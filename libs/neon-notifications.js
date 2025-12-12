const styles = `
    #neon-toast-container {
        position: fixed; top: 20px; right: 20px;
        display: flex; flex-direction: column; gap: 10px;
        z-index: 9999;
        pointer-events: none;
    }

    .neon-toast {
        width: 300px; padding: 15px;
        background: rgba(5, 16, 10, 0.95); backdrop-filter: blur(8px);
        border: 1px solid #00ff66; border-left: 4px solid #00ff66;
        color: #eee;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 13px;
        box-shadow: 0 0 15px rgba(0, 255, 100, 0.2);
        opacity: 0; transform: translateX(50px);
        animation: neon-slide-in 0.3s forwards;
        display: flex; align-items: flex-start; justify-content: space-between;
        pointer-events: auto;
        cursor: pointer;
        overflow: hidden;
        position: relative;
    }

    .neon-toast.info { border-color: #00bbff; box-shadow: 0 0 15px rgba(0, 187, 255, 0.2); }
    .neon-toast.info h4 { color: #00bbff; }

    .neon-toast.success { border-color: #00ff66; border-left-color: #00ff66; box-shadow: 0 0 15px rgba(0, 255, 100, 0.2); }
    .neon-toast.success h4 { color: #00ff66; }

    .neon-toast.warning { border-color: #ffcc00; border-left-color: #ffcc00; box-shadow: 0 0 15px rgba(255, 204, 0, 0.2); }
    .neon-toast.warning h4 { color: #ffcc00; }

    .neon-toast.error { border-color: #ff3333; border-left-color: #ff3333; box-shadow: 0 0 15px rgba(255, 51, 51, 0.2); }
    .neon-toast.error h4 { color: #ff3333; }

    .neon-toast-content { flex: 1; }
    .neon-toast h4 { margin: 0 0 5px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
    .neon-toast p { margin: 0; color: #ccc; line-height: 1.4; }
    
    .neon-toast-close {
        background: transparent; border: none; color: #666; cursor: pointer;
        font-size: 16px; line-height: 1; padding: 0 0 0 10px;
    }
    .neon-toast-close:hover { color: #fff; }

    .neon-progress {
        position: absolute; bottom: 0; left: 0; height: 2px;
        background: rgba(255,255,255,0.3); width: 100%;
    }
    .neon-progress-bar {
        height: 100%; width: 100%; background: currentColor;
        transform-origin: left;
    }

    @keyframes neon-slide-in {
        from { opacity: 0; transform: translateX(50px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes neon-fade-out {
        to { opacity: 0; transform: translateX(50px); }
    }
`;

export class NeonNotifications {
    constructor(config = {}) {
        this.config = Object.assign({
            position: 'top-right', // top-right, top-left, bottom-right, bottom-left
            duration: 4000,
            maxStack: 5
        }, config);

        this.injectStyles();
        this.createContainer();
    }

    injectStyles() {
        if (!document.getElementById('neon-notify-styles')) {
            const style = document.createElement('style');
            style.id = 'neon-notify-styles';
            style.innerText = styles;
            document.head.appendChild(style);
        }
    }

    createContainer() {
        if (!document.getElementById('neon-toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'neon-toast-container';
            this.updatePosition();
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('neon-toast-container');
        }
    }

    updatePosition() {
        this.container.style.top = this.config.position.includes('top') ? '20px' : 'auto';
        this.container.style.bottom = this.config.position.includes('bottom') ? '20px' : 'auto';
        this.container.style.left = this.config.position.includes('left') ? '20px' : 'auto';
        this.container.style.right = this.config.position.includes('right') ? '20px' : 'auto';
        this.container.style.alignItems = this.config.position.includes('left') ? 'flex-start' : 'flex-end';
    }

    toast(message, type = 'info', title = null, duration = this.config.duration) {
        if (this.container.children.length >= this.config.maxStack) {
            this.removeToast(this.container.children[0]);
        }

        const toast = document.createElement('div');
        toast.className = `neon-toast ${type}`;

        // Auto-title if null
        if (!title) title = type.toUpperCase();

        toast.innerHTML = `
            <div class="neon-toast-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="neon-toast-close">&times;</button>
            <div class="neon-progress">
                <div class="neon-progress-bar" style="color: inherit"></div>
            </div>
        `;

        // Style fix for progress bar color inheriting from toast specific color
        const colorMap = {
            info: '#00bbff',
            success: '#00ff66',
            warning: '#ffcc00',
            error: '#ff3333'
        };
        toast.querySelector('.neon-progress-bar').style.backgroundColor = colorMap[type];

        // Close button
        toast.querySelector('.neon-toast-close').onclick = (e) => {
            e.stopPropagation();
            this.removeToast(toast);
        };

        // Click to dismiss
        toast.onclick = () => this.removeToast(toast);

        // Progress Animation
        if (duration > 0) {
            const bar = toast.querySelector('.neon-progress-bar');
            bar.animate([
                { transform: 'scaleX(1)' },
                { transform: 'scaleX(0)' }
            ], {
                duration: duration,
                easing: 'linear',
                fill: 'forwards'
            });

            this.autoDismiss(toast, duration);
        } else {
            toast.querySelector('.neon-progress').style.display = 'none';
        }

        this.container.appendChild(toast);
    }

    autoDismiss(toast, delay) {
        setTimeout(() => {
            if (toast.parentElement) this.removeToast(toast);
        }, delay);
    }

    removeToast(toast) {
        toast.style.animation = 'neon-fade-out 0.3s forwards';
        toast.addEventListener('animationend', () => {
            if (toast.parentElement) toast.remove();
        });
    }

    info(msg, title, duration) { this.toast(msg, 'info', title, duration); }
    success(msg, title, duration) { this.toast(msg, 'success', title, duration); }
    warning(msg, title, duration) { this.toast(msg, 'warning', title, duration); }
    error(msg, title, duration) { this.toast(msg, 'error', title, duration); }

    // Config update helper
    setPosition(pos) {
        this.config.position = pos;
        this.updatePosition();
    }
}

// Global expose
window.NeonNotifications = NeonNotifications;
