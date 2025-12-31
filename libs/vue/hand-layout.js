import gsap from 'https://esm.sh/gsap';

export function useHandLayout(actors, options = {}) {
    const {
        spacing = 60,
        tiltAmount = 5,
        curveAmount = 4,
        duration = 0.5
    } = options;

    const updateLayout = () => {
        const n = actors.length;
        if (n === 0) return;

        actors.forEach((actor, i) => {
            // No movemos la carta si el usuario la está arrastrando
            if (actor.current.value.state === 'dragging') return;

            const centerOffset = i - (n - 1) / 2;
            
            // Cálculo de posición y rotación
            const tx = centerOffset * spacing;
            const ty = Math.pow(Math.abs(centerOffset), 2) * curveAmount;
            const tr = centerOffset * tiltAmount;

            // Actualizamos el estado del Actor para que su Animator reaccione
            actor.patch({
                layout: { x: tx, y: ty, rotate: tr }
            });
        });
    };

    // Podríamos observar cambios en el array de actores aquí
    Vue.watch(() => actors.length, updateLayout, { immediate: true });

    return { updateLayout };
}