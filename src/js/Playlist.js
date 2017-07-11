"use strict";

import Track from './Track';

export default class Playlist {
    constructor(tracks=[]) {
        this._tracks = [];
        this.addTrackList(tracks);
    }

    get tracks() {
        return this._tracks;
    }

    getTrack(id) {
        const track = this._tracks[id];
        if(track) {
            return track;
        } else {
            throw Error(`Track with id=${id} dosen't exist in playlist`);
        }
    }

    addTrack(id, src, name = '') {
        const track = new Track(id, src, name);
        this.tracks.push(track);

        return this;
    }

    addTrackList(list) {
        list.forEach((track, i) => {
            if(typeof track === 'string') {
                // console.log('str', track);
                this.addTrack(i, track);
            } else if(typeof track === 'object') {
                const { src, name } = track;
                // console.log('obj', src, name);
                this.addTrack(i, src, name);
            }
        });
    }
}