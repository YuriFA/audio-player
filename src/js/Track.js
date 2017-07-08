"use strict";

import EventEmmiter from './utils/EventEmmiter.js';

export default class Track extends EventEmmiter{
    constructor(src, name='') {
        super();

        this._src = src;
        this._name = name;
        this._buffer = null;
        this._audio = new Audio();
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

    set muted(value) {
        this._audio.muted = !!value;
    }

    isBuffered() {
        return this._audio.buffered.length > 0;
    }

    load() {
        this._audio.addEventListener('canplay', (e) => {
            this.emit('canplay', e);
        });
        this._audio.addEventListener('ended', () => {
            this.emit('ended');
        });
        this._audio.addEventListener('progress', (e) => {
            this.emit('progress', e);
        });
        this._audio.addEventListener('loadeddata', (e) => {
            this.emit('loadeddata', e);
        });
        this._audio.addEventListener('loadedmetadata', (e) => {
            this.emit('loadedmetadata', e);
        });
        this._audio.addEventListener('timeupdate', (e) => {
            console.log(e);
            this.emit('timeupdate', e);
        });
        
        this._audio.crossOrigin = "anonymous";
        this._audio.src = this._src;

        return this;
    }
};
