import { GSAPAnimator } from '../gsap-animator.js';
const { onMounted, onUnmounted } = Vue;

export function useGSAPAnimator(targetRef, actor, animations) {
    let animator = null;
    let subscription = null;

    onMounted(() => {
        if (!targetRef.value) return;
        animator = new GSAPAnimator(targetRef.value, animations);

        animator.onStepStart = (state) => {
            actor.emit(`anim_start:${state}`);
        };

        animator.onStepComplete = (state) => {
            actor.emit(`anim_end:${state}`);
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