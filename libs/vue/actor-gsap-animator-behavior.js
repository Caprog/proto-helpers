import { GSAPAnimator } from '../gsap-animator.js';
const { onMounted, onUnmounted } = Vue;

export function useGSAPAnimator(targetRef, actor, animations) {
    let animator = null;
    let subscription = null;

    onMounted(() => {
        if (!targetRef.value) return;
        animator = new GSAPAnimator(targetRef.value, animations);

        // Conectamos el inicio real de la animación con las señales del Actor
        animator.onStepStart = (state) => {
            actor.emit(`anim_start:${state}`);
        };

        subscription = actor.state$.subscribe((val) => {
            if (animator && val?.state) {
                animator.animate(val.state, val);
            }
        });
    });

    onUnmounted(() => {
        if (subscription) subscription.unsubscribe();
    });
}