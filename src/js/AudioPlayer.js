"use strict";

import Playlist from './Playlist';
import Track from './Track';
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
        
        console.log(this.currentTrackIndex);
        if(!this._playback.track) {
            this._playback.track = this.playlist.getTrack(this.currentTrackIndex);
        }
        
        if(this._playback.track.buffer) {
            console.log('RESUME');
            this._startPlayback();
        } else {
            console.log('LOADING TRACK');
            this._loadTrack();
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

    _loadTrack() {
        if(this._playback.loading && this._playback.track) {
            return this;
        }

        const track = this._playback.track;
        let xhr = new XMLHttpRequest();
        this._playback.loading = true;

        xhr.open('GET', track.src, true);
        xhr.responseType = 'arraybuffer';
        xhr.addEventListener('load', (e) => {
            this._ctx.decodeAudioData(xhr.response,
                (decodedArrayBuffer) => {
                    track.buffer = decodedArrayBuffer;
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

    _setTrack(track) {
        this._playback.track = track;
        return this;
    }

    _startPlayback() {
        if(this.isPlaying) {
            console.log('ALREADY PLAYING!');
            return this;
        }

        const playback = this._playback;
        playback.startTime = this._ctx.currentTime;

        playback.source = this._ctx.createBufferSource();
        playback.source.connect(this._gain);
        playback.source.buffer = playback.track.buffer;

        console.log(`PLAYING - ${playback.track.src}`);
        playback.playing = true;
        playback.source.start(0, playback.offset % playback.source.buffer.duration);
        playback.source.addEventListener('ended', (e) => {
            if(this.isPlaying && e.target.buffer === this._playback.source.buffer) {
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
