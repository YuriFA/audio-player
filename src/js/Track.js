"use strict";

export default class Track {
    constructor(src, name='') {
        this._src = src;
        this._name = name;
        this._buffer = null;
    }

    get src() {
        return this._src;
    }

    get name() {
        return this._name;
    }

    set buffer(buffer) {
        this._buffer = buffer;
        return this;
    }

    get buffer() {
        return this._buffer;
    }
};
