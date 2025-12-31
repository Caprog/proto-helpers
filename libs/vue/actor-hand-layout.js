const { watch, nextTick } = Vue;

export function useHandLayout(actors, options = {}) {
    const { spacing = 70, curve = 5, rotationStep = 8 } = options;

    const updateLayout = async () => {
        // Esperamos al siguiente tick de Vue para asegurar que los refs de los actores existan
        await nextTick();

        actors.forEach((actor, i) => {
            if (!actor?.current?.value || !actor.state$) return;

            if (actor.current.value.state === 'dragging') return;

            const centerIndex = (actors.length - 1) / 2;
            const distance = i - centerIndex;

            // Actualizamos el estado de forma segura
            actor.state$.patch({
                layout: {
                    x: distance * spacing,
                    y: Math.pow(Math.abs(distance), 2) * curve,
                    rotate: distance * rotationStep
                }
            });
        });
    };

    // Solo observamos cambios profundos en la colección
    watch(() => actors.length, updateLayout, { immediate: true });
    
    return { updateLayout };
}