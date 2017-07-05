"use strict";

import Playlist from './Playlist';
import EventEmmiter from './utils/EventEmmiter';

const PLAYING_TIME = 5; //for test

export default class AudioPlayer extends EventEmmiter {
    constructor(node, playlist, params = {}) {
        super();

        this.playlist = playlist || new Playlist();
        this.currentTrackIndex = 0;
        this._playback = {}
        this._resetPlaybackInfo();
        // init Audio API Nodes
        this._ctx = null;
        this._gain = null;
        this._createAudioApiNodes();
        this._gain.gain.value = 0.04;

        //Subscribe
        this.on('track:load', this._startPlayback);
    }

    get isPlaying() {
        return this._playback.playing;
    }

    set volume(value) {
        if(value > 1 && value < 0) {
            throw Error('Volume must be in range from 0 to 1');
        }
        this._gain.gain.value = value; 
    }

    play() {
        if(this._playback.playing) {
            return this;
        }
        
        if(this._playback.track && this._playback.buffer) {
            console.log('RESUME');
            this._startPlayback();
        } else {
            console.log(this.playlist.tracks[this.currentTrackIndex]);
            this._loadTrack(this.playlist.tracks[this.currentTrackIndex]);
        }

        return this;
    }

    stop() {
        this._playback.source.stop();
        this._resetPlaybackInfo();

        return this;
    }

    pause() {
        if(this._playback.playing && this._playback.source) {
            this._playback.playing = false;
            this._playback.source.stop();
            this._playback.offset += this._ctx.currentTime - this._playback.startTime;
            console.log('PAUSED');
        }
        return this;
    }
    // TODO: Fix bug with double clicking error (async loading)
    playNext() {
        if(this.isPlaying && this._playback.source) {
            this.stop();
        }

        this.currentTrackIndex += 1;
        this.play();
        return this;
    }

    playPrev() {
        if(this.isPlaying && this._playback.source) {
            this.stop();
        }

        this.currentTrackIndex -= 1;
        this.play();
        return this;
    }

    _resetPlaybackInfo() {
        this._playback = {
            track: null,
            source: null,
            buffer: null,
            playing: false,
            loading: false,
            startTime: 0,
            offset: 0
        }

        console.log('RESET PLAYBACK');

        return this;
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

    _setNextTrack() {

    }

    _startPlayback() {
        const playback = this._playback;
        playback.startTime = this._ctx.currentTime;

        playback.source = this._ctx.createBufferSource();
        playback.source.connect(this._gain);
        playback.source.buffer = playback.buffer;
        playback.source.start(0, playback.offset % playback.buffer.duration);
        console.log('PLAYING');
        playback.playing = true;

        playback.source.addEventListener('ended', (e) => {
            // const source = e.target.buffer;
            // console.log(this._ctx.currentTime - (this._playback.startTime + source.buffer.duration));
            // may be bugs
            if(this.isPlaying) {
                //isPlaying == not paused
                console.log('TRACK ENDED');
                this.playNext();
            }
        });

        return this;
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
