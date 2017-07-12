"use strict";

const PRESETS = [
  {
    name: "Acoustic",
    data: [5, 5, 4, 1, 2, 2, 3, 4, 3, 2],
  }, {
    name: "Bass Booster",
    data: [6, 5, 4, 3, 2, 0, 0, 0, 0, 0],
  }, {
    name: "Bass Reducer",
    data: [-6, -5, -4, -3, -2, 0, 0, 0, 0, 0],
  }, {
    name: "Classical",
    data: [5, 4, 3, 2, -1, -1, 0, 1, 3, 4]
  }, {
    name: "Dance",
    data: [4, 6, 5, 0, 2, 3, 5, 4, 3, 0],
  }, {
    name: "Deep",
    data: [5, 3, 2, 1, 3, 2, 1, -2, -4, -5]
  }, {
    name: "Electronic",
    data: [4, 4, 1, 0, -2, 2, 1, 2, 4, 5]
  }, {
    name: "Hip-Hop",
    data: [5, 3, 1, 3, -1, -1, 1, -1, 2, 3],
  }, {
    name: "Jazz",
    data: [4, 3, 1, 2, -1, -1, 0, 1, 3, 4],
  }, {
    name: "Latin",
    data: [5, 3, 0, 0, -1, -1, -1, 0, 3, 5]
  }, {
    name: "Loudness",
    data: [6, 4, 0, 0, -2, 0, -1, -5, 4, 1],
  }, {
    name: "Lounge",
    data: [-3, -2, -1, 1, 4, 3, 0, -1, 2, 1],
  }, {
    name: "Piano",
    data: [3, 2, 0, 2, 3, 1, 3, 5, 3, 4],
  }, {
    name: "Pop",
    data: [-2, -1, 0, 2, 4, 4, 2, 0, -1, -2],
  }, {
    name: "R&B",
    data: [2, 7, 6, 1, -2, -1, 2, 3, 3, 4],
  }, {
    name: "Rock",
    data: [5, 4, 3, 2, -1, -2, 0, 2, 3, 4],
  }, {
    name: "Small Speakers",
    data: [5, 4, 3, 2, 1, 0, -2, -3, -4, -5],
  }, {
    name: "Spoken Word",
    data: [-4, -1, 0, 1, 3, 5, 5, 4, 2, 0],
  }, {
    name: "Treble Booster",
    data: [0, 0, 0, 0, 0, 1, 2, 3, 4, 5],
  }, {
    name: "Treble Reducer",
    data: [0, 0, 0, 0, 0, -1, -2, -3, -4, -5],
  }, {
    name: "Vocal Booster",
    data: [-1, -3, -3, 1, 4, 4, 3, 1, 0, -1]
  }
];
const FREQS = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

export default class Equalizer {
    constructor(context) {
        this.filters = [];
        this.presets = PRESETS;
        this._context = context;
        this._frequencies = FREQS;
        this._createFilters();
    }

    get frequencies() {
        return this._frequencies;
    }

    changeFilterGain(id, value) {
        if(id in this.filters) {
            const validValue = value > 12 ? 12 : (value < -12 ? -12 : value);
            this.filters[id].gain.value = validValue;
        }

        return this;
    }

    getFilterGain(id) {
        return id in this.filters ? this.filters[id].gain.value : null;
    }

    _createFilter(frequency) {
        const filter = this._context.createBiquadFilter();

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
