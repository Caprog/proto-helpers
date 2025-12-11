const styles = `
    #gui-panel {
        position: absolute; top: 20px; left: 20px; width: 280px;
        max-height: calc(100vh - 40px);
        background: rgba(5, 16, 10, 0.9); backdrop-filter: blur(12px);
        padding: 20px; border-radius: 4px; border: 1px solid rgba(0, 255, 100, 0.3);
        color: #eee; overflow-y: auto;
        box-shadow: 0 0 20px rgba(0, 255, 100, 0.15); z-index: 100;
        user-select: none; -webkit-user-select: none;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        box-sizing: border-box;
        display: flex; flex-direction: column; gap: 12px; 
    }
    #gui-panel::-webkit-scrollbar { width: 6px; }
    #gui-panel::-webkit-scrollbar-track { background: rgba(0, 20, 10, 0.5); border-radius: 3px; }
    #gui-panel::-webkit-scrollbar-thumb { background: rgba(0, 255, 100, 0.2); border-radius: 3px; }
    
    .gui-folder { 
        display: flex; flex-direction: column; gap: 12px;
        margin-bottom: 15px; border-bottom: 1px solid rgba(0, 255, 100, 0.2); padding-bottom: 20px; 
    }
    .gui-folder:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    
    .gui-folder h3 {
        display: block; width: 100%; margin: 0; 
        font-size: 14px; font-weight: 600; text-transform: uppercase;
        letter-spacing: 2px; color: #00ff66; text-shadow: 0 0 5px rgba(0, 255, 100, 0.5);
        padding-bottom: 5px; border-bottom: 2px solid rgba(0,255,100,0.5);
    }
    
    .gui-control { display: flex; flex-direction: column; gap: 6px; width: 100%; }
    .gui-label { display: flex; justify-content: space-between; align-items: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #8fb59a; margin: 0; }
    
    .gui-checkbox-row { display: flex; align-items: center; cursor: pointer; color: #eee; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; width: 100%; margin: 0; }
    .gui-checkbox { margin-right: 10px; margin-top: 0; margin-bottom: 0; transform: scale(1.2); }

    .gui-slider { width: 100%; background: transparent; -webkit-appearance: none; margin: 0; display: block; }
    .gui-slider::-webkit-slider-runnable-track { width: 100%; height: 2px; background: #1a3322; }
    .gui-slider::-webkit-slider-thumb { -webkit-appearance: none; height: 12px; width: 6px; background: #00ff66; margin-top: -5px; cursor: pointer; box-shadow: 0 0 8px #00ff66; }
    
    .gui-color { width: 100%; height: 30px; border: 1px solid #224433; background: #000; cursor: pointer; padding: 2px; margin: 0; display: block; }
    .gui-text-input { width: 100%; padding: 6px; background: #020804; color: #00ff66; border: 1px solid #224433; font-family: monospace; outline: none; box-sizing: border-box; margin: 0; display: block; }
    .gui-text-input:focus { border-color: #00ff66; }
    
    .gui-num-input {
        background: rgba(0,0,0,0.3); color: #00ff66; border: 1px solid transparent;
        font-family: monospace; font-size: 11px; text-align: right; width: 60px; padding: 2px 4px; outline: none;
        -moz-appearance: textfield;
    }
    .gui-num-input:hover, .gui-num-input:focus { border-color: #00ff66; background: #020804; }
    .gui-num-input::-webkit-outer-spin-button, .gui-num-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

    .gui-display { width: 100%; padding: 6px; background: rgba(0,0,0,0.3); color: #00ff66; border-left: 2px solid #00ff66; font-family: monospace; font-size: 11px; box-sizing: border-box; margin: 0; }
    .gui-select { width: 100%; padding: 5px; background: #020804; color: #00ff66; border: 1px solid #224433; font-family: inherit; font-size: 11px; cursor: pointer; outline: none; text-transform: uppercase; box-sizing: border-box; margin: 0; }
    .gui-separator { border-top: 1px dashed rgba(0,255,100,0.2); margin: 5px 0; width: 100%; }
    .gui-value { float: right; color: #00ff66; font-family: monospace; font-size: 11px; }
    
    .gui-button {
        width: 100%; padding: 12px; background: rgba(0, 255, 100, 0.1); border: 1px solid #00ff66; color: #00ff66;
        font-weight: bold; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
        cursor: pointer; transition: all 0.3s; margin: 0;
    }
    .gui-button:hover { background: #00ff66; color: #000; box-shadow: 0 0 15px rgba(0, 255, 100, 0.6); }
    
    .gui-row { display: flex; gap: 8px; margin: 0; width: 100%; }
    .gui-row .gui-button { flex: 1; margin: 0; }
    
    .gui-modal {
        display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: #051008; padding: 20px; border: 1px solid #00ff66; z-index: 200;
        width: 400px; box-shadow: 0 0 50px rgba(0,0,0,0.9);
    }
    .gui-textarea { width: 100%; height: 150px; background: #020603; color: #00ff66; border: 1px solid #333; font-family: monospace; padding: 10px; font-size: 12px; resize: none; outline: none; box-sizing: border-box; }
    .gui-modal-close { margin-top: 10px; padding: 5px 15px; background: transparent; color: #888; border: 1px solid #333; cursor: pointer; text-transform: uppercase; font-size: 10px; float: right; }
    .gui-modal-close:hover { color: #fff; border-color: #fff; }
`;

export class GuiLib {
    constructor(containerId = 'gui-panel') {
        this.injectStyles();
        this.container = document.createElement('div');
        this.container.id = containerId;
        document.body.appendChild(this.container);
        this.currentFolder = this.container;
        this.controllers = [];
        this.onChangeCallback = null;
        // Inicializamos la notificación global con debounce de 200ms
        this.notifyGlobal = this.debounce((p, v) => {
            if (this.onChangeCallback) this.onChangeCallback(p, v);
        }, 200);
    }

    // --- DEBOUNCE UTILITY ---
    debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    enableManagement(configRef, storageKey, onUpdate) {
        this.configRef = configRef;
        this.storageKey = storageKey;
        this.onUpdate = onUpdate;
        
        const managerDiv = document.createElement('div');
        managerDiv.className = 'gui-folder';
        
        const title = document.createElement('h3');
        title.innerText = "CONFIG MANAGER";
        managerDiv.appendChild(title);

        const row = document.createElement('div');
        row.className = 'gui-row';
        
        this.presetSelect = document.createElement('select');
        this.presetSelect.className = 'gui-select';
        this.presetSelect.style.marginBottom = '0';
        this.presetSelect.innerHTML = '<option value="">-- Select Config --</option>';
        this.presetSelect.addEventListener('change', (e) => this.loadPreset(e.target.value));

        const btnDelete = document.createElement('button');
        btnDelete.className = 'gui-button';
        btnDelete.innerText = 'X';
        btnDelete.style.width = '40px'; 
        btnDelete.style.background = 'rgba(255,0,0,0.1)'; 
        btnDelete.style.borderColor = '#ff3333'; 
        btnDelete.style.color = '#ff3333';
        btnDelete.onclick = () => this.deletePreset();

        row.appendChild(this.presetSelect);
        row.appendChild(btnDelete);
        managerDiv.appendChild(row);

        const btnSave = document.createElement('button');
        btnSave.className = 'gui-button';
        btnSave.innerText = 'SAVE CURRENT';
        btnSave.onclick = () => this.savePreset();
        managerDiv.appendChild(btnSave);

        const ioRow = document.createElement('div');
        ioRow.className = 'gui-row';
        
        const btnExport = document.createElement('button');
        btnExport.className = 'gui-button';
        btnExport.innerText = 'EXPORT';
        btnExport.onclick = () => this.showExport();

        const btnImport = document.createElement('button');
        btnImport.className = 'gui-button';
        btnImport.innerText = 'IMPORT';
        btnImport.onclick = () => this.showImport();

        ioRow.appendChild(btnImport);
        ioRow.appendChild(btnExport);
        managerDiv.appendChild(ioRow);

        const btnFull = document.createElement('button');
        btnFull.className = 'gui-button';
        btnFull.innerText = 'TOGGLE FULLSCREEN';
        btnFull.onclick = () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(e => console.warn(e));
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
            }
        };
        managerDiv.appendChild(btnFull);

        if(this.container.firstChild) {
            this.container.insertBefore(managerDiv, this.container.firstChild);
        } else {
            this.container.appendChild(managerDiv);
        }

        this.refreshPresets();
        this.initModals();
    }

    initModals() {
        this.exportModal = this.createModal('gui-export', 'EXPORT JSON', null, null, null);
        this.importModal = this.createModal('gui-import', 'IMPORT JSON', 'Paste JSON here...', 'LOAD', (textarea) => {
            try {
                const data = JSON.parse(textarea.value);
                this.applyData(data);
                this.importModal.style.display = 'none';
                textarea.value = '';
            } catch(e) { alert("Invalid JSON"); }
        });
    }

    savePreset() {
        const name = prompt("Preset Name:");
        if(!name) return;
        const store = this.getStorage();
        store[name] = { ...this.configRef };
        localStorage.setItem(this.storageKey, JSON.stringify(store));
        this.refreshPresets();
        this.presetSelect.value = name;
    }

    loadPreset(name) {
        if(!name) return;
        const store = this.getStorage();
        if(store[name]) this.applyData(store[name]);
    }

    deletePreset() {
        const name = this.presetSelect.value;
        if(!name) return;
        if(confirm(`Delete ${name}?`)) {
            const store = this.getStorage();
            delete store[name];
            localStorage.setItem(this.storageKey, JSON.stringify(store));
            this.refreshPresets();
        }
    }

    showExport() {
        this.exportModal.querySelector('textarea').value = JSON.stringify(this.configRef, null, 2);
        this.exportModal.style.display = 'block';
    }

    showImport() {
        this.importModal.style.display = 'block';
    }

    getStorage() {
        return JSON.parse(localStorage.getItem(this.storageKey)) || {};
    }

    refreshPresets() {
        const store = this.getStorage();
        this.presetSelect.innerHTML = '<option value="">-- Select Config --</option>';
        Object.keys(store).forEach(k => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.innerText = k;
            this.presetSelect.appendChild(opt);
        });
    }

    applyData(newData) {
        Object.assign(this.configRef, newData);
        this.updateDisplay();
        if(this.onUpdate) this.onUpdate();
    }

    updateDisplay() {
        this.controllers.forEach(ctrl => ctrl.update());
    }

    onChange(callback) { this.onChangeCallback = callback; }

    injectStyles() {
        if (!document.getElementById('gui-lib-styles')) {
            const style = document.createElement('style');
            style.id = 'gui-lib-styles';
            style.innerText = styles;
            document.head.appendChild(style);
        }
    }

    addFolder(title) {
        const f = document.createElement('div');
        f.className = 'gui-folder';
        const h = document.createElement('h3');
        h.innerText = title;
        f.appendChild(h);
        this.container.appendChild(f);
        this.currentFolder = f;
        return this;
    }

    add(object, property, params = {}) {
        if (params.options) return this.addSelect(object, property, params);
        if (typeof object[property] === 'boolean') return this.addBoolean(object, property, params);
        if (typeof object[property] === 'number') return this.addSlider(object, property, params);
        if (typeof object[property] === 'string') return this.addText(object, property, params);
        return null;
    }

    addText(obj, prop, params = {}) {
        const name = params.name || prop;
        const div = document.createElement('div');
        div.className = 'gui-control'; 
        const label = document.createElement('label');
        label.className = 'gui-label';
        label.innerText = name;
        const input = document.createElement('input');
        input.className = 'gui-text-input';
        input.type = 'text';
        
        const update = () => { input.value = obj[prop]; };
        
        input.addEventListener('input', (e) => {
            obj[prop] = e.target.value;
            // Actualización local inmediata, notificación global debounced
            this.notifyGlobal(prop, obj[prop]);
        });

        div.appendChild(label);
        div.appendChild(input);
        this.currentFolder.appendChild(div);
        const controller = { update };
        this.controllers.push(controller);
        update();
        
        return { onChange: (fn) => { 
            const dFn = this.debounce(fn, 200);
            input.addEventListener('input', () => dFn(obj[prop])); 
            return this; 
        }};
    }

    addDisplay(obj, prop, params = {}) {
        const name = params.name || prop;
        const div = document.createElement('div');
        div.className = 'gui-control';
        const label = document.createElement('label');
        label.className = 'gui-label';
        label.innerText = name;
        const display = document.createElement('div');
        display.className = 'gui-display';
        
        const update = () => { 
            const val = obj[prop];
            display.innerText = typeof val === 'number' ? val.toFixed(3) : val;
        };
        div.appendChild(label);
        div.appendChild(display);
        this.currentFolder.appendChild(div);
        const controller = { update };
        this.controllers.push(controller);
        update();
        return { 
            listen: () => {
                const interval = setInterval(update, 100);
                return () => clearInterval(interval);
            }
        };
    }

    addSeparator() {
        const div = document.createElement('div');
        div.className = 'gui-separator';
        this.currentFolder.appendChild(div);
    }

    addSlider(obj, prop, params = {}) {
        const name = params.name || prop;
        const min = params.min !== undefined ? params.min : 0;
        const max = params.max !== undefined ? params.max : 1;
        const step = params.step !== undefined ? params.step : 0.01;
        const div = document.createElement('div');
        div.className = 'gui-control'; 
        const label = document.createElement('label');
        label.className = 'gui-label';
        const textSpan = document.createElement('span');
        textSpan.innerText = name;
        label.appendChild(textSpan);
        const numInput = document.createElement('input');
        numInput.type = 'number';
        numInput.className = 'gui-num-input';
        numInput.min = min; numInput.max = max; numInput.step = step;
        label.appendChild(numInput);
        const slider = document.createElement('input');
        slider.className = 'gui-slider';
        slider.type = 'range';
        slider.min = min; slider.max = max; slider.step = step;
        
        const updateDisplay = () => {
            const val = parseFloat(obj[prop]);
            slider.value = val;
            numInput.value = Math.round(val * 1000) / 1000; 
        };
        
        const onInput = (val) => {
            obj[prop] = val;
            updateDisplay();
            this.notifyGlobal(prop, obj[prop]);
        };

        slider.addEventListener('input', (e) => onInput(parseFloat(e.target.value)));
        numInput.addEventListener('change', (e) => {
            let val = parseFloat(e.target.value);
            if (val < min) val = min;
            if (val > max) val = max;
            onInput(val);
        });

        div.appendChild(label);
        div.appendChild(slider);
        this.currentFolder.appendChild(div);
        const controller = { update: updateDisplay };
        this.controllers.push(controller);
        updateDisplay();
        
        return { onChange: (fn) => { 
            const dFn = this.debounce(fn, 200);
            slider.addEventListener('input', () => dFn(obj[prop])); 
            numInput.addEventListener('change', () => dFn(obj[prop]));
            return this; 
        }};
    }

    addColor(obj, prop, params = {}) {
        const name = params.name || prop;
        const div = document.createElement('div');
        div.className = 'gui-control';
        const label = document.createElement('label');
        label.className = 'gui-label';
        label.innerText = name;
        const input = document.createElement('input');
        input.className = 'gui-color';
        input.type = 'color';
        const update = () => { input.value = obj[prop]; };
        input.addEventListener('input', (e) => {
            obj[prop] = e.target.value;
            this.notifyGlobal(prop, obj[prop]);
        });
        div.appendChild(label);
        div.appendChild(input);
        this.currentFolder.appendChild(div);
        const controller = { update };
        this.controllers.push(controller);
        update();
        return { onChange: (fn) => { 
            const dFn = this.debounce(fn, 200);
            input.addEventListener('input', () => dFn(obj[prop])); 
            return this; 
        }};
    }

    addBoolean(obj, prop, params = {}) {
        const name = params.name || prop;
        const label = document.createElement('label');
        label.className = 'gui-checkbox-row'; 
        const input = document.createElement('input');
        input.className = 'gui-checkbox';
        input.type = 'checkbox';
        const update = () => { input.checked = obj[prop]; };
        input.addEventListener('change', (e) => {
            obj[prop] = e.target.checked;
            this.notifyGlobal(prop, obj[prop]);
        });
        label.appendChild(input);
        label.appendChild(document.createTextNode(name));
        this.currentFolder.appendChild(label);
        const controller = { update };
        this.controllers.push(controller);
        update();
        return { onChange: (fn) => { 
            const dFn = this.debounce(fn, 200);
            input.addEventListener('change', () => dFn(obj[prop])); 
            return this; 
        }};
    }

    addSelect(obj, prop, params = {}) {
        const name = params.name || prop;
        const options = params.options || {};
        const div = document.createElement('div');
        div.className = 'gui-control';
        const label = document.createElement('label');
        label.className = 'gui-label';
        label.innerText = name;
        const select = document.createElement('select');
        select.className = 'gui-select';
        const isArray = Array.isArray(options);
        (isArray ? options : Object.keys(options)).forEach((k, i) => {
            const opt = document.createElement('option');
            opt.value = isArray ? i : options[k];
            opt.innerText = k;
            select.appendChild(opt);
        });
        const update = () => { select.value = obj[prop]; };
        select.addEventListener('change', (e) => {
            obj[prop] = parseInt(e.target.value);
            this.notifyGlobal(prop, obj[prop]);
        });
        div.appendChild(label);
        div.appendChild(select);
        this.currentFolder.appendChild(div);
        const controller = { update };
        this.controllers.push(controller);
        update();
        return { onChange: (fn) => { 
            const dFn = this.debounce(fn, 200);
            select.addEventListener('change', () => dFn(obj[prop])); 
            return this; 
        }};
    }

    addButton(text, callback) {
        const btn = document.createElement('button');
        btn.className = 'gui-button';
        btn.innerText = text;
        btn.onclick = callback;
        this.currentFolder.appendChild(btn);
        return { style: btn.style };
    }

    // Not using internal addFullscreen here as it is embedded in Management
    createModal(id, title, placeholder, actionText, actionFn) {
        const d = document.createElement('div');
        d.id = id; d.className = 'gui-modal';
        d.innerHTML = `<h4 style="color:#00ff66;margin:0;font-family:monospace">${title}</h4>`;
        const txt = document.createElement('textarea');
        txt.className = 'gui-textarea';
        if(placeholder) txt.placeholder = placeholder;
        d.appendChild(txt);
        if(actionText) {
            const b = document.createElement('button');
            b.className = 'gui-button';
            b.innerText = actionText;
            b.style.marginTop = '10px';
            b.onclick = () => actionFn(txt);
            d.appendChild(b);
        }
        const c = document.createElement('button');
        c.className = 'gui-modal-close';
        c.innerText = 'CLOSE';
        c.onclick = () => d.style.display = 'none';
        d.appendChild(c);
        document.body.appendChild(d);
        return d;
    }
}
window.GuiLib = GuiLib;