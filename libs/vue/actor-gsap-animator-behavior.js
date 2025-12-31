import { GSAPAnimator } from "../gsap-animator.js";

export function useGSAPAnimator(targetRef, actor, animations) {
    let animator = null;

    Vue.onMounted(() => {
        if (!targetRef.value) return;
        
        animator = new GSAPAnimator(targetRef.value, animations);

        animator.onStepStart = (state) => actor.emit(`anim_start:${state}`);
        animator.onStepComplete = (state) => actor.emit(`anim_end:${state}`);

        const subscription = actor.state$.subscribe((val) => {
            if (animator && val?.state) {
                animator.animate(val.state, val);
            }
        });

        Vue.onUnmounted(() => {
            subscription.unsubscribe();
            animator.dispose();
        });
    });
}