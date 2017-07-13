export default class EventEmmiter {
  constructor() {
    this._events = [];
  }

  on(event, cb) {
    if (typeof cb === 'undefined') {
      throw Error('You must provide a callback function');
    }

    if (typeof cb !== 'function') {
      throw Error('Callback must be a function');
    }

    this._events[event] = this._events[event] || [];
    this._events[event].push(cb);

    return this;
  }

  off(event, cb) {
    if (typeof cb === 'undefined') {
      throw Error('You must provide a callback function');
    }

    if (typeof cb !== 'function') {
      throw Error('Callback must be a function');
    }

    if (typeof this._events[event] === 'undefined') {
      throw Error('Event not found');
    }

    const callbacks = this._events[event];
    callbacks.forEach((callback, i) => {
      if (callback.toString() === cb.toString()) {
        callbacks.splice(i, 1);
      }
    });

    return this;
  }

  emit(event, ...args) {
    if (typeof event === 'undefined') {
      throw Error('You must provide an event to emit');
    }

    let callbacks = this._events[event];
    if (typeof callbacks !== 'undefined') {
      callbacks = callbacks.slice();

      callbacks.forEach((cb, i) => {
        cb.apply(this, args);
      });
    }

    return this;
  }
}
