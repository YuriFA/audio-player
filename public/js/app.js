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

var _Equalizer = require('./Equalizer');

var _Equalizer2 = _interopRequireDefault(_Equalizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AudioPlayer = function (_EventEmmiter) {
    _inherits(AudioPlayer, _EventEmmiter);

    function AudioPlayer() {
        var tracks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, AudioPlayer);

        var _this = _possibleConstructorReturn(this, (AudioPlayer.__proto__ || Object.getPrototypeOf(AudioPlayer)).call(this));

        _this.playlist = new _Playlist2.default(tracks);
        _this.muted = false;
        _this.currentTrackIndex = 0;
        _this._playback = {};
        _this.settings = settings;
        _this._resetPlaybackInfo();
        _this._setTrack();

        // init Audio API Nodes
        _this._ctx = null;
        _this._gain = null;
        _this._equalizer = null;
        _this._createAudioApiNodes();
        return _this;
    }

    _createClass(AudioPlayer, [{
        key: 'play',
        value: function play() {
            var _this2 = this;

            if (this.isPlaying) {
                return this;
            }

            if (!this._playback.track || this._playback.track.id !== this.currentTrackIndex) {
                this._setTrack();
            }

            var track = this._playback.track;

            console.log('Playing track id=' + this.currentTrackIndex + ' - ' + track.src);
            if (track.audio && track.isBuffered()) {
                track.audio.play();
                this._playback.playing = true;
            } else {
                track.load();
                //Subscribe
                //чет не ок
                track.on('canplay', this._startPlayback.bind(this));
                track.on('ended', this.playNext.bind(this));
                track.on('progress', function (e) {
                    _this2.emit('track:progress', e);
                });
                track.on('loadeddata', function (e) {
                    _this2.emit('track:loadeddata', e);
                });
                track.on('canplaythrough', function (e) {
                    _this2.emit('track:canplaythrough', e);
                });
                track.on('loadedmetadata', function (e) {
                    _this2.emit('track:loadedmetadata', e);
                });
                track.on('timeupdate', function (e) {
                    _this2.emit('track:timeupdate', e);
                });
            }

            return this;
        }
    }, {
        key: 'stop',
        value: function stop() {
            this._playback.playing = false;
            var track = this._playback.track;
            track.audio.pause();
            track.audio.currentTime = 0;

            return this;
        }
    }, {
        key: 'pause',
        value: function pause() {
            this._playback.playing = false;
            var track = this._playback.track;
            track.audio.pause();
            console.log('PAUSED');

            return this;
        }
    }, {
        key: 'mute',
        value: function mute() {
            this._playback.track.muted = true;
            this.muted = true;

            return this;
        }
    }, {
        key: 'unmute',
        value: function unmute() {
            this._playback.track.muted = false;
            this.muted = false;

            return this;
        }
    }, {
        key: 'playNext',
        value: function playNext() {
            if (this.isPlaying) {
                this.stop();
            }
            this._resetPlaybackInfo();

            this.currentTrackIndex += 1;
            this.play();

            return this;
        }
    }, {
        key: 'playPrev',
        value: function playPrev() {
            if (this.isPlaying) {
                this.stop();
            }
            this._resetPlaybackInfo();

            this.currentTrackIndex -= 1;
            this.play();

            return this;
        }
    }, {
        key: 'rewind',
        value: function rewind(ratio) {
            if (ratio > 1 && ratio < 0) {
                throw Error('To rewind audio, ratio must be in range from 0 to 1');
            }

            var audio = this._playback.track.audio;
            if (!isNaN(audio.duration)) {
                var newTime = audio.duration * ratio;
                audio.currentTime = newTime;
            }

            return this;
        }
    }, {
        key: 'changeEqualizerFilterGain',
        value: function changeEqualizerFilterGain(id, value) {
            if (this._equalizer) {
                this._equalizer.changeFilterGain(id, value);
            }

            return this;
        }
    }, {
        key: 'getEqualizerFilterGain',
        value: function getEqualizerFilterGain(id) {
            return this._equalizer ? this._equalizer.getFilterGain(id) : null;
        }
    }, {
        key: '_setTrack',
        value: function _setTrack() {
            if (this.isPlaying) {
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
    }, {
        key: '_resetPlaybackInfo',
        value: function _resetPlaybackInfo() {
            this._playback = {
                track: null,
                source: null,
                playing: false
                // console.log('RESET PLAYBACK');

            };return this;
        }
    }, {
        key: '_startPlayback',
        value: function _startPlayback() {
            if (this.isPlaying) {
                console.log('Already playing!1');
                return this;
            }

            var playback = this._playback;
            var track = this._playback.track;

            playback.source = this._ctx.createMediaElementSource(track.audio);
            this._connectNodes();

            console.log('Loaded - ' + playback.track.src);
            playback.playing = true;
            track.audio.play();

            //Unsubscribe because 'canplay' event triggered by changing the current time
            track.off('canplay', this._startPlayback.bind(this));

            return this;
        }
    }, {
        key: '_createAudioApiNodes',
        value: function _createAudioApiNodes() {
            if (!(window.AudioContext || window.webkitAudioContext)) return;

            this._ctx = new (window.AudioContext || window.webkitAudioContext)();
            this._dest = this._ctx.destination;
            this._gain = this._ctx.createGain();
            this._equalizer = this.settings.equalizer ? new _Equalizer2.default(this._ctx) : null;
            return this;
        }

        // TODO: Переделать чтобы связывалось в зависимости от настроек

    }, {
        key: '_connectNodes',
        value: function _connectNodes() {
            var source = this._playback.source;
            var filters = this._equalizer.filters;
            if (!(source instanceof MediaElementAudioSourceNode)) {
                throw Error('Source node is undefined or source !== MediaElementAudioSourceNode');
            }

            source.connect(filters[0]);
            filters[filters.length - 1].connect(this._gain);
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
        get: function get() {
            return this._gain.gain.value;
        },
        set: function set(value) {
            if (value > 1 && value < 0) {
                throw Error('Volume must be in range from 0 to 1');
            }
            if (value === 0) {
                this.mute();
            } else if (this.muted) {
                this.unmute();
            }
            this._gain.gain.value = value;
        }
    }]);

    return AudioPlayer;
}(_EventEmmiter3.default);

exports.default = AudioPlayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvUGxheWVyLmpzIl0sIm5hbWVzIjpbIkF1ZGlvUGxheWVyIiwidHJhY2tzIiwic2V0dGluZ3MiLCJwbGF5bGlzdCIsIm11dGVkIiwiY3VycmVudFRyYWNrSW5kZXgiLCJfcGxheWJhY2siLCJfcmVzZXRQbGF5YmFja0luZm8iLCJfc2V0VHJhY2siLCJfY3R4IiwiX2dhaW4iLCJfZXF1YWxpemVyIiwiX2NyZWF0ZUF1ZGlvQXBpTm9kZXMiLCJpc1BsYXlpbmciLCJ0cmFjayIsImlkIiwiY29uc29sZSIsImxvZyIsInNyYyIsImF1ZGlvIiwiaXNCdWZmZXJlZCIsInBsYXkiLCJwbGF5aW5nIiwibG9hZCIsIm9uIiwiX3N0YXJ0UGxheWJhY2siLCJiaW5kIiwicGxheU5leHQiLCJlIiwiZW1pdCIsInBhdXNlIiwiY3VycmVudFRpbWUiLCJzdG9wIiwicmF0aW8iLCJFcnJvciIsImlzTmFOIiwiZHVyYXRpb24iLCJuZXdUaW1lIiwidmFsdWUiLCJjaGFuZ2VGaWx0ZXJHYWluIiwiZ2V0RmlsdGVyR2FpbiIsImdldFRyYWNrIiwiZXJyb3IiLCJzb3VyY2UiLCJwbGF5YmFjayIsImNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZSIsIl9jb25uZWN0Tm9kZXMiLCJvZmYiLCJ3aW5kb3ciLCJBdWRpb0NvbnRleHQiLCJ3ZWJraXRBdWRpb0NvbnRleHQiLCJfZGVzdCIsImRlc3RpbmF0aW9uIiwiY3JlYXRlR2FpbiIsImVxdWFsaXplciIsImZpbHRlcnMiLCJNZWRpYUVsZW1lbnRBdWRpb1NvdXJjZU5vZGUiLCJjb25uZWN0IiwibGVuZ3RoIiwiZ2FpbiIsIm11dGUiLCJ1bm11dGUiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFcUJBLFc7OztBQUNqQiwyQkFBc0M7QUFBQSxZQUExQkMsTUFBMEIsdUVBQW5CLEVBQW1CO0FBQUEsWUFBZkMsUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUFB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QUFpQixDQUF6QixFQUE0QkQsT0FBNUIsQ0FBb0MsS0FBSy9DLEtBQXpDO0FBQ0EsaUJBQUtBLEtBQUwsQ0FBVytDLE9BQVgsQ0FBbUIsS0FBS04sS0FBeEI7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOzs7NEJBek5lO0FBQ1osbUJBQU8sS0FBSzdDLFNBQUwsQ0FBZWdCLE9BQXRCO0FBQ0g7Ozs0QkFFWTtBQUNULG1CQUFPLEtBQUtaLEtBQUwsQ0FBV2lELElBQVgsQ0FBZ0JyQixLQUF2QjtBQUNILFM7MEJBRVVBLEssRUFBTztBQUNkLGdCQUFHQSxRQUFRLENBQVIsSUFBYUEsUUFBUSxDQUF4QixFQUEyQjtBQUN2QixzQkFBTUosTUFBTSxxQ0FBTixDQUFOO0FBQ0g7QUFDRCxnQkFBR0ksVUFBVSxDQUFiLEVBQWdCO0FBQ1oscUJBQUtzQixJQUFMO0FBQ0gsYUFGRCxNQUVPLElBQUcsS0FBS3hELEtBQVIsRUFBZTtBQUNsQixxQkFBS3lELE1BQUw7QUFDSDtBQUNELGlCQUFLbkQsS0FBTCxDQUFXaUQsSUFBWCxDQUFnQnJCLEtBQWhCLEdBQXdCQSxLQUF4QjtBQUNIOzs7Ozs7a0JBckNnQnRDLFciLCJmaWxlIjoiQXVkaW9QbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFBsYXlsaXN0IGZyb20gJy4vUGxheWxpc3QnO1xuaW1wb3J0IFRyYWNrIGZyb20gJy4vVHJhY2snO1xuaW1wb3J0IEV2ZW50RW1taXRlciBmcm9tICcuL3V0aWxzL0V2ZW50RW1taXRlcic7XG5pbXBvcnQgRXF1YWxpemVyIGZyb20gJy4vRXF1YWxpemVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXVkaW9QbGF5ZXIgZXh0ZW5kcyBFdmVudEVtbWl0ZXIge1xuICAgIGNvbnN0cnVjdG9yKHRyYWNrcz1bXSwgc2V0dGluZ3MgPSB7fSkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMucGxheWxpc3QgPSBuZXcgUGxheWxpc3QodHJhY2tzKTtcbiAgICAgICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmN1cnJlbnRUcmFja0luZGV4ID0gMDtcbiAgICAgICAgdGhpcy5fcGxheWJhY2sgPSB7fVxuICAgICAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgICAgIHRoaXMuX3Jlc2V0UGxheWJhY2tJbmZvKCk7XG4gICAgICAgIHRoaXMuX3NldFRyYWNrKCk7XG5cbiAgICAgICAgLy8gaW5pdCBBdWRpbyBBUEkgTm9kZXNcbiAgICAgICAgdGhpcy5fY3R4ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZ2FpbiA9IG51bGw7XG4gICAgICAgIHRoaXMuX2VxdWFsaXplciA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NyZWF0ZUF1ZGlvQXBpTm9kZXMoKTtcbiAgICB9XG5cbiAgICBnZXQgaXNQbGF5aW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGxheWJhY2sucGxheWluZztcbiAgICB9XG4gICAgXG4gICAgZ2V0IHZvbHVtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dhaW4uZ2Fpbi52YWx1ZTtcbiAgICB9XG5cbiAgICBzZXQgdm9sdW1lKHZhbHVlKSB7XG4gICAgICAgIGlmKHZhbHVlID4gMSAmJiB2YWx1ZSA8IDApIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdWb2x1bWUgbXVzdCBiZSBpbiByYW5nZSBmcm9tIDAgdG8gMScpO1xuICAgICAgICB9XG4gICAgICAgIGlmKHZhbHVlID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLm11dGUoKTtcbiAgICAgICAgfSBlbHNlIGlmKHRoaXMubXV0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMudW5tdXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZ2Fpbi5nYWluLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIFxuICAgIHBsYXkoKSB7XG4gICAgICAgIGlmKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCF0aGlzLl9wbGF5YmFjay50cmFjayB8fCB0aGlzLl9wbGF5YmFjay50cmFjay5pZCAhPT0gdGhpcy5jdXJyZW50VHJhY2tJbmRleCkge1xuICAgICAgICAgICAgdGhpcy5fc2V0VHJhY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRyYWNrID0gdGhpcy5fcGxheWJhY2sudHJhY2s7XG5cbiAgICAgICAgY29uc29sZS5sb2coYFBsYXlpbmcgdHJhY2sgaWQ9JHt0aGlzLmN1cnJlbnRUcmFja0luZGV4fSAtICR7dHJhY2suc3JjfWApO1xuICAgICAgICBpZih0cmFjay5hdWRpbyAmJiB0cmFjay5pc0J1ZmZlcmVkKCkpIHtcbiAgICAgICAgICAgIHRyYWNrLmF1ZGlvLnBsYXkoKTtcbiAgICAgICAgICAgIHRoaXMuX3BsYXliYWNrLnBsYXlpbmcgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJhY2subG9hZCgpO1xuICAgICAgICAgICAgLy9TdWJzY3JpYmVcbiAgICAgICAgICAgIC8v0YfQtdGCINC90LUg0L7QulxuICAgICAgICAgICAgdHJhY2sub24oJ2NhbnBsYXknLCB0aGlzLl9zdGFydFBsYXliYWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdHJhY2sub24oJ2VuZGVkJywgdGhpcy5wbGF5TmV4dC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRyYWNrLm9uKCdwcm9ncmVzcycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd0cmFjazpwcm9ncmVzcycsIGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0cmFjay5vbignbG9hZGVkZGF0YScsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd0cmFjazpsb2FkZWRkYXRhJywgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRyYWNrLm9uKCdjYW5wbGF5dGhyb3VnaCcsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd0cmFjazpjYW5wbGF5dGhyb3VnaCcsIGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0cmFjay5vbignbG9hZGVkbWV0YWRhdGEnLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgndHJhY2s6bG9hZGVkbWV0YWRhdGEnLCBlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdHJhY2sub24oJ3RpbWV1cGRhdGUnLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgndHJhY2s6dGltZXVwZGF0ZScsIGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdG9wKCkge1xuICAgICAgICB0aGlzLl9wbGF5YmFjay5wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHRyYWNrID0gdGhpcy5fcGxheWJhY2sudHJhY2s7XG4gICAgICAgIHRyYWNrLmF1ZGlvLnBhdXNlKCk7XG4gICAgICAgIHRyYWNrLmF1ZGlvLmN1cnJlbnRUaW1lID0gMDtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwYXVzZSgpIHtcbiAgICAgICAgdGhpcy5fcGxheWJhY2sucGxheWluZyA9IGZhbHNlO1xuICAgICAgICBjb25zdCB0cmFjayA9IHRoaXMuX3BsYXliYWNrLnRyYWNrO1xuICAgICAgICB0cmFjay5hdWRpby5wYXVzZSgpO1xuICAgICAgICBjb25zb2xlLmxvZygnUEFVU0VEJyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbXV0ZSgpIHtcbiAgICAgICAgdGhpcy5fcGxheWJhY2sudHJhY2subXV0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLm11dGVkID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1bm11dGUoKSB7XG4gICAgICAgIHRoaXMuX3BsYXliYWNrLnRyYWNrLm11dGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMubXV0ZWQgPSBmYWxzZTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwbGF5TmV4dCgpIHtcbiAgICAgICAgaWYodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3Jlc2V0UGxheWJhY2tJbmZvKCk7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50VHJhY2tJbmRleCArPSAxO1xuICAgICAgICB0aGlzLnBsYXkoKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwbGF5UHJldigpIHtcbiAgICAgICAgaWYodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3Jlc2V0UGxheWJhY2tJbmZvKCk7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50VHJhY2tJbmRleCAtPSAxO1xuICAgICAgICB0aGlzLnBsYXkoKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZXdpbmQocmF0aW8pIHtcbiAgICAgICAgaWYocmF0aW8gPiAxICYmIHJhdGlvIDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1RvIHJld2luZCBhdWRpbywgcmF0aW8gbXVzdCBiZSBpbiByYW5nZSBmcm9tIDAgdG8gMScpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXVkaW8gPSB0aGlzLl9wbGF5YmFjay50cmFjay5hdWRpbztcbiAgICAgICAgaWYoIWlzTmFOKGF1ZGlvLmR1cmF0aW9uKSkge1xuICAgICAgICAgICAgY29uc3QgbmV3VGltZSA9IGF1ZGlvLmR1cmF0aW9uICogcmF0aW87XG4gICAgICAgICAgICBhdWRpby5jdXJyZW50VGltZSA9IG5ld1RpbWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjaGFuZ2VFcXVhbGl6ZXJGaWx0ZXJHYWluKGlkLCB2YWx1ZSkge1xuICAgICAgICBpZih0aGlzLl9lcXVhbGl6ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2VxdWFsaXplci5jaGFuZ2VGaWx0ZXJHYWluKGlkLCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBnZXRFcXVhbGl6ZXJGaWx0ZXJHYWluKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lcXVhbGl6ZXIgPyB0aGlzLl9lcXVhbGl6ZXIuZ2V0RmlsdGVyR2FpbihpZCkgOiBudWxsO1xuICAgIH1cblxuICAgIF9zZXRUcmFjaygpIHtcbiAgICAgICAgaWYodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKCdTZXR0aW5nIHRyYWNrJywgdGhpcy5jdXJyZW50VHJhY2tJbmRleCk7XG4gICAgICAgIC8vVE9ETzogbmVlZCB0byByZWZhY3RvcmluZyB0aGlzXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLl9wbGF5YmFjay50cmFjayA9IHRoaXMucGxheWxpc3QuZ2V0VHJhY2sodGhpcy5jdXJyZW50VHJhY2tJbmRleCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ3VycmVudFRyYWNrSW5kZXggcmVzZXRlZCB0byAwJyk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUcmFja0luZGV4ID0gMDtcbiAgICAgICAgICAgIHRoaXMuX3BsYXliYWNrLnRyYWNrID0gdGhpcy5wbGF5bGlzdC5nZXRUcmFjayh0aGlzLmN1cnJlbnRUcmFja0luZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9yZXNldFBsYXliYWNrSW5mbygpIHtcbiAgICAgICAgdGhpcy5fcGxheWJhY2sgPSB7XG4gICAgICAgICAgICB0cmFjazogbnVsbCxcbiAgICAgICAgICAgIHNvdXJjZTogbnVsbCxcbiAgICAgICAgICAgIHBsYXlpbmc6IGZhbHNlLFxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdSRVNFVCBQTEFZQkFDSycpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9zdGFydFBsYXliYWNrKCkge1xuICAgICAgICBpZih0aGlzLmlzUGxheWluZykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0FscmVhZHkgcGxheWluZyExJyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBsYXliYWNrID0gdGhpcy5fcGxheWJhY2s7XG4gICAgICAgIGNvbnN0IHRyYWNrID0gdGhpcy5fcGxheWJhY2sudHJhY2s7XG4gICAgICAgIFxuICAgICAgICBwbGF5YmFjay5zb3VyY2UgPSB0aGlzLl9jdHguY3JlYXRlTWVkaWFFbGVtZW50U291cmNlKHRyYWNrLmF1ZGlvKTtcbiAgICAgICAgdGhpcy5fY29ubmVjdE5vZGVzKCk7XG5cbiAgICAgICAgY29uc29sZS5sb2coYExvYWRlZCAtICR7cGxheWJhY2sudHJhY2suc3JjfWApO1xuICAgICAgICBwbGF5YmFjay5wbGF5aW5nID0gdHJ1ZTtcbiAgICAgICAgdHJhY2suYXVkaW8ucGxheSgpO1xuXG4gICAgICAgIC8vVW5zdWJzY3JpYmUgYmVjYXVzZSAnY2FucGxheScgZXZlbnQgdHJpZ2dlcmVkIGJ5IGNoYW5naW5nIHRoZSBjdXJyZW50IHRpbWVcbiAgICAgICAgdHJhY2sub2ZmKCdjYW5wbGF5JywgdGhpcy5fc3RhcnRQbGF5YmFjay5iaW5kKHRoaXMpKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfY3JlYXRlQXVkaW9BcGlOb2RlcygpIHtcbiAgICAgICAgaWYoISh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5fY3R4ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKCk7XG4gICAgICAgIHRoaXMuX2Rlc3QgPSB0aGlzLl9jdHguZGVzdGluYXRpb247XG4gICAgICAgIHRoaXMuX2dhaW4gPSB0aGlzLl9jdHguY3JlYXRlR2FpbigpO1xuICAgICAgICB0aGlzLl9lcXVhbGl6ZXIgPSB0aGlzLnNldHRpbmdzLmVxdWFsaXplciA/IG5ldyBFcXVhbGl6ZXIodGhpcy5fY3R4KSA6IG51bGw7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8vIFRPRE86INCf0LXRgNC10LTQtdC70LDRgtGMINGH0YLQvtCx0Ysg0YHQstGP0LfRi9Cy0LDQu9C+0YHRjCDQsiDQt9Cw0LLQuNGB0LjQvNC+0YHRgtC4INC+0YIg0L3QsNGB0YLRgNC+0LXQulxuICAgIF9jb25uZWN0Tm9kZXMoKSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMuX3BsYXliYWNrLnNvdXJjZTtcbiAgICAgICAgY29uc3QgZmlsdGVycyA9IHRoaXMuX2VxdWFsaXplci5maWx0ZXJzO1xuICAgICAgICBpZighKHNvdXJjZSBpbnN0YW5jZW9mIE1lZGlhRWxlbWVudEF1ZGlvU291cmNlTm9kZSkpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdTb3VyY2Ugbm9kZSBpcyB1bmRlZmluZWQgb3Igc291cmNlICE9PSBNZWRpYUVsZW1lbnRBdWRpb1NvdXJjZU5vZGUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNvdXJjZS5jb25uZWN0KGZpbHRlcnNbMF0pO1xuICAgICAgICBmaWx0ZXJzW2ZpbHRlcnMubGVuZ3RoIC0gMV0uY29ubmVjdCh0aGlzLl9nYWluKTtcbiAgICAgICAgdGhpcy5fZ2Fpbi5jb25uZWN0KHRoaXMuX2Rlc3QpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiJdfQ==
},{"./Equalizer":2,"./Playlist":3,"./Track":4,"./utils/EventEmmiter":7}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PRESETS = [{
  name: "Acoustic",
  data: [5, 5, 4, 1, 2, 2, 3, 4, 3, 2]
}, {
  name: "Bass Booster",
  data: [6, 5, 4, 3, 2, 0, 0, 0, 0, 0]
}, {
  name: "Bass Reducer",
  data: [-6, -5, -4, -3, -2, 0, 0, 0, 0, 0]
}, {
  name: "Classical",
  data: [5, 4, 3, 2, -1, -1, 0, 1, 3, 4]
}, {
  name: "Dance",
  data: [4, 6, 5, 0, 2, 3, 5, 4, 3, 0]
}, {
  name: "Deep",
  data: [5, 3, 2, 1, 3, 2, 1, -2, -4, -5]
}, {
  name: "Electronic",
  data: [4, 4, 1, 0, -2, 2, 1, 2, 4, 5]
}, {
  name: "Hip-Hop",
  data: [5, 3, 1, 3, -1, -1, 1, -1, 2, 3]
}, {
  name: "Jazz",
  data: [4, 3, 1, 2, -1, -1, 0, 1, 3, 4]
}, {
  name: "Latin",
  data: [5, 3, 0, 0, -1, -1, -1, 0, 3, 5]
}, {
  name: "Loudness",
  data: [6, 4, 0, 0, -2, 0, -1, -5, 4, 1]
}, {
  name: "Lounge",
  data: [-3, -2, -1, 1, 4, 3, 0, -1, 2, 1]
}, {
  name: "Piano",
  data: [3, 2, 0, 2, 3, 1, 3, 5, 3, 4]
}, {
  name: "Pop",
  data: [-2, -1, 0, 2, 4, 4, 2, 0, -1, -2]
}, {
  name: "R&B",
  data: [2, 7, 6, 1, -2, -1, 2, 3, 3, 4]
}, {
  name: "Rock",
  data: [5, 4, 3, 2, -1, -2, 0, 2, 3, 4]
}, {
  name: "Small Speakers",
  data: [5, 4, 3, 2, 1, 0, -2, -3, -4, -5]
}, {
  name: "Spoken Word",
  data: [-4, -1, 0, 1, 3, 5, 5, 4, 2, 0]
}, {
  name: "Treble Booster",
  data: [0, 0, 0, 0, 0, 1, 2, 3, 4, 5]
}, {
  name: "Treble Reducer",
  data: [0, 0, 0, 0, 0, -1, -2, -3, -4, -5]
}, {
  name: "Vocal Booster",
  data: [-1, -3, -3, 1, 4, 4, 3, 1, 0, -1]
}];
var FREQS = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

var Equalizer = function () {
  function Equalizer(context) {
    _classCallCheck(this, Equalizer);

    this.context = context;
    this.filters = [];
    this._frequencies = FREQS;
    this._createFilters();
  }

  _createClass(Equalizer, [{
    key: "changeFilterGain",
    value: function changeFilterGain(id, value) {
      if (id in this.filters) {
        var validValue = value > 12 ? 12 : value < -12 ? -12 : value;
        this.filters[id].gain.value = validValue;
      }

      return this;
    }
  }, {
    key: "getFilterGain",
    value: function getFilterGain(id) {
      return id in this.filters ? this.filters[id].gain.value : null;
    }
  }, {
    key: "_createFilter",
    value: function _createFilter(frequency) {
      var filter = this.context.createBiquadFilter();

      filter.type = 'peaking';
      filter.frequency.value = frequency;
      filter.Q.value = 1; // Q-factor
      filter.gain.value = 0;

      return filter;
    }
  }, {
    key: "_createFilters",
    value: function _createFilters() {
      var filters = this._frequencies.map(this._createFilter.bind(this));
      filters.reduce(function (prev, curr) {
        prev.connect(curr);
        return curr;
      });
      this.filters = filters;

      return this;
    }
  }, {
    key: "frequencies",
    get: function get() {
      return this._frequencies;
    }
  }]);

  return Equalizer;
}();

exports.default = Equalizer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVxdWFsaXplci5qcyJdLCJuYW1lcyI6WyJQUkVTRVRTIiwibmFtZSIsImRhdGEiLCJGUkVRUyIsIkVxdWFsaXplciIsImNvbnRleHQiLCJmaWx0ZXJzIiwiX2ZyZXF1ZW5jaWVzIiwiX2NyZWF0ZUZpbHRlcnMiLCJpZCIsInZhbHVlIiwidmFsaWRWYWx1ZSIsImdhaW4iLCJmcmVxdWVuY3kiLCJmaWx0ZXIiLCJjcmVhdGVCaXF1YWRGaWx0ZXIiLCJ0eXBlIiwiUSIsIm1hcCIsIl9jcmVhdGVGaWx0ZXIiLCJiaW5kIiwicmVkdWNlIiwicHJldiIsImN1cnIiLCJjb25uZWN0Il0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQUVBLElBQU1BLFVBQVUsQ0FDZDtBQUNFQyxRQUFNLFVBRFI7QUFFRUMsUUFBTSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCLENBQXpCLEVBQTRCLENBQTVCO0FBRlIsQ0FEYyxFQUlYO0FBQ0RELFFBQU0sY0FETDtBQUVEQyxRQUFNLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUI7QUFGTCxDQUpXLEVBT1g7QUFDREQsUUFBTSxjQURMO0FBRURDLFFBQU0sQ0FBQyxDQUFDLENBQUYsRUFBSyxDQUFDLENBQU4sRUFBUyxDQUFDLENBQVYsRUFBYSxDQUFDLENBQWQsRUFBaUIsQ0FBQyxDQUFsQixFQUFxQixDQUFyQixFQUF3QixDQUF4QixFQUEyQixDQUEzQixFQUE4QixDQUE5QixFQUFpQyxDQUFqQztBQUZMLENBUFcsRUFVWDtBQUNERCxRQUFNLFdBREw7QUFFREMsUUFBTSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFD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VSxrQkFBYixFQUFmOztBQUVBRCxhQUFPRSxJQUFQLEdBQWMsU0FBZDtBQUNBRixhQUFPRCxTQUFQLENBQWlCSCxLQUFqQixHQUF5QkcsU0FBekI7QUFDQUMsYUFBT0csQ0FBUCxDQUFTUCxLQUFULEdBQWlCLENBQWpCLENBTHFCLENBS0Q7QUFDcEJJLGFBQU9GLElBQVAsQ0FBWUYsS0FBWixHQUFvQixDQUFwQjs7QUFFQSxhQUFPSSxNQUFQO0FBQ0g7OztxQ0FFZ0I7QUFDYixVQUFNUixVQUFVLEtBQUtDLFlBQUwsQ0FBa0JXLEdBQWxCLENBQXNCLEtBQUtDLGFBQUwsQ0FBbUJDLElBQW5CLENBQXdCLElBQXhCLENBQXRCLENBQWhCO0FBQ0FkLGNBQVFlLE1BQVIsQ0FBZSxVQUFDQyxJQUFELEVBQU9DLElBQVAsRUFBZ0I7QUFDM0JELGFBQUtFLE9BQUwsQ0FBYUQsSUFBYjtBQUNBLGVBQU9BLElBQVA7QUFDSCxPQUhEO0FBSUEsV0FBS2pCLE9BQUwsR0FBZUEsT0FBZjs7QUFFQSxhQUFPLElBQVA7QUFDSDs7O3dCQXJDaUI7QUFDZCxhQUFPLEtBQUtDLFlBQVo7QUFDSDs7Ozs7O2tCQVZnQkgsUyIsImZpbGUiOiJFcXVhbGl6ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QgUFJFU0VUUyA9IFtcbiAge1xuICAgIG5hbWU6IFwiQWNvdXN0aWNcIixcbiAgICBkYXRhOiBbNSwgNSwgNCwgMSwgMiwgMiwgMywgNCwgMywgMl0sXG4gIH0sIHtcbiAgICBuYW1lOiBcIkJhc3MgQm9vc3RlclwiLFxuICAgIGRhdGE6IFs2LCA1LCA0LCAzLCAyLCAwLCAwLCAwLCAwLCAwXSxcbiAgfSwge1xuICAgIG5hbWU6IFwiQmFzcyBSZWR1Y2VyXCIsXG4gICAgZGF0YTogWy02LCAtNSwgLTQsIC0zLCAtMiwgMCwgMCwgMCwgMCwgMF0sXG4gIH0sIHtcbiAgICBuYW1lOiBcIkNsYXNzaWNhbFwiLFxuICAgIGRhdGE6IFs1LCA0LCAzLCAyLCAtMSwgLTEsIDAsIDEsIDMsIDRdXG4gIH0sIHtcbiAgICBuYW1lOiBcIkRhbmNlXCIsXG4gICAgZGF0YTogWzQsIDYsIDUsIDAsIDIsIDMsIDUsIDQsIDMsIDBdLFxuICB9LCB7XG4gICAgbmFtZTogXCJEZWVwXCIsXG4gICAgZGF0YTogWzUsIDMsIDIsIDEsIDMsIDIsIDEsIC0yLCAtNCwgLTVdXG4gIH0sIHtcbiAgICBuYW1lOiBcIkVsZWN0cm9uaWNcIixcbiAgICBkYXRhOiBbNCwgNCwgMSwgMCwgLTIsIDIsIDEsIDIsIDQsIDVdXG4gIH0sIHtcbiAgICBuYW1lOiBcIkhpcC1Ib3BcIixcbiAgICBkYXRhOiBbNSwgMywgMSwgMywgLTEsIC0xLCAxLCAtMSwgMiwgM10sXG4gIH0sIHtcbiAgICBuYW1lOiBcIkphenpcIixcbiAgICBkYXRhOiBbNCwgMywgMSwgMiwgLTEsIC0xLCAwLCAxLCAzLCA0XSxcbiAgfSwge1xuICAgIG5hbWU6IFwiTGF0aW5cIixcbiAgICBkYXRhOiBbNSwgMywgMCwgMCwgLTEsIC0xLCAtMSwgMCwgMywgNV1cbiAgfSwge1xuICAgIG5hbWU6IFwiTG91ZG5lc3NcIixcbiAgICBkYXRhOiBbNiwgNCwgMCwgMCwgLTIsIDAsIC0xLCAtNSwgNCwgMV0sXG4gIH0sIHtcbiAgICBuYW1lOiBcIkxvdW5nZVwiLFxuICAgIGRhdGE6IFstMywgLTIsIC0xLCAxLCA0LCAzLCAwLCAtMSwgMiwgMV0sXG4gIH0sIHtcbiAgICBuYW1lOiBcIlBpYW5vXCIsXG4gICAgZGF0YTogWzMsIDIsIDAsIDIsIDMsIDEsIDMsIDUsIDMsIDRdLFxuICB9LCB7XG4gICAgbmFtZTogXCJQb3BcIixcbiAgICBkYXRhOiBbLTIsIC0xLCAwLCAyLCA0LCA0LCAyLCAwLCAtMSwgLTJdLFxuICB9LCB7XG4gICAgbmFtZTogXCJSJkJcIixcbiAgICBkYXRhOiBbMiwgNywgNiwgMSwgLTIsIC0xLCAyLCAzLCAzLCA0XSxcbiAgfSwge1xuICAgIG5hbWU6IFwiUm9ja1wiLFxuICAgIGRhdGE6IFs1LCA0LCAzLCAyLCAtMSwgLTIsIDAsIDIsIDMsIDRdLFxuICB9LCB7XG4gICAgbmFtZTogXCJTbWFsbCBTcGVha2Vyc1wiLFxuICAgIGRhdGE6IFs1LCA0LCAzLCAyLCAxLCAwLCAtMiwgLTMsIC00LCAtNV0sXG4gIH0sIHtcbiAgICBuYW1lOiBcIlNwb2tlbiBXb3JkXCIsXG4gICAgZGF0YTogWy00LCAtMSwgMCwgMSwgMywgNSwgNSwgNCwgMiwgMF0sXG4gIH0sIHtcbiAgICBuYW1lOiBcIlRyZWJsZSBCb29zdGVyXCIsXG4gICAgZGF0YTogWzAsIDAsIDAsIDAsIDAsIDEsIDIsIDMsIDQsIDVdLFxuICB9LCB7XG4gICAgbmFtZTogXCJUcmVibGUgUmVkdWNlclwiLFxuICAgIGRhdGE6IFswLCAwLCAwLCAwLCAwLCAtMSwgLTIsIC0zLCAtNCwgLTVdLFxuICB9LCB7XG4gICAgbmFtZTogXCJWb2NhbCBCb29zdGVyXCIsXG4gICAgZGF0YTogWy0xLCAtMywgLTMsIDEsIDQsIDQsIDMsIDEsIDAsIC0xXVxuICB9XG5dO1xuY29uc3QgRlJFUVMgPSBbNjAsIDE3MCwgMzEwLCA2MDAsIDEwMDAsIDMwMDAsIDYwMDAsIDEyMDAwLCAxNDAwMCwgMTYwMDBdO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcXVhbGl6ZXIge1xuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gW107XG4gICAgICAgIHRoaXMuX2ZyZXF1ZW5jaWVzID0gRlJFUVM7XG4gICAgICAgIHRoaXMuX2NyZWF0ZUZpbHRlcnMoKTtcbiAgICB9XG5cbiAgICBnZXQgZnJlcXVlbmNpZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mcmVxdWVuY2llcztcbiAgICB9XG5cbiAgICBjaGFuZ2VGaWx0ZXJHYWluKGlkLCB2YWx1ZSkge1xuICAgICAgICBpZihpZCBpbiB0aGlzLmZpbHRlcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbGlkVmFsdWUgPSB2YWx1ZSA+IDEyID8gMTIgOiAodmFsdWUgPCAtMTIgPyAtMTIgOiB2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmZpbHRlcnNbaWRdLmdhaW4udmFsdWUgPSB2YWxpZFZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0RmlsdGVyR2FpbihpZCkge1xuICAgICAgICByZXR1cm4gaWQgaW4gdGhpcy5maWx0ZXJzID8gdGhpcy5maWx0ZXJzW2lkXS5nYWluLnZhbHVlIDogbnVsbDtcbiAgICB9XG5cbiAgICBfY3JlYXRlRmlsdGVyKGZyZXF1ZW5jeSkge1xuICAgICAgICBjb25zdCBmaWx0ZXIgPSB0aGlzLmNvbnRleHQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG5cbiAgICAgICAgZmlsdGVyLnR5cGUgPSAncGVha2luZyc7XG4gICAgICAgIGZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSBmcmVxdWVuY3k7XG4gICAgICAgIGZpbHRlci5RLnZhbHVlID0gMTsgLy8gUS1mYWN0b3JcbiAgICAgICAgZmlsdGVyLmdhaW4udmFsdWUgPSAwO1xuXG4gICAgICAgIHJldHVybiBmaWx0ZXI7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUZpbHRlcnMoKSB7XG4gICAgICAgIGNvbnN0IGZpbHRlcnMgPSB0aGlzLl9mcmVxdWVuY2llcy5tYXAodGhpcy5fY3JlYXRlRmlsdGVyLmJpbmQodGhpcykpO1xuICAgICAgICBmaWx0ZXJzLnJlZHVjZSgocHJldiwgY3VycikgPT4ge1xuICAgICAgICAgICAgcHJldi5jb25uZWN0KGN1cnIpO1xuICAgICAgICAgICAgcmV0dXJuIGN1cnI7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZpbHRlcnMgPSBmaWx0ZXJzO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiJdfQ==
},{}],3:[function(require,module,exports){
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
        var tracks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        _classCallCheck(this, Playlist);

        this._tracks = [];
        this.addTrackList(tracks);
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
        value: function addTrack(id, src) {
            var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

            var track = new _Track2.default(id, src, name);
            this.tracks.push(track);

            return this;
        }
    }, {
        key: 'addTrackList',
        value: function addTrackList(list) {
            var _this = this;

            list.forEach(function (track, i) {
                if (typeof track === 'string') {
                    // console.log('str', track);
                    _this.addTrack(i, track);
                } else if ((typeof track === 'undefined' ? 'undefined' : _typeof(track)) === 'object') {
                    var src = track.src,
                        name = track.name;
                    // console.log('obj', src, name);

                    _this.addTrack(i, src, name);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXlsaXN0LmpzIl0sIm5hbWVzIjpbIlBsYXlsaXN0IiwidHJhY2tzIiwiX3RyYWNrcyIsImFkZFRyYWNrTGlzdCIsImlkIiwidHJhY2siLCJFcnJvciIsInNyYyIsIm5hbWUiLCJwdXNoIiwibGlzdCIsImZvckVhY2giLCJpIiwiYWRkVHJhY2siXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7O0lBRXFCQSxRO0FBQ2pCLHdCQUF1QjtBQUFBLFlBQVhDLE1BQVcsdUVBQUosRUFBSTs7QUFBQTs7QUFDbkIsYUFBS0MsT0FBTCxHQUFlLEVBQWY7QUFDQSxhQUFLQyxZQUFMLENBQWtCRixNQUFsQjtBQUNIOzs7O2lDQU1RRyxFLEVBQUk7QUFDVCxnQkFBTUMsUUFBUSxLQUFLSCxPQUFMLENBQWFFLEVBQWIsQ0FBZDtBQUNBLGdCQUFHQyxLQUFILEVBQVU7QUFDTix1QkFBT0EsS0FBUDtBQUNILGFBRkQsTUFFTztBQUNILHNCQUFNQyx5QkFBdUJGLEVBQXZCLGlDQUFOO0FBQ0g7QUFDSjs7O2lDQUVRQSxFLEVBQUlHLEcsRUFBZ0I7QUFBQSxnQkFBWEMsSUFBVyx1RUFBSixFQUFJOztBQUN6QixnQkFBTUgsUUFBUSxvQkFBVUQsRUFBVixFQUFjRyxHQUFkLEVBQW1CQyxJQUFuQixDQUFkO0FBQ0EsaUJBQUtQLE1BQUwsQ0FBWVEsSUFBWixDQUFpQkosS0FBakI7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOzs7cUNBRVlLLEksRUFBTTtBQUFBOztBQUNmQSxpQkFBS0MsT0FBTCxDQUFhLFVBQUNOLEtBQUQsRUFBUU8sQ0FBUixFQUFjO0FBQ3ZCLG9CQUFHLE9BQU9QLEtBQVAsS0FBaUIsUUFBcEIsRUFBOEI7QUFDMUI7QUFDQSwwQkFBS1EsUUFBTCxDQUFjRCxDQUFkLEVBQWlCUCxLQUFqQjtBQUNILGlCQUhELE1BR08sSUFBRyxRQUFPQSxLQUFQLHlDQUFPQSxLQUFQLE9BQWlCLFFBQXBCLEVBQThCO0FBQUEsd0JBQ3pCRSxHQUR5QixHQUNYRixLQURXLENBQ3pCRSxHQUR5QjtBQUFBLHdCQUNwQkMsSUFEb0IsR0FDWEgsS0FEVyxDQUNwQkcsSUFEb0I7QUFFakM7O0FBQ0EsMEJBQUtLLFFBQUwsQ0FBY0QsQ0FBZCxFQUFpQkwsR0FBakIsRUFBc0JDLElBQXRCO0FBQ0g7QUFDSixhQVREO0FBVUg7Ozs0QkEvQlk7QUFDVCxtQkFBTyxLQUFLTixPQUFaO0FBQ0g7Ozs7OztrQkFSZ0JGLFEiLCJmaWxlIjoiUGxheWxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFRyYWNrIGZyb20gJy4vVHJhY2snO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5bGlzdCB7XG4gICAgY29uc3RydWN0b3IodHJhY2tzPVtdKSB7XG4gICAgICAgIHRoaXMuX3RyYWNrcyA9IFtdO1xuICAgICAgICB0aGlzLmFkZFRyYWNrTGlzdCh0cmFja3MpO1xuICAgIH1cblxuICAgIGdldCB0cmFja3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90cmFja3M7XG4gICAgfVxuXG4gICAgZ2V0VHJhY2soaWQpIHtcbiAgICAgICAgY29uc3QgdHJhY2sgPSB0aGlzLl90cmFja3NbaWRdO1xuICAgICAgICBpZih0cmFjaykge1xuICAgICAgICAgICAgcmV0dXJuIHRyYWNrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoYFRyYWNrIHdpdGggaWQ9JHtpZH0gZG9zZW4ndCBleGlzdCBpbiBwbGF5bGlzdGApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkVHJhY2soaWQsIHNyYywgbmFtZSA9ICcnKSB7XG4gICAgICAgIGNvbnN0IHRyYWNrID0gbmV3IFRyYWNrKGlkLCBzcmMsIG5hbWUpO1xuICAgICAgICB0aGlzLnRyYWNrcy5wdXNoKHRyYWNrKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhZGRUcmFja0xpc3QobGlzdCkge1xuICAgICAgICBsaXN0LmZvckVhY2goKHRyYWNrLCBpKSA9PiB7XG4gICAgICAgICAgICBpZih0eXBlb2YgdHJhY2sgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3N0cicsIHRyYWNrKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRyYWNrKGksIHRyYWNrKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZih0eXBlb2YgdHJhY2sgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzcmMsIG5hbWUgfSA9IHRyYWNrO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdvYmonLCBzcmMsIG5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkVHJhY2soaSwgc3JjLCBuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSJdfQ==
},{"./Track":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventEmmiter2 = require('./utils/EventEmmiter.js');

var _EventEmmiter3 = _interopRequireDefault(_EventEmmiter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Track = function (_EventEmmiter) {
    _inherits(Track, _EventEmmiter);

    function Track(id, src) {
        var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        _classCallCheck(this, Track);

        var _this = _possibleConstructorReturn(this, (Track.__proto__ || Object.getPrototypeOf(Track)).call(this));

        _this.id = id;
        _this._src = src;
        _this._name = name;
        _this._buffer = null;
        _this._audio = new Audio();
        _this._bindEvents();
        return _this;
    }

    _createClass(Track, [{
        key: 'isBuffered',
        value: function isBuffered() {
            return this._audio.buffered.length > 0;
        }
    }, {
        key: 'load',
        value: function load() {
            this._audio.crossOrigin = "anonymous";
            this._audio.src = this._src;
            this._audio.load();
            return this;
        }
    }, {
        key: '_bindEvents',
        value: function _bindEvents() {
            var _this2 = this;

            this._audio.addEventListener('canplay', function (e) {
                _this2.emit('canplay', e);
            });
            this._audio.addEventListener('ended', function () {
                _this2.emit('ended');
            });
            this._audio.addEventListener('progress', function (e) {
                _this2.emit('progress', e);
            });
            this._audio.addEventListener('loadeddata', function (e) {
                _this2.emit('loadeddata', e);
            });
            this._audio.addEventListener('canplaythrough', function (e) {
                _this2.emit('canplaythrough', e);
            });
            this._audio.addEventListener('loadedmetadata', function (e) {
                _this2.emit('loadedmetadata', e);
            });
            this._audio.addEventListener('timeupdate', function (e) {
                _this2.emit('timeupdate', e);
            });
        }
    }, {
        key: 'src',
        get: function get() {
            return this._src;
        }
    }, {
        key: 'name',
        get: function get() {
            return this._name;
        }
    }, {
        key: 'audio',
        get: function get() {
            return this._audio;
        }
    }, {
        key: 'muted',
        set: function set(value) {
            this._audio.muted = !!value;
        }
    }]);

    return Track;
}(_EventEmmiter3.default);

exports.default = Track;
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRyYWNrLmpzIl0sIm5hbWVzIjpbIlRyYWNrIiwiaWQiLCJzcmMiLCJuYW1lIiwiX3NyYyIsIl9uYW1lIiwiX2J1ZmZlciIsIl9hdWRpbyIsIkF1ZGlvIiwiX2JpbmRFdmVudHMiLCJidWZmZXJlZCIsImxlbmd0aCIsImNyb3NzT3JpZ2luIiwibG9hZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiZW1pdCIsInZhbHVlIiwibXV0ZWQiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7SUFFcUJBLEs7OztBQUNqQixtQkFBWUMsRUFBWixFQUFnQkMsR0FBaEIsRUFBOEI7QUFBQSxZQUFUQyxJQUFTLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUE7O0FBRTFCLGNBQUtGLEVBQUwsR0FBVUEsRUFBVjtBQUNBLGNBQUtHLElBQUwsR0FBWUYsR0FBWjtBQUNBLGNBQUtHLEtBQUwsR0FBYUYsSUFBYjtBQUNBLGNBQUtHLE9BQUwsR0FBZSxJQUFmO0FBQ0EsY0FBS0MsTUFBTCxHQUFjLElBQUlDLEtBQUosRUFBZDtBQUNBLGNBQUtDLFdBQUw7QUFQMEI7QUFRN0I7Ozs7cUNBa0JZO0FBQ1QsbUJBQU8sS0FBS0YsTUFBTCxDQUFZRyxRQUFaLENBQXFCQyxNQUFyQixHQUE4QixDQUFyQztBQUNIOzs7K0JBRU07QUFDSCxpQkFBS0osTUFBTCxDQUFZSyxXQUFaLEdBQTBCLFdBQTFCO0FBQ0EsaUJBQUtMLE1BQUwsQ0FBWUwsR0FBWixHQUFrQixLQUFLRSxJQUF2QjtBQUNBLGlCQUFLRyxNQUFMLENBQVlNLElBQVo7QUFDQSxtQkFBTyxJQUFQO0FBQ0g7OztzQ0FFYTtBQUFBOztBQUNWLGlCQUFLTixNQUFMLENBQVlPLGdCQUFaLENBQTZCLFNBQTdCLEVBQXdDLFVBQUNDLENBQUQsRUFBTztBQUMzQyx1QkFBS0MsSUFBTCxDQUFVLFNBQVYsRUFBcUJELENBQXJCO0FBQ0gsYUFGRDtBQUdBLGlCQUFLUixNQUFMLENBQVlPLGdCQUFaLENBQTZCLE9BQTdCLEVBQXNDLFlBQU07QUFDeEMsdUJBQUtFLElBQUwsQ0FBVSxPQUFWO0FBQ0gsYUFGRDtBQUdBLGlCQUFLVCxNQUFMLENBQVlPLGdCQUFaLENBQTZCLFVBQTdCLEVBQXlDLFVBQUNDLENBQUQsRUFBTztBQUM1Qyx1QkFBS0MsSUFBTCxDQUFVLFVBQVYsRUFBc0JELENBQXRCO0FBQ0gsYUFGRDtBQUdBLGlCQUFLUixNQUFMLENBQVlPLGdCQUFaLENBQTZCLFlBQTdCLEVBQTJDLFVBQUNDLENBQUQsRUFBTztBQUM5Qyx1QkFBS0MsSUFBTCxDQUFVLFlBQVYsRUFBd0JELENBQXhCO0FBQ0gsYUFGRDtBQUdBLGlCQUFLUixNQUFMLENBQVlPLGdCQUFaLENBQTZCLGdCQUE3QixFQUErQyxVQUFDQyxDQUFELEVBQU87QUFDbEQsdUJBQUtDLElBQUwsQ0FBVSxnQkFBVixFQUE0QkQsQ0FBNUI7QUFDSCxhQUZEO0FBR0EsaUJBQUtSLE1BQUwsQ0FBWU8sZ0JBQVosQ0FBNkIsZ0JBQTdCLEVBQStDLFVBQUNDLENBQUQsRUFBTztBQUNsRCx1QkFBS0MsSUFBTCxDQUFVLGdCQUFWLEVBQTRCRCxDQUE1QjtBQUNILGFBRkQ7QUFHQSxpQkFBS1IsTUFBTCxDQUFZTyxnQkFBWixDQUE2QixZQUE3QixFQUEyQyxVQUFDQyxDQUFELEVBQU87QUFDOUMsdUJBQUtDLElBQUwsQ0FBVSxZQUFWLEVBQXdCRCxDQUF4QjtBQUNILGFBRkQ7QUFHSDs7OzRCQWpEUztBQUNOLG1CQUFPLEtBQUtYLElBQVo7QUFDSDs7OzRCQUVVO0FBQ1AsbUJBQU8sS0FBS0MsS0FBWjtBQUNIOzs7NEJBRVc7QUFDUixtQkFBTyxLQUFLRSxNQUFaO0FBQ0g7OzswQkFFU1UsSyxFQUFPO0FBQ2IsaUJBQUtWLE1BQUwsQ0FBWVcsS0FBWixHQUFvQixDQUFDLENBQUNELEtBQXRCO0FBQ0g7Ozs7OztrQkF6QmdCakIsSztBQTZEcEIiLCJmaWxlIjoiVHJhY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEV2ZW50RW1taXRlciBmcm9tICcuL3V0aWxzL0V2ZW50RW1taXRlci5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNrIGV4dGVuZHMgRXZlbnRFbW1pdGVye1xuICAgIGNvbnN0cnVjdG9yKGlkLCBzcmMsIG5hbWU9JycpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLl9zcmMgPSBzcmM7XG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLl9idWZmZXIgPSBudWxsO1xuICAgICAgICB0aGlzLl9hdWRpbyA9IG5ldyBBdWRpbygpO1xuICAgICAgICB0aGlzLl9iaW5kRXZlbnRzKCk7XG4gICAgfVxuXG4gICAgZ2V0IHNyYygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NyYztcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuXG4gICAgZ2V0IGF1ZGlvKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXVkaW87XG4gICAgfVxuXG4gICAgc2V0IG11dGVkKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2F1ZGlvLm11dGVkID0gISF2YWx1ZTtcbiAgICB9XG5cbiAgICBpc0J1ZmZlcmVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXVkaW8uYnVmZmVyZWQubGVuZ3RoID4gMDtcbiAgICB9XG5cbiAgICBsb2FkKCkge1xuICAgICAgICB0aGlzLl9hdWRpby5jcm9zc09yaWdpbiA9IFwiYW5vbnltb3VzXCI7XG4gICAgICAgIHRoaXMuX2F1ZGlvLnNyYyA9IHRoaXMuX3NyYztcbiAgICAgICAgdGhpcy5fYXVkaW8ubG9hZCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfYmluZEV2ZW50cygpIHtcbiAgICAgICAgdGhpcy5fYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcignY2FucGxheScsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2NhbnBsYXknLCBlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX2F1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdlbmRlZCcpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdwcm9ncmVzcycsIGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVkZGF0YScsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2xvYWRlZGRhdGEnLCBlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX2F1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2NhbnBsYXl0aHJvdWdoJywgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnY2FucGxheXRocm91Z2gnLCBlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX2F1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlZG1ldGFkYXRhJywgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnbG9hZGVkbWV0YWRhdGEnLCBlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX2F1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ3RpbWV1cGRhdGUnLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCd0aW1ldXBkYXRlJywgZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iXX0=
},{"./utils/EventEmmiter.js":7}],5:[function(require,module,exports){
'use strict';

var _AudioPlayer = require('./AudioPlayer');

var _AudioPlayer2 = _interopRequireDefault(_AudioPlayer);

var _Playlist = require('./Playlist');

var _Playlist2 = _interopRequireDefault(_Playlist);

var _DOMBuilder = require('./utils/DOMBuilder');

var _DOMBuilder2 = _interopRequireDefault(_DOMBuilder);

var _RangeSlider = require('./utils/RangeSlider');

var _RangeSlider2 = _interopRequireDefault(_RangeSlider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var playerNode = document.getElementById("player");
var playBtn = document.querySelector('.player-controls__btn_play');
var playNextBtn = document.querySelector('.player-controls__btn_next');
var playPrevBtn = document.querySelector('.player-controls__btn_prev');

var volumeBtn = document.querySelector('.volume__btn');
var volumeSliderNode = document.querySelector('.volume__slider');

var progressBar = document.querySelector('.progress__bar');

var equalizerNode = document.querySelector('equalizer');
var equalizerBands = document.querySelectorAll('.equalizer-band__slider');

var tracks = ['http://freshly-ground.com/data/audio/mpc/20090207%20-%20Loverman.mp3', './../media/02 - Needles.mp3', './../media/03 - Deer Dance.mp3', './../media/04 - Jet Pilot.mp3', './../media/05 - X.mp3', './../media/06 - Chop Suey!.mp3'];

var player = new _AudioPlayer2.default(tracks, { equalizer: true });
player.volume = 0.5;

// Volume settings
var setVolume = function setVolume(value) {
    var icon = volumeBtn.children[0];
    if (value === 0) {
        icon.classList.remove('volume__icon_half');
        icon.classList.add('volume__icon_mute');
    }
    if (value > 0 && value <= 0.5) {
        icon.classList.remove('volume__icon_mute');
        icon.classList.add('volume__icon_half');
    }
    if (value > 0.5) {
        icon.classList.remove('volume__icon_mute');
        icon.classList.remove('volume__icon_half');
    }
    player.volume = value;
};

var volumeSlider = new _RangeSlider2.default(volumeSliderNode, {
    value: player.volume,
    onchange: setVolume,
    onmove: setVolume
});

volumeBtn.addEventListener('click', function (e) {
    var icon = volumeBtn.children[0];
    if (player.muted) {
        player.unmute();
        icon.classList.remove('volume__icon_mute');
    } else {
        player.mute();
        icon.classList.add('volume__icon_mute');
    }
});

// MouseScroll event handler to control the volume
var onwheelHandler = function onwheelHandler(e) {
    e.preventDefault();
    var newValue = player.volume + Math.sign(e.wheelDeltaY) * 0.05;
    volumeSlider.setValue(newValue);
    player.volume = newValue;
};

volumeBtn.addEventListener('wheel', onwheelHandler);
volumeSliderNode.addEventListener('wheel', onwheelHandler);

// Progress settings
var progressSlider = new _RangeSlider2.default(progressBar, {
    handle: false,
    buffer: true,
    onchange: function onchange(value) {
        player.rewind(value);
    }
});

var updateBuffer = function updateBuffer(e) {
    var audio = e.target;
    var buffered = audio.buffered;
    var buffRatio = buffered.length ? buffered.end(buffered.length - 1) / audio.duration : 0;

    progressSlider.setBuffer(buffRatio);
};

player.on('track:progress', updateBuffer);
player.on('track:loadeddata', updateBuffer);
player.on('track:canplaythrough', updateBuffer);
player.on('track:timeupdate', function (e) {
    var audio = e.target;
    var ratio = audio.currentTime / audio.duration;
    progressSlider.setValue(ratio);
});

// Player controls settings
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
    playBtn.classList.add('player-controls__btn_pause');
    player.playPrev();
});

//Equalizer settings
equalizerBands.forEach(function (band, i) {
    var bandFilled = band.querySelector('.slider-vert__filled');
    var filterValue = player.getEqualizerFilterGain(i);
    var bandSlider = new _RangeSlider2.default(band, {
        vertical: true,
        min: -12,
        max: 12,
        value: filterValue,
        onchange: function onchange(value) {
            player.changeEqualizerFilterGain(i, value);
        },
        onmove: function onmove(value) {
            player.changeEqualizerFilterGain(i, value);
        }
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfMjVjNTY0MjMuanMiXSwibmFtZXMiOlsicGxheWVyTm9kZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwbGF5QnRuIiwicXVlcnlTZWxlY3RvciIsInBsYXlOZXh0QnRuIiwicGxheVByZXZCdG4iLCJ2b2x1bWVCdG4iLCJ2b2x1bWVTbGlkZXJOb2RlIiwicHJvZ3Jlc3NCYXIiLCJlcXVhbGl6ZXJOb2RlIiwiZXF1YWxpemVyQmFuZHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwidHJhY2tzIiwicGxheWVyIiwiZXF1YWxpemVyIiwidm9sdW1lIiwic2V0Vm9sdW1lIiwidmFsdWUiLCJpY29uIiwiY2hpbGRyZW4iLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJhZGQiLCJ2b2x1bWVTbGlkZXIiLCJvbmNoYW5nZSIsIm9ubW92ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwibXV0ZWQiLCJ1bm11dGUiLCJtdXRlIiwib253aGVlbEhhbmRsZXIiLCJwcmV2ZW50RGVmYXVsdCIsIm5ld1ZhbHVlIiwiTWF0aCIsInNpZ24iLCJ3aGVlbERlbHRhWSIsInNldFZhbHVlIiwicHJvZ3Jlc3NTbGlkZXIiLCJoYW5kbGUiLCJidWZmZXIiLCJyZXdpbmQiLCJ1cGRhdGVCdWZmZXIiLCJhdWRpbyIsInRhcmdldCIsImJ1ZmZlcmVkIiwiYnVmZlJhdGlvIiwibGVuZ3RoIiwiZW5kIiwiZHVyYXRpb24iLCJzZXRCdWZmZXIiLCJvbiIsInJhdGlvIiwiY3VycmVudFRpbWUiLCJpc1BsYXlpbmciLCJwbGF5IiwicGF1c2UiLCJwbGF5TmV4dCIsInBsYXlQcmV2IiwiZm9yRWFjaCIsImJhbmQiLCJpIiwiYmFuZEZpbGxlZCIsImZpbHRlclZhbHVlIiwiZ2V0RXF1YWxpemVyRmlsdGVyR2FpbiIsImJhbmRTbGlkZXIiLCJ2ZXJ0aWNhbCIsIm1pbiIsIm1heCIsImNoYW5nZUVxdWFsaXplckZpbHRlckdhaW4iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFDQTs7OztBQUNB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QXVkaW9QbGF5ZXInO1xuaW1wb3J0IFBsYXlsaXN0IGZyb20gJy4vUGxheWxpc3QnO1xuaW1wb3J0IERPTUJ1aWRsZXIgZnJvbSAnLi91dGlscy9ET01CdWlsZGVyJztcbmltcG9ydCBSYW5nZVNsaWRlciBmcm9tICcuL3V0aWxzL1JhbmdlU2xpZGVyJztcblxuY29uc3QgcGxheWVyTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyXCIpO1xuY29uc3QgcGxheUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9wbGF5Jyk7XG5jb25zdCBwbGF5TmV4dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9uZXh0Jyk7XG5jb25zdCBwbGF5UHJldkJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9wcmV2Jyk7XG5cbmNvbnN0IHZvbHVtZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52b2x1bWVfX2J0bicpO1xuY29uc3Qgdm9sdW1lU2xpZGVyTm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52b2x1bWVfX3NsaWRlcicpO1xuXG5jb25zdCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmVzc19fYmFyJyk7XG5cbmNvbnN0IGVxdWFsaXplck5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdlcXVhbGl6ZXInKTtcbmNvbnN0IGVxdWFsaXplckJhbmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmVxdWFsaXplci1iYW5kX19zbGlkZXInKTtcblxuY29uc3QgdHJhY2tzID0gW1xuICAgICdodHRwOi8vZnJlc2hseS1ncm91bmQuY29tL2RhdGEvYXVkaW8vbXBjLzIwMDkwMjA3JTIwLSUyMExvdmVybWFuLm1wMycsXG4gICAgJy4vLi4vbWVkaWEvMDIgLSBOZWVkbGVzLm1wMycsXG4gICAgJy4vLi4vbWVkaWEvMDMgLSBEZWVyIERhbmNlLm1wMycsXG4gICAgJy4vLi4vbWVkaWEvMDQgLSBKZXQgUGlsb3QubXAzJyxcbiAgICAnLi8uLi9tZWRpYS8wNSAtIFgubXAzJyxcbiAgICAnLi8uLi9tZWRpYS8wNiAtIENob3AgU3VleSEubXAzJyxcbl07XG5cbmNvbnN0IHBsYXllciA9IG5ldyBBdWRpb1BsYXllcih0cmFja3MsIHsgZXF1YWxpemVyOiB0cnVlIH0pO1xucGxheWVyLnZvbHVtZSA9IDAuNTtcblxuLy8gVm9sdW1lIHNldHRpbmdzXG5jb25zdCBzZXRWb2x1bWUgPSAodmFsdWUpID0+IHtcbiAgICBjb25zdCBpY29uID0gdm9sdW1lQnRuLmNoaWxkcmVuWzBdO1xuICAgIGlmKHZhbHVlID09PSAwKSB7XG4gICAgICAgIGljb24uY2xhc3NMaXN0LnJlbW92ZSgndm9sdW1lX19pY29uX2hhbGYnKTtcbiAgICAgICAgaWNvbi5jbGFzc0xpc3QuYWRkKCd2b2x1bWVfX2ljb25fbXV0ZScpO1xuICAgIH1cbiAgICBpZih2YWx1ZSA+IDAgJiYgdmFsdWUgPD0gMC41KSB7XG4gICAgICAgIGljb24uY2xhc3NMaXN0LnJlbW92ZSgndm9sdW1lX19pY29uX211dGUnKTtcbiAgICAgICAgaWNvbi5jbGFzc0xpc3QuYWRkKCd2b2x1bWVfX2ljb25faGFsZicpO1xuICAgIH1cbiAgICBpZih2YWx1ZSA+IDAuNSkge1xuICAgICAgICBpY29uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZvbHVtZV9faWNvbl9tdXRlJyk7XG4gICAgICAgIGljb24uY2xhc3NMaXN0LnJlbW92ZSgndm9sdW1lX19pY29uX2hhbGYnKTtcbiAgICB9XG4gICAgcGxheWVyLnZvbHVtZSA9IHZhbHVlO1xufTtcblxuY29uc3Qgdm9sdW1lU2xpZGVyID0gbmV3IFJhbmdlU2xpZGVyKHZvbHVtZVNsaWRlck5vZGUsIHtcbiAgICB2YWx1ZTogcGxheWVyLnZvbHVtZSxcbiAgICBvbmNoYW5nZTogc2V0Vm9sdW1lLFxuICAgIG9ubW92ZTogc2V0Vm9sdW1lXG59KTtcblxudm9sdW1lQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBjb25zdCBpY29uID0gdm9sdW1lQnRuLmNoaWxkcmVuWzBdO1xuICAgIGlmKHBsYXllci5tdXRlZCkge1xuICAgICAgICBwbGF5ZXIudW5tdXRlKCk7XG4gICAgICAgIGljb24uY2xhc3NMaXN0LnJlbW92ZSgndm9sdW1lX19pY29uX211dGUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBwbGF5ZXIubXV0ZSgpO1xuICAgICAgICBpY29uLmNsYXNzTGlzdC5hZGQoJ3ZvbHVtZV9faWNvbl9tdXRlJyk7XG4gICAgfVxufSk7XG5cbi8vIE1vdXNlU2Nyb2xsIGV2ZW50IGhhbmRsZXIgdG8gY29udHJvbCB0aGUgdm9sdW1lXG5jb25zdCBvbndoZWVsSGFuZGxlciA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gcGxheWVyLnZvbHVtZSArIE1hdGguc2lnbihlLndoZWVsRGVsdGFZKSAqIDAuMDU7XG4gICAgdm9sdW1lU2xpZGVyLnNldFZhbHVlKG5ld1ZhbHVlKTtcbiAgICBwbGF5ZXIudm9sdW1lID0gbmV3VmFsdWU7XG59O1xuXG52b2x1bWVCdG4uYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCBvbndoZWVsSGFuZGxlcik7XG52b2x1bWVTbGlkZXJOb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgb253aGVlbEhhbmRsZXIpO1xuXG4vLyBQcm9ncmVzcyBzZXR0aW5nc1xuY29uc3QgcHJvZ3Jlc3NTbGlkZXIgPSBuZXcgUmFuZ2VTbGlkZXIocHJvZ3Jlc3NCYXIsIHtcbiAgICBoYW5kbGU6IGZhbHNlLFxuICAgIGJ1ZmZlcjogdHJ1ZSxcbiAgICBvbmNoYW5nZTogKHZhbHVlKSA9PiB7XG4gICAgICAgIHBsYXllci5yZXdpbmQodmFsdWUpO1xuICAgIH1cbn0pO1xuXG5jb25zdCB1cGRhdGVCdWZmZXIgPSAoZSkgPT4ge1xuICAgIGNvbnN0IGF1ZGlvID0gZS50YXJnZXQ7XG4gICAgY29uc3QgYnVmZmVyZWQgPSBhdWRpby5idWZmZXJlZDtcbiAgICBjb25zdCBidWZmUmF0aW8gPSBidWZmZXJlZC5sZW5ndGggPyBidWZmZXJlZC5lbmQoYnVmZmVyZWQubGVuZ3RoIC0gMSkgLyBhdWRpby5kdXJhdGlvbiA6IDA7XG4gICAgXG4gICAgcHJvZ3Jlc3NTbGlkZXIuc2V0QnVmZmVyKGJ1ZmZSYXRpbyk7XG59XG5cbnBsYXllci5vbigndHJhY2s6cHJvZ3Jlc3MnLCB1cGRhdGVCdWZmZXIpO1xucGxheWVyLm9uKCd0cmFjazpsb2FkZWRkYXRhJywgdXBkYXRlQnVmZmVyKTtcbnBsYXllci5vbigndHJhY2s6Y2FucGxheXRocm91Z2gnLCB1cGRhdGVCdWZmZXIpO1xucGxheWVyLm9uKCd0cmFjazp0aW1ldXBkYXRlJywgKGUpID0+IHtcbiAgICBjb25zdCBhdWRpbyA9IGUudGFyZ2V0O1xuICAgIGNvbnN0IHJhdGlvID0gYXVkaW8uY3VycmVudFRpbWUgLyBhdWRpby5kdXJhdGlvbjtcbiAgICBwcm9ncmVzc1NsaWRlci5zZXRWYWx1ZShyYXRpbyk7XG59KTtcblxuXG4vLyBQbGF5ZXIgY29udHJvbHMgc2V0dGluZ3NcbnBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgaWYoIXBsYXllci5pc1BsYXlpbmcpIHtcbiAgICAgICAgcGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udHJvbHNfX2J0bl9wYXVzZScpO1xuICAgICAgICBwbGF5ZXIucGxheSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYXlCdG4uY2xhc3NMaXN0LnJlbW92ZSgncGxheWVyLWNvbnRyb2xzX19idG5fcGF1c2UnKTtcbiAgICAgICAgcGxheWVyLnBhdXNlKCk7XG4gICAgfVxufSk7XG5cbnBsYXlOZXh0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBwbGF5QnRuLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250cm9sc19fYnRuX3BhdXNlJyk7XG4gICAgcGxheWVyLnBsYXlOZXh0KCk7XG59KTtcblxucGxheVByZXZCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIHBsYXlCdG4uY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRyb2xzX19idG5fcGF1c2UnKTtcbiAgICBwbGF5ZXIucGxheVByZXYoKTtcbn0pO1xuXG4vL0VxdWFsaXplciBzZXR0aW5nc1xuZXF1YWxpemVyQmFuZHMuZm9yRWFjaCgoYmFuZCwgaSkgPT4ge1xuICAgIGNvbnN0IGJhbmRGaWxsZWQgPSBiYW5kLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXItdmVydF9fZmlsbGVkJyk7XG4gICAgY29uc3QgZmlsdGVyVmFsdWUgPSBwbGF5ZXIuZ2V0RXF1YWxpemVyRmlsdGVyR2FpbihpKTtcbiAgICBjb25zdCBiYW5kU2xpZGVyID0gbmV3IFJhbmdlU2xpZGVyKGJhbmQsIHtcbiAgICAgICAgdmVydGljYWw6IHRydWUsXG4gICAgICAgIG1pbjogLTEyLFxuICAgICAgICBtYXg6IDEyLFxuICAgICAgICB2YWx1ZTogZmlsdGVyVmFsdWUsXG4gICAgICAgIG9uY2hhbmdlOiAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHBsYXllci5jaGFuZ2VFcXVhbGl6ZXJGaWx0ZXJHYWluKGksIHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25tb3ZlOiAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHBsYXllci5jaGFuZ2VFcXVhbGl6ZXJGaWx0ZXJHYWluKGksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iXX0=
},{"./AudioPlayer":1,"./Playlist":3,"./utils/DOMBuilder":6,"./utils/RangeSlider":9}],6:[function(require,module,exports){
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
        value: function createElement(tagName, _ref) {
            var attrs = _ref.attrs,
                callback = _ref.callback,
                parent = _ref.parent;

            var element = document.createElement("" + tagName);

            if (attrs) {
                DOMBuilder.insertAttributes(element, attrs);
            }

            if (callback) {
                callback(element);
            }

            if (parent instanceof HTMLElement) {
                parent.appendChild(element);
            }

            return element;
        }
    }, {
        key: "insertAttributes",
        value: function insertAttributes(element, attrs) {
            if (element instanceof HTMLElement) {
                for (var prop in attrs) {
                    if (attrs.hasOwnProperty(prop)) {
                        element.setAttribute(prop, attrs[prop]);
                    }
                }
            }
        }
    }]);

    return DOMBuilder;
}();

exports.default = DOMBuilder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRPTUJ1aWxkZXIuanMiXSwibmFtZXMiOlsiRE9NQnVpbGRlciIsIkVycm9yIiwidGFnTmFtZSIsImF0dHJzIiwiY2FsbGJhY2siLCJwYXJlbnQiLCJlbGVtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaW5zZXJ0QXR0cmlidXRlcyIsIkhUTUxFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJwcm9wIiwiaGFzT3duUHJvcGVydHkiLCJzZXRBdHRyaWJ1dGUiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0lBRXFCQSxVO0FBQ2pCLDBCQUFjO0FBQUE7O0FBQ1YsY0FBTSxJQUFJQyxLQUFKLENBQVUsd0RBQVYsQ0FBTjtBQUNIOzs7O3NDQUVvQkMsTyxRQUFzQztBQUFBLGdCQUEzQkMsS0FBMkIsUUFBM0JBLEtBQTJCO0FBQUEsZ0JBQXBCQyxRQUFvQixRQUFwQkEsUUFBb0I7QUFBQSxnQkFBVkMsTUFBVSxRQUFWQSxNQUFVOztBQUN2RCxnQkFBTUMsVUFBVUMsU0FBU0MsYUFBVCxNQUEwQk4sT0FBMUIsQ0FBaEI7O0FBRUEsZ0JBQUdDLEtBQUgsRUFBVTtBQUNOSCwyQkFBV1MsZ0JBQVgsQ0FBNEJILE9BQTVCLEVBQXFDSCxLQUFyQztBQUNIOztBQUVELGdCQUFHQyxRQUFILEVBQWE7QUFDVEEseUJBQVNFLE9BQVQ7QUFDSDs7QUFFRCxnQkFBR0Qsa0JBQWtCSyxXQUFyQixFQUFrQztBQUM5QkwsdUJBQU9NLFdBQVAsQ0FBbUJMLE9BQW5CO0FBQ0g7O0FBRUQsbUJBQU9BLE9BQVA7QUFDSDs7O3lDQUV1QkEsTyxFQUFTSCxLLEVBQU87QUFDcEMsZ0JBQUdHLG1CQUFtQkksV0FBdEIsRUFBa0M7QUFDOUIscUJBQUssSUFBSUUsSUFBVCxJQUFpQlQsS0FBakIsRUFBd0I7QUFDcEIsd0JBQUlBLE1BQU1VLGNBQU4sQ0FBcUJELElBQXJCLENBQUosRUFBZ0M7QUFDNUJOLGdDQUFRUSxZQUFSLENBQXFCRixJQUFyQixFQUEyQlQsTUFBTVMsSUFBTixDQUEzQjtBQUNIO0FBQ0o7QUFDSjtBQUNKOzs7Ozs7a0JBL0JnQlosVSIsImZpbGUiOiJET01CdWlsZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERPTUJ1aWxkZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgaXMgc3RhdGljIGNsYXNzLiBDcmVhdGluZyBpbnN0YW5jZXMgaXMgZm9yYmlkZGVuLicpO1xuICAgIH1cblxuICAgIHN0YXRpYyBjcmVhdGVFbGVtZW50KHRhZ05hbWUsIHsgYXR0cnMsIGNhbGxiYWNrLCBwYXJlbnQgfSkge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgJHt0YWdOYW1lfWApO1xuXG4gICAgICAgIGlmKGF0dHJzKSB7XG4gICAgICAgICAgICBET01CdWlsZGVyLmluc2VydEF0dHJpYnV0ZXMoZWxlbWVudCwgYXR0cnMpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZihjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2soZWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZihwYXJlbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGluc2VydEF0dHJpYnV0ZXMoZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgaWYoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KXtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gYXR0cnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cnMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUocHJvcCwgYXR0cnNbcHJvcF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
},{}],7:[function(require,module,exports){
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
                if (callback.toString() === cb.toString()) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50RW1taXRlci5qcyJdLCJuYW1lcyI6WyJFdmVudEVtbWl0ZXIiLCJfZXZlbnRzIiwiZXZlbnQiLCJjYiIsIkVycm9yIiwicHVzaCIsImNhbGxiYWNrcyIsImZvckVhY2giLCJjYWxsYmFjayIsImkiLCJ0b1N0cmluZyIsInNwbGljZSIsImFyZ3MiLCJzbGljZSIsImFwcGx5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQXFCQSxZO0FBQ2pCLDRCQUFjO0FBQUE7O0FBQ1YsYUFBS0MsT0FBTCxHQUFlLEVBQWY7QUFDSDs7OzsyQkFFRUMsSyxFQUFPQyxFLEVBQUk7QUFDVixnQkFBRyxPQUFPQSxFQUFQLEtBQWMsV0FBakIsRUFBOEI7QUFDMUIsc0JBQU1DLE1BQU0sc0NBQU4sQ0FBTjtBQUNIOztBQUVELGdCQUFHLE9BQU9ELEVBQVAsS0FBYyxVQUFqQixFQUE2QjtBQUN6QixzQkFBTUMsTUFBTSw2QkFBTixDQUFOO0FBQ0g7O0FBRUQsaUJBQUtILE9BQUwsQ0FBYUMsS0FBYixJQUFzQixLQUFLRCxPQUFMLENBQWFDLEtBQWIsS0FBdUIsRUFBN0M7QUFDQSxpQkFBS0QsT0FBTCxDQUFhQyxLQUFiLEVBQW9CRyxJQUFwQixDQUF5QkYsRUFBekI7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOzs7NEJBRUdELEssRUFBT0MsRSxFQUFJO0FBQ1gsZ0JBQUcsT0FBT0EsRUFBUCxLQUFjLFdBQWpCLEVBQThCO0FBQzFCLHNCQUFNQyxNQUFNLHNDQUFOLENBQU47QUFDSDs7QUFFRCxnQkFBRyxPQUFPRCxFQUFQLEtBQWMsVUFBakIsRUFBNkI7QUFDekIsc0JBQU1DLE1BQU0sNkJBQU4sQ0FBTjtBQUNIOztBQUVELGdCQUFHLE9BQU8sS0FBS0gsT0FBTCxDQUFhQyxLQUFiLENBQVAsS0FBK0IsV0FBbEMsRUFBK0M7QUFDM0Msc0JBQU1FLE1BQU0saUJBQU4sQ0FBTjtBQUNIOztBQUVELGdCQUFNRSxZQUFZLEtBQUtMLE9BQUwsQ0FBYUMsS0FBYixDQUFsQjtBQUNBSSxzQkFBVUMsT0FBVixDQUFrQixVQUFDQyxRQUFELEVBQVdDLENBQVgsRUFBa0I7QUFDaEMsb0JBQUdELFNBQVNFLFFBQVQsT0FBd0JQLEdBQUdPLFFBQUgsRUFBM0IsRUFBMEM7QUFDdENKLDhCQUFVSyxNQUFWLENBQWlCRixDQUFqQixFQUFvQixDQUFwQjtBQUNIO0FBQ0osYUFKRDs7QUFNQSxtQkFBTyxJQUFQO0FBQ0g7Ozs2QkFFSVAsSyxFQUFnQjtBQUFBOztBQUFBLDhDQUFOVSxJQUFNO0FBQU5BLG9CQUFNO0FBQUE7O0FBQ2pCLGdCQUFHLE9BQU9WLEtBQVAsS0FBaUIsV0FBcEIsRUFBaUM7QUFDN0Isc0JBQU1FLE1BQU0sbUNBQU4sQ0FBTjtBQUNIOztBQUVELGdCQUFJRSxZQUFZLEtBQUtMLE9BQUwsQ0FBYUMsS0FBYixDQUFoQjtBQUNBLGdCQUFHLE9BQU9JLFNBQVAsS0FBcUIsV0FBeEIsRUFBcUM7QUFDakNBLDRCQUFZQSxVQUFVTyxLQUFWLEVBQVo7O0FBRUFQLDBCQUFVQyxPQUFWLENBQWtCLFVBQUNKLEVBQUQsRUFBS00sQ0FBTCxFQUFXO0FBQ3pCTix1QkFBR1csS0FBSCxRQUFlRixJQUFmO0FBQ0gsaUJBRkQ7QUFHSDs7QUFFRCxtQkFBTyxJQUFQO0FBQ0g7Ozs7OztrQkExRGdCWixZO0FBMkRwQiIsImZpbGUiOiJFdmVudEVtbWl0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudEVtbWl0ZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9ldmVudHMgPSBbXTtcbiAgICB9XG5cbiAgICBvbihldmVudCwgY2IpIHtcbiAgICAgICAgaWYodHlwZW9mIGNiID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1lvdSBtdXN0IHByb3ZpZGUgYSBjYWxsYmFjayBmdW5jdGlvbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignQ2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9ldmVudHNbZXZlbnRdID0gdGhpcy5fZXZlbnRzW2V2ZW50XSB8fCBbXTtcbiAgICAgICAgdGhpcy5fZXZlbnRzW2V2ZW50XS5wdXNoKGNiKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvZmYoZXZlbnQsIGNiKSB7XG4gICAgICAgIGlmKHR5cGVvZiBjYiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdZb3UgbXVzdCBwcm92aWRlIGEgY2FsbGJhY2sgZnVuY3Rpb24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ0NhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodHlwZW9mIHRoaXMuX2V2ZW50c1tldmVudF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignRXZlbnQgbm90IGZvdW5kJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLl9ldmVudHNbZXZlbnRdO1xuICAgICAgICBjYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2ssIGkgKSA9PiB7XG4gICAgICAgICAgICBpZihjYWxsYmFjay50b1N0cmluZygpID09PSBjYi50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZW1pdChldmVudCwgLi4uYXJncykge1xuICAgICAgICBpZih0eXBlb2YgZXZlbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignWW91IG11c3QgcHJvdmlkZSBhbiBldmVudCB0byBlbWl0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2FsbGJhY2tzID0gdGhpcy5fZXZlbnRzW2V2ZW50XTtcbiAgICAgICAgaWYodHlwZW9mIGNhbGxiYWNrcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgpO1xuXG4gICAgICAgICAgICBjYWxsYmFja3MuZm9yRWFjaCgoY2IsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBjYi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTtcbiJdfQ==
},{}],8:[function(require,module,exports){
'use strict';

if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function value(target, firstSource) {
      'use strict';

      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9iamVjdEFzc2lnbi5qcyJdLCJuYW1lcyI6WyJPYmplY3QiLCJhc3NpZ24iLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsInZhbHVlIiwidGFyZ2V0IiwiZmlyc3RTb3VyY2UiLCJ1bmRlZmluZWQiLCJUeXBlRXJyb3IiLCJ0byIsImkiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJuZXh0U291cmNlIiwia2V5c0FycmF5Iiwia2V5cyIsIm5leHRJbmRleCIsImxlbiIsIm5leHRLZXkiLCJkZXNjIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksQ0FBQ0EsT0FBT0MsTUFBWixFQUFvQjtBQUNsQkQsU0FBT0UsY0FBUCxDQUFzQkYsTUFBdEIsRUFBOEIsUUFBOUIsRUFBd0M7QUFDdENHLGdCQUFZLEtBRDBCO0FBRXRDQyxrQkFBYyxJQUZ3QjtBQUd0Q0MsY0FBVSxJQUg0QjtBQUl0Q0MsV0FBTyxlQUFTQyxNQUFULEVBQWlCQyxXQUFqQixFQUE4QjtBQUNuQzs7QUFDQSxVQUFJRCxXQUFXRSxTQUFYLElBQXdCRixXQUFXLElBQXZDLEVBQTZDO0FBQzNDLGNBQU0sSUFBSUcsU0FBSixDQUFjLHlDQUFkLENBQU47QUFDRDs7QUFFRCxVQUFJQyxLQUFLWCxPQUFPTyxNQUFQLENBQVQ7QUFDQSxXQUFLLElBQUlLLElBQUksQ0FBYixFQUFnQkEsSUFBSUMsVUFBVUMsTUFBOUIsRUFBc0NGLEdBQXRDLEVBQTJDO0FBQ3pDLFlBQUlHLGFBQWFGLFVBQVVELENBQVYsQ0FBakI7QUFDQSxZQUFJRyxlQUFlTixTQUFmLElBQTRCTSxlQUFlLElBQS9DLEVBQXFEO0FBQ25EO0FBQ0Q7O0FBRUQsWUFBSUMsWUFBWWhCLE9BQU9pQixJQUFQLENBQVlqQixPQUFPZSxVQUFQLENBQVosQ0FBaEI7QUFDQSxhQUFLLElBQUlHLFlBQVksQ0FBaEIsRUFBbUJDLE1BQU1ILFVBQVVGLE1BQXhDLEVBQWdESSxZQUFZQyxHQUE1RCxFQUFpRUQsV0FBakUsRUFBOEU7QUFDNUUsY0FBSUUsVUFBVUosVUFBVUUsU0FBVixDQUFkO0FBQ0EsY0FBSUcsT0FBT3JCLE9BQU9zQix3QkFBUCxDQUFnQ1AsVUFBaEMsRUFBNENLLE9BQTVDLENBQVg7QUFDQSxjQUFJQyxTQUFTWixTQUFULElBQXNCWSxLQUFLbEIsVUFBL0IsRUFBMkM7QUFDekNRLGVBQUdTLE9BQUgsSUFBY0wsV0FBV0ssT0FBWCxDQUFkO0FBQ0Q7QUFDRjtBQUNGO0FBQ0QsYUFBT1QsRUFBUDtBQUNEO0FBM0JxQyxHQUF4QztBQTZCRCIsImZpbGUiOiJPYmplY3RBc3NpZ24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpZiAoIU9iamVjdC5hc3NpZ24pIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2Fzc2lnbicsIHtcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgdmFsdWU6IGZ1bmN0aW9uKHRhcmdldCwgZmlyc3RTb3VyY2UpIHtcbiAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgZmlyc3QgYXJndW1lbnQgdG8gb2JqZWN0Jyk7XG4gICAgICB9XG5cbiAgICAgIHZhciB0byA9IE9iamVjdCh0YXJnZXQpO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5leHRTb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGlmIChuZXh0U291cmNlID09PSB1bmRlZmluZWQgfHwgbmV4dFNvdXJjZSA9PT0gbnVsbCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGtleXNBcnJheSA9IE9iamVjdC5rZXlzKE9iamVjdChuZXh0U291cmNlKSk7XG4gICAgICAgIGZvciAodmFyIG5leHRJbmRleCA9IDAsIGxlbiA9IGtleXNBcnJheS5sZW5ndGg7IG5leHRJbmRleCA8IGxlbjsgbmV4dEluZGV4KyspIHtcbiAgICAgICAgICB2YXIgbmV4dEtleSA9IGtleXNBcnJheVtuZXh0SW5kZXhdO1xuICAgICAgICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihuZXh0U291cmNlLCBuZXh0S2V5KTtcbiAgICAgICAgICBpZiAoZGVzYyAhPT0gdW5kZWZpbmVkICYmIGRlc2MuZW51bWVyYWJsZSkge1xuICAgICAgICAgICAgdG9bbmV4dEtleV0gPSBuZXh0U291cmNlW25leHRLZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRvO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=
},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DOMBuilder = require('./DOMBuilder');

var _DOMBuilder2 = _interopRequireDefault(_DOMBuilder);

var _ = require('./');

require('./ObjectAssign');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaults = {
    min: 0,
    max: 1,
    value: 0,
    vertical: false,
    handle: true,
    buffer: false
};

var RangeSlider = function () {
    function RangeSlider(node) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, RangeSlider);

        this.node = node;
        this.options = Object.assign(Object.assign({}, defaults), options);

        this.track = null;
        this.fill = null;
        this.handle = null;
        this.buffer = null;

        this.vertical = this.options.vertical;

        this.min = this.options.min;
        this.max = this.options.max;
        this.length = Math.abs(this.min) + Math.abs(this.max);
        this.value = this.options.value;
        this.ratio = null;

        this.draggable = false;
        this.onmove = this.options.onmove;
        this.onchange = this.options.onchange;
        //chrome bug with mousemove
        this.node.ondragstart = function () {
            return false;
        };

        this._createDOM();
        this._bindEvents();
        this.setValue(this.value);
    }

    _createClass(RangeSlider, [{
        key: 'setValue',
        value: function setValue(value) {
            var validValue = value > this.max ? this.max : value < this.min ? this.min : value;
            this.value = validValue;
            this.ratio = (this.value - this.min) / this.length;

            this._updateFill();

            return this;
        }
    }, {
        key: 'setValueByRatio',
        value: function setValueByRatio(ratio) {
            var validRatio = ratio > 1 ? 1 : ratio < 0 ? 0 : ratio;
            this.ratio = validRatio;
            this.value = this.min + this.ratio * this.length;

            this._updateFill();

            return this;
        }
    }, {
        key: 'setBuffer',
        value: function setBuffer(ratio) {
            if (this.options.buffer) {
                var validRatio = ratio > 1 ? 1 : ratio < 0 ? 0 : ratio;

                if (this.vertical) {
                    this.buffer.style.height = validRatio * 100 + '%';
                } else {
                    this.buffer.style.width = validRatio * 100 + '%';
                }
            }

            return this;
        }
    }, {
        key: '_updateFill',
        value: function _updateFill() {
            if (this.vertical) {
                this.fill.style.height = this.ratio * 100 + '%';
            } else {
                this.fill.style.width = this.ratio * 100 + '%';
            }

            return this;
        }
    }, {
        key: '_updateValue',
        value: function _updateValue(e) {
            var pos = this.node.getBoundingClientRect();

            var ratio = null;
            if (this.vertical) {
                ratio = 1 - (e.clientY - pos.top) / this.node.offsetHeight;
            } else {
                ratio = (e.clientX - pos.left) / this.node.offsetWidth;
            }

            this.setValueByRatio(ratio);

            return this;
        }
    }, {
        key: '_bindEvents',
        value: function _bindEvents() {
            var _this = this;

            this.node.addEventListener('mousedown', function (e) {
                if (e.which === 1) {
                    //left mouse button
                    _this.draggable = true;
                    _this._updateValue(e);
                }
            });

            document.addEventListener('mousemove', function (e) {
                if (_this.draggable) {
                    _this._updateValue(e);

                    if ((0, _.isFunction)(_this.onmove)) {
                        _this.onmove(_this.value);
                    }
                }
            });

            document.addEventListener('mouseup', function (e) {
                if (_this.draggable) {
                    _this.draggable = false;
                    _this._updateValue(e);

                    if ((0, _.isFunction)(_this.onchange)) {
                        _this.onchange(_this.value);
                    }
                }
            });
        }
    }, {
        key: '_createDOM',
        value: function _createDOM() {
            var mainClassName = this.vertical ? 'slider-vert' : 'slider-horiz';
            this.node.classList.add(mainClassName);
            this.track = _DOMBuilder2.default.createElement('div', {
                attrs: {
                    class: mainClassName + '__track'
                },
                parent: this.node
            });
            this.fill = _DOMBuilder2.default.createElement('div', {
                attrs: {
                    class: mainClassName + '__filled'
                },
                parent: this.track
            });
            if (this.options.handle) {
                this.handle = _DOMBuilder2.default.createElement('div', {
                    attrs: {
                        class: mainClassName + '__handle'
                    },
                    parent: this.fill
                });
            }
            if (this.options.buffer) {
                this.buffer = _DOMBuilder2.default.createElement('div', {
                    attrs: {
                        class: mainClassName + '__buffer'
                    },
                    parent: this.track
                });
            }
        }
    }]);

    return RangeSlider;
}();

exports.default = RangeSlider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJhbmdlU2xpZGVyLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRzIiwibWluIiwibWF4IiwidmFsdWUiLCJ2ZXJ0aWNhbCIsImhhbmRsZSIsImJ1ZmZlciIsIlJhbmdlU2xpZGVyIiwibm9kZSIsIm9wdGlvbnMiLCJPYmplY3QiLCJhc3NpZ24iLCJ0cmFjayIsImZpbGwiLCJsZW5ndGgiLCJNYXRoIiwiYWJzIiwicmF0aW8iLCJkcmFnZ2FibGUiLCJvbm1vdmUiLCJvbmNoYW5nZSIsIm9uZHJhZ3N0YXJ0IiwiX2NyZWF0ZURPTSIsIl9iaW5kRXZlbnRzIiwic2V0VmFsdWUiLCJ2YWxpZFZhbHVlIiwiX3VwZGF0ZUZpbGwiLCJ2YWxpZFJhdGlvIiwic3R5bGUiLCJoZWlnaHQiLCJ3aWR0aCIsImUiLCJwb3MiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJjbGllbnRZIiwidG9wIiwib2Zmc2V0SGVpZ2h0IiwiY2xpZW50WCIsImxlZnQiLCJvZmZzZXRXaWR0aCIsInNldFZhbHVlQnlSYXRpbyIsImFkZEV2ZW50TGlzdGVuZXIiLCJ3aGljaCIsIl91cGRhdGVWYWx1ZSIsImRvY3VtZW50IiwibWFpbkNsYXNzTmFtZSIsImNsYXNzTGlzdCIsImFkZCIsImNyZWF0ZUVsZW1lbnQiLCJhdHRycyIsImNsYXNzIiwicGFyZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFdBQVc7QUFDYkMsU0FBSyxDQURRO0FBRWJDLFNBQUssQ0FGUTtBQUdiQyxXQUFPLENBSE07QUFJYkMsY0FBVSxLQUpHO0FBS2JDLFlBQVEsSUFMSztBQU1iQyxZQUFRO0FBTkssQ0FBakI7O0lBU3FCQyxXO0FBQ2pCLHlCQUFZQyxJQUFaLEVBQThCO0FBQUEsWUFBWkMsT0FBWSx1RUFBSixFQUFJOztBQUFBOztBQUMxQixhQUFLRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxhQUFLQyxPQUFMLEdBQWVDLE9BQU9DLE1BQVAsQ0FBY0QsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JYLFFBQWxCLENBQWQsRUFBMkNTLE9BQTNDLENBQWY7O0FBRUEsYUFBS0csS0FBTCxHQUFhLElBQWI7QUFDQSxhQUFLQyxJQUFMLEdBQVksSUFBWjtBQUNBLGFBQUtSLE1BQUwsR0FBYyxJQUFkO0FBQ0EsYUFBS0MsTUFBTCxHQUFjLElBQWQ7O0FBRUEsYUFBS0YsUUFBTCxHQUFnQixLQUFLSyxPQUFMLENBQWFMLFFBQTdCOztBQUVBLGFBQUtILEdBQUwsR0FBVyxLQUFLUSxPQUFMLENBQWFSLEdBQXhCO0FBQ0EsYUFBS0MsR0FBTCxHQUFXLEtBQUtPLE9BQUwsQ0FBYVAsR0FBeEI7QUFDQSxhQUFLWSxNQUFMLEdBQWNDLEtBQUtDLEdBQUwsQ0FBUyxLQUFLZixHQUFkLElBQXFCYyxLQUFLQyxHQUFMLENBQVMsS0FBS2QsR0FBZCxDQUFuQztBQUNBLGFBQUtDLEtBQUwsR0FBYSxLQUFLTSxPQUFMLENBQWFOLEtBQTFCO0FBQ0EsYUFBS2MsS0FBTCxHQUFhLElBQWI7O0FBRUEsYUFBS0MsU0FBTCxHQUFpQixLQUFqQjtBQUNBLGFBQUtDLE1BQUwsR0FBYyxLQUFLVixPQUFMLENBQWFVLE1BQTNCO0FBQ0EsYUFBS0MsUUFBTCxHQUFnQixLQUFLWCxPQUFMLENBQWFXLFFBQTdCO0FBQ0E7QUFDQSxhQUFLWixJQUFMLENBQVVhLFdBQVYsR0FBd0I7QUFBQSxtQkFBTSxLQUFOO0FBQUEsU0FBeEI7O0FBRUEsYUFBS0MsVUFBTDtBQUNBLGFBQUtDLFdBQUw7QUFDQSxhQUFLQyxRQUFMLENBQWMsS0FBS3JCLEtBQW5CO0FBQ0g7Ozs7aUNBRVFBLEssRUFBTztBQUNaLGdCQUFNc0IsYUFBYXRCLFFBQVEsS0FBS0QsR0FBYixHQUFtQixLQUFLQSxHQUF4QixHQUErQkMsUUFBUSxLQUFLRixHQUFiLEdBQW1CLEtBQUtBLEdBQXhCLEdBQThCRSxLQUFoRjtBQUNBLGlCQUFLQSxLQUFMLEdBQWFzQixVQUFiO0FBQ0EsaUJBQUtSLEtBQUwsR0FBYSxDQUFDLEtBQUtkLEtBQUwsR0FBYSxLQUFLRixHQUFuQixJQUEwQixLQUFLYSxNQUE1Qzs7QUFFQSxpQkFBS1ksV0FBTDs7QUFFQSxtQkFBTyxJQUFQO0FBQ0g7Ozt3Q0FFZVQsSyxFQUFPO0FBQ25CLGdCQUFNVSxhQUFhVixRQUFRLENBQVIsR0FBWSxDQUFaLEdBQWlCQSxRQUFRLENBQVIsR0FBWSxDQUFaLEdBQWdCQSxLQUFwRDtBQUNBLGlCQUFLQSxLQUFMLEdBQWFVLFVBQWI7QUFDQSxpQkFBS3hCLEtBQUwsR0FBYSxLQUFLRixHQUFMLEdBQVksS0FBS2dCLEtBQUwsR0FBYSxLQUFLSCxNQUEzQzs7QUFFQSxpQkFBS1ksV0FBTDs7QUFFQSxtQkFBTyxJQUFQO0FBQ0g7OztrQ0FFU1QsSyxFQUFPO0FBQ2IsZ0JBQUcsS0FBS1IsT0FBTCxDQUFhSCxNQUFoQixFQUF3QjtBQUNwQixvQkFBTXFCLGFBQWFWLFFBQVEsQ0FBUixHQUFZLENBQVosR0FBaUJBLFFBQVEsQ0FBUixHQUFZLENBQVosR0FBZ0JBLEtBQXBEOztBQUVBLG9CQUFHLEtBQUtiLFFBQVIsRUFBa0I7QUFDZCx5QkFBS0UsTUFBTCxDQUFZc0IsS0FBWixDQUFrQkMsTUFBbEIsR0FBOEJGLGFBQWEsR0FBM0M7QUFDSCxpQkFGRCxNQUVPO0FBQ0gseUJBQUtyQixNQUFMLENBQVlzQixLQUFaLENBQWtCRSxLQUFsQixHQUE2QkgsYUFBYSxHQUExQztBQUNIO0FBQ0o7O0FBRUQsbUJBQU8sSUFBUDtBQUNIOzs7c0NBRWE7QUFDVixnQkFBRyxLQUFLdkIsUUFBUixFQUFrQjtBQUNkLHFCQUFLUyxJQUFMLENBQVVlLEtBQVYsQ0FBZ0JDLE1BQWhCLEdBQTRCLEtBQUtaLEtBQUwsR0FBYSxHQUF6QztBQUNILGFBRkQsTUFFTztBQUNILHFCQUFLSixJQUFMLENBQVVlLEtBQVYsQ0FBZ0JFLEtBQWhCLEdBQTJCLEtBQUtiLEtBQUwsR0FBYSxHQUF4QztBQUNIOztBQUVELG1CQUFPLElBQVA7QUFDSDs7O3FDQUVZYyxDLEVBQUc7QUFDWixnQkFBTUMsTUFBTSxLQUFLeEIsSUFBTCxDQUFVeUIscUJBQVYsRUFBWjs7QUFFQSxnQkFBSWhCLFFBQVEsSUFBWjtBQUNBLGdCQUFHLEtBQUtiLFFBQVIsRUFBa0I7QUFDZGEsd0JBQVEsSUFBSyxDQUFDYyxFQUFFRyxPQUFGLEdBQVlGLElBQUlHLEdBQWpCLElBQXdCLEtBQUszQixJQUFMLENBQVU0QixZQUEvQztBQUNILGFBRkQsTUFFTztBQUNIbkIsd0JBQVEsQ0FBQ2MsRUFBRU0sT0FBRixHQUFZTCxJQUFJTSxJQUFqQixJQUF5QixLQUFLOUIsSUFBTCxDQUFVK0IsV0FBM0M7QUFDSDs7QUFFRCxpQkFBS0MsZUFBTCxDQUFxQnZCLEtBQXJCOztBQUVBLG1CQUFPLElBQVA7QUFDSDs7O3NDQUVhO0FBQUE7O0FBQ1YsaUJBQUtULElBQUwsQ0FBVWlDLGdCQUFWLENBQTJCLFdBQTNCLEVBQXdDLFVBQUNWLENBQUQsRUFBTztBQUMzQyxvQkFBR0EsRUFBRVcsS0FBRixLQUFZLENBQWYsRUFBa0I7QUFBRTtBQUNoQiwwQkFBS3hCLFNBQUwsR0FBaUIsSUFBakI7QUFDQSwwQkFBS3lCLFlBQUwsQ0FBa0JaLENBQWxCO0FBQ0g7QUFDSixhQUxEOztBQU9BYSxxQkFBU0gsZ0JBQVQsQ0FBMEIsV0FBMUIsRUFBdUMsVUFBQ1YsQ0FBRCxFQUFPO0FBQzFDLG9CQUFHLE1BQUtiLFNBQVIsRUFBbUI7QUFDZiwwQkFBS3lCLFlBQUwsQ0FBa0JaLENBQWxCOztBQUVBLHdCQUFHLGtCQUFXLE1BQUtaLE1BQWhCLENBQUgsRUFBNEI7QUFDeEIsOEJBQUtBLE1BQUwsQ0FBWSxNQUFLaEIsS0FBakI7QUFDSDtBQUNKO0FBQ0osYUFSRDs7QUFVQXlDLHFCQUFTSCxnQkFBVCxDQUEwQixTQUExQixFQUFxQyxVQUFDVixDQUFELEVBQU87QUFDeEMsb0JBQUcsTUFBS2IsU0FBUixFQUFtQjtBQUNmLDBCQUFLQSxTQUFMLEdBQWlCLEtBQWpCO0FBQ0EsMEJBQUt5QixZQUFMLENBQWtCWixDQUFsQjs7QUFFQSx3QkFBRyxrQkFBVyxNQUFLWCxRQUFoQixDQUFILEVBQThCO0FBQzFCLDhCQUFLQSxRQUFMLENBQWMsTUFBS2pCLEtBQW5CO0FBQ0g7QUFDSjtBQUNKLGFBVEQ7QUFVSDs7O3FDQUVZO0FBQ1QsZ0JBQU0wQyxnQkFBZ0IsS0FBS3pDLFFBQUwsR0FBZ0IsYUFBaEIsR0FBZ0MsY0FBdEQ7QUFDQSxpQkFBS0ksSUFBTCxDQUFVc0MsU0FBVixDQUFvQkMsR0FBcEIsQ0FBd0JGLGFBQXhCO0FBQ0EsaUJBQUtqQyxLQUFMLEdBQWEscUJBQVdvQyxhQUFYLENBQXlCLEtBQXpCLEVBQWdDO0FBQ3pDQyx1QkFBTztBQUNIQywyQkFBVUwsYUFBVjtBQURHLGlCQURrQztBQUl6Q00sd0JBQVEsS0FBSzNDO0FBSjRCLGFBQWhDLENBQWI7QUFNQSxpQkFBS0ssSUFBTCxHQUFZLHFCQUFXbUMsYUFBWCxDQUF5QixLQUF6QixFQUFnQztBQUN4Q0MsdUJBQU87QUFDSEMsMkJBQVVMLGFBQVY7QUFERyxpQkFEaUM7QUFJeENNLHdCQUFRLEtBQUt2QztBQUoyQixhQUFoQyxDQUFaO0FBTUEsZ0JBQUcsS0FBS0gsT0FBTCxDQUFhSixNQUFoQixFQUF3QjtBQUNwQixxQkFBS0EsTUFBTCxHQUFjLHFCQUFXMkMsYUFBWCxDQUF5QixLQUF6QixFQUFnQztBQUM5Q0MsMkJBQU87QUFDSEMsK0JBQVVMLGFBQVY7QUFERyxxQkFEdUM7QUFJMUNNLDRCQUFRLEtBQUt0QztBQUo2QixpQkFBaEMsQ0FBZDtBQU1IO0FBQ0QsZ0JBQUcsS0FBS0osT0FBTCxDQUFhSCxNQUFoQixFQUF3QjtBQUNwQixxQkFBS0EsTUFBTCxHQUFjLHFCQUFXMEMsYUFBWCxDQUF5QixLQUF6QixFQUFnQztBQUMxQ0MsMkJBQU87QUFDSEMsK0JBQVVMLGFBQVY7QUFERyxxQkFEbUM7QUFJMUNNLDRCQUFRLEtBQUt2QztBQUo2QixpQkFBaEMsQ0FBZDtBQU1IO0FBQ0o7Ozs7OztrQkFySmdCTCxXIiwiZmlsZSI6IlJhbmdlU2xpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERPTUJ1aWxkZXIgZnJvbSAnLi9ET01CdWlsZGVyJztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuLyc7XG5pbXBvcnQgJy4vT2JqZWN0QXNzaWduJztcblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgbWluOiAwLFxuICAgIG1heDogMSxcbiAgICB2YWx1ZTogMCxcbiAgICB2ZXJ0aWNhbDogZmFsc2UsXG4gICAgaGFuZGxlOiB0cnVlLFxuICAgIGJ1ZmZlcjogZmFsc2Vcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmFuZ2VTbGlkZXIge1xuICAgIGNvbnN0cnVjdG9yKG5vZGUsIG9wdGlvbnM9e30pIHtcbiAgICAgICAgdGhpcy5ub2RlID0gbm9kZTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cyksIG9wdGlvbnMpO1xuXG4gICAgICAgIHRoaXMudHJhY2sgPSBudWxsO1xuICAgICAgICB0aGlzLmZpbGwgPSBudWxsO1xuICAgICAgICB0aGlzLmhhbmRsZSA9IG51bGw7XG4gICAgICAgIHRoaXMuYnVmZmVyID0gbnVsbDtcblxuICAgICAgICB0aGlzLnZlcnRpY2FsID0gdGhpcy5vcHRpb25zLnZlcnRpY2FsO1xuXG4gICAgICAgIHRoaXMubWluID0gdGhpcy5vcHRpb25zLm1pbjtcbiAgICAgICAgdGhpcy5tYXggPSB0aGlzLm9wdGlvbnMubWF4O1xuICAgICAgICB0aGlzLmxlbmd0aCA9IE1hdGguYWJzKHRoaXMubWluKSArIE1hdGguYWJzKHRoaXMubWF4KTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMub3B0aW9ucy52YWx1ZTtcbiAgICAgICAgdGhpcy5yYXRpbyA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vbm1vdmUgPSB0aGlzLm9wdGlvbnMub25tb3ZlO1xuICAgICAgICB0aGlzLm9uY2hhbmdlID0gdGhpcy5vcHRpb25zLm9uY2hhbmdlO1xuICAgICAgICAvL2Nocm9tZSBidWcgd2l0aCBtb3VzZW1vdmVcbiAgICAgICAgdGhpcy5ub2RlLm9uZHJhZ3N0YXJ0ID0gKCkgPT4gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fY3JlYXRlRE9NKCk7XG4gICAgICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLnZhbHVlKTtcbiAgICB9XG5cbiAgICBzZXRWYWx1ZSh2YWx1ZSkge1xuICAgICAgICBjb25zdCB2YWxpZFZhbHVlID0gdmFsdWUgPiB0aGlzLm1heCA/IHRoaXMubWF4IDogKHZhbHVlIDwgdGhpcy5taW4gPyB0aGlzLm1pbiA6IHZhbHVlKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbGlkVmFsdWU7XG4gICAgICAgIHRoaXMucmF0aW8gPSAodGhpcy52YWx1ZSAtIHRoaXMubWluKSAvIHRoaXMubGVuZ3RoO1xuXG4gICAgICAgIHRoaXMuX3VwZGF0ZUZpbGwoKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldFZhbHVlQnlSYXRpbyhyYXRpbykge1xuICAgICAgICBjb25zdCB2YWxpZFJhdGlvID0gcmF0aW8gPiAxID8gMSA6IChyYXRpbyA8IDAgPyAwIDogcmF0aW8pO1xuICAgICAgICB0aGlzLnJhdGlvID0gdmFsaWRSYXRpbztcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubWluICsgKHRoaXMucmF0aW8gKiB0aGlzLmxlbmd0aCk7XG5cbiAgICAgICAgdGhpcy5fdXBkYXRlRmlsbCgpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2V0QnVmZmVyKHJhdGlvKSB7XG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy5idWZmZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbGlkUmF0aW8gPSByYXRpbyA+IDEgPyAxIDogKHJhdGlvIDwgMCA/IDAgOiByYXRpbyk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMudmVydGljYWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlci5zdHlsZS5oZWlnaHQgPSBgJHt2YWxpZFJhdGlvICogMTAwfSVgO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlci5zdHlsZS53aWR0aCA9IGAke3ZhbGlkUmF0aW8gKiAxMDB9JWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF91cGRhdGVGaWxsKCkge1xuICAgICAgICBpZih0aGlzLnZlcnRpY2FsKSB7XG4gICAgICAgICAgICB0aGlzLmZpbGwuc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5yYXRpbyAqIDEwMH0lYDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZmlsbC5zdHlsZS53aWR0aCA9IGAke3RoaXMucmF0aW8gKiAxMDB9JWA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfdXBkYXRlVmFsdWUoZSkge1xuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLm5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgbGV0IHJhdGlvID0gbnVsbDtcbiAgICAgICAgaWYodGhpcy52ZXJ0aWNhbCkge1xuICAgICAgICAgICAgcmF0aW8gPSAxIC0gKChlLmNsaWVudFkgLSBwb3MudG9wKSAvIHRoaXMubm9kZS5vZmZzZXRIZWlnaHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmF0aW8gPSAoZS5jbGllbnRYIC0gcG9zLmxlZnQpIC8gdGhpcy5ub2RlLm9mZnNldFdpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRWYWx1ZUJ5UmF0aW8ocmF0aW8pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9iaW5kRXZlbnRzKCkge1xuICAgICAgICB0aGlzLm5vZGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGUpID0+IHtcbiAgICAgICAgICAgIGlmKGUud2hpY2ggPT09IDEpIHsgLy9sZWZ0IG1vdXNlIGJ1dHRvblxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVWYWx1ZShlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGUpID0+IHtcbiAgICAgICAgICAgIGlmKHRoaXMuZHJhZ2dhYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlVmFsdWUoZSk7XG5cbiAgICAgICAgICAgICAgICBpZihpc0Z1bmN0aW9uKHRoaXMub25tb3ZlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9ubW92ZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZSkgPT4ge1xuICAgICAgICAgICAgaWYodGhpcy5kcmFnZ2FibGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVZhbHVlKGUpO1xuXG4gICAgICAgICAgICAgICAgaWYoaXNGdW5jdGlvbih0aGlzLm9uY2hhbmdlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uY2hhbmdlKHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZURPTSgpIHtcbiAgICAgICAgY29uc3QgbWFpbkNsYXNzTmFtZSA9IHRoaXMudmVydGljYWwgPyAnc2xpZGVyLXZlcnQnIDogJ3NsaWRlci1ob3Jpeic7XG4gICAgICAgIHRoaXMubm9kZS5jbGFzc0xpc3QuYWRkKG1haW5DbGFzc05hbWUpO1xuICAgICAgICB0aGlzLnRyYWNrID0gRE9NQnVpbGRlci5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgIGNsYXNzOiBgJHttYWluQ2xhc3NOYW1lfV9fdHJhY2tgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyZW50OiB0aGlzLm5vZGUsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZpbGwgPSBET01CdWlsZGVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgY2xhc3M6IGAke21haW5DbGFzc05hbWV9X19maWxsZWRgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFyZW50OiB0aGlzLnRyYWNrXG4gICAgICAgIH0pO1xuICAgICAgICBpZih0aGlzLm9wdGlvbnMuaGFuZGxlKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZSA9IERPTUJ1aWxkZXIuY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICBjbGFzczogYCR7bWFpbkNsYXNzTmFtZX1fX2hhbmRsZWBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcGFyZW50OiB0aGlzLmZpbGxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMub3B0aW9ucy5idWZmZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gRE9NQnVpbGRlci5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6IGAke21haW5DbGFzc05hbWV9X19idWZmZXJgXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IHRoaXMudHJhY2tcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
},{"./":10,"./DOMBuilder":6,"./ObjectAssign":8}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFunction = isFunction;
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImlzRnVuY3Rpb24iLCJmdW5jdGlvblRvQ2hlY2siLCJnZXRUeXBlIiwidG9TdHJpbmciLCJjYWxsIl0sIm1hcHBpbmdzIjoiOzs7OztRQUFnQkEsVSxHQUFBQSxVO0FBQVQsU0FBU0EsVUFBVCxDQUFvQkMsZUFBcEIsRUFBcUM7QUFDM0MsTUFBSUMsVUFBVSxFQUFkO0FBQ0EsU0FBT0QsbUJBQW1CQyxRQUFRQyxRQUFSLENBQWlCQyxJQUFqQixDQUFzQkgsZUFBdEIsTUFBMkMsbUJBQXJFO0FBQ0EiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbihmdW5jdGlvblRvQ2hlY2spIHtcbiB2YXIgZ2V0VHlwZSA9IHt9O1xuIHJldHVybiBmdW5jdGlvblRvQ2hlY2sgJiYgZ2V0VHlwZS50b1N0cmluZy5jYWxsKGZ1bmN0aW9uVG9DaGVjaykgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG4iXX0=
},{}]},{},[5])