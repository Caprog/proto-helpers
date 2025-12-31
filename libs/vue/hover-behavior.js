const { onMounted, onUnmounted } = Vue;

export function useHoverBehavior(targetRef, state$) {
    const handleEnter = () => {
        if (state$.value.state !== 'dragging') {
            state$.patch({ state: 'hover' });
        }
    };

    const handleLeave = () => {
        if (state$.value.state !== 'dragging') {
            state$.patch({ state: 'idle' });
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