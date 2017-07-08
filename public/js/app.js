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
        _this._createAudioApiNodes();
        _this._gain.gain.value = 0.1;
        return _this;
    }

    _createClass(AudioPlayer, [{
        key: 'play',
        value: function play() {
            var _this2 = this;

            if (this.isPlaying) {
                return this;
            }
            console.log('Playing track id=' + this.currentTrackIndex);

            if (!this._playback.track) {
                this._setTrack();
            }

            var track = this._playback.track;
            if (track.audio && track.isBuffered()) {
                track.audio.play();
                this._playback.playing = true;
            } else {
                track.load();
                //Subscribe
                track.on('canplay', this._startPlayback.bind(this));
                track.on('ended', this.playNext.bind(this));
                track.on('progress', function (e) {
                    _this2.emit('track:progress', e);
                });
                track.on('loadeddata', function (e) {
                    _this2.emit('track:loadeddata', e);
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
            this._resetPlaybackInfo();

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

            this.currentTrackIndex -= 1;
            this.play();

            return this;
        }
    }, {
        key: '_setTrack',
        value: function _setTrack() {
            if (this.isPlaying) {
                return this;
            }

            this._playback.track = this.playlist.getTrack(this.currentTrackIndex);

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

            playback.startTime = this._ctx.currentTime;
            playback.source = this._ctx.createMediaElementSource(track.audio);
            playback.source.connect(this._gain);

            console.log('Loaded - ' + playback.track.src);
            playback.playing = true;
            track.audio.play();

            //Unsubscribe because changing current time triggering 'canplay' event
            track.off('canplay', this._startPlayback.bind(this));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvUGxheWVyLmpzIl0sIm5hbWVzIjpbIlBMQVlJTkdfVElNRSIsIkF1ZGlvUGxheWVyIiwidHJhY2tzIiwicGFyYW1zIiwicGxheWxpc3QiLCJtdXRlZCIsImN1cnJlbnRUcmFja0luZGV4IiwiX3BsYXliYWNrIiwiX3Jlc2V0UGxheWJhY2tJbmZvIiwiX3NldFRyYWNrIiwiX2N0eCIsIl9nYWluIiwiX2NyZWF0ZUF1ZGlvQXBpTm9kZXMiLCJnYWluIiwidmFsdWUiLCJpc1BsYXlpbmciLCJjb25zb2xlIiwibG9nIiwidHJhY2siLCJhdWRpbyIsImlzQnVmZmVyZWQiLCJwbGF5IiwicGxheWluZyIsImxvYWQiLCJvbiIsIl9zdGFydFBsYXliYWNrIiwiYmluZCIsInBsYXlOZXh0IiwiZSIsImVtaXQiLCJwYXVzZSIsImN1cnJlbnRUaW1lIiwic3RvcCIsImdldFRyYWNrIiwic291cmNlIiwicGxheWJhY2siLCJzdGFydFRpbWUiLCJjcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UiLCJjb25uZWN0Iiwic3JjIiwib2ZmIiwid2luZG93IiwiQXVkaW9Db250ZXh0Iiwid2Via2l0QXVkaW9Db250ZXh0IiwiX2Rlc3QiLCJkZXN0aW5hdGlvbiIsImNyZWF0ZUdhaW4iLCJFcnJvciIsIm11dGUiLCJ1bm11dGUiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsZUFBZSxDQUFyQixDLENBQXdCOztJQUVIQyxXOzs7QUFDakIsMkJBQW9DO0FBQUEsWUFBeEJDLE1BQXdCLHVFQUFqQixFQUFpQjtBQUFBLFlBQWJDLE1BQWEsdUVBQUosRUFBSTs7QUFBQTs7QUFBQTs7QUFHaEMsY0FBS0MsUUFBTCxHQUFnQix1QkFBYUYsTUFBYixDQUFoQjtBQUNBLGNBQUtHLEtBQUwsR0FBYSxLQUFiO0FBQ0EsY0FBS0MsaUJBQUwsR0FBeUIsQ0FBekI7QUFDQSxjQUFLQyxTQUFMLEdBQWlCLEVBQWpCO0FB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WUUsSUFBWjs7QUFFQTtBQUNBSCxrQkFBTXNCLEdBQU4sQ0FBVSxTQUFWLEVBQXFCLEtBQUtmLGNBQUwsQ0FBb0JDLElBQXBCLENBQXlCLElBQXpCLENBQXJCOztBQUVBLG1CQUFPLElBQVA7QUFDSDs7OytDQUVzQjtBQUNuQixpQkFBS2hCLElBQUwsR0FBWSxLQUFLK0IsT0FBT0MsWUFBUCxJQUF1QkQsT0FBT0Usa0JBQW5DLEdBQVo7QUFDQSxpQkFBS0MsS0FBTCxHQUFhLEtBQUtsQyxJQUFMLENBQVVtQyxXQUF2QjtBQUNBLGlCQUFLbEMsS0FBTCxHQUFhLEtBQUtELElBQUwsQ0FBVW9DLFVBQVYsRUFBYjs7QUFFQTtBQUNBLGlCQUFLbkMsS0FBTCxDQUFXMkIsT0FBWCxDQUFtQixLQUFLTSxLQUF4Qjs7QUFFQSxtQkFBTyxJQUFQO0FBQ0g7Ozs0QkFyS2U7QUFDWixtQkFBTyxLQUFLckMsU0FBTCxDQUFlZSxPQUF0QjtBQUNIOzs7NEJBRVk7QUFDVCxtQkFBTyxLQUFLWCxLQUFMLENBQVdFLElBQVgsQ0FBZ0JDLEtBQXZCO0FBQ0gsUzswQkFFVUEsSyxFQUFPO0FBQ2QsZ0JBQUdBLFFBQVEsQ0FBUixJQUFhQSxRQUFRLENBQXhCLEVBQTJCO0FBQ3ZCLHNCQUFNaUMsTUFBTSxxQ0FBTixDQUFOO0FBQ0g7QUFDRCxnQkFBR2pDLFVBQVUsQ0FBYixFQUFnQjtBQUNaLHFCQUFLa0MsSUFBTDtBQUNILGFBRkQsTUFFTyxJQUFHLEtBQUszQyxLQUFSLEVBQWU7QUFDbEIscUJBQUs0QyxNQUFMO0FBQ0g7QUFDRCxpQkFBS3RDLEtBQUwsQ0FBV0UsSUFBWCxDQUFnQkMsS0FBaEIsR0FBd0JBLEtBQXhCO0FBQ0g7Ozs7OztrQkFwQ2dCYixXIiwiZmlsZSI6IkF1ZGlvUGxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBQbGF5bGlzdCBmcm9tICcuL1BsYXlsaXN0JztcbmltcG9ydCBUcmFjayBmcm9tICcuL1RyYWNrJztcbmltcG9ydCBFdmVudEVtbWl0ZXIgZnJvbSAnLi91dGlscy9FdmVudEVtbWl0ZXInO1xuXG5jb25zdCBQTEFZSU5HX1RJTUUgPSA1OyAvL2ZvciB0ZXN0XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1ZGlvUGxheWVyIGV4dGVuZHMgRXZlbnRFbW1pdGVyIHtcbiAgICBjb25zdHJ1Y3Rvcih0cmFja3M9W10sIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5wbGF5bGlzdCA9IG5ldyBQbGF5bGlzdCh0cmFja3MpO1xuICAgICAgICB0aGlzLm11dGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY3VycmVudFRyYWNrSW5kZXggPSAwO1xuICAgICAgICB0aGlzLl9wbGF5YmFjayA9IHt9XG4gICAgICAgIHRoaXMuX3Jlc2V0UGxheWJhY2tJbmZvKCk7XG4gICAgICAgIHRoaXMuX3NldFRyYWNrKCk7XG5cbiAgICAgICAgLy8gaW5pdCBBdWRpbyBBUEkgTm9kZXNcbiAgICAgICAgdGhpcy5fY3R4ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZ2FpbiA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NyZWF0ZUF1ZGlvQXBpTm9kZXMoKTtcbiAgICAgICAgdGhpcy5fZ2Fpbi5nYWluLnZhbHVlID0gMC4xO1xuICAgIH1cblxuICAgIGdldCBpc1BsYXlpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wbGF5YmFjay5wbGF5aW5nO1xuICAgIH1cbiAgICBcbiAgICBnZXQgdm9sdW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2Fpbi5nYWluLnZhbHVlO1xuICAgIH1cblxuICAgIHNldCB2b2x1bWUodmFsdWUpIHtcbiAgICAgICAgaWYodmFsdWUgPiAxICYmIHZhbHVlIDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1ZvbHVtZSBtdXN0IGJlIGluIHJhbmdlIGZyb20gMCB0byAxJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYodmFsdWUgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMubXV0ZSgpO1xuICAgICAgICB9IGVsc2UgaWYodGhpcy5tdXRlZCkge1xuICAgICAgICAgICAgdGhpcy51bm11dGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9nYWluLmdhaW4udmFsdWUgPSB2YWx1ZTsgXG4gICAgfVxuXG4gICAgcGxheSgpIHtcbiAgICAgICAgaWYodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGBQbGF5aW5nIHRyYWNrIGlkPSR7dGhpcy5jdXJyZW50VHJhY2tJbmRleH1gKTtcblxuXG4gICAgICAgIGlmKCF0aGlzLl9wbGF5YmFjay50cmFjaykge1xuICAgICAgICAgICAgdGhpcy5fc2V0VHJhY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRyYWNrID0gdGhpcy5fcGxheWJhY2sudHJhY2s7XG4gICAgICAgIGlmKHRyYWNrLmF1ZGlvICYmIHRyYWNrLmlzQnVmZmVyZWQoKSkge1xuICAgICAgICAgICAgdHJhY2suYXVkaW8ucGxheSgpO1xuICAgICAgICAgICAgdGhpcy5fcGxheWJhY2sucGxheWluZyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cmFjay5sb2FkKCk7XG4gICAgICAgICAgICAvL1N1YnNjcmliZVxuICAgICAgICAgICAgdHJhY2sub24oJ2NhbnBsYXknLCB0aGlzLl9zdGFydFBsYXliYWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdHJhY2sub24oJ2VuZGVkJywgdGhpcy5wbGF5TmV4dC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRyYWNrLm9uKCdwcm9ncmVzcycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd0cmFjazpwcm9ncmVzcycsIGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0cmFjay5vbignbG9hZGVkZGF0YScsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd0cmFjazpsb2FkZWRkYXRhJywgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRyYWNrLm9uKCdsb2FkZWRtZXRhZGF0YScsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd0cmFjazpsb2FkZWRtZXRhZGF0YScsIGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0cmFjay5vbigndGltZXVwZGF0ZScsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd0cmFjazp0aW1ldXBkYXRlJywgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuX3BsYXliYWNrLnBsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgdHJhY2sgPSB0aGlzLl9wbGF5YmFjay50cmFjaztcbiAgICAgICAgdHJhY2suYXVkaW8ucGF1c2UoKTtcbiAgICAgICAgdHJhY2suYXVkaW8uY3VycmVudFRpbWUgPSAwO1xuICAgICAgICB0aGlzLl9yZXNldFBsYXliYWNrSW5mbygpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHBhdXNlKCkge1xuICAgICAgICB0aGlzLl9wbGF5YmFjay5wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHRyYWNrID0gdGhpcy5fcGxheWJhY2sudHJhY2s7XG4gICAgICAgIHRyYWNrLmF1ZGlvLnBhdXNlKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdQQVVTRUQnKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBtdXRlKCkge1xuICAgICAgICB0aGlzLl9wbGF5YmFjay50cmFjay5tdXRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMubXV0ZWQgPSB0cnVlO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHVubXV0ZSgpIHtcbiAgICAgICAgdGhpcy5fcGxheWJhY2sudHJhY2subXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHBsYXlOZXh0KCkge1xuICAgICAgICBpZih0aGlzLmlzUGxheWluZykge1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRUcmFja0luZGV4ICs9IDE7XG4gICAgICAgIHRoaXMucGxheSgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHBsYXlQcmV2KCkge1xuICAgICAgICBpZih0aGlzLmlzUGxheWluZykge1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRUcmFja0luZGV4IC09IDE7XG4gICAgICAgIHRoaXMucGxheSgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9zZXRUcmFjaygpIHtcbiAgICAgICAgaWYodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fcGxheWJhY2sudHJhY2sgPSB0aGlzLnBsYXlsaXN0LmdldFRyYWNrKHRoaXMuY3VycmVudFRyYWNrSW5kZXgpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9yZXNldFBsYXliYWNrSW5mbygpIHtcbiAgICAgICAgdGhpcy5fcGxheWJhY2sgPSB7XG4gICAgICAgICAgICB0cmFjazogbnVsbCxcbiAgICAgICAgICAgIHNvdXJjZTogbnVsbCxcbiAgICAgICAgICAgIHBsYXlpbmc6IGZhbHNlLFxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdSRVNFVCBQTEFZQkFDSycpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9zdGFydFBsYXliYWNrKCkge1xuICAgICAgICBpZih0aGlzLmlzUGxheWluZykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0FscmVhZHkgcGxheWluZyExJyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBsYXliYWNrID0gdGhpcy5fcGxheWJhY2s7XG4gICAgICAgIGNvbnN0IHRyYWNrID0gdGhpcy5fcGxheWJhY2sudHJhY2s7XG4gICAgICAgIFxuICAgICAgICBwbGF5YmFjay5zdGFydFRpbWUgPSB0aGlzLl9jdHguY3VycmVudFRpbWU7XG4gICAgICAgIHBsYXliYWNrLnNvdXJjZSA9IHRoaXMuX2N0eC5jcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UodHJhY2suYXVkaW8pO1xuICAgICAgICBwbGF5YmFjay5zb3VyY2UuY29ubmVjdCh0aGlzLl9nYWluKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhgTG9hZGVkIC0gJHtwbGF5YmFjay50cmFjay5zcmN9YCk7XG4gICAgICAgIHBsYXliYWNrLnBsYXlpbmcgPSB0cnVlO1xuICAgICAgICB0cmFjay5hdWRpby5wbGF5KCk7XG5cbiAgICAgICAgLy9VbnN1YnNjcmliZSBiZWNhdXNlIGNoYW5naW5nIGN1cnJlbnQgdGltZSB0cmlnZ2VyaW5nICdjYW5wbGF5JyBldmVudFxuICAgICAgICB0cmFjay5vZmYoJ2NhbnBsYXknLCB0aGlzLl9zdGFydFBsYXliYWNrLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9jcmVhdGVBdWRpb0FwaU5vZGVzKCkge1xuICAgICAgICB0aGlzLl9jdHggPSBuZXcgKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCkoKTtcbiAgICAgICAgdGhpcy5fZGVzdCA9IHRoaXMuX2N0eC5kZXN0aW5hdGlvbjtcbiAgICAgICAgdGhpcy5fZ2FpbiA9IHRoaXMuX2N0eC5jcmVhdGVHYWluKCk7XG5cbiAgICAgICAgLy8gQ29ubmVjdCBOb2Rlc1xuICAgICAgICB0aGlzLl9nYWluLmNvbm5lY3QodGhpcy5fZGVzdCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIl19
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
                console.log(this.tracks);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXlsaXN0LmpzIl0sIm5hbWVzIjpbIlBsYXlsaXN0IiwidHJhY2tzIiwiX3RyYWNrcyIsImFkZFRyYWNrTGlzdCIsImlkIiwidHJhY2siLCJjb25zb2xlIiwibG9nIiwiRXJyb3IiLCJzcmMiLCJuYW1lIiwicHVzaCIsImxpc3QiLCJmb3JFYWNoIiwiYWRkVHJhY2siXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7O0lBRXFCQSxRO0FBQ2pCLHdCQUF1QjtBQUFBLFlBQVhDLE1BQVcsdUVBQUosRUFBSTs7QUFBQTs7QUFDbkIsYUFBS0MsT0FBTCxHQUFlLEVBQWY7QUFDQSxhQUFLQyxZQUFMLENBQWtCRixNQUFsQjtBQUNIOzs7O2lDQU1RRyxFLEVBQUk7QUFDVCxnQkFBTUMsUUFBUSxLQUFLSCxPQUFMLENBQWFFLEVBQWIsQ0FBZDtBQUNBLGdCQUFHQyxLQUFILEVBQVU7QUFDTix1QkFBT0EsS0FBUDtBQUNILGFBRkQsTUFFTztBQUNIQyx3QkFBUUMsR0FBUixDQUFZLEtBQUtOLE1BQWpCO0FBQ0Esc0JBQU1PLHlCQUF1QkosRUFBdkIsaUNBQU47QUFDSDtBQUNKOzs7aUNBRVFLLEcsRUFBZ0I7QUFBQSxnQkFBWEMsSUFBVyx1RUFBSixFQUFJOztBQUNyQixnQkFBTUwsUUFBUSxvQkFBVUksR0FBVixFQUFlQyxJQUFmLENBQWQ7QUFDQSxpQkFBS1QsTUFBTCxDQUFZVSxJQUFaLENBQWlCTixLQUFqQjs7QUFFQSxtQkFBTyxJQUFQO0FBQ0g7OztxQ0FFWU8sSSxFQUFNO0FBQUE7O0FBQ2ZBLGlCQUFLQyxPQUFMLENBQWEsVUFBQ1IsS0FBRCxFQUFXO0FBQ3BCLG9CQUFHLE9BQU9BLEtBQVAsS0FBaUIsUUFBcEIsRUFBOEI7QUFDMUJDLDRCQUFRQyxHQUFSLENBQVksS0FBWixFQUFtQkYsS0FBbkI7QUFDQSwwQkFBS1MsUUFBTCxDQUFjVCxLQUFkO0FBQ0gsaUJBSEQsTUFHTyxJQUFHLFFBQU9BLEtBQVAseUNBQU9BLEtBQVAsT0FBaUIsUUFBcEIsRUFBOEI7QUFBQSx3QkFDekJJLEdBRHlCLEdBQ1hKLEtBRFcsQ0FDekJJLEdBRHlCO0FBQUEsd0JBQ3BCQyxJQURvQixHQUNYTCxLQURXLENBQ3BCSyxJQURvQjs7QUFFakNKLDRCQUFRQyxHQUFSLENBQVksS0FBWixFQUFtQkUsR0FBbkIsRUFBd0JDLElBQXhCO0FBQ0EsMEJBQUtJLFFBQUwsQ0FBY0wsR0FBZCxFQUFtQkMsSUFBbkI7QUFDSDtBQUNKLGFBVEQ7QUFVSDs7OzRCQWhDWTtBQUNULG1CQUFPLEtBQUtSLE9BQVo7QUFDSDs7Ozs7O2tCQVJnQkYsUSIsImZpbGUiOiJQbGF5bGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgVHJhY2sgZnJvbSAnLi9UcmFjayc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXlsaXN0IHtcbiAgICBjb25zdHJ1Y3Rvcih0cmFja3M9W10pIHtcbiAgICAgICAgdGhpcy5fdHJhY2tzID0gW107XG4gICAgICAgIHRoaXMuYWRkVHJhY2tMaXN0KHRyYWNrcyk7XG4gICAgfVxuXG4gICAgZ2V0IHRyYWNrcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYWNrcztcbiAgICB9XG5cbiAgICBnZXRUcmFjayhpZCkge1xuICAgICAgICBjb25zdCB0cmFjayA9IHRoaXMuX3RyYWNrc1tpZF07XG4gICAgICAgIGlmKHRyYWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJhY2s7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnRyYWNrcyk7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihgVHJhY2sgd2l0aCBpZD0ke2lkfSBkb3Nlbid0IGV4aXN0IGluIHBsYXlsaXN0YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRUcmFjayhzcmMsIG5hbWUgPSAnJykge1xuICAgICAgICBjb25zdCB0cmFjayA9IG5ldyBUcmFjayhzcmMsIG5hbWUpO1xuICAgICAgICB0aGlzLnRyYWNrcy5wdXNoKHRyYWNrKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhZGRUcmFja0xpc3QobGlzdCkge1xuICAgICAgICBsaXN0LmZvckVhY2goKHRyYWNrKSA9PiB7XG4gICAgICAgICAgICBpZih0eXBlb2YgdHJhY2sgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3N0cicsIHRyYWNrKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRyYWNrKHRyYWNrKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZih0eXBlb2YgdHJhY2sgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzcmMsIG5hbWUgfSA9IHRyYWNrO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdvYmonLCBzcmMsIG5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkVHJhY2soc3JjLCBuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSJdfQ==
},{"./Track":3}],3:[function(require,module,exports){
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

    function Track(src) {
        var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        _classCallCheck(this, Track);

        var _this = _possibleConstructorReturn(this, (Track.__proto__ || Object.getPrototypeOf(Track)).call(this));

        _this._src = src;
        _this._name = name;
        _this._buffer = null;
        _this._audio = new Audio();
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
            this._audio.addEventListener('loadedmetadata', function (e) {
                _this2.emit('loadedmetadata', e);
            });
            this._audio.addEventListener('timeupdate', function (e) {
                console.log(e);
                _this2.emit('timeupdate', e);
            });

            this._audio.crossOrigin = "anonymous";
            this._audio.src = this._src;

            return this;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRyYWNrLmpzIl0sIm5hbWVzIjpbIlRyYWNrIiwic3JjIiwibmFtZSIsIl9zcmMiLCJfbmFtZSIsIl9idWZmZXIiLCJfYXVkaW8iLCJBdWRpbyIsImJ1ZmZlcmVkIiwibGVuZ3RoIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJlbWl0IiwiY29uc29sZSIsImxvZyIsImNyb3NzT3JpZ2luIiwidmFsdWUiLCJtdXRlZCJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7OztJQUVxQkEsSzs7O0FBQ2pCLG1CQUFZQyxHQUFaLEVBQTBCO0FBQUEsWUFBVEMsSUFBUyx1RUFBSixFQUFJOztBQUFBOztBQUFBOztBQUd0QixjQUFLQyxJQUFMLEdBQVlGLEdBQVo7QUFDQSxjQUFLRyxLQUFMLEdBQWFGLElBQWI7QUFDQSxjQUFLRyxPQUFMLEdBQWUsSUFBZjtBQUNBLGNBQUtDLE1BQUwsR0FBYyxJQUFJQyxLQUFKLEVBQWQ7QUFOc0I7QUFPekI7Ozs7cUNBa0JZO0FBQ1QsbUJBQU8sS0FBS0QsTUFBTCxDQUFZRSxRQUFaLENBQXFCQyxNQUFyQixHQUE4QixDQUFyQztBQUNIOzs7K0JBRU07QUFBQTs7QUFDSCxpQkFBS0gsTUFBTCxDQUFZSSxnQkFBWixDQUE2QixTQUE3QixFQUF3QyxVQUFDQyxDQUFELEVBQU87QUFDM0MsdUJBQUtDLElBQUwsQ0FBVSxTQUFWLEVBQXFCRCxDQUFyQjtBQUNILGFBRkQ7QUFHQSxpQkFBS0wsTUFBTCxDQUFZSSxnQkFBWixDQUE2QixPQUE3QixFQUFzQyxZQUFNO0FBQ3hDLHVCQUFLRSxJQUFMLENBQVUsT0FBVjtBQUNILGFBRkQ7QUFHQSxpQkFBS04sTUFBTCxDQUFZSSxnQkFBWixDQUE2QixVQUE3QixFQUF5QyxVQUFDQyxDQUFELEVBQU87QUFDNUMsdUJBQUtDLElBQUwsQ0FBVSxVQUFWLEVBQXNCRCxDQUF0QjtBQUNILGFBRkQ7QUFHQSxpQkFBS0wsTUFBTCxDQUFZSSxnQkFBWixDQUE2QixZQUE3QixFQUEyQyxVQUFDQyxDQUFELEVBQU87QUFDOUMsdUJBQUtDLElBQUwsQ0FBVSxZQUFWLEVBQXdCRCxDQUF4QjtBQUNILGFBRkQ7QUFHQSxpQkFBS0wsTUFBTCxDQUFZSSxnQkFBWixDQUE2QixnQkFBN0IsRUFBK0MsVUFBQ0MsQ0FBRCxFQUFPO0FBQ2xELHVCQUFLQyxJQUFMLENBQVUsZ0JBQVYsRUFBNEJELENBQTVCO0FBQ0gsYUFGRDtBQUdBLGlCQUFLTCxNQUFMLENBQVlJLGdCQUFaLENBQTZCLFlBQTdCLEVBQTJDLFVBQUNDLENBQUQsRUFBTztBQUM5Q0Usd0JBQVFDLEdBQVIsQ0FBWUgsQ0FBWjtBQUNBLHVCQUFLQyxJQUFMLENBQVUsWUFBVixFQUF3QkQsQ0FBeEI7QUFDSCxhQUhEOztBQUtBLGlCQUFLTCxNQUFMLENBQVlTLFdBQVosR0FBMEIsV0FBMUI7QUFDQSxpQkFBS1QsTUFBTCxDQUFZTCxHQUFaLEdBQWtCLEtBQUtFLElBQXZCOztBQUVBLG1CQUFPLElBQVA7QUFDSDs7OzRCQTdDUztBQUNOLG1CQUFPLEtBQUtBLElBQVo7QUFDSDs7OzRCQUVVO0FBQ1AsbUJBQU8sS0FBS0MsS0FBWjtBQUNIOzs7NEJBRVc7QUFDUixtQkFBTyxLQUFLRSxNQUFaO0FBQ0g7OzswQkFFU1UsSyxFQUFPO0FBQ2IsaUJBQUtWLE1BQUwsQ0FBWVcsS0FBWixHQUFvQixDQUFDLENBQUNELEtBQXRCO0FBQ0g7Ozs7OztrQkF4QmdCaEIsSztBQXdEcEIiLCJmaWxlIjoiVHJhY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IEV2ZW50RW1taXRlciBmcm9tICcuL3V0aWxzL0V2ZW50RW1taXRlci5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNrIGV4dGVuZHMgRXZlbnRFbW1pdGVye1xuICAgIGNvbnN0cnVjdG9yKHNyYywgbmFtZT0nJykge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuX3NyYyA9IHNyYztcbiAgICAgICAgdGhpcy5fbmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuX2J1ZmZlciA9IG51bGw7XG4gICAgICAgIHRoaXMuX2F1ZGlvID0gbmV3IEF1ZGlvKCk7XG4gICAgfVxuXG4gICAgZ2V0IHNyYygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NyYztcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuXG4gICAgZ2V0IGF1ZGlvKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXVkaW87XG4gICAgfVxuXG4gICAgc2V0IG11dGVkKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2F1ZGlvLm11dGVkID0gISF2YWx1ZTtcbiAgICB9XG5cbiAgICBpc0J1ZmZlcmVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXVkaW8uYnVmZmVyZWQubGVuZ3RoID4gMDtcbiAgICB9XG5cbiAgICBsb2FkKCkge1xuICAgICAgICB0aGlzLl9hdWRpby5hZGRFdmVudExpc3RlbmVyKCdjYW5wbGF5JywgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnY2FucGxheScsIGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2VuZGVkJyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9hdWRpby5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3Byb2dyZXNzJywgZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9hdWRpby5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRkYXRhJywgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnbG9hZGVkZGF0YScsIGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVkbWV0YWRhdGEnLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdsb2FkZWRtZXRhZGF0YScsIGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcigndGltZXVwZGF0ZScsIChlKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgndGltZXVwZGF0ZScsIGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuX2F1ZGlvLmNyb3NzT3JpZ2luID0gXCJhbm9ueW1vdXNcIjtcbiAgICAgICAgdGhpcy5fYXVkaW8uc3JjID0gdGhpcy5fc3JjO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn07XG4iXX0=
},{"./utils/EventEmmiter.js":6}],4:[function(require,module,exports){
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

var tracks = ["https://psv4.userapi.com/c813426/u371745449/audios/9c1312192a1f.mp3?extra=VJaBPkT9cAnq5pm3Awnbc7XC0YZYmz5-VQuceGER_P6cWML5Lwx8P9h_ucpPc9YLfsgCF-X-BZ6jbW12151MZSnHhsknnC09vP1rVFY0CWjd-UAWLwoOaDyF-cgBUZrPBh4-kGjeYM43-mA", './../media/02 - Needles.mp3', './../media/03 - Deer Dance.mp3', './../media/04 - Jet Pilot.mp3', './../media/05 - X.mp3', './../media/06 - Chop Suey!.mp3'];

var playerNode = document.getElementById("player");
var playBtn = document.querySelector('.player-controls__btn_play');
var playNextBtn = document.querySelector('.player-controls__btn_next');
var playPrevBtn = document.querySelector('.player-controls__btn_prev');

var volumeBtn = document.querySelector('.volume__btn');
var volumeSliderNode = document.querySelector('.volume__slider');
var volumeSliderFilled = document.querySelector('.volume__slider .slider__filled');

var progressBuffer = document.querySelector('.progress__buffer');
var progressLine = document.querySelector('.progress__line');

function setVolume(value) {
    var icon = volumeBtn.children[0];
    var validValue = value > 1 ? 1 : value < 0 ? 0 : value;
    if (validValue === 0) {
        icon.classList.remove('volume__icon_half');
        icon.classList.add('volume__icon_mute');
    }
    if (validValue > 0 && validValue <= 0.5) {
        icon.classList.remove('volume__icon_mute');
        icon.classList.add('volume__icon_half');
    }
    if (validValue > 0.5) {
        icon.classList.remove('volume__icon_mute');
        icon.classList.remove('volume__icon_half');
    }
    volumeSliderFilled.style.width = validValue * 100 + '%';
    player.volume = validValue;
}

var player = new _AudioPlayer2.default(tracks);
setVolume(player.volume);
// player.playlist.addTrack(['./../media/System_Of_A_Down_-_Aerials.mp3']);
// player.playlist.addTrackList(tracks);


function updateBuffer(e) {
    var audio = e.target;
    var buffered = audio.buffered;
    var buffRatio = buffered.length ? buffered.end(buffered.length - 1) / audio.duration * 100 : 0;

    progressBuffer.style.width = buffRatio + '%';
}

player.on('track:progress', updateBuffer);
player.on('track:loadeddata', updateBuffer);
player.on('track:timeupdate', function (e) {
    var audio = e.target;
    var playedRatio = audio.currentTime / audio.duration * 100;
    progressLine.style.width = playedRatio + '%';
});

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

// Volume settings
// let volumeDraggable = false;
var updateVolume = function updateVolume(e) {
    var ratio = (e.clientX - volumeSliderNode.offsetLeft) / volumeSliderNode.offsetWidth;
    setVolume(ratio);
};

var volumeSlider = new _Slider2.default(volumeSliderNode, updateVolume);

// volumeSliderNode.addEventListener('mousedown', (e) => {
//     if(e.which === 1) { //left mouse button
//         volumeDraggable = true;
//         updateVolume(e);
//     }
// });

// document.addEventListener('mousemove', (e) => {
//     if(volumeDraggable) {
//         updateVolume(e);
//     }
// });

// document.addEventListener('mouseup', (e) => {
//     if(volumeDraggable) {
//         volumeDraggable = false;
//         updateVolume(e);
//     }
// });

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
    var newValue = player.volume + Math.sign(e.wheelDeltaY) * 0.05;
    setVolume(newValue);
});

volumeSliderNode.addEventListener('wheel', function (e) {
    var newValue = player.volume + Math.sign(e.wheelDeltaY) * 0.05;
    setVolume(newValue);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfZDFhMDgzYWQuanMiXSwibmFtZXMiOlsidHJhY2tzIiwicGxheWVyTm9kZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwbGF5QnRuIiwicXVlcnlTZWxlY3RvciIsInBsYXlOZXh0QnRuIiwicGxheVByZXZCdG4iLCJ2b2x1bWVCdG4iLCJ2b2x1bWVTbGlkZXJOb2RlIiwidm9sdW1lU2xpZGVyRmlsbGVkIiwicHJvZ3Jlc3NCdWZmZXIiLCJwcm9ncmVzc0xpbmUiLCJzZXRWb2x1bWUiLCJ2YWx1ZSIsImljb24iLCJjaGlsZHJlbiIsInZhbGlkVmFsdWUiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJhZGQiLCJzdHlsZSIsIndpZHRoIiwicGxheWVyIiwidm9sdW1lIiwidXBkYXRlQnVmZmVyIiwiZSIsImF1ZGlvIiwidGFyZ2V0IiwiYnVmZmVyZWQiLCJidWZmUmF0aW8iLCJsZW5ndGgiLCJlbmQiLCJkdXJhdGlvbiIsIm9uIiwicGxheWVkUmF0aW8iLCJjdXJyZW50VGltZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJpc1BsYXlpbmciLCJwbGF5IiwicGF1c2UiLCJwbGF5TmV4dCIsInBsYXlQcmV2IiwidXBkYXRlVm9sdW1lIiwicmF0aW8iLCJjbGllbnRYIiwib2Zmc2V0TGVmdCIsIm9mZnNldFdpZHRoIiwidm9sdW1lU2xpZGVyIiwibXV0ZWQiLCJ1bm11dGUiLCJtdXRlIiwibmV3VmFsdWUiLCJNYXRoIiwic2lnbiIsIndoZWVsRGVsdGFZIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxTQUFTLENBQ1gsMk5BRFcsRUFFWCw2QkFGVyxFQUdYLGdDQUhXLEVBSVgsK0JBSlcsRUFLWCx1QkFMVyxFQU1YLGdDQU5XLENBQWY7O0FBU0EsSUFBTUMsYUFBYUMsU0FBU0MsY0FBVCxDQUF3QixRQUF4QixDQUFuQjtBQUNBLElBQU1DLFVBQVVGLFNBQVNHLGFBQVQsQ0FBdUIsNEJBQXZC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QU0wQixXQUFXN0IsT0FBT0MsTUFBUCxHQUFnQjZCLEtBQUtDLElBQUwsQ0FBVTVCLEVBQUU2QixXQUFaLElBQTJCLElBQTVEO0FBQ0ExQyxjQUFVdUMsUUFBVjtBQUNILENBSEQ7O0FBS0EzQyxpQkFBaUI0QixnQkFBakIsQ0FBa0MsT0FBbEMsRUFBMkMsVUFBQ1gsQ0FBRCxFQUFPO0FBQzlDLFFBQU0wQixXQUFXN0IsT0FBT0MsTUFBUCxHQUFnQjZCLEtBQUtDLElBQUwsQ0FBVTVCLEVBQUU2QixXQUFaLElBQTJCLElBQTVEO0FBQ0ExQyxjQUFVdUMsUUFBVjtBQUNILENBSEQiLCJmaWxlIjoiZmFrZV9kMWEwODNhZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBdWRpb1BsYXllciBmcm9tICcuL0F1ZGlvUGxheWVyJztcbmltcG9ydCBQbGF5bGlzdCBmcm9tICcuL1BsYXlsaXN0JztcbmltcG9ydCBET01CdWlkbGVyIGZyb20gJy4vdXRpbHMvRE9NQnVpbGRlcic7XG5pbXBvcnQgU2xpZGVyIGZyb20gJy4vdXRpbHMvU2xpZGVyLmpzJztcblxuY29uc3QgdHJhY2tzID0gW1xuICAgIFwiaHR0cHM6Ly9wc3Y0LnVzZXJhcGkuY29tL2M4MTM0MjYvdTM3MTc0NTQ0OS9hdWRpb3MvOWMxMzEyMTkyYTFmLm1wMz9leHRyYT1WSmFCUGtUOWNBbnE1cG0zQXduYmM3WEMwWVpZbXo1LVZRdWNlR0VSX1A2Y1dNTDVMd3g4UDloX3VjcFBjOVlMZnNnQ0YtWC1CWjZqYlcxMjE1MU1aU25IaHNrbm5DMDl2UDFyVkZZMENXamQtVUFXTHdvT2FEeUYtY2dCVVpyUEJoNC1rR2plWU00My1tQVwiLFxuICAgICcuLy4uL21lZGlhLzAyIC0gTmVlZGxlcy5tcDMnLFxuICAgICcuLy4uL21lZGlhLzAzIC0gRGVlciBEYW5jZS5tcDMnLFxuICAgICcuLy4uL21lZGlhLzA0IC0gSmV0IFBpbG90Lm1wMycsXG4gICAgJy4vLi4vbWVkaWEvMDUgLSBYLm1wMycsXG4gICAgJy4vLi4vbWVkaWEvMDYgLSBDaG9wIFN1ZXkhLm1wMycsXG5dXG5cbmNvbnN0IHBsYXllck5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllclwiKTtcbmNvbnN0IHBsYXlCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLWNvbnRyb2xzX19idG5fcGxheScpO1xuY29uc3QgcGxheU5leHRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLWNvbnRyb2xzX19idG5fbmV4dCcpO1xuY29uc3QgcGxheVByZXZCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLWNvbnRyb2xzX19idG5fcHJldicpO1xuXG5jb25zdCB2b2x1bWVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudm9sdW1lX19idG4nKTtcbmNvbnN0IHZvbHVtZVNsaWRlck5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudm9sdW1lX19zbGlkZXInKTtcbmNvbnN0IHZvbHVtZVNsaWRlckZpbGxlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52b2x1bWVfX3NsaWRlciAuc2xpZGVyX19maWxsZWQnKTtcblxuY29uc3QgcHJvZ3Jlc3NCdWZmZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZ3Jlc3NfX2J1ZmZlcicpO1xuY29uc3QgcHJvZ3Jlc3NMaW5lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2dyZXNzX19saW5lJyk7XG5cbmZ1bmN0aW9uIHNldFZvbHVtZSh2YWx1ZSkge1xuICAgIGNvbnN0IGljb24gPSB2b2x1bWVCdG4uY2hpbGRyZW5bMF07XG4gICAgY29uc3QgdmFsaWRWYWx1ZSA9IHZhbHVlID4gMSA/IDEgOiAodmFsdWUgPCAwID8gMCA6IHZhbHVlKTtcbiAgICBpZih2YWxpZFZhbHVlID09PSAwKSB7XG4gICAgICAgIGljb24uY2xhc3NMaXN0LnJlbW92ZSgndm9sdW1lX19pY29uX2hhbGYnKTtcbiAgICAgICAgaWNvbi5jbGFzc0xpc3QuYWRkKCd2b2x1bWVfX2ljb25fbXV0ZScpO1xuICAgIH1cbiAgICBpZih2YWxpZFZhbHVlID4gMCAmJiB2YWxpZFZhbHVlIDw9IDAuNSkge1xuICAgICAgICBpY29uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZvbHVtZV9faWNvbl9tdXRlJyk7XG4gICAgICAgIGljb24uY2xhc3NMaXN0LmFkZCgndm9sdW1lX19pY29uX2hhbGYnKTtcbiAgICB9XG4gICAgaWYodmFsaWRWYWx1ZSA+IDAuNSkge1xuICAgICAgICBpY29uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZvbHVtZV9faWNvbl9tdXRlJyk7XG4gICAgICAgIGljb24uY2xhc3NMaXN0LnJlbW92ZSgndm9sdW1lX19pY29uX2hhbGYnKTtcbiAgICB9XG4gICAgdm9sdW1lU2xpZGVyRmlsbGVkLnN0eWxlLndpZHRoID0gYCR7dmFsaWRWYWx1ZSAqIDEwMH0lYDtcbiAgICBwbGF5ZXIudm9sdW1lID0gdmFsaWRWYWx1ZTtcbn1cblxuY29uc3QgcGxheWVyID0gbmV3IEF1ZGlvUGxheWVyKHRyYWNrcyk7XG5zZXRWb2x1bWUocGxheWVyLnZvbHVtZSk7XG4vLyBwbGF5ZXIucGxheWxpc3QuYWRkVHJhY2soWycuLy4uL21lZGlhL1N5c3RlbV9PZl9BX0Rvd25fLV9BZXJpYWxzLm1wMyddKTtcbi8vIHBsYXllci5wbGF5bGlzdC5hZGRUcmFja0xpc3QodHJhY2tzKTtcblxuXG5mdW5jdGlvbiB1cGRhdGVCdWZmZXIoZSkge1xuICAgIGNvbnN0IGF1ZGlvID0gZS50YXJnZXQ7XG4gICAgY29uc3QgYnVmZmVyZWQgPSBhdWRpby5idWZmZXJlZDtcbiAgICBjb25zdCBidWZmUmF0aW8gPSBidWZmZXJlZC5sZW5ndGggPyBidWZmZXJlZC5lbmQoYnVmZmVyZWQubGVuZ3RoIC0gMSkgLyBhdWRpby5kdXJhdGlvbiAqIDEwMCA6IDA7XG4gICAgXG4gICAgcHJvZ3Jlc3NCdWZmZXIuc3R5bGUud2lkdGggPSBgJHtidWZmUmF0aW99JWA7XG59XG5cbnBsYXllci5vbigndHJhY2s6cHJvZ3Jlc3MnLCB1cGRhdGVCdWZmZXIpO1xucGxheWVyLm9uKCd0cmFjazpsb2FkZWRkYXRhJywgdXBkYXRlQnVmZmVyKTtcbnBsYXllci5vbigndHJhY2s6dGltZXVwZGF0ZScsIChlKSA9PiB7XG4gICAgY29uc3QgYXVkaW8gPSBlLnRhcmdldDtcbiAgICBjb25zdCBwbGF5ZWRSYXRpbyA9IGF1ZGlvLmN1cnJlbnRUaW1lIC8gYXVkaW8uZHVyYXRpb24gKiAxMDA7XG4gICAgcHJvZ3Jlc3NMaW5lLnN0eWxlLndpZHRoID0gYCR7cGxheWVkUmF0aW99JWA7XG59KTtcblxucGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBpZighcGxheWVyLmlzUGxheWluZykge1xuICAgICAgICBwbGF5QnRuLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250cm9sc19fYnRuX3BhdXNlJyk7XG4gICAgICAgIHBsYXllci5wbGF5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcGxheUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdwbGF5ZXItY29udHJvbHNfX2J0bl9wYXVzZScpO1xuICAgICAgICBwbGF5ZXIucGF1c2UoKTtcbiAgICB9XG59KTtcblxucGxheU5leHRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIHBsYXlCdG4uY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRyb2xzX19idG5fcGF1c2UnKTtcbiAgICBwbGF5ZXIucGxheU5leHQoKTtcbn0pO1xuXG5wbGF5UHJldkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgcGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udHJvbHNfX2J0bl9wYXVzZScpO1xuICAgIHBsYXllci5wbGF5UHJldigpO1xufSk7XG5cbi8vIFZvbHVtZSBzZXR0aW5nc1xuLy8gbGV0IHZvbHVtZURyYWdnYWJsZSA9IGZhbHNlO1xuY29uc3QgdXBkYXRlVm9sdW1lID0gKGUpID0+IHtcbiAgICBsZXQgcmF0aW8gPSAoZS5jbGllbnRYIC0gdm9sdW1lU2xpZGVyTm9kZS5vZmZzZXRMZWZ0KSAvIHZvbHVtZVNsaWRlck5vZGUub2Zmc2V0V2lkdGg7XG4gICAgc2V0Vm9sdW1lKHJhdGlvKTtcbn1cblxuY29uc3Qgdm9sdW1lU2xpZGVyID0gbmV3IFNsaWRlcih2b2x1bWVTbGlkZXJOb2RlLCB1cGRhdGVWb2x1bWUpO1xuXG4vLyB2b2x1bWVTbGlkZXJOb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChlKSA9PiB7XG4vLyAgICAgaWYoZS53aGljaCA9PT0gMSkgeyAvL2xlZnQgbW91c2UgYnV0dG9uXG4vLyAgICAgICAgIHZvbHVtZURyYWdnYWJsZSA9IHRydWU7XG4vLyAgICAgICAgIHVwZGF0ZVZvbHVtZShlKTtcbi8vICAgICB9XG4vLyB9KTtcblxuLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGUpID0+IHtcbi8vICAgICBpZih2b2x1bWVEcmFnZ2FibGUpIHtcbi8vICAgICAgICAgdXBkYXRlVm9sdW1lKGUpO1xuLy8gICAgIH1cbi8vIH0pO1xuXG4vLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGUpID0+IHtcbi8vICAgICBpZih2b2x1bWVEcmFnZ2FibGUpIHtcbi8vICAgICAgICAgdm9sdW1lRHJhZ2dhYmxlID0gZmFsc2U7XG4vLyAgICAgICAgIHVwZGF0ZVZvbHVtZShlKTtcbi8vICAgICB9XG4vLyB9KTtcblxudm9sdW1lQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGNvbnN0IGljb24gPSB2b2x1bWVCdG4uY2hpbGRyZW5bMF07XG4gICAgaWYocGxheWVyLm11dGVkKSB7XG4gICAgICAgIHBsYXllci51bm11dGUoKTtcbiAgICAgICAgaWNvbi5jbGFzc0xpc3QucmVtb3ZlKCd2b2x1bWVfX2ljb25fbXV0ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYXllci5tdXRlKCk7XG4gICAgICAgIGljb24uY2xhc3NMaXN0LmFkZCgndm9sdW1lX19pY29uX211dGUnKTtcbiAgICB9XG59KTtcblxuLy8g0L7QsdGA0LDQsdC+0YLRh9C40LogTW91c2VTY3JvbGwgZXZlbnQn0LAg0LTQu9GPINGD0L/RgNCw0LLQu9C10L3QuNGPINCz0YDQvtC80LrQvtGB0YLRjNGOXG52b2x1bWVCdG4uYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCAoZSkgPT4ge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gcGxheWVyLnZvbHVtZSArIE1hdGguc2lnbihlLndoZWVsRGVsdGFZKSAqIDAuMDU7XG4gICAgc2V0Vm9sdW1lKG5ld1ZhbHVlKTtcbn0pO1xuXG52b2x1bWVTbGlkZXJOb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgKGUpID0+IHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHBsYXllci52b2x1bWUgKyBNYXRoLnNpZ24oZS53aGVlbERlbHRhWSkgKiAwLjA1O1xuICAgIHNldFZvbHVtZShuZXdWYWx1ZSk7XG59KTtcbiJdfQ==
},{"./AudioPlayer":1,"./Playlist":2,"./utils/DOMBuilder":5,"./utils/Slider.js":7}],5:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slider = function () {
    function Slider(node, updateFunction) {
        _classCallCheck(this, Slider);

        this.node = node;
        this.draggable = false;
        this.updateFunction = updateFunction;
        this.bind();
    }

    _createClass(Slider, [{
        key: 'bind',
        value: function bind() {
            var _this = this;

            this.node.addEventListener('mousedown', function (e) {
                if (e.which === 1) {
                    //left mouse button
                    _this.draggable = true;
                }
            });

            document.addEventListener('mousemove', function (e) {
                if (_this.draggable) {
                    _this.updateFunction(e);
                }
            });

            document.addEventListener('mouseup', function (e) {
                if (_this.draggable) {
                    _this.draggable = false;
                    _this.updateFunction(e);
                }
            });
        }
    }]);

    return Slider;
}();

exports.default = Slider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNsaWRlci5qcyJdLCJuYW1lcyI6WyJTbGlkZXIiLCJub2RlIiwidXBkYXRlRnVuY3Rpb24iLCJkcmFnZ2FibGUiLCJiaW5kIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJ3aGljaCIsImRvY3VtZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQXFCQSxNO0FBQ2pCLG9CQUFZQyxJQUFaLEVBQWtCQyxjQUFsQixFQUFrQztBQUFBOztBQUM5QixhQUFLRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxhQUFLRSxTQUFMLEdBQWlCLEtBQWpCO0FBQ0EsYUFBS0QsY0FBTCxHQUFzQkEsY0FBdEI7QUFDQSxhQUFLRSxJQUFMO0FBQ0g7Ozs7K0JBRU07QUFBQTs7QUFDSCxpQkFBS0gsSUFBTCxDQUFVSSxnQkFBVixDQUEyQixXQUEzQixFQUF3QyxVQUFDQyxDQUFELEVBQU87QUFDM0Msb0JBQUdBLEVBQUVDLEtBQUYsS0FBWSxDQUFmLEVBQWtCO0FBQUU7QUFDaEIsMEJBQUtKLFNBQUwsR0FBaUIsSUFBakI7QUFDSDtBQUNKLGFBSkQ7O0FBTUFLLHFCQUFTSCxnQkFBVCxDQUEwQixXQUExQixFQUF1QyxVQUFDQyxDQUFELEVBQU87QUFDMUMsb0JBQUcsTUFBS0gsU0FBUixFQUFtQjtBQUNmLDBCQUFLRCxjQUFMLENBQW9CSSxDQUFwQjtBQUNIO0FBQ0osYUFKRDs7QUFNQUUscUJBQVNILGdCQUFULENBQTBCLFNBQTFCLEVBQXFDLFVBQUNDLENBQUQsRUFBTztBQUN4QyxvQkFBRyxNQUFLSCxTQUFSLEVBQW1CO0FBQ2YsMEJBQUtBLFNBQUwsR0FBaUIsS0FBakI7QUFDQSwwQkFBS0QsY0FBTCxDQUFvQkksQ0FBcEI7QUFDSDtBQUNKLGFBTEQ7QUFNSDs7Ozs7O2tCQTNCZ0JOLE0iLCJmaWxlIjoiU2xpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2xpZGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihub2RlLCB1cGRhdGVGdW5jdGlvbikge1xuICAgICAgICB0aGlzLm5vZGUgPSBub2RlO1xuICAgICAgICB0aGlzLmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVwZGF0ZUZ1bmN0aW9uID0gdXBkYXRlRnVuY3Rpb247XG4gICAgICAgIHRoaXMuYmluZCgpO1xuICAgIH1cblxuICAgIGJpbmQoKSB7XG4gICAgICAgIHRoaXMubm9kZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZSkgPT4ge1xuICAgICAgICAgICAgaWYoZS53aGljaCA9PT0gMSkgeyAvL2xlZnQgbW91c2UgYnV0dG9uXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnZ2FibGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZSkgPT4ge1xuICAgICAgICAgICAgaWYodGhpcy5kcmFnZ2FibGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUZ1bmN0aW9uKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGUpID0+IHtcbiAgICAgICAgICAgIGlmKHRoaXMuZHJhZ2dhYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUZ1bmN0aW9uKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=
},{}]},{},[4])