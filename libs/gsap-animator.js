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
            ...config
        };
        this.helpers = {
            clamp: (val, min, max) => Math.min(Math.max(val, min), max)
        };
        this.busy = false;
        this.nextTask = null;
    }

    async #parse(obj, data) {
        if (typeof obj === 'string' && obj.startsWith('${') && obj.endsWith('}')) {
            const expression = obj.substring(2, obj.length - 1);
            try {
                const runner = jsonata(expression);
                Object.entries(this.helpers).forEach(([name, fn]) => {
                    runner.registerFunction(name, fn);
                });
                return await runner.evaluate(data);
            } catch (e) {
                return obj;
            }
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

    async animate(state, data) {
        this.nextTask = { state, data };
        if (this.busy) return;
        await this.#run();
    }

    async #run() {
        this.busy = true;
        while (this.nextTask) {
            const { state, data } = this.nextTask;
            this.nextTask = null;
            const el = document.querySelector(this.selector);
            const steps = this.animations[state];
            if (!steps || !el) continue;
            for (const step of steps) {
                const props = await this.#parse(step.props, data);
                await gsap[step.direction || 'to'](el, { ...this.config, ...props });
            }
        }
        this.busy = false;
    }
}