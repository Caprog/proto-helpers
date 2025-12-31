const { onMounted, onUnmounted } = Vue;

export function useHoverBehavior(targetRef, actor) {
    const handleEnter = () => {
        if (actor.current.value.state !== 'dragging') {
            actor.state$.patch({ state: 'hover' });
        }
    };

    const handleLeave = () => {
        if (actor.current.value.state !== 'dragging') {
            actor.state$.patch({ state: 'idle' });
        }
    };

    onMounted(() => {
        const el = targetRef.value;
        if (!el) return;
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
    });

    onUnmounted(() => {
        const el = targetRef.value;
        if (!el) return;
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
    });
}