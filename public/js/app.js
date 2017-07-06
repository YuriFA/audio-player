(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Playlist = require('./Playlist');

var _Playlist2 = _interopRequireDefault(_Playlist);

var _Track = require('./Track');

var _Track2 = _interopRequireDefault(_Track);

var _EventEmmiter2 = require('./utils/EventEmmiter');

var _EventEmmiter3 = _interopRequireDefault(_EventEmmiter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PLAYING_TIME = 5; //for test

var AudioPlayer = function (_EventEmmiter) {
    _inherits(AudioPlayer, _EventEmmiter);

    function AudioPlayer(node, playlist) {
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, AudioPlayer);

        var _this = _possibleConstructorReturn(this, (AudioPlayer.__proto__ || Object.getPrototypeOf(AudioPlayer)).call(this));

        _this.playlist = playlist || new _Playlist2.default();
        _this.currentTrackIndex = 0;
        _this._playback = {};
        _this._resetPlaybackInfo();
        // init Audio API Nodes
        _this._ctx = null;
        _this._gain = null;
        _this._createAudioApiNodes();
        _this._gain.gain.value = 0.04;

        //Subscribe
        _this.on('track:load', _this._startPlayback);
        return _this;
    }

    _createClass(AudioPlayer, [{
        key: 'play',
        value: function play() {
            if (this._playback.playing) {
                return this;
            }

            console.log(this.currentTrackIndex);
            if (!this._playback.track) {
                this._playback.track = this.playlist.getTrack(this.currentTrackIndex);
            }

            if (this._playback.track.buffer) {
                console.log('RESUME');
                this._startPlayback();
            } else {
                console.log('LOADING TRACK');
                this._loadTrack();
            }

            return this;
        }
    }, {
        key: 'stop',
        value: function stop() {
            this._playback.source.stop();
            this._resetPlaybackInfo();

            return this;
        }
    }, {
        key: 'pause',
        value: function pause() {
            if (this._playback.playing && this._playback.source) {
                this._playback.playing = false;
                this._playback.source.stop();
                this._playback.offset += this._ctx.currentTime - this._playback.startTime;
                console.log('PAUSED');
            }
            return this;
        }
        // TODO: Fix bug with double clicking error (async loading)

    }, {
        key: 'playNext',
        value: function playNext() {
            if (this.isPlaying && this._playback.source) {
                this.stop();
            }

            this.currentTrackIndex += 1;
            this.play();
            return this;
        }
    }, {
        key: 'playPrev',
        value: function playPrev() {
            if (this.isPlaying && this._playback.source) {
                this.stop();
            }

            this.currentTrackIndex -= 1;
            this.play();
            return this;
        }
    }, {
        key: '_resetPlaybackInfo',
        value: function _resetPlaybackInfo() {
            this._playback = {
                track: null,
                source: null,
                buffer: null,
                playing: false,
                loading: false,
                startTime: 0,
                offset: 0
            };

            console.log('RESET PLAYBACK');

            return this;
        }
    }, {
        key: '_loadTrack',
        value: function _loadTrack() {
            var _this2 = this;

            if (this._playback.loading && this._playback.track) {
                return this;
            }

            var track = this._playback.track;
            var xhr = new XMLHttpRequest();
            this._playback.loading = true;

            xhr.open('GET', track.src, true);
            xhr.responseType = 'arraybuffer';
            xhr.addEventListener('load', function (e) {
                _this2._ctx.decodeAudioData(xhr.response, function (decodedArrayBuffer) {
                    track.buffer = decodedArrayBuffer;
                    _this2._playback.loading = false;
                    _this2.emit('track:load');
                }, function (e) {
                    console.log('Error decoding file', e);
                });
            });
            xhr.send();

            return this;
        }
    }, {
        key: '_setTrack',
        value: function _setTrack(track) {
            this._playback.track = track;
            return this;
        }
    }, {
        key: '_startPlayback',
        value: function _startPlayback() {
            var _this3 = this;

            if (this.isPlaying) {
                console.log('ALREADY PLAYING!');
                return this;
            }

            var playback = this._playback;
            playback.startTime = this._ctx.currentTime;

            playback.source = this._ctx.createBufferSource();
            playback.source.connect(this._gain);
            playback.source.buffer = playback.track.buffer;

            console.log('PLAYING - ' + playback.track.src);
            playback.playing = true;
            playback.source.start(0, playback.offset % playback.source.buffer.duration);
            playback.source.addEventListener('ended', function (e) {
                if (_this3.isPlaying && e.target.buffer === _this3._playback.source.buffer) {
                    console.log('TRACK ENDED');
                    _this3.playNext();
                }
            });

            return this;
        }
    }, {
        key: '_createAudioApiNodes',
        value: function _createAudioApiNodes() {
            this._ctx = new (window.AudioContext || window.webkitAudioContext)();
            this._dest = this._ctx.destination;
            this._gain = this._ctx.createGain();

            // Connect Nodes
            this._gain.connect(this._dest);

            return this;
        }
    }, {
        key: 'isPlaying',
        get: function get() {
            return this._playback.playing;
        }
    }, {
        key: 'volume',
        set: function set(value) {
            if (value > 1 && value < 0) {
                throw Error('Volume must be in range from 0 to 1');
            }
            this._gain.gain.value = value;
        }
    }]);

    return AudioPlayer;
}(_EventEmmiter3.default);

exports.default = AudioPlayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvUGxheWVyLmpzIl0sIm5hbWVzIjpbIlBMQVlJTkdfVElNRSIsIkF1ZGlvUGxheWVyIiwibm9kZSIsInBsYXlsaXN0IiwicGFyYW1zIiwiY3VycmVudFRyYWNrSW5kZXgiLCJfcGxheWJhY2siLCJfcmVzZXRQbGF5YmFja0luZm8iLCJfY3R4IiwiX2dhaW4iLCJfY3JlYXRlQXVkaW9BcGlOb2RlcyIsImdhaW4iLCJ2YWx1ZSIsIm9uIiwiX3N0YXJ0UGxheWJhY2siLCJwbGF5aW5nIiwiY29uc29sZSIsImxvZyIsInRyYWNrIiwiZ2V0VHJhY2siLCJidWZmZXIiLCJfbG9hZFRyYWNrIiwic291cmNlIiwic3RvcCIsIm9mZnNldCIsImN1cnJlbnRUaW1lIiwic3RhcnRUaW1lIiwiaXNQbGF5aW5nIiwicGxheSIsImxvYWRpbmciLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJzcmMiLCJyZXNwb25zZVR5cGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImRlY29kZUF1ZGlvRGF0YSIsInJlc3BvbnNlIiwiZGVjb2RlZEFycmF5QnVmZmVyIiwiZW1pdCIsInNlbmQiLCJwbGF5YmFjayIsImNyZWF0ZUJ1ZmZlclNvdXJjZSIsImNvbm5lY3QiLCJzdGFydCIsImR1cmF0aW9uIiwidGFyZ2V0IiwicGxheU5leHQiLCJ3aW5kb3ciLCJBdWRpb0NvbnRleHQiLCJ3ZWJraXRBdWRpb0NvbnRleHQiLCJfZGVzdCIsImRlc3RpbmF0aW9uIiwiY3JlYXRlR2FpbiIsIkVycm9yIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLGVBQWUsQ0FBckIsQyxDQUF3Qjs7SUFFSEMsVzs7O0FBQ2pCLHlCQUFZQyxJQUFaLEVBQWtCQyxRQUFsQixFQUF5QztBQUFBLFlBQWJDLE1BQWEsdUVBQUosRUFBSTs7QUFBQTs7QUFBQTs7QUFHckMsY0FBS0QsUUFBTCxHQUFnQkEsWUFBWSx3QkFBNUI7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WCxDQUFnQkMsS0FBaEIsR0FBd0JBLEtBQXhCO0FBQ0g7Ozs7OztrQkEzQmdCWCxXIiwiZmlsZSI6IkF1ZGlvUGxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBQbGF5bGlzdCBmcm9tICcuL1BsYXlsaXN0JztcbmltcG9ydCBUcmFjayBmcm9tICcuL1RyYWNrJztcbmltcG9ydCBFdmVudEVtbWl0ZXIgZnJvbSAnLi91dGlscy9FdmVudEVtbWl0ZXInO1xuXG5jb25zdCBQTEFZSU5HX1RJTUUgPSA1OyAvL2ZvciB0ZXN0XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1ZGlvUGxheWVyIGV4dGVuZHMgRXZlbnRFbW1pdGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihub2RlLCBwbGF5bGlzdCwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLnBsYXlsaXN0ID0gcGxheWxpc3QgfHwgbmV3IFBsYXlsaXN0KCk7XG4gICAgICAgIHRoaXMuY3VycmVudFRyYWNrSW5kZXggPSAwO1xuICAgICAgICB0aGlzLl9wbGF5YmFjayA9IHt9XG4gICAgICAgIHRoaXMuX3Jlc2V0UGxheWJhY2tJbmZvKCk7XG4gICAgICAgIC8vIGluaXQgQXVkaW8gQVBJIE5vZGVzXG4gICAgICAgIHRoaXMuX2N0eCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2dhaW4gPSBudWxsO1xuICAgICAgICB0aGlzLl9jcmVhdGVBdWRpb0FwaU5vZGVzKCk7XG4gICAgICAgIHRoaXMuX2dhaW4uZ2Fpbi52YWx1ZSA9IDAuMDQ7XG5cbiAgICAgICAgLy9TdWJzY3JpYmVcbiAgICAgICAgdGhpcy5vbigndHJhY2s6bG9hZCcsIHRoaXMuX3N0YXJ0UGxheWJhY2spO1xuICAgIH1cblxuICAgIGdldCBpc1BsYXlpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wbGF5YmFjay5wbGF5aW5nO1xuICAgIH1cblxuICAgIHNldCB2b2x1bWUodmFsdWUpIHtcbiAgICAgICAgaWYodmFsdWUgPiAxICYmIHZhbHVlIDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1ZvbHVtZSBtdXN0IGJlIGluIHJhbmdlIGZyb20gMCB0byAxJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZ2Fpbi5nYWluLnZhbHVlID0gdmFsdWU7IFxuICAgIH1cblxuICAgIHBsYXkoKSB7XG4gICAgICAgIGlmKHRoaXMuX3BsYXliYWNrLnBsYXlpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRUcmFja0luZGV4KTtcbiAgICAgICAgaWYoIXRoaXMuX3BsYXliYWNrLnRyYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9wbGF5YmFjay50cmFjayA9IHRoaXMucGxheWxpc3QuZ2V0VHJhY2sodGhpcy5jdXJyZW50VHJhY2tJbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuX3BsYXliYWNrLnRyYWNrLmJ1ZmZlcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1JFU1VNRScpO1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRQbGF5YmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0xPQURJTkcgVFJBQ0snKTtcbiAgICAgICAgICAgIHRoaXMuX2xvYWRUcmFjaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RvcCgpIHtcbiAgICAgICAgdGhpcy5fcGxheWJhY2suc291cmNlLnN0b3AoKTtcbiAgICAgICAgdGhpcy5fcmVzZXRQbGF5YmFja0luZm8oKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwYXVzZSgpIHtcbiAgICAgICAgaWYodGhpcy5fcGxheWJhY2sucGxheWluZyAmJiB0aGlzLl9wbGF5YmFjay5zb3VyY2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3BsYXliYWNrLnBsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX3BsYXliYWNrLnNvdXJjZS5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLl9wbGF5YmFjay5vZmZzZXQgKz0gdGhpcy5fY3R4LmN1cnJlbnRUaW1lIC0gdGhpcy5fcGxheWJhY2suc3RhcnRUaW1lO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1BBVVNFRCcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvLyBUT0RPOiBGaXggYnVnIHdpdGggZG91YmxlIGNsaWNraW5nIGVycm9yIChhc3luYyBsb2FkaW5nKVxuICAgIHBsYXlOZXh0KCkge1xuICAgICAgICBpZih0aGlzLmlzUGxheWluZyAmJiB0aGlzLl9wbGF5YmFjay5zb3VyY2UpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJyZW50VHJhY2tJbmRleCArPSAxO1xuICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcGxheVByZXYoKSB7XG4gICAgICAgIGlmKHRoaXMuaXNQbGF5aW5nICYmIHRoaXMuX3BsYXliYWNrLnNvdXJjZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRUcmFja0luZGV4IC09IDE7XG4gICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfcmVzZXRQbGF5YmFja0luZm8oKSB7XG4gICAgICAgIHRoaXMuX3BsYXliYWNrID0ge1xuICAgICAgICAgICAgdHJhY2s6IG51bGwsXG4gICAgICAgICAgICBzb3VyY2U6IG51bGwsXG4gICAgICAgICAgICBidWZmZXI6IG51bGwsXG4gICAgICAgICAgICBwbGF5aW5nOiBmYWxzZSxcbiAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgc3RhcnRUaW1lOiAwLFxuICAgICAgICAgICAgb2Zmc2V0OiAwXG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygnUkVTRVQgUExBWUJBQ0snKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfbG9hZFRyYWNrKCkge1xuICAgICAgICBpZih0aGlzLl9wbGF5YmFjay5sb2FkaW5nICYmIHRoaXMuX3BsYXliYWNrLnRyYWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRyYWNrID0gdGhpcy5fcGxheWJhY2sudHJhY2s7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdGhpcy5fcGxheWJhY2subG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHRyYWNrLnNyYywgdHJ1ZSk7XG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jdHguZGVjb2RlQXVkaW9EYXRhKHhoci5yZXNwb25zZSxcbiAgICAgICAgICAgICAgICAoZGVjb2RlZEFycmF5QnVmZmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyYWNrLmJ1ZmZlciA9IGRlY29kZWRBcnJheUJ1ZmZlcjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGxheWJhY2subG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3RyYWNrOmxvYWQnKTtcbiAgICAgICAgICAgICAgICB9LCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3IgZGVjb2RpbmcgZmlsZScsIGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgICB4aHIuc2VuZCgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9zZXRUcmFjayh0cmFjaykge1xuICAgICAgICB0aGlzLl9wbGF5YmFjay50cmFjayA9IHRyYWNrO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfc3RhcnRQbGF5YmFjaygpIHtcbiAgICAgICAgaWYodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBTFJFQURZIFBMQVlJTkchJyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBsYXliYWNrID0gdGhpcy5fcGxheWJhY2s7XG4gICAgICAgIHBsYXliYWNrLnN0YXJ0VGltZSA9IHRoaXMuX2N0eC5jdXJyZW50VGltZTtcblxuICAgICAgICBwbGF5YmFjay5zb3VyY2UgPSB0aGlzLl9jdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgICAgIHBsYXliYWNrLnNvdXJjZS5jb25uZWN0KHRoaXMuX2dhaW4pO1xuICAgICAgICBwbGF5YmFjay5zb3VyY2UuYnVmZmVyID0gcGxheWJhY2sudHJhY2suYnVmZmVyO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGBQTEFZSU5HIC0gJHtwbGF5YmFjay50cmFjay5zcmN9YCk7XG4gICAgICAgIHBsYXliYWNrLnBsYXlpbmcgPSB0cnVlO1xuICAgICAgICBwbGF5YmFjay5zb3VyY2Uuc3RhcnQoMCwgcGxheWJhY2sub2Zmc2V0ICUgcGxheWJhY2suc291cmNlLmJ1ZmZlci5kdXJhdGlvbik7XG4gICAgICAgIHBsYXliYWNrLnNvdXJjZS5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsIChlKSA9PiB7XG4gICAgICAgICAgICBpZih0aGlzLmlzUGxheWluZyAmJiBlLnRhcmdldC5idWZmZXIgPT09IHRoaXMuX3BsYXliYWNrLnNvdXJjZS5idWZmZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVFJBQ0sgRU5ERUQnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlOZXh0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9jcmVhdGVBdWRpb0FwaU5vZGVzKCkge1xuICAgICAgICB0aGlzLl9jdHggPSBuZXcgKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCkoKTtcbiAgICAgICAgdGhpcy5fZGVzdCA9IHRoaXMuX2N0eC5kZXN0aW5hdGlvbjtcbiAgICAgICAgdGhpcy5fZ2FpbiA9IHRoaXMuX2N0eC5jcmVhdGVHYWluKCk7XG5cbiAgICAgICAgLy8gQ29ubmVjdCBOb2Rlc1xuICAgICAgICB0aGlzLl9nYWluLmNvbm5lY3QodGhpcy5fZGVzdCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIl19
},{"./Playlist":2,"./Track":3,"./utils/EventEmmiter":6}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Track = require('./Track');

var _Track2 = _interopRequireDefault(_Track);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Playlist = function () {
    function Playlist() {
        _classCallCheck(this, Playlist);

        this._tracks = [];
    }

    _createClass(Playlist, [{
        key: 'getTrack',
        value: function getTrack(id) {
            var track = this._tracks[id];
            if (track) {
                return track;
            } else {
                throw Error('Track with id=' + id + ' dosen\'t exist in playlist');
            }
        }
    }, {
        key: 'addTrack',
        value: function addTrack(src) {
            var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

            var track = new _Track2.default(src, name);
            this.tracks.push(track);

            return this;
        }
    }, {
        key: 'addTrackList',
        value: function addTrackList(list) {
            var _this = this;

            list.forEach(function (track) {
                if (typeof track === 'string') {
                    console.log('str', track);
                    _this.addTrack(track);
                } else if ((typeof track === 'undefined' ? 'undefined' : _typeof(track)) === 'object') {
                    var src = track.src,
                        name = track.name;

                    console.log('obj', src, name);
                    _this.addTrack(src, name);
                }
            });
        }
    }, {
        key: 'tracks',
        get: function get() {
            return this._tracks;
        }
    }]);

    return Playlist;
}();

exports.default = Playlist;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXlsaXN0LmpzIl0sIm5hbWVzIjpbIlBsYXlsaXN0IiwiX3RyYWNrcyIsImlkIiwidHJhY2siLCJFcnJvciIsInNyYyIsIm5hbWUiLCJ0cmFja3MiLCJwdXNoIiwibGlzdCIsImZvckVhY2giLCJjb25zb2xlIiwibG9nIiwiYWRkVHJhY2siXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7O0lBRXFCQSxRO0FBQ2pCLHdCQUFjO0FBQUE7O0FBQ1YsYUFBS0MsT0FBTCxHQUFlLEVBQWY7QUFDSDs7OztpQ0FNUUMsRSxFQUFJO0FBQ1QsZ0JBQU1DLFFBQVEsS0FBS0YsT0FBTCxDQUFhQyxFQUFiLENBQWQ7QUFDQSxnQkFBR0MsS0FBSCxFQUFVO0FBQ04sdUJBQU9BLEtBQVA7QUFDSCxhQUZELE1BRU87QUFDSCxzQkFBTUMseUJBQXVCRixFQUF2QixpQ0FBTjtBQUNIO0FBQ0o7OztpQ0FFUUcsRyxFQUFnQjtBQUFBLGdCQUFYQyxJQUFXLHVFQUFKLEVBQUk7O0FBQ3JCLGdCQUFNSCxRQUFRLG9CQUFVRSxHQUFWLEVBQWVDLElBQWYsQ0FBZDtBQUNBLGlCQUFLQyxNQUFMLENBQVlDLElBQVosQ0FBaUJMLEtBQWpCOztBQUVBLG1CQUFPLElBQVA7QUFDSDs7O3FDQUVZTSxJLEVBQU07QUFBQTs7QUFDZkEsaUJBQUtDLE9BQUwsQ0FBYSxVQUFDUCxLQUFELEVBQVc7QUFDcEIsb0JBQUcsT0FBT0EsS0FBUCxLQUFpQixRQUFwQixFQUE4QjtBQUMxQlEsNEJBQVFDLEdBQVIsQ0FBWSxLQUFaLEVBQW1CVCxLQUFuQjtBQUNBLDBCQUFLVSxRQUFMLENBQWNWLEtBQWQ7QUFDSCxpQkFIRCxNQUdPLElBQUcsUUFBT0EsS0FBUCx5Q0FBT0EsS0FBUCxPQUFpQixRQUFwQixFQUE4QjtBQUFBLHdCQUN6QkUsR0FEeUIsR0FDWEYsS0FEVyxDQUN6QkUsR0FEeUI7QUFBQSx3QkFDcEJDLElBRG9CLEdBQ1hILEtBRFcsQ0FDcEJHLElBRG9COztBQUVqQ0ssNEJBQVFDLEdBQVIsQ0FBWSxLQUFaLEVBQW1CUCxHQUFuQixFQUF3QkMsSUFBeEI7QUFDQSwwQkFBS08sUUFBTCxDQUFjUixHQUFkLEVBQW1CQyxJQUFuQjtBQUNIO0FBQ0osYUFURDtBQVVIOzs7NEJBL0JZO0FBQ1QsbUJBQU8sS0FBS0wsT0FBWjtBQUNIOzs7Ozs7a0JBUGdCRCxRIiwiZmlsZSI6IlBsYXlsaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBUcmFjayBmcm9tICcuL1RyYWNrJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWxpc3Qge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl90cmFja3MgPSBbXTtcbiAgICB9XG5cbiAgICBnZXQgdHJhY2tzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHJhY2tzO1xuICAgIH1cblxuICAgIGdldFRyYWNrKGlkKSB7XG4gICAgICAgIGNvbnN0IHRyYWNrID0gdGhpcy5fdHJhY2tzW2lkXTtcbiAgICAgICAgaWYodHJhY2spIHtcbiAgICAgICAgICAgIHJldHVybiB0cmFjaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBUcmFjayB3aXRoIGlkPSR7aWR9IGRvc2VuJ3QgZXhpc3QgaW4gcGxheWxpc3RgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZFRyYWNrKHNyYywgbmFtZSA9ICcnKSB7XG4gICAgICAgIGNvbnN0IHRyYWNrID0gbmV3IFRyYWNrKHNyYywgbmFtZSk7XG4gICAgICAgIHRoaXMudHJhY2tzLnB1c2godHJhY2spO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGFkZFRyYWNrTGlzdChsaXN0KSB7XG4gICAgICAgIGxpc3QuZm9yRWFjaCgodHJhY2spID0+IHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiB0cmFjayA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc3RyJywgdHJhY2spO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkVHJhY2sodHJhY2spO1xuICAgICAgICAgICAgfSBlbHNlIGlmKHR5cGVvZiB0cmFjayA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHNyYywgbmFtZSB9ID0gdHJhY2s7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ29iaicsIHNyYywgbmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRUcmFjayhzcmMsIG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59Il19
},{"./Track":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Track = function () {
    function Track(src) {
        var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        _classCallCheck(this, Track);

        this._src = src;
        this._name = name;
        this._buffer = null;
    }

    _createClass(Track, [{
        key: "src",
        get: function get() {
            return this._src;
        }
    }, {
        key: "name",
        get: function get() {
            return this._name;
        }
    }, {
        key: "buffer",
        set: function set(buffer) {
            this._buffer = buffer;
            return this;
        },
        get: function get() {
            return this._buffer;
        }
    }]);

    return Track;
}();

exports.default = Track;
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRyYWNrLmpzIl0sIm5hbWVzIjpbIlRyYWNrIiwic3JjIiwibmFtZSIsIl9zcmMiLCJfbmFtZSIsIl9idWZmZXIiLCJidWZmZXIiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0lBRXFCQSxLO0FBQ2pCLG1CQUFZQyxHQUFaLEVBQTBCO0FBQUEsWUFBVEMsSUFBUyx1RUFBSixFQUFJOztBQUFBOztBQUN0QixhQUFLQyxJQUFMLEdBQVlGLEdBQVo7QUFDQSxhQUFLRyxLQUFMLEdBQWFGLElBQWI7QUFDQSxhQUFLRyxPQUFMLEdBQWUsSUFBZjtBQUNIOzs7OzRCQUVTO0FBQ04sbUJBQU8sS0FBS0YsSUFBWjtBQUNIOzs7NEJBRVU7QUFDUCxtQkFBTyxLQUFLQyxLQUFaO0FBQ0g7OzswQkFFVUUsTSxFQUFRO0FBQ2YsaUJBQUtELE9BQUwsR0FBZUMsTUFBZjtBQUNBLG1CQUFPLElBQVA7QUFDSCxTOzRCQUVZO0FBQ1QsbUJBQU8sS0FBS0QsT0FBWjtBQUNIOzs7Ozs7a0JBdEJnQkwsSztBQXVCcEIiLCJmaWxlIjoiVHJhY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2sge1xuICAgIGNvbnN0cnVjdG9yKHNyYywgbmFtZT0nJykge1xuICAgICAgICB0aGlzLl9zcmMgPSBzcmM7XG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLl9idWZmZXIgPSBudWxsO1xuICAgIH1cblxuICAgIGdldCBzcmMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zcmM7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgIH1cblxuICAgIHNldCBidWZmZXIoYnVmZmVyKSB7XG4gICAgICAgIHRoaXMuX2J1ZmZlciA9IGJ1ZmZlcjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0IGJ1ZmZlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2J1ZmZlcjtcbiAgICB9XG59O1xuIl19
},{}],4:[function(require,module,exports){
'use strict';

var _AudioPlayer = require('./AudioPlayer');

var _AudioPlayer2 = _interopRequireDefault(_AudioPlayer);

var _Playlist = require('./Playlist');

var _Playlist2 = _interopRequireDefault(_Playlist);

var _DOMBuilder = require('./utils/DOMBuilder');

var _DOMBuilder2 = _interopRequireDefault(_DOMBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tracks = ['./../media/01 - Prison Song.mp3', './../media/02 - Needles.mp3', './../media/03 - Deer Dance.mp3', './../media/04 - Jet Pilot.mp3', './../media/05 - X.mp3', './../media/06 - Chop Suey!.mp3'];

var playerNode = document.getElementById("player");
var playBtn = document.querySelector('.player-controls__btn_play');
var playNextBtn = document.querySelector('.player-controls__btn_next');
var playPrevBtn = document.querySelector('.player-controls__btn_prev');

var volumeSlider = document.querySelector('.volume__slider');
var volumeSliderFilled = document.querySelector('.volume__slider .slider__filled');

var player = new _AudioPlayer2.default();
// player.playlist.addTrack(['./../media/System_Of_A_Down_-_Aerials.mp3']);
player.playlist.addTrackList(tracks);

playBtn.addEventListener('click', function () {
    if (!player.isPlaying) {
        playBtn.classList.add('player-controls__btn_pause');
        player.play();
    } else {
        playBtn.classList.remove('player-controls__btn_pause');
        player.pause();
    }
});

playNextBtn.addEventListener('click', function (e) {
    playBtn.classList.add('player-controls__btn_pause');
    player.playNext();
});

playPrevBtn.addEventListener('click', function (e) {
    console.log('PREV', playPrevBtn);
    playBtn.classList.add('player-controls__btn_pause');
    player.playPrev();
});

volumeSlider.addEventListener('click', function (e) {
    e.preventDefault();
    var ratio = (e.clientX - volumeSlider.offsetLeft) / volumeSlider.offsetWidth;
    var filledWidth = ratio * 100;
    volumeSliderFilled.style.width = filledWidth + '%';
    player.volume = ratio;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfMWNmNTJhZTMuanMiXSwibmFtZXMiOlsidHJhY2tzIiwicGxheWVyTm9kZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwbGF5QnRuIiwicXVlcnlTZWxlY3RvciIsInBsYXlOZXh0QnRuIiwicGxheVByZXZCdG4iLCJ2b2x1bWVTbGlkZXIiLCJ2b2x1bWVTbGlkZXJGaWxsZWQiLCJwbGF5ZXIiLCJwbGF5bGlzdCIsImFkZFRyYWNrTGlzdCIsImFkZEV2ZW50TGlzdGVuZXIiLCJpc1BsYXlpbmciLCJjbGFzc0xpc3QiLCJhZGQiLCJwbGF5IiwicmVtb3ZlIiwicGF1c2UiLCJlIiwicGxheU5leHQiLCJjb25zb2xlIiwibG9nIiwicGxheVByZXYiLCJwcmV2ZW50RGVmYXVsdCIsInJhdGlvIiwiY2xpZW50WCIsIm9mZnNldExlZnQiLCJvZmZzZXRXaWR0aCIsImZpbGxlZFdpZHRoIiwic3R5bGUiLCJ3aWR0aCIsInZvbHVtZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFNBQVMsQ0FDWCxpQ0FEVyxFQUVYLDZCQUZXLEVBR1gsZ0NBSFcsRUFJWCwrQkFKVyxFQUtYLHVCQUxXLEVBTVgsZ0NBTlcsQ0FBZjs7QUFTQSxJQUFNQyxhQUFhQyxTQUFTQyxjQUFULENBQXdCLFFBQXhCLENBQW5CO0FBQ0EsSUFBTUMsVUFBVUYsU0FBU0csYUFBVCxDQUF1Qiw0QkFBdkIsQ0FBaEI7QUFDQSxJQUFNQyxjQUFjSixTQUFTRyxhQUFULENBQXVCLDRCQUF2QixDQUFwQjtBQUNBLElBQU1FLGNBQWNMLFNBQVNHLGFBQVQsQ0FBdUIsNEJBQXZCLENBQXBCOztBQUVBLElBQU1HLGVBQWVOLFNBQVNHLGFBQVQsQ0FBdUIsaUJBQXZCLENBQXJCO0FBQ0EsSUFBTUkscUJBQXFCUCxTQUFTRyxhQUFULENBQXVCLGlDQUF2QixDQUEzQjs7QUFFQSxJQUFNSyxTQUFTLDJCQUFmO0FBQ0E7QUFDQUEsT0FBT0MsUUFBUCxDQUFnQkMsWUFBaEIsQ0FBNkJaLE1BQTdCOztBQUVBSSxRQUFRUyxnQkFBUixDQUF5QixPQUF6QixFQUFrQyxZQUFNO0FBQ3BDLFFBQUcsQ0FBQ0gsT0FBT0ksU0FBWCxFQUFzQjtBQUNsQlYsZ0JBQVFXLFNBQVIsQ0FBa0JDLEdBQWxCLENBQXNCLDRCQUF0QjtBQUNBTixlQUFPTyxJQUFQO0FBQ0gsS0FIRCxNQUdPO0FBQ0hiLGdCQUFRVyxTQUFSLENBQWtCRyxNQUFsQixDQUF5Qiw0QkFBekI7QUFDQVIsZUFBT1MsS0FBUDtBQUNIO0FBQ0osQ0FSRDs7QUFVQWIsWUFBWU8sZ0JBQVosQ0FBNkIsT0FBN0IsRUFBc0MsVUFBQ08sQ0FBRCxFQUFPO0FBQ3pDaEIsWUFBUVcsU0FBUixDQUFrQkMsR0FBbEIsQ0FBc0IsNEJBQXRCO0FBQ0FOLFdBQU9XLFFBQVA7QUFDSCxDQUhEOztBQUtBZCxZQUFZTSxnQkFBWixDQUE2QixPQUE3QixFQUFzQyxVQUFDTyxDQUFELEVBQU87QUFDekNFLFlBQVFDLEdBQVIsQ0FBWSxNQUFaLEVBQW9CaEIsV0FBcEI7QUFDQUgsWUFBUVcsU0FBUixDQUFrQkMsR0FBbEIsQ0FBc0IsNEJBQXRCO0FBQ0FOLFdBQU9jLFFBQVA7QUFDSCxDQUpEOztBQU1BaEIsYUFBYUssZ0JBQWIsQ0FBOEIsT0FBOUIsRUFBdUMsVUFBQ08sQ0FBRCxFQUFPO0FBQzFDQSxNQUFFSyxjQUFGO0FBQ0EsUUFBTUMsUUFBUSxDQUFDTixFQUFFTyxPQUFGLEdBQVluQixhQUFhb0IsVUFBMUIsSUFBd0NwQixhQUFhcUIsV0FBbkU7QUFDQSxRQUFNQyxjQUFjSixRQUFRLEdBQTVCO0FBQ0FqQix1QkFBbUJzQixLQUFuQixDQUF5QkMsS0FBekIsR0FBb0NGLFdBQXBDO0FBQ0FwQixXQUFPdUIsTUFBUCxHQUFnQlAsS0FBaEI7QUFDSCxDQU5EIiwiZmlsZSI6ImZha2VfMWNmNTJhZTMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXVkaW9QbGF5ZXIgZnJvbSAnLi9BdWRpb1BsYXllcic7XG5pbXBvcnQgUGxheWxpc3QgZnJvbSAnLi9QbGF5bGlzdCc7XG5pbXBvcnQgRE9NQnVpZGxlciBmcm9tICcuL3V0aWxzL0RPTUJ1aWxkZXInXG5cbmNvbnN0IHRyYWNrcyA9IFtcbiAgICAnLi8uLi9tZWRpYS8wMSAtIFByaXNvbiBTb25nLm1wMycsXG4gICAgJy4vLi4vbWVkaWEvMDIgLSBOZWVkbGVzLm1wMycsXG4gICAgJy4vLi4vbWVkaWEvMDMgLSBEZWVyIERhbmNlLm1wMycsXG4gICAgJy4vLi4vbWVkaWEvMDQgLSBKZXQgUGlsb3QubXAzJyxcbiAgICAnLi8uLi9tZWRpYS8wNSAtIFgubXAzJyxcbiAgICAnLi8uLi9tZWRpYS8wNiAtIENob3AgU3VleSEubXAzJyxcbl1cblxuY29uc3QgcGxheWVyTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyXCIpO1xuY29uc3QgcGxheUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9wbGF5Jyk7XG5jb25zdCBwbGF5TmV4dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9uZXh0Jyk7XG5jb25zdCBwbGF5UHJldkJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9wcmV2Jyk7XG5cbmNvbnN0IHZvbHVtZVNsaWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52b2x1bWVfX3NsaWRlcicpO1xuY29uc3Qgdm9sdW1lU2xpZGVyRmlsbGVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZvbHVtZV9fc2xpZGVyIC5zbGlkZXJfX2ZpbGxlZCcpO1xuXG5jb25zdCBwbGF5ZXIgPSBuZXcgQXVkaW9QbGF5ZXIoKTtcbi8vIHBsYXllci5wbGF5bGlzdC5hZGRUcmFjayhbJy4vLi4vbWVkaWEvU3lzdGVtX09mX0FfRG93bl8tX0FlcmlhbHMubXAzJ10pO1xucGxheWVyLnBsYXlsaXN0LmFkZFRyYWNrTGlzdCh0cmFja3MpO1xuXG5wbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmKCFwbGF5ZXIuaXNQbGF5aW5nKSB7XG4gICAgICAgIHBsYXlCdG4uY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRyb2xzX19idG5fcGF1c2UnKTtcbiAgICAgICAgcGxheWVyLnBsYXkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBwbGF5QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3BsYXllci1jb250cm9sc19fYnRuX3BhdXNlJyk7XG4gICAgICAgIHBsYXllci5wYXVzZSgpO1xuICAgIH1cbn0pO1xuXG5wbGF5TmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgcGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udHJvbHNfX2J0bl9wYXVzZScpO1xuICAgIHBsYXllci5wbGF5TmV4dCgpO1xufSk7XG5cbnBsYXlQcmV2QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBjb25zb2xlLmxvZygnUFJFVicsIHBsYXlQcmV2QnRuKTtcbiAgICBwbGF5QnRuLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250cm9sc19fYnRuX3BhdXNlJyk7XG4gICAgcGxheWVyLnBsYXlQcmV2KCk7XG59KTtcblxudm9sdW1lU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgcmF0aW8gPSAoZS5jbGllbnRYIC0gdm9sdW1lU2xpZGVyLm9mZnNldExlZnQpIC8gdm9sdW1lU2xpZGVyLm9mZnNldFdpZHRoO1xuICAgIGNvbnN0IGZpbGxlZFdpZHRoID0gcmF0aW8gKiAxMDA7XG4gICAgdm9sdW1lU2xpZGVyRmlsbGVkLnN0eWxlLndpZHRoID0gYCR7ZmlsbGVkV2lkdGh9JWA7XG4gICAgcGxheWVyLnZvbHVtZSA9IHJhdGlvO1xufSk7Il19
},{"./AudioPlayer":1,"./Playlist":2,"./utils/DOMBuilder":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DOMBuilder = function () {
    function DOMBuilder() {
        _classCallCheck(this, DOMBuilder);

        throw new Error('This is static class. Creating instances is forbidden.');
    }

    _createClass(DOMBuilder, null, [{
        key: "createElement",
        value: function createElement(tagName) {
            var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            var element = document.createElement("" + tagName);

            if (attrs) {
                DOMBuilder._insertAttributes(element, attrs);
            }

            if (callback) {
                callback(element);
            }

            return element;
        }
    }, {
        key: "_insertAttributes",
        value: function _insertAttributes(element, attrs) {
            for (var prop in attrs) {
                if (attrs.hasOwnProperty(prop)) {
                    element.setAttribute(prop, attrs[prop]);
                }
            }
        }
    }]);

    return DOMBuilder;
}();

exports.default = DOMBuilder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRPTUJ1aWxkZXIuanMiXSwibmFtZXMiOlsiRE9NQnVpbGRlciIsIkVycm9yIiwidGFnTmFtZSIsImF0dHJzIiwiY2FsbGJhY2siLCJlbGVtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiX2luc2VydEF0dHJpYnV0ZXMiLCJwcm9wIiwiaGFzT3duUHJvcGVydHkiLCJzZXRBdHRyaWJ1dGUiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0lBRXFCQSxVO0FBQ2pCLDBCQUFjO0FBQUE7O0FBQ1YsY0FBTSxJQUFJQyxLQUFKLENBQVUsd0RBQVYsQ0FBTjtBQUNIOzs7O3NDQUVvQkMsTyxFQUFvQztBQUFBLGdCQUEzQkMsS0FBMkIsdUVBQXJCLElBQXFCO0FBQUEsZ0JBQWZDLFFBQWUsdUVBQU4sSUFBTTs7QUFDckQsZ0JBQU1DLFVBQVVDLFNBQVNDLGFBQVQsTUFBMEJMLE9BQTFCLENBQWhCOztBQUVBLGdCQUFJQyxLQUFKLEVBQVc7QUFDUEgsMkJBQVdRLGlCQUFYLENBQTZCSCxPQUE3QixFQUFzQ0YsS0FBdEM7QUFDSDs7QUFFRCxnQkFBSUMsUUFBSixFQUFjO0FBQ1ZBLHlCQUFTQyxPQUFUO0FBQ0g7O0FBRUQsbUJBQU9BLE9BQVA7QUFDSDs7OzBDQUV3QkEsTyxFQUFTRixLLEVBQU87QUFDckMsaUJBQUssSUFBSU0sSUFBVCxJQUFpQk4sS0FBakIsRUFBd0I7QUFDcEIsb0JBQUlBLE1BQU1PLGNBQU4sQ0FBcUJELElBQXJCLENBQUosRUFBZ0M7QUFDNUJKLDRCQUFRTSxZQUFSLENBQXFCRixJQUFyQixFQUEyQk4sTUFBTU0sSUFBTixDQUEzQjtBQUNIO0FBQ0o7QUFDSjs7Ozs7O2tCQXpCZ0JULFUiLCJmaWxlIjoiRE9NQnVpbGRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBET01CdWlsZGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIGlzIHN0YXRpYyBjbGFzcy4gQ3JlYXRpbmcgaW5zdGFuY2VzIGlzIGZvcmJpZGRlbi4nKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgY3JlYXRlRWxlbWVudCh0YWdOYW1lLCBhdHRycz1udWxsLCBjYWxsYmFjaz1udWxsKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGAke3RhZ05hbWV9YCk7XG5cbiAgICAgICAgaWYgKGF0dHJzKSB7XG4gICAgICAgICAgICBET01CdWlsZGVyLl9pbnNlcnRBdHRyaWJ1dGVzKGVsZW1lbnQsIGF0dHJzKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH1cblxuICAgIHN0YXRpYyBfaW5zZXJ0QXR0cmlidXRlcyhlbGVtZW50LCBhdHRycykge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIGF0dHJzKSB7XG4gICAgICAgICAgICBpZiAoYXR0cnMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShwcm9wLCBhdHRyc1twcm9wXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmmiter = function () {
    function EventEmmiter() {
        _classCallCheck(this, EventEmmiter);

        this._events = [];
    }

    _createClass(EventEmmiter, [{
        key: 'on',
        value: function on(event, cb) {
            if (typeof cb === 'undefined') {
                throw Error('You must provide a callback function');
            }

            if (typeof cb !== 'function') {
                throw Error('Callback must be a function');
            }

            this._events[event] = this._events[event] || [];
            this._events[event].push(cb);

            return this;
        }
    }, {
        key: 'off',
        value: function off(event, cb) {
            if (typeof cb === 'undefined') {
                throw Error('You must provide a callback function');
            }

            if (typeof cb !== 'function') {
                throw Error('Callback must be a function');
            }

            if (typeof this._events[event] === 'undefined') {
                throw Error('Event not found');
            }

            var callbacks = this._events[event];

            callbacks.forEach(function (callback, i) {
                if (callback === cb) {
                    callbacks.splice(i, 1);
                }
            });

            return this;
        }
    }, {
        key: 'emit',
        value: function emit(event) {
            var _this = this;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            if (typeof event === 'undefined') {
                throw Error('You must provide an event to emit');
            }

            var callbacks = this._events[event];
            if (typeof callbacks !== 'undefined') {
                callbacks = callbacks.slice();

                callbacks.forEach(function (cb, i) {
                    cb.apply(_this, args);
                });
            }

            return this;
        }
    }]);

    return EventEmmiter;
}();

exports.default = EventEmmiter;
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50RW1taXRlci5qcyJdLCJuYW1lcyI6WyJFdmVudEVtbWl0ZXIiLCJfZXZlbnRzIiwiZXZlbnQiLCJjYiIsIkVycm9yIiwicHVzaCIsImNhbGxiYWNrcyIsImZvckVhY2giLCJjYWxsYmFjayIsImkiLCJzcGxpY2UiLCJhcmdzIiwic2xpY2UiLCJhcHBseSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFxQkEsWTtBQUNqQiw0QkFBYztBQUFBOztBQUNWLGFBQUtDLE9BQUwsR0FBZSxFQUFmO0FBQ0g7Ozs7MkJBRUVDLEssRUFBT0MsRSxFQUFJO0FBQ1YsZ0JBQUcsT0FBT0EsRUFBUCxLQUFjLFdBQWpCLEVBQThCO0FBQzFCLHNCQUFNQyxNQUFNLHNDQUFOLENBQU47QUFDSDs7QUFFRCxnQkFBRyxPQUFPRCxFQUFQLEtBQWMsVUFBakIsRUFBNkI7QUFDekIsc0JBQU1DLE1BQU0sNkJBQU4sQ0FBTjtBQUNIOztBQUVELGlCQUFLSCxPQUFMLENBQWFDLEtBQWIsSUFBc0IsS0FBS0QsT0FBTCxDQUFhQyxLQUFiLEtBQXVCLEVBQTdDO0FBQ0EsaUJBQUtELE9BQUwsQ0FBYUMsS0FBYixFQUFvQkcsSUFBcEIsQ0FBeUJGLEVBQXpCOztBQUVBLG1CQUFPLElBQVA7QUFDSDs7OzRCQUVHRCxLLEVBQU9DLEUsRUFBSTtBQUNYLGdCQUFHLE9BQU9BLEVBQVAsS0FBYyxXQUFqQixFQUE4QjtBQUMxQixzQkFBTUMsTUFBTSxzQ0FBTixDQUFOO0FBQ0g7O0FBRUQsZ0JBQUcsT0FBT0QsRUFBUCxLQUFjLFVBQWpCLEVBQTZCO0FBQ3pCLHNCQUFNQyxNQUFNLDZCQUFOLENBQU47QUFDSDs7QUFFRCxnQkFBRyxPQUFPLEtBQUtILE9BQUwsQ0FBYUMsS0FBYixDQUFQLEtBQStCLFdBQWxDLEVBQStDO0FBQzNDLHNCQUFNRSxNQUFNLGlCQUFOLENBQU47QUFDSDs7QUFFRCxnQkFBTUUsWUFBWSxLQUFLTCxPQUFMLENBQWFDLEtBQWIsQ0FBbEI7O0FBRUFJLHNCQUFVQyxPQUFWLENBQWtCLFVBQUNDLFFBQUQsRUFBV0MsQ0FBWCxFQUFrQjtBQUNoQyxvQkFBR0QsYUFBYUwsRUFBaEIsRUFBb0I7QUFDaEJHLDhCQUFVSSxNQUFWLENBQWlCRCxDQUFqQixFQUFvQixDQUFwQjtBQUNIO0FBQ0osYUFKRDs7QUFNQSxtQkFBTyxJQUFQO0FBQ0g7Ozs2QkFFSVAsSyxFQUFnQjtBQUFBOztBQUFBLDhDQUFOUyxJQUFNO0FBQU5BLG9CQUFNO0FBQUE7O0FBQ2pCLGdCQUFHLE9BQU9ULEtBQVAsS0FBaUIsV0FBcEIsRUFBaUM7QUFDN0Isc0JBQU1FLE1BQU0sbUNBQU4sQ0FBTjtBQUNIOztBQUVELGdCQUFJRSxZQUFZLEtBQUtMLE9BQUwsQ0FBYUMsS0FBYixDQUFoQjtBQUNBLGdCQUFHLE9BQU9JLFNBQVAsS0FBcUIsV0FBeEIsRUFBcUM7QUFDakNBLDRCQUFZQSxVQUFVTSxLQUFWLEVBQVo7O0FBRUFOLDBCQUFVQyxPQUFWLENBQWtCLFVBQUNKLEVBQUQsRUFBS00sQ0FBTCxFQUFXO0FBQ3pCTix1QkFBR1UsS0FBSCxRQUFlRixJQUFmO0FBQ0gsaUJBRkQ7QUFHSDs7QUFFRCxtQkFBTyxJQUFQO0FBQ0g7Ozs7OztrQkEzRGdCWCxZO0FBNERwQiIsImZpbGUiOiJFdmVudEVtbWl0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudEVtbWl0ZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9ldmVudHMgPSBbXTtcbiAgICB9XG5cbiAgICBvbihldmVudCwgY2IpIHtcbiAgICAgICAgaWYodHlwZW9mIGNiID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1lvdSBtdXN0IHByb3ZpZGUgYSBjYWxsYmFjayBmdW5jdGlvbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignQ2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9ldmVudHNbZXZlbnRdID0gdGhpcy5fZXZlbnRzW2V2ZW50XSB8fCBbXTtcbiAgICAgICAgdGhpcy5fZXZlbnRzW2V2ZW50XS5wdXNoKGNiKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvZmYoZXZlbnQsIGNiKSB7XG4gICAgICAgIGlmKHR5cGVvZiBjYiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdZb3UgbXVzdCBwcm92aWRlIGEgY2FsbGJhY2sgZnVuY3Rpb24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ0NhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodHlwZW9mIHRoaXMuX2V2ZW50c1tldmVudF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignRXZlbnQgbm90IGZvdW5kJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLl9ldmVudHNbZXZlbnRdO1xuICAgICAgICBcbiAgICAgICAgY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrLCBpICkgPT4ge1xuICAgICAgICAgICAgaWYoY2FsbGJhY2sgPT09IGNiKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZW1pdChldmVudCwgLi4uYXJncykge1xuICAgICAgICBpZih0eXBlb2YgZXZlbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignWW91IG11c3QgcHJvdmlkZSBhbiBldmVudCB0byBlbWl0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2FsbGJhY2tzID0gdGhpcy5fZXZlbnRzW2V2ZW50XTtcbiAgICAgICAgaWYodHlwZW9mIGNhbGxiYWNrcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgpO1xuXG4gICAgICAgICAgICBjYWxsYmFja3MuZm9yRWFjaCgoY2IsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBjYi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTtcbiJdfQ==
},{}]},{},[4])