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
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, AudioPlayer);

        var _this = _possibleConstructorReturn(this, (AudioPlayer.__proto__ || Object.getPrototypeOf(AudioPlayer)).call(this));

        _this.playlist = new _Playlist2.default(tracks);
        _this.muted = false;
        _this.currentTrackIndex = 0;
        _this._playback = {};
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

        // перемотка

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
            this._equalizer = new _Equalizer2.default(this._ctx);
            return this;
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvUGxheWVyLmpzIl0sIm5hbWVzIjpbIkF1ZGlvUGxheWVyIiwidHJhY2tzIiwicGFyYW1zIiwicGxheWxpc3QiLCJtdXRlZCIsImN1cnJlbnRUcmFja0luZGV4IiwiX3BsYXliYWNrIiwiX3Jlc2V0UGxheWJhY2tJbmZvIiwiX3NldFRyYWNrIiwiX2N0eCIsIl9nYWluIiwiX2VxdWFsaXplciIsIl9jcmVhdGVBdWRpb0FwaU5vZGVzIiwiaXNQbGF5aW5nIiwidHJhY2siLCJpZCIsImNvbnNvbGUiLCJsb2ciLCJzcmMiLCJhdWRpbyIsImlzQnVmZmVyZWQiLCJwbGF5IiwicGxheWluZyIsImxvYWQiLCJvbiIsIl9zdGFydFBsYXliYWNrIiwiYmluZCIsInBsYXlOZXh0IiwiZSIsImVtaXQiLCJwYXVzZSIsImN1cnJlbnRUaW1lIiwic3RvcCIsInJhdGlvIiwiRXJyb3IiLCJpc05hTiIsImR1cmF0aW9uIiwibmV3VGltZSIsInZhbHVlIiwiY2hhbmdlRmlsdGVyR2FpbiIsImdldEZpbHRlckdhaW4iLCJnZXRUcmFjayIsImVycm9yIiwic291cmNlIiwicGxheWJhY2siLCJjcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UiLCJfY29ubmVjdE5vZGVzIiwib2ZmIiwid2luZG93IiwiQXVkaW9Db250ZXh0Iiwid2Via2l0QXVkaW9Db250ZXh0IiwiX2Rlc3QiLCJkZXN0aW5hdGlvbiIsImNyZWF0ZUdhaW4iLCJmaWx0ZXJzIiwiTWVkaWFFbGVtZW50QXVkaW9Tb3VyY2VOb2RlIiwiY29ubmVjdCIsImxlbmd0aCIsImdhaW4iLCJtdXRlIiwidW5tdXRlIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRXFCQSxXOzs7QUFDakIsMkJBQW9DO0FBQUEsWUFBeEJDLE1BQXdCLHVFQUFqQixFQUFpQjtBQUFBLFlBQWJDLE1BQWEsdUVBQUosRUFBSTs7QUFBQTs7QUFBQTs7QUFHaEMsY0FBS0Ms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eEI7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOzs7NEJBek5lO0FBQ1osbUJBQU8sS0FBSzdDLFNBQUwsQ0FBZWdCLE9BQXRCO0FBQ0g7Ozs0QkFFWTtBQUNULG1CQUFPLEtBQUtaLEtBQUwsQ0FBV2dELElBQVgsQ0FBZ0JwQixLQUF2QjtBQUNILFM7MEJBRVVBLEssRUFBTztBQUNkLGdCQUFHQSxRQUFRLENBQVIsSUFBYUEsUUFBUSxDQUF4QixFQUEyQjtBQUN2QixzQkFBTUosTUFBTSxxQ0FBTixDQUFOO0FBQ0g7QUFDRCxnQkFBR0ksVUFBVSxDQUFiLEVBQWdCO0FBQ1oscUJBQUtxQixJQUFMO0FBQ0gsYUFGRCxNQUVPLElBQUcsS0FBS3ZELEtBQVIsRUFBZTtBQUNsQixxQkFBS3dELE1BQUw7QUFDSDtBQUNELGlCQUFLbEQsS0FBTCxDQUFXZ0QsSUFBWCxDQUFnQnBCLEtBQWhCLEdBQXdCQSxLQUF4QjtBQUNIOzs7Ozs7a0JBcENnQnRDLFciLCJmaWxlIjoiQXVkaW9QbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFBsYXlsaXN0IGZyb20gJy4vUGxheWxpc3QnO1xuaW1wb3J0IFRyYWNrIGZyb20gJy4vVHJhY2snO1xuaW1wb3J0IEV2ZW50RW1taXRlciBmcm9tICcuL3V0aWxzL0V2ZW50RW1taXRlcic7XG5pbXBvcnQgRXF1YWxpemVyIGZyb20gJy4vRXF1YWxpemVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXVkaW9QbGF5ZXIgZXh0ZW5kcyBFdmVudEVtbWl0ZXIge1xuICAgIGNvbnN0cnVjdG9yKHRyYWNrcz1bXSwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLnBsYXlsaXN0ID0gbmV3IFBsYXlsaXN0KHRyYWNrcyk7XG4gICAgICAgIHRoaXMubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jdXJyZW50VHJhY2tJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuX3BsYXliYWNrID0ge31cbiAgICAgICAgdGhpcy5fcmVzZXRQbGF5YmFja0luZm8oKTtcbiAgICAgICAgdGhpcy5fc2V0VHJhY2soKTtcblxuICAgICAgICAvLyBpbml0IEF1ZGlvIEFQSSBOb2Rlc1xuICAgICAgICB0aGlzLl9jdHggPSBudWxsO1xuICAgICAgICB0aGlzLl9nYWluID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZXF1YWxpemVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY3JlYXRlQXVkaW9BcGlOb2RlcygpO1xuICAgIH1cblxuICAgIGdldCBpc1BsYXlpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wbGF5YmFjay5wbGF5aW5nO1xuICAgIH1cbiAgICBcbiAgICBnZXQgdm9sdW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2Fpbi5nYWluLnZhbHVlO1xuICAgIH1cblxuICAgIHNldCB2b2x1bWUodmFsdWUpIHtcbiAgICAgICAgaWYodmFsdWUgPiAxICYmIHZhbHVlIDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1ZvbHVtZSBtdXN0IGJlIGluIHJhbmdlIGZyb20gMCB0byAxJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYodmFsdWUgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMubXV0ZSgpO1xuICAgICAgICB9IGVsc2UgaWYodGhpcy5tdXRlZCkge1xuICAgICAgICAgICAgdGhpcy51bm11dGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9nYWluLmdhaW4udmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgXG4gICAgcGxheSgpIHtcbiAgICAgICAgaWYodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIXRoaXMuX3BsYXliYWNrLnRyYWNrIHx8IHRoaXMuX3BsYXliYWNrLnRyYWNrLmlkICE9PSB0aGlzLmN1cnJlbnRUcmFja0luZGV4KSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRUcmFjaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHJhY2sgPSB0aGlzLl9wbGF5YmFjay50cmFjaztcblxuICAgICAgICBjb25zb2xlLmxvZyhgUGxheWluZyB0cmFjayBpZD0ke3RoaXMuY3VycmVudFRyYWNrSW5kZXh9IC0gJHt0cmFjay5zcmN9YCk7XG4gICAgICAgIGlmKHRyYWNrLmF1ZGlvICYmIHRyYWNrLmlzQnVmZmVyZWQoKSkge1xuICAgICAgICAgICAgdHJhY2suYXVkaW8ucGxheSgpO1xuICAgICAgICAgICAgdGhpcy5fcGxheWJhY2sucGxheWluZyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cmFjay5sb2FkKCk7XG4gICAgICAgICAgICAvL1N1YnNjcmliZVxuICAgICAgICAgICAgLy/Rh9C10YIg0L3QtSDQvtC6XG4gICAgICAgICAgICB0cmFjay5vbignY2FucGxheScsIHRoaXMuX3N0YXJ0UGxheWJhY2suYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0cmFjay5vbignZW5kZWQnLCB0aGlzLnBsYXlOZXh0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdHJhY2sub24oJ3Byb2dyZXNzJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3RyYWNrOnByb2dyZXNzJywgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRyYWNrLm9uKCdsb2FkZWRkYXRhJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3RyYWNrOmxvYWRlZGRhdGEnLCBlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdHJhY2sub24oJ2NhbnBsYXl0aHJvdWdoJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3RyYWNrOmNhbnBsYXl0aHJvdWdoJywgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRyYWNrLm9uKCdsb2FkZWRtZXRhZGF0YScsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd0cmFjazpsb2FkZWRtZXRhZGF0YScsIGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0cmFjay5vbigndGltZXVwZGF0ZScsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd0cmFjazp0aW1ldXBkYXRlJywgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuX3BsYXliYWNrLnBsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgdHJhY2sgPSB0aGlzLl9wbGF5YmFjay50cmFjaztcbiAgICAgICAgdHJhY2suYXVkaW8ucGF1c2UoKTtcbiAgICAgICAgdHJhY2suYXVkaW8uY3VycmVudFRpbWUgPSAwO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHBhdXNlKCkge1xuICAgICAgICB0aGlzLl9wbGF5YmFjay5wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHRyYWNrID0gdGhpcy5fcGxheWJhY2sudHJhY2s7XG4gICAgICAgIHRyYWNrLmF1ZGlvLnBhdXNlKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdQQVVTRUQnKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBtdXRlKCkge1xuICAgICAgICB0aGlzLl9wbGF5YmFjay50cmFjay5tdXRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMubXV0ZWQgPSB0cnVlO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHVubXV0ZSgpIHtcbiAgICAgICAgdGhpcy5fcGxheWJhY2sudHJhY2subXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHBsYXlOZXh0KCkge1xuICAgICAgICBpZih0aGlzLmlzUGxheWluZykge1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVzZXRQbGF5YmFja0luZm8oKTtcblxuICAgICAgICB0aGlzLmN1cnJlbnRUcmFja0luZGV4ICs9IDE7XG4gICAgICAgIHRoaXMucGxheSgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHBsYXlQcmV2KCkge1xuICAgICAgICBpZih0aGlzLmlzUGxheWluZykge1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVzZXRQbGF5YmFja0luZm8oKTtcblxuICAgICAgICB0aGlzLmN1cnJlbnRUcmFja0luZGV4IC09IDE7XG4gICAgICAgIHRoaXMucGxheSgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8vINC/0LXRgNC10LzQvtGC0LrQsFxuICAgIHJld2luZChyYXRpbykge1xuICAgICAgICBpZihyYXRpbyA+IDEgJiYgcmF0aW8gPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVG8gcmV3aW5kIGF1ZGlvLCByYXRpbyBtdXN0IGJlIGluIHJhbmdlIGZyb20gMCB0byAxJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhdWRpbyA9IHRoaXMuX3BsYXliYWNrLnRyYWNrLmF1ZGlvO1xuICAgICAgICBpZighaXNOYU4oYXVkaW8uZHVyYXRpb24pKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdUaW1lID0gYXVkaW8uZHVyYXRpb24gKiByYXRpbztcbiAgICAgICAgICAgIGF1ZGlvLmN1cnJlbnRUaW1lID0gbmV3VGltZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNoYW5nZUVxdWFsaXplckZpbHRlckdhaW4oaWQsIHZhbHVlKSB7XG4gICAgICAgIGlmKHRoaXMuX2VxdWFsaXplcikge1xuICAgICAgICAgICAgdGhpcy5fZXF1YWxpemVyLmNoYW5nZUZpbHRlckdhaW4oaWQsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGdldEVxdWFsaXplckZpbHRlckdhaW4oaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VxdWFsaXplciA/IHRoaXMuX2VxdWFsaXplci5nZXRGaWx0ZXJHYWluKGlkKSA6IG51bGw7XG4gICAgfVxuXG4gICAgX3NldFRyYWNrKCkge1xuICAgICAgICBpZih0aGlzLmlzUGxheWluZykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coJ1NldHRpbmcgdHJhY2snLCB0aGlzLmN1cnJlbnRUcmFja0luZGV4KTtcbiAgICAgICAgLy9UT0RPOiBuZWVkIHRvIHJlZmFjdG9yaW5nIHRoaXNcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuX3BsYXliYWNrLnRyYWNrID0gdGhpcy5wbGF5bGlzdC5nZXRUcmFjayh0aGlzLmN1cnJlbnRUcmFja0luZGV4KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDdXJyZW50VHJhY2tJbmRleCByZXNldGVkIHRvIDAnKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRyYWNrSW5kZXggPSAwO1xuICAgICAgICAgICAgdGhpcy5fcGxheWJhY2sudHJhY2sgPSB0aGlzLnBsYXlsaXN0LmdldFRyYWNrKHRoaXMuY3VycmVudFRyYWNrSW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX3Jlc2V0UGxheWJhY2tJbmZvKCkge1xuICAgICAgICB0aGlzLl9wbGF5YmFjayA9IHtcbiAgICAgICAgICAgIHRyYWNrOiBudWxsLFxuICAgICAgICAgICAgc291cmNlOiBudWxsLFxuICAgICAgICAgICAgcGxheWluZzogZmFsc2UsXG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1JFU0VUIFBMQVlCQUNLJyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX3N0YXJ0UGxheWJhY2soKSB7XG4gICAgICAgIGlmKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQWxyZWFkeSBwbGF5aW5nITEnKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGxheWJhY2sgPSB0aGlzLl9wbGF5YmFjaztcbiAgICAgICAgY29uc3QgdHJhY2sgPSB0aGlzLl9wbGF5YmFjay50cmFjaztcbiAgICAgICAgXG4gICAgICAgIHBsYXliYWNrLnNvdXJjZSA9IHRoaXMuX2N0eC5jcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UodHJhY2suYXVkaW8pO1xuICAgICAgICB0aGlzLl9jb25uZWN0Tm9kZXMoKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhgTG9hZGVkIC0gJHtwbGF5YmFjay50cmFjay5zcmN9YCk7XG4gICAgICAgIHBsYXliYWNrLnBsYXlpbmcgPSB0cnVlO1xuICAgICAgICB0cmFjay5hdWRpby5wbGF5KCk7XG5cbiAgICAgICAgLy9VbnN1YnNjcmliZSBiZWNhdXNlICdjYW5wbGF5JyBldmVudCB0cmlnZ2VyZWQgYnkgY2hhbmdpbmcgdGhlIGN1cnJlbnQgdGltZVxuICAgICAgICB0cmFjay5vZmYoJ2NhbnBsYXknLCB0aGlzLl9zdGFydFBsYXliYWNrLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9jcmVhdGVBdWRpb0FwaU5vZGVzKCkge1xuICAgICAgICBpZighKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCkpIHJldHVybjtcblxuICAgICAgICB0aGlzLl9jdHggPSBuZXcgKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCkoKTtcbiAgICAgICAgdGhpcy5fZGVzdCA9IHRoaXMuX2N0eC5kZXN0aW5hdGlvbjtcbiAgICAgICAgdGhpcy5fZ2FpbiA9IHRoaXMuX2N0eC5jcmVhdGVHYWluKCk7XG4gICAgICAgIHRoaXMuX2VxdWFsaXplciA9IG5ldyBFcXVhbGl6ZXIodGhpcy5fY3R4KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX2Nvbm5lY3ROb2RlcygpIHtcbiAgICAgICAgY29uc3Qgc291cmNlID0gdGhpcy5fcGxheWJhY2suc291cmNlO1xuICAgICAgICBjb25zdCBmaWx0ZXJzID0gdGhpcy5fZXF1YWxpemVyLmZpbHRlcnM7XG4gICAgICAgIGlmKCEoc291cmNlIGluc3RhbmNlb2YgTWVkaWFFbGVtZW50QXVkaW9Tb3VyY2VOb2RlKSkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1NvdXJjZSBub2RlIGlzIHVuZGVmaW5lZCBvciBzb3VyY2UgIT09IE1lZGlhRWxlbWVudEF1ZGlvU291cmNlTm9kZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgc291cmNlLmNvbm5lY3QoZmlsdGVyc1swXSk7XG4gICAgICAgIGZpbHRlcnNbZmlsdGVycy5sZW5ndGggLSAxXS5jb25uZWN0KHRoaXMuX2dhaW4pO1xuICAgICAgICB0aGlzLl9nYWluLmNvbm5lY3QodGhpcy5fZGVzdCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIl19
},{"./Equalizer":2,"./Playlist":3,"./Track":4,"./utils/EventEmmiter":7}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVxdWFsaXplci5qcyJdLCJuYW1lcyI6WyJGUkVRUyIsIkVxdWFsaXplciIsImNvbnRleHQiLCJmaWx0ZXJzIiwiX2ZyZXF1ZW5jaWVzIiwiX2NyZWF0ZUZpbHRlcnMiLCJpZCIsInZhbHVlIiwidmFsaWRWYWx1ZSIsImdhaW4iLCJmcmVxdWVuY3kiLCJmaWx0ZXIiLCJjcmVhdGVCaXF1YWRGaWx0ZXIiLCJ0eXBlIiwiUSIsIm1hcCIsIl9jcmVhdGVGaWx0ZXIiLCJiaW5kIiwicmVkdWNlIiwicHJldiIsImN1cnIiLCJjb25uZWN0Il0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQUVBLElBQU1BLFFBQVEsQ0FBQyxFQUFELEVBQUssR0FBTCxFQUFVLEdBQVYsRUFBZSxHQUFmLEVBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQWdDLElBQWhDLEVBQXNDLEtBQXRDLEVBQTZDLEtBQTdDLEVBQW9ELEtBQXBELENBQWQ7O0lBRXFCQyxTO0FBQ2pCLHVCQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBQ2pCLGFBQUtBLE9BQUwsR0FBZUEsT0FBZjtBQUNBLGFBQUtDLE9BQUwsR0FBZSxFQUFmO0FBQ0EsYUFBS0MsWUFBTCxHQUFvQkosS0FBcEI7QUFDQSxhQUFLSyxjQUFMO0FBQ0g7Ozs7eUNBTWdCQyxFLEVBQUlDLEssRUFBTztBQUN4QixnQkFBR0QsTUFBTSxLQUFLSCxPQUFkLEVBQXVCO0FBQ25CLG9CQUFNSyxhQUFhRCxRQUFRLEVBQVIsR0FBYSxFQUFiLEdBQW1CQSxRQUFRLENBQUMsRUFBVCxHQUFjLENBQUMsRUFBZixHQUFvQkEsS0FBMUQ7QUFDQSxxQkFBS0osT0FBTCxDQUFhRyxFQUFiLEVBQWlCRyxJQUFqQixDQUFzQkYsS0FBdEIsR0FBOEJDLFVBQTlCO0FBQ0g7O0FBRUQsbUJBQU8sSUFBUDtBQUNIOzs7c0NBRWFGLEUsRUFBSTtBQUNkLG1CQUFPQSxNQUFNLEtBQUtILE9BQVgsR0FBcUIsS0FBS0EsT0FBTCxDQUFhRyxFQUFiLEVBQWlCRyxJQUFqQixDQUFzQkYsS0FBM0MsR0FBbUQsSUFBMUQ7QUFDSDs7O3NDQUVhRyxTLEVBQVc7QUFDckIsZ0JBQU1DLFNBQVMsS0FBS1QsT0FBTCxDQUFhVSxrQkFBYixFQUFmOztBQUVBRCxtQkFBT0UsSUFBUCxHQUFjLFNBQWQ7QUFDQUYsbUJBQU9ELFNBQVAsQ0FBaUJILEtBQWpCLEdBQXlCRyxTQUF6QjtBQUNBQyxtQkFBT0csQ0FBUCxDQUFTUCxLQUFULEdBQWlCLENBQWpCLENBTHFCLENBS0Q7QUFDcEJJLG1CQUFPRixJQUFQLENBQVlGLEtBQVosR0FBb0IsQ0FBcEI7O0FBRUEsbUJBQU9JLE1BQVA7QUFDSDs7O3lDQUVnQjtBQUNiLGdCQUFNUixVQUFVLEtBQUtDLFlBQUwsQ0FBa0JXLEdBQWxCLENBQXNCLEtBQUtDLGFBQUwsQ0FBbUJDLElBQW5CLENBQXdCLElBQXhCLENBQXRCLENBQWhCO0FBQ0FkLG9CQUFRZSxNQUFSLENBQWUsVUFBQ0MsSUFBRCxFQUFPQyxJQUFQLEVBQWdCO0FBQzNCRCxxQkFBS0UsT0FBTCxDQUFhRCxJQUFiO0FBQ0EsdUJBQU9BLElBQVA7QUFDSCxhQUhEO0FBSUEsaUJBQUtqQixPQUFMLEdBQWVBLE9BQWY7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOzs7NEJBckNpQjtBQUNkLG1CQUFPLEtBQUtDLFlBQVo7QUFDSDs7Ozs7O2tCQVZnQkgsUyIsImZpbGUiOiJFcXVhbGl6ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QgRlJFUVMgPSBbNjAsIDE3MCwgMzEwLCA2MDAsIDEwMDAsIDMwMDAsIDYwMDAsIDEyMDAwLCAxNDAwMCwgMTYwMDBdO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFcXVhbGl6ZXIge1xuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gW107XG4gICAgICAgIHRoaXMuX2ZyZXF1ZW5jaWVzID0gRlJFUVM7XG4gICAgICAgIHRoaXMuX2NyZWF0ZUZpbHRlcnMoKTtcbiAgICB9XG5cbiAgICBnZXQgZnJlcXVlbmNpZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mcmVxdWVuY2llcztcbiAgICB9XG5cbiAgICBjaGFuZ2VGaWx0ZXJHYWluKGlkLCB2YWx1ZSkge1xuICAgICAgICBpZihpZCBpbiB0aGlzLmZpbHRlcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbGlkVmFsdWUgPSB2YWx1ZSA+IDEyID8gMTIgOiAodmFsdWUgPCAtMTIgPyAtMTIgOiB2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmZpbHRlcnNbaWRdLmdhaW4udmFsdWUgPSB2YWxpZFZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0RmlsdGVyR2FpbihpZCkge1xuICAgICAgICByZXR1cm4gaWQgaW4gdGhpcy5maWx0ZXJzID8gdGhpcy5maWx0ZXJzW2lkXS5nYWluLnZhbHVlIDogbnVsbDtcbiAgICB9XG5cbiAgICBfY3JlYXRlRmlsdGVyKGZyZXF1ZW5jeSkge1xuICAgICAgICBjb25zdCBmaWx0ZXIgPSB0aGlzLmNvbnRleHQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG5cbiAgICAgICAgZmlsdGVyLnR5cGUgPSAncGVha2luZyc7XG4gICAgICAgIGZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSBmcmVxdWVuY3k7XG4gICAgICAgIGZpbHRlci5RLnZhbHVlID0gMTsgLy8gUS1mYWN0b3JcbiAgICAgICAgZmlsdGVyLmdhaW4udmFsdWUgPSAwO1xuXG4gICAgICAgIHJldHVybiBmaWx0ZXI7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUZpbHRlcnMoKSB7XG4gICAgICAgIGNvbnN0IGZpbHRlcnMgPSB0aGlzLl9mcmVxdWVuY2llcy5tYXAodGhpcy5fY3JlYXRlRmlsdGVyLmJpbmQodGhpcykpO1xuICAgICAgICBmaWx0ZXJzLnJlZHVjZSgocHJldiwgY3VycikgPT4ge1xuICAgICAgICAgICAgcHJldi5jb25uZWN0KGN1cnIpO1xuICAgICAgICAgICAgcmV0dXJuIGN1cnI7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZpbHRlcnMgPSBmaWx0ZXJzO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiJdfQ==
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
                    console.log('str', track);
                    _this.addTrack(i, track);
                } else if ((typeof track === 'undefined' ? 'undefined' : _typeof(track)) === 'object') {
                    var src = track.src,
                        name = track.name;

                    console.log('obj', src, name);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXlsaXN0LmpzIl0sIm5hbWVzIjpbIlBsYXlsaXN0IiwidHJhY2tzIiwiX3RyYWNrcyIsImFkZFRyYWNrTGlzdCIsImlkIiwidHJhY2siLCJFcnJvciIsInNyYyIsIm5hbWUiLCJwdXNoIiwibGlzdCIsImZvckVhY2giLCJpIiwiY29uc29sZSIsImxvZyIsImFkZFRyYWNrIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQUVBOzs7Ozs7OztJQUVxQkEsUTtBQUNqQix3QkFBdUI7QUFBQSxZQUFYQyxNQUFXLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ25CLGFBQUtDLE9BQUwsR0FBZSxFQUFmO0FBQ0EsYUFBS0MsWUFBTCxDQUFrQkYsTUFBbEI7QUFDSDs7OztpQ0FNUUcsRSxFQUFJO0FBQ1QsZ0JBQU1DLFFBQVEsS0FBS0gsT0FBTCxDQUFhRSxFQUFiLENBQWQ7QUFDQSxnQkFBR0MsS0FBSCxFQUFVO0FBQ04sdUJBQU9BLEtBQVA7QUFDSCxhQUZELE1BRU87QUFDSCxzQkFBTUMseUJBQXVCRixFQUF2QixpQ0FBTjtBQUNIO0FBQ0o7OztpQ0FFUUEsRSxFQUFJRyxHLEVBQWdCO0FBQUEsZ0JBQVhDLElBQVcsdUVBQUosRUFBSTs7QUFDekIsZ0JBQU1ILFFBQVEsb0JBQVVELEVBQVYsRUFBY0csR0FBZCxFQUFtQkMsSUFBbkIsQ0FBZDtBQUNBLGlCQUFLUCxNQUFMLENBQVlRLElBQVosQ0FBaUJKLEtBQWpCOztBQUVBLG1CQUFPLElBQVA7QUFDSDs7O3FDQUVZSyxJLEVBQU07QUFBQTs7QUFDZkEsaUJBQUtDLE9BQUwsQ0FBYSxVQUFDTixLQUFELEVBQVFPLENBQVIsRUFBYztBQUN2QixvQkFBRyxPQUFPUCxLQUFQLEtBQWlCLFFBQXBCLEVBQThCO0FBQzFCUSw0QkFBUUMsR0FBUixDQUFZLEtBQVosRUFBbUJULEtBQW5CO0FBQ0EsMEJBQUtVLFFBQUwsQ0FBY0gsQ0FBZCxFQUFpQlAsS0FBakI7QUFDSCxpQkFIRCxNQUdPLElBQUcsUUFBT0EsS0FBUCx5Q0FBT0EsS0FBUCxPQUFpQixRQUFwQixFQUE4QjtBQUFBLHdCQUN6QkUsR0FEeUIsR0FDWEYsS0FEVyxDQUN6QkUsR0FEeUI7QUFBQSx3QkFDcEJDLElBRG9CLEdBQ1hILEtBRFcsQ0FDcEJHLElBRG9COztBQUVqQ0ssNEJBQVFDLEdBQVIsQ0FBWSxLQUFaLEVBQW1CUCxHQUFuQixFQUF3QkMsSUFBeEI7QUFDQSwwQkFBS08sUUFBTCxDQUFjSCxDQUFkLEVBQWlCTCxHQUFqQixFQUFzQkMsSUFBdEI7QUFDSDtBQUNKLGFBVEQ7QUFVSDs7OzRCQS9CWTtBQUNULG1CQUFPLEtBQUtOLE9BQVo7QUFDSDs7Ozs7O2tCQVJnQkYsUSIsImZpbGUiOiJQbGF5bGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgVHJhY2sgZnJvbSAnLi9UcmFjayc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXlsaXN0IHtcbiAgICBjb25zdHJ1Y3Rvcih0cmFja3M9W10pIHtcbiAgICAgICAgdGhpcy5fdHJhY2tzID0gW107XG4gICAgICAgIHRoaXMuYWRkVHJhY2tMaXN0KHRyYWNrcyk7XG4gICAgfVxuXG4gICAgZ2V0IHRyYWNrcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYWNrcztcbiAgICB9XG5cbiAgICBnZXRUcmFjayhpZCkge1xuICAgICAgICBjb25zdCB0cmFjayA9IHRoaXMuX3RyYWNrc1tpZF07XG4gICAgICAgIGlmKHRyYWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJhY2s7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihgVHJhY2sgd2l0aCBpZD0ke2lkfSBkb3Nlbid0IGV4aXN0IGluIHBsYXlsaXN0YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRUcmFjayhpZCwgc3JjLCBuYW1lID0gJycpIHtcbiAgICAgICAgY29uc3QgdHJhY2sgPSBuZXcgVHJhY2soaWQsIHNyYywgbmFtZSk7XG4gICAgICAgIHRoaXMudHJhY2tzLnB1c2godHJhY2spO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGFkZFRyYWNrTGlzdChsaXN0KSB7XG4gICAgICAgIGxpc3QuZm9yRWFjaCgodHJhY2ssIGkpID0+IHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiB0cmFjayA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc3RyJywgdHJhY2spO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkVHJhY2soaSwgdHJhY2spO1xuICAgICAgICAgICAgfSBlbHNlIGlmKHR5cGVvZiB0cmFjayA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHNyYywgbmFtZSB9ID0gdHJhY2s7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ29iaicsIHNyYywgbmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRUcmFjayhpLCBzcmMsIG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59Il19
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRyYWNrLmpzIl0sIm5hbWVzIjpbIlRyYWNrIiwiaWQiLCJzcmMiLCJuYW1lIiwiX3NyYyIsIl9uYW1lIiwiX2J1ZmZlciIsIl9hdWRpbyIsIkF1ZGlvIiwiX2JpbmRFdmVudHMiLCJidWZmZXJlZCIsImxlbmd0aCIsImNyb3NzT3JpZ2luIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJlbWl0IiwidmFsdWUiLCJtdXRlZCJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7OztJQUVxQkEsSzs7O0FBQ2pCLG1CQUFZQyxFQUFaLEVBQWdCQyxHQUFoQixFQUE4QjtBQUFBLFlBQVRDLElBQVMsdUVBQUosRUFBSTs7QUFBQTs7QUFBQTs7QUFFMUIsY0FBS0YsRUFBTCxHQUFVQSxFQUFWO0FBQ0EsY0FBS0csSUFBTCxHQUFZRixHQUFaO0FBQ0EsY0FBS0csS0FBTCxHQUFhRixJQUFiO0FBQ0EsY0FBS0csT0FBTCxHQUFlLElBQWY7QUFDQSxjQUFLQyxNQUFMLEdBQWMsSUFBSUMsS0FBSixFQUFkO0FBQ0EsY0FBS0MsV0FBTDtBQVAwQjtBQVE3Qjs7OztxQ0FrQlk7QUFDVCxtQkFBTyxLQUFLRixNQUFMLENBQVlHLFFBQVosQ0FBcUJDLE1BQXJCLEdBQThCLENBQXJDO0FBQ0g7OzsrQkFFTTtBQUNILGlCQUFLSixNQUFMLENBQVlLLFdBQVosR0FBMEIsV0FBMUI7QUFDQSxpQkFBS0wsTUFBTCxDQUFZTCxHQUFaLEdBQWtCLEtBQUtFLElBQXZCOztBQUVBLG1CQUFPLElBQVA7QUFDSDs7O3NDQUVhO0FBQUE7O0FBQ1YsaUJBQUtHLE1BQUwsQ0FBWU0sZ0JBQVosQ0FBNkIsU0FBN0IsRUFBd0MsVUFBQ0MsQ0FBRCxFQUFPO0FBQzNDLHVCQUFLQyxJQUFMLENBQVUsU0FBVixFQUFxQkQsQ0FBckI7QUFDSCxhQUZEO0FBR0EsaUJBQUtQLE1BQUwsQ0FBWU0sZ0JBQVosQ0FBNkIsT0FBN0IsRUFBc0MsWUFBTTtBQUN4Qyx1QkFBS0UsSUFBTCxDQUFVLE9BQVY7QUFDSCxhQUZEO0FBR0EsaUJBQUtSLE1BQUwsQ0FBWU0sZ0JBQVosQ0FBNkIsVUFBN0IsRUFBeUMsVUFBQ0MsQ0FBRCxFQUFPO0FBQzVDLHVCQUFLQyxJQUFMLENBQVUsVUFBVixFQUFzQkQsQ0FBdEI7QUFDSCxhQUZEO0FBR0EsaUJBQUtQLE1BQUwsQ0FBWU0sZ0JBQVosQ0FBNkIsWUFBN0IsRUFBMkMsVUFBQ0MsQ0FBRCxFQUFPO0FBQzlDLHVCQUFLQyxJQUFMLENBQVUsWUFBVixFQUF3QkQsQ0FBeEI7QUFDSCxhQUZEO0FBR0EsaUJBQUtQLE1BQUwsQ0FBWU0sZ0JBQVosQ0FBNkIsZ0JBQTdCLEVBQStDLFVBQUNDLENBQUQsRUFBTztBQUNsRCx1QkFBS0MsSUFBTCxDQUFVLGdCQUFWLEVBQTRCRCxDQUE1QjtBQUNILGFBRkQ7QUFHQSxpQkFBS1AsTUFBTCxDQUFZTSxnQkFBWixDQUE2QixnQkFBN0IsRUFBK0MsVUFBQ0MsQ0FBRCxFQUFPO0FBQ2xELHVCQUFLQyxJQUFMLENBQVUsZ0JBQVYsRUFBNEJELENBQTVCO0FBQ0gsYUFGRDtBQUdBLGlCQUFLUCxNQUFMLENBQVlNLGdCQUFaLENBQTZCLFlBQTdCLEVBQTJDLFVBQUNDLENBQUQsRUFBTztBQUM5Qyx1QkFBS0MsSUFBTCxDQUFVLFlBQVYsRUFBd0JELENBQXhCO0FBQ0gsYUFGRDtBQUdIOzs7NEJBakRTO0FBQ04sbUJBQU8sS0FBS1YsSUFBWjtBQUNIOzs7NEJBRVU7QUFDUCxtQkFBTyxLQUFLQyxLQUFaO0FBQ0g7Ozs0QkFFVztBQUNSLG1CQUFPLEtBQUtFLE1BQVo7QUFDSDs7OzBCQUVTUyxLLEVBQU87QUFDYixpQkFBS1QsTUFBTCxDQUFZVSxLQUFaLEdBQW9CLENBQUMsQ0FBQ0QsS0FBdEI7QUFDSDs7Ozs7O2tCQXpCZ0JoQixLO0FBNkRwQiIsImZpbGUiOiJUcmFjay5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgRXZlbnRFbW1pdGVyIGZyb20gJy4vdXRpbHMvRXZlbnRFbW1pdGVyLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2sgZXh0ZW5kcyBFdmVudEVtbWl0ZXJ7XG4gICAgY29uc3RydWN0b3IoaWQsIHNyYywgbmFtZT0nJykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuX3NyYyA9IHNyYztcbiAgICAgICAgdGhpcy5fbmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuX2J1ZmZlciA9IG51bGw7XG4gICAgICAgIHRoaXMuX2F1ZGlvID0gbmV3IEF1ZGlvKCk7XG4gICAgICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcbiAgICB9XG5cbiAgICBnZXQgc3JjKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3JjO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICB9XG5cbiAgICBnZXQgYXVkaW8oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hdWRpbztcbiAgICB9XG5cbiAgICBzZXQgbXV0ZWQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fYXVkaW8ubXV0ZWQgPSAhIXZhbHVlO1xuICAgIH1cblxuICAgIGlzQnVmZmVyZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hdWRpby5idWZmZXJlZC5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIGxvYWQoKSB7XG4gICAgICAgIHRoaXMuX2F1ZGlvLmNyb3NzT3JpZ2luID0gXCJhbm9ueW1vdXNcIjtcbiAgICAgICAgdGhpcy5fYXVkaW8uc3JjID0gdGhpcy5fc3JjO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9iaW5kRXZlbnRzKCkge1xuICAgICAgICB0aGlzLl9hdWRpby5hZGRFdmVudExpc3RlbmVyKCdjYW5wbGF5JywgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnY2FucGxheScsIGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2VuZGVkJyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9hdWRpby5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3Byb2dyZXNzJywgZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9hdWRpby5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRkYXRhJywgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnbG9hZGVkZGF0YScsIGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcignY2FucGxheXRocm91Z2gnLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdjYW5wbGF5dGhyb3VnaCcsIGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVkbWV0YWRhdGEnLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdsb2FkZWRtZXRhZGF0YScsIGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcigndGltZXVwZGF0ZScsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3RpbWV1cGRhdGUnLCBlKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiJdfQ==
},{"./utils/EventEmmiter.js":7}],5:[function(require,module,exports){
'use strict';

var _AudioPlayer = require('./AudioPlayer');

var _AudioPlayer2 = _interopRequireDefault(_AudioPlayer);

var _Playlist = require('./Playlist');

var _Playlist2 = _interopRequireDefault(_Playlist);

var _DOMBuilder = require('./utils/DOMBuilder');

var _DOMBuilder2 = _interopRequireDefault(_DOMBuilder);

var _Slider = require('./utils/Slider.js');

var _Slider2 = _interopRequireDefault(_Slider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var playerNode = document.getElementById("player");
var playBtn = document.querySelector('.player-controls__btn_play');
var playNextBtn = document.querySelector('.player-controls__btn_next');
var playPrevBtn = document.querySelector('.player-controls__btn_prev');

var volumeBtn = document.querySelector('.volume__btn');
var volumeSliderNode = document.querySelector('.volume__slider');
var volumeSliderFilled = document.querySelector('.volume__slider .slider-horiz__filled');

var progressBar = document.querySelector('.progress__bar');
var progressBuffer = document.querySelector('.progress__buffer');
var progressLine = document.querySelector('.progress__line');

var equalizerBands = document.querySelectorAll('.equalizer-band__slider');

var tracks = ['http://freshly-ground.com/data/audio/mpc/20090207%20-%20Loverman.mp3'];

var player = new _AudioPlayer2.default(tracks);
player.volume = 0.1;
setVolume(player.volume);

function setVolume(value) {
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
    volumeSliderFilled.style.width = value * 100 + '%';
    player.volume = value;
}

function drawProgress(value) {
    progressLine.style.width = value * 100 + '%';
}

// Volume settings
var updateVolume = function updateVolume(e) {
    var ratio = (e.clientX - volumeSliderNode.offsetLeft) / volumeSliderNode.offsetWidth;
    setVolume(ratio);
};

var volumeSlider = new _Slider2.default(volumeSliderNode, {
    value: player.volume,
    onchange: setVolume
});

volumeBtn.addEventListener('click', function () {
    var icon = volumeBtn.children[0];
    if (player.muted) {
        player.unmute();
        icon.classList.remove('volume__icon_mute');
    } else {
        player.mute();
        icon.classList.add('volume__icon_mute');
    }
});

// обработчик MouseScroll event'а для управления громкостью
volumeBtn.addEventListener('wheel', function (e) {
    e.preventDefault();
    var newValue = player.volume + Math.sign(e.wheelDeltaY) * 0.05;
    setVolume(newValue);
});

volumeSliderNode.addEventListener('wheel', function (e) {
    e.preventDefault();
    var newValue = player.volume + Math.sign(e.wheelDeltaY) * 0.05;
    setVolume(newValue);
});

// Progress settings
var setProgress = function setProgress(ratio) {
    drawProgress(ratio);
    player.rewind(ratio);
};
var progressSlider = new _Slider2.default(progressBar, {
    onchange: setProgress
});

var updateBuffer = function updateBuffer(e) {
    var audio = e.target;
    var buffered = audio.buffered;
    var buffRatio = buffered.length ? buffered.end(buffered.length - 1) / audio.duration : 0;

    progressBuffer.style.width = buffRatio * 100 + '%';
};

player.on('track:progress', updateBuffer);
player.on('track:loadeddata', updateBuffer);
player.on('track:canplaythrough', updateBuffer);
player.on('track:timeupdate', function (e) {
    var audio = e.target;
    var playedRatio = audio.currentTime / audio.duration;
    drawProgress(playedRatio);
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
    var bandSlider = new _Slider2.default(band, {
        vertical: true,
        min: -12,
        max: 12,
        value: filterValue,
        onchange: function onchange(ratio) {
            var gain = (ratio - 0.5) * 24;
            console.log(gain);
            bandFilled.style.height = ratio * 100 + '%';
            player.changeEqualizerFilterGain(i, gain);
        }
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfMjdjYTIxZTEuanMiXSwibmFtZXMiOlsicGxheWVyTm9kZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwbGF5QnRuIiwicXVlcnlTZWxlY3RvciIsInBsYXlOZXh0QnRuIiwicGxheVByZXZCdG4iLCJ2b2x1bWVCdG4iLCJ2b2x1bWVTbGlkZXJOb2RlIiwidm9sdW1lU2xpZGVyRmlsbGVkIiwicHJvZ3Jlc3NCYXIiLCJwcm9ncmVzc0J1ZmZlciIsInByb2dyZXNzTGluZSIsImVxdWFsaXplckJhbmRzIiwicXVlcnlTZWxlY3RvckFsbCIsInRyYWNrcyIsInBsYXllciIsInZvbHVtZSIsInNldFZvbHVtZSIsInZhbHVlIiwiaWNvbiIsImNoaWxkcmVuIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkIiwic3R5bGUiLCJ3aWR0aCIsImRyYXdQcm9ncmVzcyIsInVwZGF0ZVZvbHVtZSIsImUiLCJyYXRpbyIsImNsaWVudFgiLCJvZmZzZXRMZWZ0Iiwib2Zmc2V0V2lkdGgiLCJ2b2x1bWVTbGlkZXIiLCJvbmNoYW5nZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJtdXRlZCIsInVubXV0ZSIsIm11dGUiLCJwcmV2ZW50RGVmYXVsdCIsIm5ld1ZhbHVlIiwiTWF0aCIsInNpZ24iLCJ3aGVlbERlbHRhWSIsInNldFByb2dyZXNzIiwicmV3aW5kIiwicHJvZ3Jlc3NTbGlkZXIiLCJ1cGRhdGVCdWZmZXIiLCJhdWRpbyIsInRhcmdldCIsImJ1ZmZlcmVkIiwiYnVmZlJhdGlvIiwibGVuZ3RoIiwiZW5kIiwiZHVyYXRpb24iLCJvbiIsInBsYXllZFJhdGlvIiwiY3VycmVudFRpbWUiLCJpc1BsYXlpbmciLCJwbGF5IiwicGF1c2UiLCJwbGF5TmV4dCIsInBsYXlQcmV2IiwiZm9yRWFjaCIsImJhbmQiLCJpIiwiYmFuZEZpbGxlZCIsImZpbHRlclZhbHVlIiwiZ2V0RXF1YWxpemVyRmlsdGVyR2FpbiIsImJhbmRTbGlkZXIiLCJ2ZXJ0aWNhbCIsIm1pbiIs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LGFBQUwsQ0FBbUIsc0JBQW5CLENBQW5CO0FBQ0EsUUFBTWdFLGNBQWNwRCxPQUFPcUQsc0JBQVAsQ0FBOEJILENBQTlCLENBQXBCO0FBQ0EsUUFBTUksYUFBYSxxQkFBV0wsSUFBWCxFQUFpQjtBQUNoQ00sa0JBQVUsSUFEc0I7QUFFaENDLGFBQUssQ0FBQyxFQUYwQjtBQUdoQ0MsYUFBSyxFQUgyQjtBQUloQ3RELGVBQU9pRCxXQUp5QjtBQUtoQ2pDLGtCQUFVLGtCQUFDTCxLQUFELEVBQVc7QUFDakIsZ0JBQU00QyxPQUFPLENBQUM1QyxRQUFRLEdBQVQsSUFBZ0IsRUFBN0I7QUFDQTZDLG9CQUFRQyxHQUFSLENBQVlGLElBQVo7QUFDQVAsdUJBQVcxQyxLQUFYLENBQWlCb0QsTUFBakIsR0FBNkIvQyxRQUFRLEdBQXJDO0FBQ0FkLG1CQUFPOEQseUJBQVAsQ0FBaUNaLENBQWpDLEVBQW9DUSxJQUFwQztBQUNIO0FBVitCLEtBQWpCLENBQW5CO0FBWUgsQ0FmRCIsImZpbGUiOiJmYWtlXzI3Y2EyMWUxLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEF1ZGlvUGxheWVyIGZyb20gJy4vQXVkaW9QbGF5ZXInO1xuaW1wb3J0IFBsYXlsaXN0IGZyb20gJy4vUGxheWxpc3QnO1xuaW1wb3J0IERPTUJ1aWRsZXIgZnJvbSAnLi91dGlscy9ET01CdWlsZGVyJztcbmltcG9ydCBTbGlkZXIgZnJvbSAnLi91dGlscy9TbGlkZXIuanMnO1xuXG5jb25zdCBwbGF5ZXJOb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXJcIik7XG5jb25zdCBwbGF5QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1jb250cm9sc19fYnRuX3BsYXknKTtcbmNvbnN0IHBsYXlOZXh0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1jb250cm9sc19fYnRuX25leHQnKTtcbmNvbnN0IHBsYXlQcmV2QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1jb250cm9sc19fYnRuX3ByZXYnKTtcblxuY29uc3Qgdm9sdW1lQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZvbHVtZV9fYnRuJyk7XG5jb25zdCB2b2x1bWVTbGlkZXJOb2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZvbHVtZV9fc2xpZGVyJyk7XG5jb25zdCB2b2x1bWVTbGlkZXJGaWxsZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudm9sdW1lX19zbGlkZXIgLnNsaWRlci1ob3Jpel9fZmlsbGVkJyk7XG5cbmNvbnN0IHByb2dyZXNzQmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2dyZXNzX19iYXInKTtcbmNvbnN0IHByb2dyZXNzQnVmZmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2dyZXNzX19idWZmZXInKTtcbmNvbnN0IHByb2dyZXNzTGluZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmVzc19fbGluZScpO1xuXG5jb25zdCBlcXVhbGl6ZXJCYW5kcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5lcXVhbGl6ZXItYmFuZF9fc2xpZGVyJyk7XG5cbmNvbnN0IHRyYWNrcyA9IFtcbiAgICAnaHR0cDovL2ZyZXNobHktZ3JvdW5kLmNvbS9kYXRhL2F1ZGlvL21wYy8yMDA5MDIwNyUyMC0lMjBMb3Zlcm1hbi5tcDMnLFxuICAgIC8vICcuLy4uL21lZGlhLzAyIC0gTmVlZGxlcy5tcDMnLFxuICAgIC8vICcuLy4uL21lZGlhLzAzIC0gRGVlciBEYW5jZS5tcDMnLFxuICAgIC8vICcuLy4uL21lZGlhLzA0IC0gSmV0IFBpbG90Lm1wMycsXG4gICAgLy8gJy4vLi4vbWVkaWEvMDUgLSBYLm1wMycsXG4gICAgLy8gJy4vLi4vbWVkaWEvMDYgLSBDaG9wIFN1ZXkhLm1wMycsXG5dO1xuXG5jb25zdCBwbGF5ZXIgPSBuZXcgQXVkaW9QbGF5ZXIodHJhY2tzKTtcbnBsYXllci52b2x1bWUgPSAwLjE7XG5zZXRWb2x1bWUocGxheWVyLnZvbHVtZSk7XG5cbmZ1bmN0aW9uIHNldFZvbHVtZSh2YWx1ZSkge1xuICAgIGNvbnN0IGljb24gPSB2b2x1bWVCdG4uY2hpbGRyZW5bMF07XG4gICAgaWYodmFsdWUgPT09IDApIHtcbiAgICAgICAgaWNvbi5jbGFzc0xpc3QucmVtb3ZlKCd2b2x1bWVfX2ljb25faGFsZicpO1xuICAgICAgICBpY29uLmNsYXNzTGlzdC5hZGQoJ3ZvbHVtZV9faWNvbl9tdXRlJyk7XG4gICAgfVxuICAgIGlmKHZhbHVlID4gMCAmJiB2YWx1ZSA8PSAwLjUpIHtcbiAgICAgICAgaWNvbi5jbGFzc0xpc3QucmVtb3ZlKCd2b2x1bWVfX2ljb25fbXV0ZScpO1xuICAgICAgICBpY29uLmNsYXNzTGlzdC5hZGQoJ3ZvbHVtZV9faWNvbl9oYWxmJyk7XG4gICAgfVxuICAgIGlmKHZhbHVlID4gMC41KSB7XG4gICAgICAgIGljb24uY2xhc3NMaXN0LnJlbW92ZSgndm9sdW1lX19pY29uX211dGUnKTtcbiAgICAgICAgaWNvbi5jbGFzc0xpc3QucmVtb3ZlKCd2b2x1bWVfX2ljb25faGFsZicpO1xuICAgIH1cbiAgICB2b2x1bWVTbGlkZXJGaWxsZWQuc3R5bGUud2lkdGggPSBgJHt2YWx1ZSAqIDEwMH0lYDtcbiAgICBwbGF5ZXIudm9sdW1lID0gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGRyYXdQcm9ncmVzcyh2YWx1ZSkge1xuICAgIHByb2dyZXNzTGluZS5zdHlsZS53aWR0aCA9IGAke3ZhbHVlICogMTAwfSVgO1xufVxuXG4vLyBWb2x1bWUgc2V0dGluZ3NcbmNvbnN0IHVwZGF0ZVZvbHVtZSA9IChlKSA9PiB7XG4gICAgbGV0IHJhdGlvID0gKGUuY2xpZW50WCAtIHZvbHVtZVNsaWRlck5vZGUub2Zmc2V0TGVmdCkgLyB2b2x1bWVTbGlkZXJOb2RlLm9mZnNldFdpZHRoO1xuICAgIHNldFZvbHVtZShyYXRpbyk7XG59XG5cbmNvbnN0IHZvbHVtZVNsaWRlciA9IG5ldyBTbGlkZXIodm9sdW1lU2xpZGVyTm9kZSwge1xuICAgIHZhbHVlOiBwbGF5ZXIudm9sdW1lLFxuICAgIG9uY2hhbmdlOiBzZXRWb2x1bWVcbn0pO1xuXG52b2x1bWVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgY29uc3QgaWNvbiA9IHZvbHVtZUJ0bi5jaGlsZHJlblswXTtcbiAgICBpZihwbGF5ZXIubXV0ZWQpIHtcbiAgICAgICAgcGxheWVyLnVubXV0ZSgpO1xuICAgICAgICBpY29uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZvbHVtZV9faWNvbl9tdXRlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcGxheWVyLm11dGUoKTtcbiAgICAgICAgaWNvbi5jbGFzc0xpc3QuYWRkKCd2b2x1bWVfX2ljb25fbXV0ZScpO1xuICAgIH1cbn0pO1xuXG4vLyDQvtCx0YDQsNCx0L7RgtGH0LjQuiBNb3VzZVNjcm9sbCBldmVudCfQsCDQtNC70Y8g0YPQv9GA0LDQstC70LXQvdC40Y8g0LPRgNC+0LzQutC+0YHRgtGM0Y5cbnZvbHVtZUJ0bi5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gcGxheWVyLnZvbHVtZSArIE1hdGguc2lnbihlLndoZWVsRGVsdGFZKSAqIDAuMDU7XG4gICAgc2V0Vm9sdW1lKG5ld1ZhbHVlKTtcbn0pO1xuXG52b2x1bWVTbGlkZXJOb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBwbGF5ZXIudm9sdW1lICsgTWF0aC5zaWduKGUud2hlZWxEZWx0YVkpICogMC4wNTtcbiAgICBzZXRWb2x1bWUobmV3VmFsdWUpO1xufSk7XG5cbi8vIFByb2dyZXNzIHNldHRpbmdzXG5jb25zdCBzZXRQcm9ncmVzcyA9IChyYXRpbykgPT4ge1xuICAgIGRyYXdQcm9ncmVzcyhyYXRpbyk7XG4gICAgcGxheWVyLnJld2luZChyYXRpbyk7XG59XG5jb25zdCBwcm9ncmVzc1NsaWRlciA9IG5ldyBTbGlkZXIocHJvZ3Jlc3NCYXIsIHtcbiAgICBvbmNoYW5nZTogc2V0UHJvZ3Jlc3Ncbn0pO1xuXG5cbmNvbnN0IHVwZGF0ZUJ1ZmZlciA9IChlKSA9PiB7XG4gICAgY29uc3QgYXVkaW8gPSBlLnRhcmdldDtcbiAgICBjb25zdCBidWZmZXJlZCA9IGF1ZGlvLmJ1ZmZlcmVkO1xuICAgIGNvbnN0IGJ1ZmZSYXRpbyA9IGJ1ZmZlcmVkLmxlbmd0aCA/IGJ1ZmZlcmVkLmVuZChidWZmZXJlZC5sZW5ndGggLSAxKSAvIGF1ZGlvLmR1cmF0aW9uIDogMDtcbiAgICBcbiAgICBwcm9ncmVzc0J1ZmZlci5zdHlsZS53aWR0aCA9IGAke2J1ZmZSYXRpbyAqIDEwMH0lYDtcbn1cblxucGxheWVyLm9uKCd0cmFjazpwcm9ncmVzcycsIHVwZGF0ZUJ1ZmZlcik7XG5wbGF5ZXIub24oJ3RyYWNrOmxvYWRlZGRhdGEnLCB1cGRhdGVCdWZmZXIpO1xucGxheWVyLm9uKCd0cmFjazpjYW5wbGF5dGhyb3VnaCcsIHVwZGF0ZUJ1ZmZlcik7XG5wbGF5ZXIub24oJ3RyYWNrOnRpbWV1cGRhdGUnLCAoZSkgPT4ge1xuICAgIGNvbnN0IGF1ZGlvID0gZS50YXJnZXQ7XG4gICAgY29uc3QgcGxheWVkUmF0aW8gPSBhdWRpby5jdXJyZW50VGltZSAvIGF1ZGlvLmR1cmF0aW9uO1xuICAgIGRyYXdQcm9ncmVzcyhwbGF5ZWRSYXRpbyk7XG59KTtcblxuXG4vLyBQbGF5ZXIgY29udHJvbHMgc2V0dGluZ3NcbnBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgaWYoIXBsYXllci5pc1BsYXlpbmcpIHtcbiAgICAgICAgcGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udHJvbHNfX2J0bl9wYXVzZScpO1xuICAgICAgICBwbGF5ZXIucGxheSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYXlCdG4uY2xhc3NMaXN0LnJlbW92ZSgncGxheWVyLWNvbnRyb2xzX19idG5fcGF1c2UnKTtcbiAgICAgICAgcGxheWVyLnBhdXNlKCk7XG4gICAgfVxufSk7XG5cbnBsYXlOZXh0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBwbGF5QnRuLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250cm9sc19fYnRuX3BhdXNlJyk7XG4gICAgcGxheWVyLnBsYXlOZXh0KCk7XG59KTtcblxucGxheVByZXZCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIHBsYXlCdG4uY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRyb2xzX19idG5fcGF1c2UnKTtcbiAgICBwbGF5ZXIucGxheVByZXYoKTtcbn0pO1xuXG4vL0VxdWFsaXplciBzZXR0aW5nc1xuZXF1YWxpemVyQmFuZHMuZm9yRWFjaCgoYmFuZCwgaSkgPT4ge1xuICAgIGNvbnN0IGJhbmRGaWxsZWQgPSBiYW5kLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXItdmVydF9fZmlsbGVkJyk7XG4gICAgY29uc3QgZmlsdGVyVmFsdWUgPSBwbGF5ZXIuZ2V0RXF1YWxpemVyRmlsdGVyR2FpbihpKTtcbiAgICBjb25zdCBiYW5kU2xpZGVyID0gbmV3IFNsaWRlcihiYW5kLCB7XG4gICAgICAgIHZlcnRpY2FsOiB0cnVlLFxuICAgICAgICBtaW46IC0xMixcbiAgICAgICAgbWF4OiAxMixcbiAgICAgICAgdmFsdWU6IGZpbHRlclZhbHVlLFxuICAgICAgICBvbmNoYW5nZTogKHJhdGlvKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBnYWluID0gKHJhdGlvIC0gMC41KSAqIDI0O1xuICAgICAgICAgICAgY29uc29sZS5sb2coZ2Fpbik7XG4gICAgICAgICAgICBiYW5kRmlsbGVkLnN0eWxlLmhlaWdodCA9IGAke3JhdGlvICogMTAwfSVgO1xuICAgICAgICAgICAgcGxheWVyLmNoYW5nZUVxdWFsaXplckZpbHRlckdhaW4oaSwgZ2Fpbik7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIl19
},{"./AudioPlayer":1,"./Playlist":3,"./utils/DOMBuilder":6,"./utils/Slider.js":8}],6:[function(require,module,exports){
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

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ = require('./');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO: Добавить min и max значения и хранить значения из этого интервала
// TODO: Добавить дефолтные параметры
var Slider = function () {
    function Slider(node) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Slider);

        this.node = node;
        // this.filledNode = 
        this.vertical = options.vertical || false;
        this.onchange = options.onchange;
        this.draggable = false;
        this.min = options.min || 0;
        this.max = options.max || 1;
        this.value = options.value || this.min;

        this._bindEvents();
        this.setValue(this.value);
        //chrome bug with mousemove
        this.node.ondragstart = function () {
            return false;
        };
    }

    _createClass(Slider, [{
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
                }
            });

            document.addEventListener('mouseup', function (e) {
                if (_this.draggable) {
                    _this.draggable = false;
                    _this._updateValue(e);
                }
            });
        }
    }, {
        key: 'setValue',
        value: function setValue(value) {
            var validValue = value > 1 ? 1 : value < 0 ? 0 : value;

            this.value = validValue;

            if ((0, _.isFunction)(this.onchange)) {
                this.onchange(validValue);
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

            this.setValue(ratio);

            return this;
        }
    }]);

    return Slider;
}();

exports.default = Slider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNsaWRlci5qcyJdLCJuYW1lcyI6WyJTbGlkZXIiLCJub2RlIiwib3B0aW9ucyIsInZlcnRpY2FsIiwib25jaGFuZ2UiLCJkcmFnZ2FibGUiLCJtaW4iLCJtYXgiLCJ2YWx1ZSIsIl9iaW5kRXZlbnRzIiwic2V0VmFsdWUiLCJvbmRyYWdzdGFydCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwid2hpY2giLCJfdXBkYXRlVmFsdWUiLCJkb2N1bWVudCIsInZhbGlkVmFsdWUiLCJwb3MiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJyYXRpbyIsImNsaWVudFkiLCJ0b3AiLCJvZmZzZXRIZWlnaHQiLCJjbGllbnRYIiwibGVmdCIsIm9mZnNldFdpZHRoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBRUE7QUFDQTtJQUNxQkEsTTtBQUNqQixvQkFBWUMsSUFBWixFQUE4QjtBQUFBLFlBQVpDLE9BQVksdUVBQUosRUFBSTs7QUFBQTs7QUFDMUIsYUFBS0QsSUFBTCxHQUFZQSxJQUFaO0FBQ0E7QUFDQSxhQUFLRSxRQUFMLEdBQWdCRCxRQUFRQyxRQUFSLElBQW9CLEtBQXBDO0FBQ0EsYUFBS0MsUUFBTCxHQUFnQkYsUUFBUUUsUUFBeEI7QUFDQSxhQUFLQyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0EsYUFBS0MsR0FBTCxHQUFXSixRQUFRSSxHQUFSLElBQWUsQ0FBMUI7QUFDQSxhQUFLQyxHQUFMLEdBQVdMLFFBQVFLLEdBQVIsSUFBZSxDQUExQjtBQUNBLGFBQUtDLEtBQUwsR0FBYU4sUUFBUU0sS0FBUixJQUFpQixLQUFLRixHQUFuQzs7QUFFQSxhQUFLRyxXQUFMO0FBQ0EsYUFBS0MsUUFBTCxDQUFjLEtBQUtGLEtBQW5CO0FBQ0E7QUFDQSxhQUFLUCxJQUFMLENBQVVVLFdBQVYsR0FBd0I7QUFBQSxtQkFBTSxLQUFOO0FBQUEsU0FBeEI7QUFDSDs7OztzQ0FFYTtBQUFBOztBQUNWLGlCQUFLVixJQUFMLENBQVVXLGdCQUFWLENBQTJCLFdBQTNCLEVBQXdDLFVBQUNDLENBQUQsRUFBTztBQUMzQyxvQkFBR0EsRUFBRUMsS0FBRixLQUFZLENBQWYsRUFBa0I7QUFBRTtBQUNoQiwwQkFBS1QsU0FBTCxHQUFpQixJQUFqQjtBQUNBLDBCQUFLVSxZQUFMLENBQWtCRixDQUFsQjtBQUNIO0FBQ0osYUFMRDs7QUFPQUcscUJBQVNKLGdCQUFULENBQTBCLFdBQTFCLEVBQXVDLFVBQUNDLENBQUQsRUFBTztBQUMxQyxvQkFBRyxNQUFLUixTQUFSLEVBQW1CO0FBQ2YsMEJBQUtVLFlBQUwsQ0FBa0JGLENBQWxCO0FBQ0g7QUFDSixhQUpEOztBQU1BRyxxQkFBU0osZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUMsVUFBQ0MsQ0FBRCxFQUFPO0FBQ3hDLG9CQUFHLE1BQUtSLFNBQVIsRUFBbUI7QUFDZiwwQkFBS0EsU0FBTCxHQUFpQixLQUFqQjtBQUNBLDBCQUFLVSxZQUFMLENBQWtCRixDQUFsQjtBQUNIO0FBQ0osYUFMRDtBQU1IOzs7aUNBRVFMLEssRUFBTztBQUNaLGdCQUFNUyxhQUFhVCxRQUFRLENBQVIsR0FBWSxDQUFaLEdBQWlCQSxRQUFRLENBQVIsR0FBWSxDQUFaLEdBQWdCQSxLQUFwRDs7QUFFQSxpQkFBS0EsS0FBTCxHQUFhUyxVQUFiOztBQUVBLGdCQUFHLGtCQUFXLEtBQUtiLFFBQWhCLENBQUgsRUFBOEI7QUFDMUIscUJBQUtBLFFBQUwsQ0FBY2EsVUFBZDtBQUNIOztBQUVELG1CQUFPLElBQVA7QUFDSDs7O3FDQUVZSixDLEVBQUc7QUFDWixnQkFBTUssTUFBTSxLQUFLakIsSUFBTCxDQUFVa0IscUJBQVYsRUFBWjs7QUFFQSxnQkFBSUMsUUFBUSxJQUFaO0FBQ0EsZ0JBQUcsS0FBS2pCLFFBQVIsRUFBa0I7QUFDZGlCLHdCQUFRLElBQUssQ0FBQ1AsRUFBRVEsT0FBRixHQUFZSCxJQUFJSSxHQUFqQixJQUF3QixLQUFLckIsSUFBTCxDQUFVc0IsWUFBL0M7QUFDSCxhQUZELE1BRU87QUFDSEgsd0JBQVEsQ0FBQ1AsRUFBRVcsT0FBRixHQUFZTixJQUFJTyxJQUFqQixJQUF5QixLQUFLeEIsSUFBTCxDQUFVeUIsV0FBM0M7QUFDSDs7QUFFRCxpQkFBS2hCLFFBQUwsQ0FBY1UsS0FBZDs7QUFFQSxtQkFBTyxJQUFQO0FBQ0g7Ozs7OztrQkFoRWdCcEIsTSIsImZpbGUiOiJTbGlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi8nO1xuXG4vLyBUT0RPOiDQlNC+0LHQsNCy0LjRgtGMIG1pbiDQuCBtYXgg0LfQvdCw0YfQtdC90LjRjyDQuCDRhdGA0LDQvdC40YLRjCDQt9C90LDRh9C10L3QuNGPINC40Lcg0Y3RgtC+0LPQviDQuNC90YLQtdGA0LLQsNC70LBcbi8vIFRPRE86INCU0L7QsdCw0LLQuNGC0Ywg0LTQtdGE0L7Qu9GC0L3Ri9C1INC/0LDRgNCw0LzQtdGC0YDRi1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2xpZGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihub2RlLCBvcHRpb25zPXt9KSB7XG4gICAgICAgIHRoaXMubm9kZSA9IG5vZGU7XG4gICAgICAgIC8vIHRoaXMuZmlsbGVkTm9kZSA9IFxuICAgICAgICB0aGlzLnZlcnRpY2FsID0gb3B0aW9ucy52ZXJ0aWNhbCB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5vbmNoYW5nZSA9IG9wdGlvbnMub25jaGFuZ2U7XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMubWluID0gb3B0aW9ucy5taW4gfHwgMDtcbiAgICAgICAgdGhpcy5tYXggPSBvcHRpb25zLm1heCB8fCAxO1xuICAgICAgICB0aGlzLnZhbHVlID0gb3B0aW9ucy52YWx1ZSB8fCB0aGlzLm1pbjtcblxuICAgICAgICB0aGlzLl9iaW5kRXZlbnRzKCk7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy52YWx1ZSk7XG4gICAgICAgIC8vY2hyb21lIGJ1ZyB3aXRoIG1vdXNlbW92ZVxuICAgICAgICB0aGlzLm5vZGUub25kcmFnc3RhcnQgPSAoKSA9PiBmYWxzZTtcbiAgICB9XG5cbiAgICBfYmluZEV2ZW50cygpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChlKSA9PiB7XG4gICAgICAgICAgICBpZihlLndoaWNoID09PSAxKSB7IC8vbGVmdCBtb3VzZSBidXR0b25cbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdnYWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlVmFsdWUoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChlKSA9PiB7XG4gICAgICAgICAgICBpZih0aGlzLmRyYWdnYWJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVZhbHVlKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGUpID0+IHtcbiAgICAgICAgICAgIGlmKHRoaXMuZHJhZ2dhYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVWYWx1ZShlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2V0VmFsdWUodmFsdWUpIHtcbiAgICAgICAgY29uc3QgdmFsaWRWYWx1ZSA9IHZhbHVlID4gMSA/IDEgOiAodmFsdWUgPCAwID8gMCA6IHZhbHVlKTtcblxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsaWRWYWx1ZTtcbiAgICAgICAgXG4gICAgICAgIGlmKGlzRnVuY3Rpb24odGhpcy5vbmNoYW5nZSkpIHtcbiAgICAgICAgICAgIHRoaXMub25jaGFuZ2UodmFsaWRWYWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfdXBkYXRlVmFsdWUoZSkge1xuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLm5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgbGV0IHJhdGlvID0gbnVsbDtcbiAgICAgICAgaWYodGhpcy52ZXJ0aWNhbCkge1xuICAgICAgICAgICAgcmF0aW8gPSAxIC0gKChlLmNsaWVudFkgLSBwb3MudG9wKSAvIHRoaXMubm9kZS5vZmZzZXRIZWlnaHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmF0aW8gPSAoZS5jbGllbnRYIC0gcG9zLmxlZnQpIC8gdGhpcy5ub2RlLm9mZnNldFdpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRWYWx1ZShyYXRpbyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIl19
},{"./":9}],9:[function(require,module,exports){
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