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
        if (Array.isArray(obj)) {
            const parsedArray = await Promise.all(obj.map(item => this.#parse(item, data)));
            return parsedArray;
        }

        const result = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                result[key] = await this.#parse(obj[key], data);
            }
        }
        return result;
    }

    async animate(state, data) {
        console.debug('Animating', this.selector, state, data);
        const el = document.querySelector(this.selector);
        const steps = this.animations[state];
        if (!steps || !el) return;

        for (const step of steps) {
            const props = await this.#parse(step.props, data);
            gsap[step.direction || 'to'](el, {
                ...this.config,
                ...props
            });
        }
    }
}