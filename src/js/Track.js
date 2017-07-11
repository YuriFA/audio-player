"use strict";

import EventEmmiter from './utils/EventEmmiter.js';

export default class Track extends EventEmmiter{
    constructor(id, src, name='') {
        super();
        this.id = id;
        this._src = src;
        this._name = name;
        this._buffer = null;
        this._audio = new Audio();
        this._bindEvents();
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
        this._audio.crossOrigin = "anonymous";
        this._audio.src = this._src;
        this._audio.load();
        return this;
    }

    _bindEvents() {
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
        this._audio.addEventListener('canplaythrough', (e) => {
            this.emit('canplaythrough', e);
        });
        this._audio.addEventListener('loadedmetadata', (e) => {
            this.emit('loadedmetadata', e);
        });
        this._audio.addEventListener('timeupdate', (e) => {
            this.emit('timeupdate', e);
        });
    }
};
