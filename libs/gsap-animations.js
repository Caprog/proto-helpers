/**
 * GSAP Animation Library
 * Reusable animation definitions and helper functions.
 * Assumes gsap is available globally.
 */

export const EASINGS = {
    'Power3': 'power3.out',
    'Elastic': 'elastic.out(1, 0.3)',
    'Back': 'back.out(1.7)',
    'Expo': 'expo.out',
    'Circ': 'circ.out',
    'Steps (12)': 'steps(12)',
    // Fixed: GSAP Standard Equivalents for custom beziers
    'Smooth Flow': 'power2.inOut',   // Similar to 0.65, 0, 0.35, 1
    'Quick Snap': 'expo.out',        // Similar to 0.19, 1, 0.22, 1
    'Soft Bounce': 'back.out(2)',    // Similar to 0.34, 1.56, 0.64, 1
    'Heavy Lift': 'back.inOut(2)'    // Similar to 0.68, -0.55, 0.27, 1.55
};

export const ANIMATIONS = {
    // --- ORIGINAL ---
    fadeInUp: {
        from: { opacity: 0, y: 50 },
        to: { opacity: 1, y: 0 }
    },
    fadeInDown: {
        from: { opacity: 0, y: -50 },
        to: { opacity: 1, y: 0 }
    },
    zoomIn: {
        from: { scale: 0, opacity: 0 },
        to: { scale: 1, opacity: 1 }
    },
    zoomOutPop: {
        from: { scale: 1.5, opacity: 0 },
        to: { scale: 1, opacity: 1 }
    },
    rotateIn: {
        from: { rotation: -180, scale: 0.5, opacity: 0 },
        to: { rotation: 0, scale: 1, opacity: 1 }
    },
    flipX: {
        from: { rotationX: 90, opacity: 0 },
        to: { rotationX: 0, opacity: 1 }
    },
    flipY: {
        from: { rotationY: 90, opacity: 0 },
        to: { rotationY: 0, opacity: 1 }
    },
    skewSlide: {
        from: { x: -100, skewX: 30, opacity: 0 },
        to: { x: 0, skewX: 0, opacity: 1 }
    },
    blurReveal: {
        from: { filter: 'blur(20px)', opacity: 0, scale: 1.1 },
        to: { filter: 'blur(0px)', opacity: 1, scale: 1 }
    },

    // --- IMPORTED FROM MAP NODE DEMO ---

    // "elasticPop" from source (similar to zoomIn but meant for Elastic easing)
    elasticPop: {
        from: { scale: 0, opacity: 0 },
        to: { scale: 1, opacity: 1 }
    },

    // "elasticSlide" from source (Slide Right with Skew)
    slideRightSkew: {
        from: { opacity: 0, x: 50, skewX: -20 },
        to: { opacity: 1, x: 0, skewX: 0 }
    },

    // "typewriter" from source (ClipPath Wipe) - Works best with "Steps" easing
    typewriter: {
        from: { opacity: 1, clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
        to: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 }
    },

    // "glitch" from source (Keyframes)
    glitch: {
        from: { opacity: 1 },
        to: {
            keyframes: [
                { opacity: 1, x: -10, skewX: 30, scale: 1.1, filter: "blur(0px)" },
                { opacity: 0, x: 0, skewX: 0 },
                { opacity: 0.8, x: 5, skewX: -20, scale: 0.95 },
                { opacity: 1, x: 0, skewX: 5, filter: "blur(2px)", scale: 1 },
                { opacity: 1, x: 0, skewX: 0, filter: "blur(0px)", scale: 1 }
            ]
        }
    },

    // "draw" simulation (Wipe Right)
    wipeReveal: {
        from: { clipPath: "inset(0 100% 0 0)", opacity: 1 },
        to: { clipPath: "inset(0 0% 0 0)", opacity: 1 }
    },

    // One-shot Pulse
    pulseOnce: {
        from: { scale: 1 },
        to: {
            keyframes: [
                { scale: 1.1, duration: 0.5, ease: "sine.out" },
                { scale: 1, duration: 0.5, ease: "sine.in" }
            ]
        }
    }
};

export const AnimLib = {
    currentOrigin: '50% 50%',

    setOrigin(origin) {
        this.currentOrigin = origin;
    },

    animate(element, animType, options = {}) {
        if (!ANIMATIONS[animType]) {
            console.warn(`Animation type ${animType} not found`);
            return;
        }

        const def = ANIMATIONS[animType];
        const duration = options.duration || 0.8;
        const ease = options.ease || 'power2.out';

        // Kill existing tweens to prevent conflict
        gsap.killTweensOf(element);

        // Reset visual state based on animation start point, 
        // BUT crucially set the transformOrigin first
        gsap.set(element, {
            transformOrigin: this.currentOrigin,
            clearProps: 'all' // Optional: clear previous inline styles if needed for clean slate
        });

        // Re-apply origin after clearProps because clearProps wipes it
        gsap.set(element, { transformOrigin: this.currentOrigin });

        // Execute
        return gsap.fromTo(element,
            def.from,
            { ...def.to, duration, ease, ...options }
        );
    },

    reset(elements) {
        gsap.killTweensOf(elements);
        gsap.set(elements, { clearProps: 'all' });
        gsap.set(elements, { transformOrigin: this.currentOrigin });
    }
};
