import jsonata from 'https://esm.sh/jsonata';
import gsap from 'https://esm.sh/gsap';

export class GSAPAnimator {
    constructor(selector, animations, config = {}) {
        this.selector = selector;
        this.animations = animations;
        this.config = {
            ease: 'power3.out',
            duration: 0.5,
            force3D: true,
            cancelable: false, // Por defecto no cancelable
            ...config
        };
        this.helpers = {
            clamp: (val, min, max) => Math.min(Math.max(val, min), max)
        };
        this.busy = false;
        this.nextTask = null;
        this.resolver = null; // Para resolver la promesa actual externamente
    }

    async #parse(obj, data) {
        if (typeof obj === 'string' && obj.startsWith('${') && obj.endsWith('}')) {
            const expression = obj.substring(2, obj.length - 1);
            try {
                const runner = jsonata(expression);
                Object.entries(this.helpers).forEach(([name, fn]) => runner.registerFunction(name, fn));
                return await runner.evaluate(data);
            } catch (e) { return obj; }
        }
        if (typeof obj !== 'object' || obj === null) return obj;
        if (Array.isArray(obj)) return Promise.all(obj.map(item => this.#parse(item, data)));
        const result = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                result[key] = await this.#parse(obj[key], data);
            }
        }
        return result;
    }

    async animate(state, data, options = { cancelable: true }) {
        const animationDef = this.animations[state];
        // La prioridad de "cancelable" es: parámetro de función > config de animación > config global
        const isCancelable = options.cancelable ?? animationDef?.cancelable ?? this.config.cancelable;

        this.nextTask = { state, data, isCancelable };

        if (this.busy && isCancelable) {
            this.#cancelCurrent();
        }

        if (!this.busy) {
            await this.#run();
        }
    }

    #cancelCurrent() {
        const el = document.querySelector(this.selector);
        if (el) {
            gsap.killTweensOf(el); // Detiene la animación física
            if (this.resolver) {
                this.resolver(); // Desbloquea el await del loop #run
                this.resolver = null;
            }
        }
    }

    async #run() {
        this.busy = true;
        while (this.nextTask) {
            const current = this.nextTask;
            this.nextTask = null;

            const el = document.querySelector(this.selector);
            const steps = this.animations[current.state]?.steps || this.animations[current.state];
            if (!steps || !el) continue;

            const stepsArray = Array.isArray(steps) ? steps : [steps];

            for (const step of stepsArray) {
                const props = await this.#parse(step.props, current.data);
                
                await new Promise((resolve) => {
                    this.resolver = resolve;
                    gsap[step.direction || 'to'](el, {
                        ...this.config,
                        ...props,
                        onComplete: () => {
                            this.resolver = null;
                            resolve();
                        }
                    });
                });
            }
        }
        this.busy = false;
    }
}