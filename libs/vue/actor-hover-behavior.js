export function useHoverBehavior(targetRef, actor) {
    const handleEnter = () => {
        if (actor.current.value.state !== 'dragging') {
            actor.state$.patch({ state: 'hover' });
            actor.emit('hover_enter'); // Señal
        }
    };

    const handleLeave = () => {
        if (actor.current.value.state !== 'dragging') {
            actor.state$.patch({ state: 'idle' });
            actor.emit('hover_leave'); // Señal
        }
    };

    Vue.onMounted(() => {
        const el = targetRef.value;
        if (!el) return;
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
    });
}