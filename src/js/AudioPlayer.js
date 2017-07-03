"use strict";
import Playlist from './Playlist';
import EventEmmiter from './utils/EventEmmiter';

export default class AudioPlayer extends EventEmmiter {
    // TODO: Create simple audio player with Web Audio API
    constructor(node, playlist, params = {}) {
        super();

        this.playlist = playlist || new Playlist();
        this.currentTrackIndex = 0;
        this._playback = {
            track: null,
            source: null,
            buffer: null,
            playing: false,
            loading: false
        }
        // init Audio API Nodes
        this._ctx = null;
        this._gain = null;
        this._createAudioApiNodes();
    }

    play() {
        this.on('track:load', this._startPlayback);
        this._loadTrack(this.playlist.tracks[this.currentTrackIndex]);
    }

    stop() {}

    pause() {
        // TODO: disconnect source and save time of pause
        // if(this._playback.playing && this._playback.source) {
        //     this._playback.source
        // }
    }

    _loadTrack(track) {
        if(this._playback.loading && this._playback.track) {
            return this;
        }

        let { src } = track;
        let xhr = new XMLHttpRequest();
        this._playback.loading = true;
        this._playback.track = track;

        xhr.open('GET', src, true);
        xhr.responseType = 'arraybuffer';
        xhr.addEventListener('load', (e) => {
            this._ctx.decodeAudioData(xhr.response,
                (decodedArrayBuffer) => {
                    this._playback.buffer = decodedArrayBuffer;
                    this._playback.loading = false;
                    this.emit('track:load');
                }, (e) => {
                    console.log('Error decoding file', e);
                }
            );
        });
        xhr.send();

        return this;
    }

    _startPlayback() {
        const playback = this._playback;

        playback.source = this._ctx.createBufferSource();
        playback.source.connect(this._gain);
        playback.source.buffer = playback.buffer;

        playback.source.start(0);
        playback.playing = true;
    }

    _createAudioApiNodes() {
        this._ctx = new (window.AudioContext || window.webkitAudioContext)();
        this._dest = this._ctx.destination;
        this._gain = this._ctx.createGain();

        // Connect Nodes
        this._gain.connect(this._dest);

        return this;
    }
}
