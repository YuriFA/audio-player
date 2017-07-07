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
        if(this.isPlaying) {
            return this;
        }

        if(!this._playback.track) {
            this._playback.track = this.playlist.getTrack(this.currentTrackIndex);
        }
        console.log(`Playing track id=${this.currentTrackIndex}`);

        const track = this._playback.track;
        if(track.audio && track.isBuffered()) {
            track.audio.play();
            this._playback.playing = true;
        } else {
            track.load();
            //Subscribe
            track.on('track:canplay', this._startPlayback.bind(this));
            track.on('track:ended', this.playNext.bind(this));
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

    _resetPlaybackInfo() {
        this._playback = {
            track: null,
            source: null,
            playing: false,
            loading: false,
            startTime: 0,
            offset: 0
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

        console.log(`Playing - ${playback.track.src}`);
        playback.playing = true;
        track.audio.play();

        //Unsubscribe because changing current time triggering 'canplay' event
        track.off('track:canplay', this._startPlayback.bind(this));

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
