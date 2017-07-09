import { isFunction } from './';

export default class Slider {
    constructor(node, options={}) {//updateFunction, vertical=false) {
        this.node = node;
        this.vertical = options.vertical || false;
        this.callback = options.callback;
        this.draggable = false;
        this.value = null;
        this._bind();
        
        //chrome bug with mousemove
        this.node.ondragstart = () => false;
    }

    _bind() {
        this.node.addEventListener('mousedown', (e) => {
            if(e.which === 1) { //left mouse button
                this.draggable = true;
                this._getValue(e);
            }
        });

        document.addEventListener('mousemove', (e) => {
            if(this.draggable) {
                this._getValue(e);
            }
        });

        document.addEventListener('mouseup', (e) => {
            if(this.draggable) {
                this.draggable = false;
                this._getValue(e);
            }
        });
    }

    _getValue(e) {
        let value = null;
        if(this.vertical) {
            value = 1 - ((e.clientY - this.node.offsetTop) / this.node.offsetHeight);
        } else {
            value = (e.clientX - this.node.offsetLeft) / this.node.offsetWidth;
        }
        const validValue = value > 1 ? 1 : (value < 0 ? 0 : value);

        if(isFunction(this.callback)) {
            this.callback(validValue);
        }

        return this;
    }
}
