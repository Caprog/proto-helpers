import { Subject } from 'https://cdn.skypack.dev/rxjs';
import { debounceTime } from 'https://cdn.skypack.dev/rxjs/operators';

export function useDraggableBehavior(targetRef, actor, options = {}) {
    const dragActivity$ = new Subject();

    Vue.onMounted(() => {
        if (!targetRef.value) return;

        dragActivity$.pipe(debounceTime(options.idleTime || 100)).subscribe(() => {
            if (actor.current.value.state === 'dragging') {
                actor.state$.patchNested('drag', { x: 0, y: 0 });
                actor.emit('drag_idle'); // Señal: el usuario dejó de mover el mouse
            }
        });

        Draggable.create(targetRef.value, {
            type: "x,y",
            onDragStart: () => {
                actor.state$.patch({ state: 'dragging' });
                actor.emit('drag_start');
            },
            onDrag: function() {
                dragActivity$.next();
                actor.state$.patchNested('drag', { x: this.deltaX, y: this.deltaY });
                actor.emit('drag_move', { x: this.x, y: this.y });
            },
            onDragEnd: () => {
                actor.state$.patch({ state: 'idle', drag: { x: 0, y: 0 } });
                actor.emit('drag_end');
            }
        });
    });
}