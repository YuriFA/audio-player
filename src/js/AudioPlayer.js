"use strict";

import Playlist from './Playlist';
import Track from './Track';
import EventEmmiter from './utils/EventEmmiter';

const PLAYING_TIME = 5; //for test

export default class AudioPlayer extends EventEmmiter {
    constructor(tracks=[], params = {}) {
        super();

        this.playlist = new Playlist(tracks);
        this.muted = false;
        this.currentTrackIndex = 0;
        this._playback = {}
        this._resetPlaybackInfo();
        this._setTrack();

        // init Audio API Nodes
        this._ctx = null;
        this._gain = null;
        this._createAudioApiNodes();
        this._gain.gain.value = 0.1;
    }

    get isPlaying() {
        return this._playback.playing;
    }
    
    get volume() {
        return this._gain.gain.value;
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
        console.log(`Playing track id=${this.currentTrackIndex}`);


        if(!this._playback.track) {
            this._setTrack();
        }

        const track = this._playback.track;
        if(track.audio && track.isBuffered()) {
            track.audio.play();
            this._playback.playing = true;
        } else {
            track.load();
            //Subscribe
            track.on('canplay', this._startPlayback.bind(this));
            track.on('ended', this.playNext.bind(this));
            track.on('progress', (e) => {
                this.emit('track:progress', e);
            });
            track.on('loadeddata', (e) => {
                this.emit('track:loadeddata', e);
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
        this._resetPlaybackInfo();

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

        this.currentTrackIndex += 1;
        this.play();

        return this;
    }

    playPrev() {
        if(this.isPlaying) {
            this.stop();
        }

        this.currentTrackIndex -= 1;
        this.play();

        return this;
    }

    // перемотка
    rewind(ratio) {
        if(ratio > 1 && ratio < 0) {
            throw Error('Volume must be in range from 0 to 1');
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

        this._playback.track = this.playlist.getTrack(this.currentTrackIndex);

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
        
        playback.startTime = this._ctx.currentTime;
        playback.source = this._ctx.createMediaElementSource(track.audio);
        playback.source.connect(this._gain);

        console.log(`Loaded - ${playback.track.src}`);
        playback.playing = true;
        track.audio.play();

        //Unsubscribe because changing current time triggering 'canplay' event
        track.off('canplay', this._startPlayback.bind(this));

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
