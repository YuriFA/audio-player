"use strict";

import Playlist from './Playlist';
import Track from './Track';
import EventEmmiter from './utils/EventEmmiter';
import Equalizer from './Equalizer';
import Analyser from './Analyser';

export default class AudioPlayer extends EventEmmiter {
    constructor(tracks=[], settings = {}) {
        super();

        this.playlist = new Playlist(tracks);
        this.muted = false;
        this.currentTrackIndex = 0;
        this.settings = settings;
        this._playback = {}
        this._resetPlaybackInfo();
        this._setTrack();

        // init Audio API Nodes
        this._ctx = null;
        this._gain = null;
        this._equalizer = null;
        this._analyser = null;
        this._createAudioApiNodes();
    }

    get isPlaying() {
        return this._playback.playing;
    }
    
    get volume() {
        return this._gain.gain.value;
    }

    get equalizer() {
        return this._equalizer;
    }

    get analyser() {
        return this._analyser;
    }

    set volume(value) {
        if(value > 1 && value < 0) {
            throw Error('Volume must be in range from 0 to 1');
        }
        if(value === 0) {
            this.mute();
        } else if(this.muted) {
            this.unmute();
        }
        this._gain.gain.value = value;
    }
    
    play() {
        if(this.isPlaying) {
            return this;
        }

        if(!this._playback.track || this._playback.track.id !== this.currentTrackIndex) {
            this._setTrack();
        }

        const track = this._playback.track;

        console.log(`Playing track id=${this.currentTrackIndex} - ${track.src}`);
        if(track.audio && track.isBuffered()) {
            track.audio.play();
            this._playback.playing = true;
        } else {
            track.load();
            //Subscribe
            //чет не ок
            track.on('canplay', this._startPlayback.bind(this));
            track.on('ended', this.playNext.bind(this));
            track.on('progress', (e) => {
                this.emit('track:progress', e);
            });
            track.on('loadeddata', (e) => {
                this.emit('track:loadeddata', e);
            });
            track.on('canplaythrough', (e) => {
                this.emit('track:canplaythrough', e);
            });
            track.on('loadedmetadata', (e) => {
                this.emit('track:loadedmetadata', e);
            });
            track.on('timeupdate', (e) => {
                this.emit('track:timeupdate', e);
            });
        }

        return this;
    }

    stop() {
        this._playback.playing = false;
        const track = this._playback.track;
        track.audio.pause();
        track.audio.currentTime = 0;

        return this;
    }

    pause() {
        this._playback.playing = false;
        const track = this._playback.track;
        track.audio.pause();
        console.log('PAUSED');

        return this;
    }

    mute() {
        this._playback.track.muted = true;
        this.muted = true;

        return this;
    }

    unmute() {
        this._playback.track.muted = false;
        this.muted = false;

        return this;
    }

    playNext() {
        if(this.isPlaying) {
            this.stop();
        }
        this._resetPlaybackInfo();

        this.currentTrackIndex += 1;
        this.play();

        return this;
    }

    playPrev() {
        if(this.isPlaying) {
            this.stop();
        }
        this._resetPlaybackInfo();

        this.currentTrackIndex -= 1;
        this.play();

        return this;
    }

    rewind(ratio) {
        if(ratio > 1 && ratio < 0) {
            throw Error('To rewind audio, ratio must be in range from 0 to 1');
        }

        const audio = this._playback.track.audio;
        if(!isNaN(audio.duration)) {
            const newTime = audio.duration * ratio;
            audio.currentTime = newTime;
        }

        return this;
    }

    _setTrack() {
        if(this.isPlaying) {
            return this;
        }
        console.log('Setting track', this.currentTrackIndex);
        //TODO: need to refactoring this
        try {
            this._playback.track = this.playlist.getTrack(this.currentTrackIndex);
        } catch (error) {
            console.log(error);
            console.log('CurrentTrackIndex reseted to 0');
            this.currentTrackIndex = 0;
            this._playback.track = this.playlist.getTrack(this.currentTrackIndex);
        }

        return this;
    }

    _resetPlaybackInfo() {
        this._playback = {
            track: null,
            source: null,
            playing: false,
        }
        // console.log('RESET PLAYBACK');

        return this;
    }

    _startPlayback() {
        if(this.isPlaying) {
            console.log('Already playing!1');
            return this;
        }

        const playback = this._playback;
        const track = this._playback.track;
        
        playback.source = this._ctx.createMediaElementSource(track.audio);
        this._connectNodes();

        console.log(`Loaded - ${playback.track.src}`);
        playback.playing = true;
        track.audio.play();

        //Unsubscribe because 'canplay' event triggered by changing the current time
        track.off('canplay', this._startPlayback.bind(this));

        return this;
    }

    _createAudioApiNodes() {
        if(!(window.AudioContext || window.webkitAudioContext)) return;

        this._ctx = new (window.AudioContext || window.webkitAudioContext)();
        this._dest = this._ctx.destination;
        this._gain = this._ctx.createGain();
        this._equalizer = this.settings.equalizer ? new Equalizer(this._ctx) : null;
        this._analyser = this.settings.analyser ? new Analyser(this._ctx) : null;
        return this;
    }

    _connectNodes() {
        const filters = this._equalizer ? this._equalizer.filters : [];
        const analyser = this._analyser ? this._equalizer.analyser : null;
        let toConnectNodes = [
            this._playback.source,
            ...filters,
            this._gain,
            analyser,
            this._dest
        ].filter(n => n);

        toConnectNodes.reduce((prev, curr) => {
            if(prev instanceof AudioNode && curr instanceof AudioNode) {
                prev.connect(curr);
            }
            return curr;
        });

        return this;
    }
}
