import jsonata from 'https://esm.sh/jsonata';
import gsap from 'https://esm.sh/gsap';

export class GSAPAnimator {
    constructor(selector, animations, config = {}) {
        this.selector = selector;
        this.animations = animations;
        this.compiledCache = new Map();
        this.busy = false;
        this.nextTask = null;
        this.resolver = null;
        this.onStepStart = null;
        this.onStepComplete = null;

        this.defaults = {
            ease: config.ease || 'power3.out',
            duration: config.duration || 0.5,
            force3D: config.force3D ?? true
        };

        this.helpers = {
            clamp: (val, min, max) => Math.min(Math.max(val, min), max)
        };
    }

    async #evaluate(expression, data) {
        if (!this.compiledCache.has(expression)) {
            const runner = jsonata(expression);
            Object.entries(this.helpers).forEach(([name, fn]) => runner.registerFunction(name, fn));
            this.compiledCache.set(expression, runner);
        }
        return await this.compiledCache.get(expression).evaluate(data);
    }

    async #parse(obj, data) {
        if (typeof obj === 'string' && obj.startsWith('${') && obj.endsWith('}')) {
            return await this.#evaluate(obj.substring(2, obj.length - 1), data);
        }
        if (typeof obj !== 'object' || obj === null) return obj;
        if (Array.isArray(obj)) return Promise.all(obj.map(item => this.#parse(item, data)));

        const result = {};
        for (const key in obj) {
            result[key] = await this.#parse(obj[key], data);
        }
        return result;
    }

    async animate(state, data) {
        this.nextTask = { state, data };
        if (this.busy) {
            this.#cancelCurrent();
        } else {
            await this.#run();
        }
    }

    #cancelCurrent() {
        const el = this.#getElement();
        if (el) {
            gsap.killTweensOf(el);
            if (this.resolver) {
                this.resolver();
                this.resolver = null;
            }
        }
    }

    #getElement() {
        return typeof this.selector === 'string' ? document.querySelector(this.selector) : this.selector;
    }

    async #run() {
        this.busy = true;
        while (this.nextTask) {
            const current = this.nextTask;
            this.nextTask = null;

            const el = this.#getElement();
            const steps = this.animations[current.state];
            if (!steps || !el) continue;

            const stepsArray = Array.isArray(steps) ? steps : [steps];

            for (const step of stepsArray) {
                const props = await this.#parse(step.props, current.data);
                
                await new Promise((resolve) => {
                    this.resolver = resolve;
                    gsap[step.direction || 'to'](el, {
                        ...this.defaults,
                        ...props,
                        onStart: () => {
                            if (this.onStepStart) this.onStepStart(current.state);
                        },
                        onComplete: () => {
                            this.resolver = null;
                            if (this.onStepComplete) this.onStepComplete(current.state);
                            resolve();
                        }
                    });
                });
            }
        }
        this.busy = false;
    }

    dispose() {
        this.#cancelCurrent();
        this.compiledCache.clear();
    }
}