"use strict";

const FREQS = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

export default class Equalizer {
    constructor(context) {
        this.context = context;
        this.filters = [];
        this._frequencies = FREQS;
        this._createFilters();
    }

    get frequencies() {
        return this._frequencies;
    }

    _createFilter(frequency) {
        const filter = this.context.createBiquadFilter();

        filter.type = 'peaking';
        filter.frequency.value = frequency;
        filter.Q.value = 1; // Q-factor
        filter.gain.value = 0;

        return filter;
    }

    _createFilters() {
        const filters = this._frequencies.map(this._createFilter.bind(this));
        filters.reduce((prev, curr) => {
            prev.connect(curr);
            return curr;
        });
        this.filters = filters;

        return this;
    }
}
