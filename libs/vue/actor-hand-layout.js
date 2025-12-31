const { watch, nextTick } = Vue;

export function useHandLayout(actors, options = {}) {
    const { spacing = 80, curve = 5, rotation = 8 } = options;

    const update = async () => {
        await nextTick();
        
        const total = actors.length;
        if (total === 0) return;

        actors.forEach((actor, i) => {
            if (!actor?.state$ || !actor?.current?.value) return;
            if (actor.current.value.state === 'dragging') return;

            const center = (total - 1) / 2;
            const distance = i - center;

            actor.patch({
                layout: {
                    x: distance * spacing,
                    y: Math.pow(Math.abs(distance), 2) * curve,
                    rotate: distance * rotation
                }
            });
        });
    };

    watch(() => actors.length, update, { immediate: true, deep: true });

    return { update };
}