import { BehaviorSubject } from 'https://cdn.skypack.dev/rxjs';

export class StateSubject extends BehaviorSubject {
    constructor(initialValue) {
        super(initialValue);
    }

    patch(partial) {
        this.next({
            ...this.value,
            ...partial
        });
    }

    patchNested(key, partial) {
        const currentData = this.value[key];
        
        this.next({
            ...this.value,
            [key]: (currentData && typeof currentData === 'object') 
                ? { ...currentData, ...partial } 
                : partial
        });
    }
}