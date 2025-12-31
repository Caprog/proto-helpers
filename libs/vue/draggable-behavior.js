import { Subject } from 'https://cdn.skypack.dev/rxjs';
import { debounceTime } from 'https://cdn.skypack.dev/rxjs/operators';

const { onMounted, onUnmounted } = Vue;

export function useDraggableBehavior(targetRef, state$, options = {}) {
    const dragActivity$ = new Subject();
    let idleSubscription = null;

    const setState = (newState) => {
        if (state$.value.state === 'dragging' && newState !== 'drag-end') return;
        
        if (newState === 'drag-end') {
            state$.patch({ state: 'idle', drag: { x: 0, y: 0 } });
            return;
        }
        state$.patch({ state: newState });
    };

    onMounted(() => {
        if (!targetRef.value) return;

        idleSubscription = dragActivity$.pipe(
            debounceTime(options.idleTime || 100)
        ).subscribe(() => {
            if (state$.value.state === 'dragging') {
                state$.patchNested('drag', { x: 0, y: 0 });
            }
        });

        Draggable.create(targetRef.value, {
            type: "x,y",
            edgeResistance: options.edgeResistance || 0.65,
            bounds: options.bounds || "#app",
            inertia: options.inertia ?? true,
            onDragStart: () => setState('dragging'),
            onDrag: function() {
                dragActivity$.next();
                state$.patchNested('drag', { x: this.deltaX, y: this.deltaY });
            },
            onDragEnd: () => setState('drag-end')
        });
    });

    onUnmounted(() => {
        if (idleSubscription) idleSubscription.unsubscribe();
        const dr = Draggable.get(targetRef.value);
        if (dr) dr.kill();
    });

    return { setState };
}