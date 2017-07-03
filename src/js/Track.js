"use strict";

export default class Track {
    constructor(src, name='') {
        this._src = src;
        this._name = name;
    }

    get src() {
        return this._src;
    }

    get name() {
        return this._name;
    }
};
