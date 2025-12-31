import { StateSubject } from '../state-subject.js';
import htm from 'https://unpkg.com/htm?module';

const { h, ref, onUnmounted } = Vue;
export const html = htm.bind(h);

export class Actor {
    constructor(initialState, options = { debug: true }) {
        this.el = ref(null);
        this.behaviors = [];
        this.debug = options.debug;
        this._signals = {}; // Diccionario de señales (estilo Godot)

        // Cerebro interno
        this.state$ = new StateSubject(initialState);
        this.current = ref(initialState);
        
        // Logger de cambios de estado
        this.subscription = this.state$.subscribe(v => {
            if (this.debug && this.current.value.state !== v.state) {
                console.log(`%c[Actor] State Change: ${this.current.value.state} -> ${v.state}`, "color: #4ade80; font-weight: bold;");
            }
            this.current.value = v;
        });

        onUnmounted(() => this.dispose());
    }

    /**
     * Suscribirse a una señal (estilo Godot Signals)
     */
    on(signalName, callback) {
        if (!this._signals[signalName]) this._signals[signalName] = [];
        this._signals[signalName].push(callback);
        return this;
    }

    /**
     * Emitir una señal
     */
    emit(signalName, data) {
        if (this.debug) console.log(`%c[Signal] ${signalName}`, "color: #60a5fa;", data || "");
        if (this._signals[signalName]) {
            this._signals[signalName].forEach(cb => cb(data));
        }
    }

    /**
     * Equipa un comportamiento y le pasa la instancia del Actor
     */
    use(behavior, ...args) {
        if (this.debug) console.log(`%c[Actor] Equipping Behavior: ${behavior.name}`, "color: #facc15;");
        // Ahora pasamos 'this' (el actor) en lugar de solo 'state$'
        behavior(this.el, this, ...args);
        return this;
    }

    spawn() {
        if (this.debug) console.log("%c[Actor] Spawned into Scene", "color: #f472b6; font-weight: bold;");
        return this.el;
    }

    dispose() {
        if (this.subscription) this.subscription.unsubscribe();
        this._signals = {};
    }
}

export const createActor = (initialState, options) => new Actor(initialState, options);