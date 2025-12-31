import { StateSubject } from '../state-subject.js';
import htm from 'https://unpkg.com/htm?module';

const { h, ref, onUnmounted } = Vue;
export const html = htm.bind(h);

export class Actor {
    constructor(initialState) {
        this.el = ref(null);
        this.behaviors = [];
        this.state$ = new StateSubject(initialState);
        this.current = ref(initialState);
        
        this.subscription = this.state$.subscribe(v => {
            this.current.value = v;
        });

        onUnmounted(() => this.dispose());
    }

    use(behavior, ...args) {
        // Registramos el comportamiento inmediatamente para que Vue detecte el hook
        behavior(this.el, this.state$, ...args);
        return this;
    }

    spawn() {
        // Solo devuelve la referencia para el template
        return this.el;
    }

    dispose() {
        if (this.subscription) this.subscription.unsubscribe();
    }
}

export const createActor = (initialState) => new Actor(initialState);