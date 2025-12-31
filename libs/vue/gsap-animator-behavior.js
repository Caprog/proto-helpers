import { GSAPAnimator } from '../gsap-animator.js';

const { onMounted, onUnmounted } = Vue;

export function useGSAPAnimator(targetRef, animations, state$) {
    let animator = null;
    let subscription = null;

    onMounted(() => {
        if (!targetRef.value) return;
        animator = new GSAPAnimator(targetRef.value, animations);

        subscription = state$.subscribe((val) => {
            animator.animate(val.state, val);
        });
    });

    onUnmounted(() => {
        if (subscription) subscription.unsubscribe();
    });

    return {
        getAnimator: () => animator
    };
}