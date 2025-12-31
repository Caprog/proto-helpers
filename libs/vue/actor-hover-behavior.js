export function useHoverBehavior(targetRef, actor) {
    const handleEnter = () => {
        actor.emit('INPUT_HOVER_ENTER');
    };

    const handleLeave = () => {
        actor.emit('INPUT_HOVER_LEAVE');
    };

    Vue.onMounted(() => {
        const el = targetRef.value;
        if (!el) return;
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
    });

    Vue.onUnmounted(() => {
        const el = targetRef.value;
        if (!el) return;
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
    });
}