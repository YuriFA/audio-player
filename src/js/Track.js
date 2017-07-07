"use strict";

import EventEmmiter from './utils/EventEmmiter.js';

export default class Track extends EventEmmiter{
    constructor(src, name='') {
        super();

        this._src = src;
        this._name = name;
        this._buffer = null;
        this._audio = null;
    }

    get src() {
        return this._src;
    }

    get name() {
        return this._name;
    }

    get audio() {
        return this._audio;
    }

    isBuffered() {
        return this._audio.buffered.length > 0;
    }

    load() {
        if(!this._audio) {
            this._audio = new Audio();
            this._audio.addEventListener('canplay', (e) => {
                this.emit('track:canplay', e);
            });
            this._audio.addEventListener('ended', () => {
                this.emit('track:ended');
            })
            this._audio.src = this._src;
        }

        return this;
    }
};
