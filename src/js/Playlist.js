"use strict";

import Track from './Track';

export default class Playlist {
    constructor(tracks) {
        this._tracks = [];
    }

    get tracks() {
        return this._tracks;
    }

    addTrack(src, name) {
        const track = new Track(src, name);
        this.tracks.push(track);

        return this;
    }
}