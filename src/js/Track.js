import EventEmmiter from './utils/EventEmmiter';

export default class Track extends EventEmmiter {
  constructor(id, src, name = '') {
    super();
    this.id = id;
    this._src = src;
    this._name = name;
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
    this._audio.crossOrigin = 'anonymous';
    this._audio.src = this._src;
    this._audio.load();
    return this;
  }

  // emiting all <audio> tag events
  _bindEvents() {
    for (const key in this._audio) {
      if (key.search('on') === 0) {
        this._audio.addEventListener(key.slice(2), (event) => {
          this.emit(key.slice(2), event);
        });
      }
    }
  }
}
