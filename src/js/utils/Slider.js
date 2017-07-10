import { isFunction } from './';

// TODO: Добавить min и max значения и хранить значения из этого интервала
// TODO: Добавить дефолтные параметры
export default class Slider {
    constructor(node, options={}) {
        this.node = node;
        this.vertical = options.vertical || false;
        this.onchange = options.onchange;
        this.draggable = false;
        this.value = null;
        this._bind();

        if(typeof options.defaultValue === "number") {
            console.log('set');
            this.setValue(options.defaultValue);
        }
        
        //chrome bug with mousemove
        this.node.ondragstart = () => false;
    }

    _bind() {
        this.node.addEventListener('mousedown', (e) => {
            if(e.which === 1) { //left mouse button
                this.draggable = true;
                this._updateValue(e);
            }
        });

        document.addEventListener('mousemove', (e) => {
            if(this.draggable) {
                this._updateValue(e);
            }
        });

        document.addEventListener('mouseup', (e) => {
            if(this.draggable) {
                this.draggable = false;
                this._updateValue(e);
            }
        });
    }

    setValue(value) {
        const validValue = value > 1 ? 1 : (value < 0 ? 0 : value);

        this.value = validValue;
        
        if(isFunction(this.onchange)) {
            this.onchange(validValue);
        }

        return this;
    }

    _updateValue(e) {
        const pos = this.node.getBoundingClientRect();

        let value = null;
        if(this.vertical) {
            value = 1 - ((e.clientY - pos.top) / this.node.offsetHeight);
        } else {
            value = (e.clientX - pos.left) / this.node.offsetWidth;
        }

        this.setValue(value);

        return this;
    }
}
