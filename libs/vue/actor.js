import { StateSubject } from '../state-subject.js';
import htm from 'https://unpkg.com/htm?module';

const { h, ref, onUnmounted } = Vue;
export const html = htm.bind(h);

export class Actor {
    constructor(initialState) {
        this.el = ref(null);
        this.behaviors = [];
        
        // El Actor instancia su propio cerebro internamente
        this.state$ = new StateSubject(initialState);
        
        // Estado reactivo para el template de Vue
        this.current = ref(initialState);
        
        this.subscription = this.state$.subscribe(v => {
            this.current.value = v;
        });

        onUnmounted(() => this.dispose());
    }

    // Interfaz directa para modificar el estado
    patch(data) {
        this.state$.patch(data);
        return this;
    }

    patchNested(key, data) {
        this.state$.patchNested(key, data);
        return this;
    }

    use(behavior, ...args) {
        this.behaviors.push({ fn: behavior, args });
        return this;
    }

    spawn() {
        this.behaviors.forEach(b => {
            b.fn(this.el, this.state$, ...b.args);
        });
        return this.el;
    }

    dispose() {
        if (this.subscription) this.subscription.unsubscribe();
    }
}

export const createActor = (initialState) => new Actor(initialState);