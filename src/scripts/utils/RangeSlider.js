import DOMBuilder from './DOMBuilder';
import { isFunction, validateInRange } from './';
import './ObjectAssign';

const defaults = {
  min: 0,
  max: 1,
  value: 0,
  vertical: false,
  handle: true,
  buffer: false,
};

export default class RangeSlider {
  constructor(node, options = {}) {
    this.node = node;
    this.options = Object.assign(Object.assign({}, defaults), options);

    this.track = null;
    this.fill = null;
    this.handle = null;
    this.buffer = null;

    this.vertical = this.options.vertical;

    this.min = this.options.min;
    this.max = this.options.max;
    this.length = Math.abs(this.min) + Math.abs(this.max);
    this.value = this.options.value;
    this.ratio = null;

    this.draggable = false;
    this.onmove = this.options.onmove;
    this.onchange = this.options.onchange;
    // chrome bug with mousemove
    this.node.ondragstart = () => false;

    this._createDOM();
    this._bindEvents();
    this.setValue(this.value);
  }

  setValue(value) {
    const validValue = validateInRange(value, this.min, this.max);
    this.value = validValue;
    this.ratio = (this.value - this.min) / this.length;

    this._updateFill();

    return this;
  }

  setValueByRatio(ratio) {
    const validRatio = validateInRange(ratio, 0, 1);
    this.ratio = validRatio;
    this.value = this.min + (this.ratio * this.length);

    this._updateFill();

    return this;
  }

  setBuffer(ratio) {
    if (this.options.buffer) {
      const validRatio = validateInRange(ratio, 0, 1);

      if (this.vertical) {
        this.buffer.style.height = `${validRatio * 100}%`;
      } else {
        this.buffer.style.width = `${validRatio * 100}%`;
      }
    }

    return this;
  }

  _updateFill() {
    if (this.vertical) {
      this.fill.style.height = `${this.ratio * 100}%`;
    } else {
      this.fill.style.width = `${this.ratio * 100}%`;
    }

    return this;
  }

  _updateValue(event) {
    const pos = this.node.getBoundingClientRect();

    let ratio = null;
    if (this.vertical) {
      ratio = 1 - ((event.clientY - pos.top) / this.node.offsetHeight);
    } else {
      ratio = (event.clientX - pos.left) / this.node.offsetWidth;
    }

    this.setValueByRatio(ratio);

    return this;
  }

  _bindEvents() {
    this.node.addEventListener('mousedown', (event) => {
      if (event.which === 1) { // left mouse button
        this.draggable = true;
        this._updateValue(event);
      }
    });

    document.addEventListener('mousemove', (event) => {
      if (this.draggable) {
        this._updateValue(event);

        if (isFunction(this.onmove)) {
          this.onmove(this.value);
        }
      }
    });

    document.addEventListener('mouseup', (event) => {
      if (this.draggable) {
        this.draggable = false;
        this._updateValue(event);

        if (isFunction(this.onchange)) {
          this.onchange(this.value);
        }
      }
    });
  }

  _createDOM() {
    const mainClassName = this.vertical ? 'slider-vert' : 'slider-horiz';
    this.node.classList.add(mainClassName);
    this.track = DOMBuilder.createElement('div', {
      attrs: {
        class: `${mainClassName}__track`,
      },
      parent: this.node,
    });
    this.fill = DOMBuilder.createElement('div', {
      attrs: {
        class: `${mainClassName}__filled`,
      },
      parent: this.track,
    });
    if (this.options.handle) {
      this.handle = DOMBuilder.createElement('div', {
        attrs: {
          class: `${mainClassName}__handle`,
        },
        parent: this.fill,
      });
    }
    if (this.options.buffer) {
      this.buffer = DOMBuilder.createElement('div', {
        attrs: {
          class: `${mainClassName}__buffer`,
        },
        parent: this.track,
      });
    }
  }
}
