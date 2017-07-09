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
                throw Error('Volume must be in range from 0 to 1');
            }

            var audio = this._playback.track.audio;
            if (!isNaN(audio.duration)) {
                var newTime = audio.duration * ratio;
                audio.currentTime = newTime;
            }

            return this;
        }
    }, {
        key: '_setTrack',
        value: function _setTrack() {
            if (this.isPlaying) {
                return this;
            }
            console.log('Setting track', this.currentTrackIndex);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvUGxheWVyLmpzIl0sIm5hbWVzIjpbIkF1ZGlvUGxheWVyIiwidHJhY2tzIiwicGFyYW1zIiwicGxheWxpc3QiLCJtdXRlZCIsImN1cnJlbnRUcmFja0luZGV4IiwiX3BsYXliYWNrIiwiX3Jlc2V0UGxheWJhY2tJbmZvIiwiX3NldFRyYWNrIiwiX2N0eCIsIl9nYWluIiwiX2VxdWFsaXplciIsIl9jcmVhdGVBdWRpb0FwaU5vZGVzIiwiaXNQbGF5aW5nIiwidHJhY2siLCJpZCIsImNvbnNvbGUiLCJsb2ciLCJzcmMiLCJhdWRpbyIsImlzQnVmZmVyZWQiLCJwbGF5IiwicGxheWluZyIsImxvYWQiLCJvbiIsIl9zdGFydFBsYXliYWNrIiwiYmluZCIsInBsYXlOZXh0IiwiZSIsImVtaXQiLCJwYXVzZSIsImN1cnJlbnRUaW1lIiwic3RvcCIsInJhdGlvIiwiRXJyb3IiLCJpc05hTiIsImR1cmF0aW9uIiwibmV3VGltZSIsImdldFRyYWNrIiwic291cmNlIiwicGxheWJhY2siLCJjcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UiLCJfY29ubmVjdE5vZGVzIiwib2ZmIiwid2luZG93IiwiQXVkaW9Db250ZXh0Iiwid2Via2l0QXVkaW9Db250ZXh0IiwiX2Rlc3QiLCJkZXN0aW5hdGlvbiIsImNyZWF0ZUdhaW4iLCJmaWx0ZXJzIiwiTWVkaWFFbGVtZW50QXVkaW9Tb3VyY2VOb2RlIiwiY29ubmVjdCIsImxlbmd0aCIsImdhaW4iLCJ2YWx1ZSIsIm11dGUiLCJ1bm11dGUiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFcUJBLFc7OztBQUNqQiwyQkFBb0M7QUFBQSxZQUF4QkMsTUFBd0IsdUVBQWpCLEVBQWlCO0FBQUEsWUFBYkMsTUFBYSx1RUFBSixFQUFJOztBQUFBOztBQUFBOztBQUdoQyxjQUFLQyxRQUFMLEdBQWdCLHVCQUFhRixNQUFiLENBQWhCO0FBQ0EsY0FBS0csS0FB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a0Isd0JBQWMsS0FBS0YsSUFBbkIsQ0FBbEI7QUFDQSxtQkFBTyxJQUFQO0FBQ0g7Ozt3Q0FFZTtBQUNaLGdCQUFNOEIsU0FBUyxLQUFLakMsU0FBTCxDQUFlaUMsTUFBOUI7QUFDQSxnQkFBTVcsVUFBVSxLQUFLdkMsVUFBTCxDQUFnQnVDLE9BQWhDO0FBQ0EsZ0JBQUcsRUFBRVgsa0JBQWtCWSwyQkFBcEIsQ0FBSCxFQUFxRDtBQUNqRCxzQkFBTWpCLE1BQU0sb0VBQU4sQ0FBTjtBQUNIOztBQUVESyxtQkFBT2EsT0FBUCxDQUFlRixRQUFRLENBQVIsQ0FBZjtBQUNBQSxvQkFBUUEsUUFBUUcsTUFBUixHQUFpQixDQUF6QixFQUE0QkQsT0FBNUIsQ0FBb0MsS0FBSzFDLEtBQXpDO0FBQ0EsaUJBQUtBLEtBQUwsQ0FBVzBDLE9BQVgsQ0FBbUIsS0FBS0wsS0FBeEI7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOzs7NEJBcE1lO0FBQ1osbUJBQU8sS0FBS3pDLFNBQUwsQ0FBZWdCLE9BQXRCO0FBQ0g7Ozs0QkFFWTtBQUNULG1CQUFPLEtBQUtaLEtBQUwsQ0FBVzRDLElBQVgsQ0FBZ0JDLEtBQXZCO0FBQ0gsUzswQkFFVUEsSyxFQUFPO0FBQ2QsZ0JBQUdBLFFBQVEsQ0FBUixJQUFhQSxRQUFRLENBQXhCLEVBQTJCO0FBQ3ZCLHNCQUFNckIsTUFBTSxxQ0FBTixDQUFOO0FBQ0g7QUFDRCxnQkFBR3FCLFVBQVUsQ0FBYixFQUFnQjtBQUNaLHFCQUFLQyxJQUFMO0FBQ0gsYUFGRCxNQUVPLElBQUcsS0FBS3BELEtBQVIsRUFBZTtBQUNsQixxQkFBS3FELE1BQUw7QUFDSDtBQUNELGlCQUFLL0MsS0FBTCxDQUFXNEMsSUFBWCxDQUFnQkMsS0FBaEIsR0FBd0JBLEtBQXhCO0FBQ0g7Ozs7OztrQkFwQ2dCdkQsVyIsImZpbGUiOiJBdWRpb1BsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgUGxheWxpc3QgZnJvbSAnLi9QbGF5bGlzdCc7XG5pbXBvcnQgVHJhY2sgZnJvbSAnLi9UcmFjayc7XG5pbXBvcnQgRXZlbnRFbW1pdGVyIGZyb20gJy4vdXRpbHMvRXZlbnRFbW1pdGVyJztcbmltcG9ydCBFcXVhbGl6ZXIgZnJvbSAnLi9FcXVhbGl6ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdWRpb1BsYXllciBleHRlbmRzIEV2ZW50RW1taXRlciB7XG4gICAgY29uc3RydWN0b3IodHJhY2tzPVtdLCBwYXJhbXMgPSB7fSkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMucGxheWxpc3QgPSBuZXcgUGxheWxpc3QodHJhY2tzKTtcbiAgICAgICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmN1cnJlbnRUcmFja0luZGV4ID0gMDtcbiAgICAgICAgdGhpcy5fcGxheWJhY2sgPSB7fVxuICAgICAgICB0aGlzLl9yZXNldFBsYXliYWNrSW5mbygpO1xuICAgICAgICB0aGlzLl9zZXRUcmFjaygpO1xuXG4gICAgICAgIC8vIGluaXQgQXVkaW8gQVBJIE5vZGVzXG4gICAgICAgIHRoaXMuX2N0eCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2dhaW4gPSBudWxsO1xuICAgICAgICB0aGlzLl9lcXVhbGl6ZXIgPSBudWxsO1xuICAgICAgICB0aGlzLl9jcmVhdGVBdWRpb0FwaU5vZGVzKCk7XG4gICAgfVxuXG4gICAgZ2V0IGlzUGxheWluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BsYXliYWNrLnBsYXlpbmc7XG4gICAgfVxuICAgIFxuICAgIGdldCB2b2x1bWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nYWluLmdhaW4udmFsdWU7XG4gICAgfVxuXG4gICAgc2V0IHZvbHVtZSh2YWx1ZSkge1xuICAgICAgICBpZih2YWx1ZSA+IDEgJiYgdmFsdWUgPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVm9sdW1lIG11c3QgYmUgaW4gcmFuZ2UgZnJvbSAwIHRvIDEnKTtcbiAgICAgICAgfVxuICAgICAgICBpZih2YWx1ZSA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5tdXRlKCk7XG4gICAgICAgIH0gZWxzZSBpZih0aGlzLm11dGVkKSB7XG4gICAgICAgICAgICB0aGlzLnVubXV0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2dhaW4uZ2Fpbi52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHBsYXkoKSB7XG4gICAgICAgIGlmKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCF0aGlzLl9wbGF5YmFjay50cmFjayB8fCB0aGlzLl9wbGF5YmFjay50cmFjay5pZCAhPT0gdGhpcy5jdXJyZW50VHJhY2tJbmRleCkge1xuICAgICAgICAgICAgdGhpcy5fc2V0VHJhY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRyYWNrID0gdGhpcy5fcGxheWJhY2sudHJhY2s7XG5cbiAgICAgICAgY29uc29sZS5sb2coYFBsYXlpbmcgdHJhY2sgaWQ9JHt0aGlzLmN1cnJlbnRUcmFja0luZGV4fSAtICR7dHJhY2suc3JjfWApO1xuICAgICAgICBpZih0cmFjay5hdWRpbyAmJiB0cmFjay5pc0J1ZmZlcmVkKCkpIHtcbiAgICAgICAgICAgIHRyYWNrLmF1ZGlvLnBsYXkoKTtcbiAgICAgICAgICAgIHRoaXMuX3BsYXliYWNrLnBsYXlpbmcgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJhY2subG9hZCgpO1xuICAgICAgICAgICAgLy9TdWJzY3JpYmVcbiAgICAgICAgICAgIHRyYWNrLm9uKCdjYW5wbGF5JywgdGhpcy5fc3RhcnRQbGF5YmFjay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRyYWNrLm9uKCdlbmRlZCcsIHRoaXMucGxheU5leHQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0cmFjay5vbigncHJvZ3Jlc3MnLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgndHJhY2s6cHJvZ3Jlc3MnLCBlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdHJhY2sub24oJ2xvYWRlZGRhdGEnLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgndHJhY2s6bG9hZGVkZGF0YScsIGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0cmFjay5vbignY2FucGxheXRocm91Z2gnLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgndHJhY2s6Y2FucGxheXRocm91Z2gnLCBlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdHJhY2sub24oJ2xvYWRlZG1ldGFkYXRhJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3RyYWNrOmxvYWRlZG1ldGFkYXRhJywgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRyYWNrLm9uKCd0aW1ldXBkYXRlJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3RyYWNrOnRpbWV1cGRhdGUnLCBlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RvcCgpIHtcbiAgICAgICAgdGhpcy5fcGxheWJhY2sucGxheWluZyA9IGZhbHNlO1xuICAgICAgICBjb25zdCB0cmFjayA9IHRoaXMuX3BsYXliYWNrLnRyYWNrO1xuICAgICAgICB0cmFjay5hdWRpby5wYXVzZSgpO1xuICAgICAgICB0cmFjay5hdWRpby5jdXJyZW50VGltZSA9IDA7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcGF1c2UoKSB7XG4gICAgICAgIHRoaXMuX3BsYXliYWNrLnBsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgdHJhY2sgPSB0aGlzLl9wbGF5YmFjay50cmFjaztcbiAgICAgICAgdHJhY2suYXVkaW8ucGF1c2UoKTtcbiAgICAgICAgY29uc29sZS5sb2coJ1BBVVNFRCcpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG11dGUoKSB7XG4gICAgICAgIHRoaXMuX3BsYXliYWNrLnRyYWNrLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tdXRlZCA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdW5tdXRlKCkge1xuICAgICAgICB0aGlzLl9wbGF5YmFjay50cmFjay5tdXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLm11dGVkID0gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcGxheU5leHQoKSB7XG4gICAgICAgIGlmKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9yZXNldFBsYXliYWNrSW5mbygpO1xuXG4gICAgICAgIHRoaXMuY3VycmVudFRyYWNrSW5kZXggKz0gMTtcbiAgICAgICAgdGhpcy5wbGF5KCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcGxheVByZXYoKSB7XG4gICAgICAgIGlmKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9yZXNldFBsYXliYWNrSW5mbygpO1xuXG4gICAgICAgIHRoaXMuY3VycmVudFRyYWNrSW5kZXggLT0gMTtcbiAgICAgICAgdGhpcy5wbGF5KCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8g0L/QtdGA0LXQvNC+0YLQutCwXG4gICAgcmV3aW5kKHJhdGlvKSB7XG4gICAgICAgIGlmKHJhdGlvID4gMSAmJiByYXRpbyA8IDApIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdWb2x1bWUgbXVzdCBiZSBpbiByYW5nZSBmcm9tIDAgdG8gMScpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXVkaW8gPSB0aGlzLl9wbGF5YmFjay50cmFjay5hdWRpbztcbiAgICAgICAgaWYoIWlzTmFOKGF1ZGlvLmR1cmF0aW9uKSkge1xuICAgICAgICAgICAgY29uc3QgbmV3VGltZSA9IGF1ZGlvLmR1cmF0aW9uICogcmF0aW87XG4gICAgICAgICAgICBhdWRpby5jdXJyZW50VGltZSA9IG5ld1RpbWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfc2V0VHJhY2soKSB7XG4gICAgICAgIGlmKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZygnU2V0dGluZyB0cmFjaycsIHRoaXMuY3VycmVudFRyYWNrSW5kZXgpO1xuICAgICAgICB0aGlzLl9wbGF5YmFjay50cmFjayA9IHRoaXMucGxheWxpc3QuZ2V0VHJhY2sodGhpcy5jdXJyZW50VHJhY2tJbmRleCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX3Jlc2V0UGxheWJhY2tJbmZvKCkge1xuICAgICAgICB0aGlzLl9wbGF5YmFjayA9IHtcbiAgICAgICAgICAgIHRyYWNrOiBudWxsLFxuICAgICAgICAgICAgc291cmNlOiBudWxsLFxuICAgICAgICAgICAgcGxheWluZzogZmFsc2UsXG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1JFU0VUIFBMQVlCQUNLJyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX3N0YXJ0UGxheWJhY2soKSB7XG4gICAgICAgIGlmKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQWxyZWFkeSBwbGF5aW5nITEnKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGxheWJhY2sgPSB0aGlzLl9wbGF5YmFjaztcbiAgICAgICAgY29uc3QgdHJhY2sgPSB0aGlzLl9wbGF5YmFjay50cmFjaztcbiAgICAgICAgXG4gICAgICAgIHBsYXliYWNrLnNvdXJjZSA9IHRoaXMuX2N0eC5jcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UodHJhY2suYXVkaW8pO1xuICAgICAgICB0aGlzLl9jb25uZWN0Tm9kZXMoKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhgTG9hZGVkIC0gJHtwbGF5YmFjay50cmFjay5zcmN9YCk7XG4gICAgICAgIHBsYXliYWNrLnBsYXlpbmcgPSB0cnVlO1xuICAgICAgICB0cmFjay5hdWRpby5wbGF5KCk7XG5cbiAgICAgICAgLy9VbnN1YnNjcmliZSBiZWNhdXNlICdjYW5wbGF5JyBldmVudCB0cmlnZ2VyZWQgYnkgY2hhbmdpbmcgdGhlIGN1cnJlbnQgdGltZVxuICAgICAgICB0cmFjay5vZmYoJ2NhbnBsYXknLCB0aGlzLl9zdGFydFBsYXliYWNrLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9jcmVhdGVBdWRpb0FwaU5vZGVzKCkge1xuICAgICAgICBpZighKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCkpIHJldHVybjtcblxuICAgICAgICB0aGlzLl9jdHggPSBuZXcgKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCkoKTtcbiAgICAgICAgdGhpcy5fZGVzdCA9IHRoaXMuX2N0eC5kZXN0aW5hdGlvbjtcbiAgICAgICAgdGhpcy5fZ2FpbiA9IHRoaXMuX2N0eC5jcmVhdGVHYWluKCk7XG4gICAgICAgIHRoaXMuX2VxdWFsaXplciA9IG5ldyBFcXVhbGl6ZXIodGhpcy5fY3R4KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX2Nvbm5lY3ROb2RlcygpIHtcbiAgICAgICAgY29uc3Qgc291cmNlID0gdGhpcy5fcGxheWJhY2suc291cmNlO1xuICAgICAgICBjb25zdCBmaWx0ZXJzID0gdGhpcy5fZXF1YWxpemVyLmZpbHRlcnM7XG4gICAgICAgIGlmKCEoc291cmNlIGluc3RhbmNlb2YgTWVkaWFFbGVtZW50QXVkaW9Tb3VyY2VOb2RlKSkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1NvdXJjZSBub2RlIGlzIHVuZGVmaW5lZCBvciBzb3VyY2UgIT09IE1lZGlhRWxlbWVudEF1ZGlvU291cmNlTm9kZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgc291cmNlLmNvbm5lY3QoZmlsdGVyc1swXSk7XG4gICAgICAgIGZpbHRlcnNbZmlsdGVycy5sZW5ndGggLSAxXS5jb25uZWN0KHRoaXMuX2dhaW4pO1xuICAgICAgICB0aGlzLl9nYWluLmNvbm5lY3QodGhpcy5fZGVzdCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIl19
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVxdWFsaXplci5qcyJdLCJuYW1lcyI6WyJGUkVRUyIsIkVxdWFsaXplciIsImNvbnRleHQiLCJmaWx0ZXJzIiwiX2ZyZXF1ZW5jaWVzIiwiX2NyZWF0ZUZpbHRlcnMiLCJmcmVxdWVuY3kiLCJmaWx0ZXIiLCJjcmVhdGVCaXF1YWRGaWx0ZXIiLCJ0eXBlIiwidmFsdWUiLCJRIiwiZ2FpbiIsIm1hcCIsIl9jcmVhdGVGaWx0ZXIiLCJiaW5kIiwicmVkdWNlIiwicHJldiIsImN1cnIiLCJjb25uZWN0Il0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQUVBLElBQU1BLFFBQVEsQ0FBQyxFQUFELEVBQUssR0FBTCxFQUFVLEdBQVYsRUFBZSxHQUFmLEVBQW9CLElBQXBCLEVBQTBCLElBQTFCLEVBQWdDLElBQWhDLEVBQXNDLEtBQXRDLEVBQTZDLEtBQTdDLEVBQW9ELEtBQXBELENBQWQ7O0lBRXFCQyxTO0FBQ2pCLHVCQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBQ2pCLGFBQUtBLE9BQUwsR0FBZUEsT0FBZjtBQUNBLGFBQUtDLE9BQUwsR0FBZSxFQUFmO0FBQ0EsYUFBS0MsWUFBTCxHQUFvQkosS0FBcEI7QUFDQSxhQUFLSyxjQUFMO0FBQ0g7Ozs7c0NBTWFDLFMsRUFBVztBQUNyQixnQkFBTUMsU0FBUyxLQUFLTCxPQUFMLENBQWFNLGtCQUFiLEVBQWY7O0FBRUFELG1CQUFPRSxJQUFQLEdBQWMsU0FBZDtBQUNBRixtQkFBT0QsU0FBUCxDQUFpQkksS0FBakIsR0FBeUJKLFNBQXpCO0FBQ0FDLG1CQUFPSSxDQUFQLENBQVNELEtBQVQsR0FBaUIsQ0FBakIsQ0FMcUIsQ0FLRDtBQUNwQkgsbUJBQU9LLElBQVAsQ0FBWUYsS0FBWixHQUFvQixDQUFwQjs7QUFFQSxtQkFBT0gsTUFBUDtBQUNIOzs7eUNBRWdCO0FBQ2IsZ0JBQU1KLFVBQVUsS0FBS0MsWUFBTCxDQUFrQlMsR0FBbEIsQ0FBc0IsS0FBS0MsYUFBTCxDQUFtQkMsSUFBbkIsQ0FBd0IsSUFBeEIsQ0FBdEIsQ0FBaEI7QUFDQVosb0JBQVFhLE1BQVIsQ0FBZSxVQUFDQyxJQUFELEVBQU9DLElBQVAsRUFBZ0I7QUFDM0JELHFCQUFLRSxPQUFMLENBQWFELElBQWI7QUFDQSx1QkFBT0EsSUFBUDtBQUNILGFBSEQ7QUFJQSxpQkFBS2YsT0FBTCxHQUFlQSxPQUFmOztBQUVBLG1CQUFPLElBQVA7QUFDSDs7OzRCQXhCaUI7QUFDZCxtQkFBTyxLQUFLQyxZQUFaO0FBQ0g7Ozs7OztrQkFWZ0JILFMiLCJmaWxlIjoiRXF1YWxpemVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IEZSRVFTID0gWzYwLCAxNzAsIDMxMCwgNjAwLCAxMDAwLCAzMDAwLCA2MDAwLCAxMjAwMCwgMTQwMDAsIDE2MDAwXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXF1YWxpemVyIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIHRoaXMuZmlsdGVycyA9IFtdO1xuICAgICAgICB0aGlzLl9mcmVxdWVuY2llcyA9IEZSRVFTO1xuICAgICAgICB0aGlzLl9jcmVhdGVGaWx0ZXJzKCk7XG4gICAgfVxuXG4gICAgZ2V0IGZyZXF1ZW5jaWVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZnJlcXVlbmNpZXM7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUZpbHRlcihmcmVxdWVuY3kpIHtcbiAgICAgICAgY29uc3QgZmlsdGVyID0gdGhpcy5jb250ZXh0LmNyZWF0ZUJpcXVhZEZpbHRlcigpO1xuXG4gICAgICAgIGZpbHRlci50eXBlID0gJ3BlYWtpbmcnO1xuICAgICAgICBmaWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gZnJlcXVlbmN5O1xuICAgICAgICBmaWx0ZXIuUS52YWx1ZSA9IDE7IC8vIFEtZmFjdG9yXG4gICAgICAgIGZpbHRlci5nYWluLnZhbHVlID0gMDtcblxuICAgICAgICByZXR1cm4gZmlsdGVyO1xuICAgIH1cblxuICAgIF9jcmVhdGVGaWx0ZXJzKCkge1xuICAgICAgICBjb25zdCBmaWx0ZXJzID0gdGhpcy5fZnJlcXVlbmNpZXMubWFwKHRoaXMuX2NyZWF0ZUZpbHRlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgZmlsdGVycy5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcbiAgICAgICAgICAgIHByZXYuY29ubmVjdChjdXJyKTtcbiAgICAgICAgICAgIHJldHVybiBjdXJyO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gZmlsdGVycztcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iXX0=
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
                console.log(this.tracks);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXlsaXN0LmpzIl0sIm5hbWVzIjpbIlBsYXlsaXN0IiwidHJhY2tzIiwiX3RyYWNrcyIsImFkZFRyYWNrTGlzdCIsImlkIiwidHJhY2siLCJjb25zb2xlIiwibG9nIiwiRXJyb3IiLCJzcmMiLCJuYW1lIiwicHVzaCIsImxpc3QiLCJmb3JFYWNoIiwiaSIsImFkZFRyYWNrIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQUVBOzs7Ozs7OztJQUVxQkEsUTtBQUNqQix3QkFBdUI7QUFBQSxZQUFYQyxNQUFXLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ25CLGFBQUtDLE9BQUwsR0FBZSxFQUFmO0FBQ0EsYUFBS0MsWUFBTCxDQUFrQkYsTUFBbEI7QUFDSDs7OztpQ0FNUUcsRSxFQUFJO0FBQ1QsZ0JBQU1DLFFBQVEsS0FBS0gsT0FBTCxDQUFhRSxFQUFiLENBQWQ7QUFDQSxnQkFBR0MsS0FBSCxFQUFVO0FBQ04sdUJBQU9BLEtBQVA7QUFDSCxhQUZELE1BRU87QUFDSEMsd0JBQVFDLEdBQVIsQ0FBWSxLQUFLTixNQUFqQjtBQUNBLHNCQUFNTyx5QkFBdUJKLEVBQXZCLGlDQUFOO0FBQ0g7QUFDSjs7O2lDQUVRQSxFLEVBQUlLLEcsRUFBZ0I7QUFBQSxnQkFBWEMsSUFBVyx1RUFBSixFQUFJOztBQUN6QixnQkFBTUwsUUFBUSxvQkFBVUQsRUFBVixFQUFjSyxHQUFkLEVBQW1CQyxJQUFuQixDQUFkO0FBQ0EsaUJBQUtULE1BQUwsQ0FBWVUsSUFBWixDQUFpQk4sS0FBakI7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOzs7cUNBRVlPLEksRUFBTTtBQUFBOztBQUNmQSxpQkFBS0MsT0FBTCxDQUFhLFVBQUNSLEtBQUQsRUFBUVMsQ0FBUixFQUFjO0FBQ3ZCLG9CQUFHLE9BQU9ULEtBQVAsS0FBaUIsUUFBcEIsRUFBOEI7QUFDMUJDLDRCQUFRQyxHQUFSLENBQVksS0FBWixFQUFtQkYsS0FBbkI7QUFDQSwwQkFBS1UsUUFBTCxDQUFjRCxDQUFkLEVBQWlCVCxLQUFqQjtBQUNILGlCQUhELE1BR08sSUFBRyxRQUFPQSxLQUFQLHlDQUFPQSxLQUFQLE9BQWlCLFFBQXBCLEVBQThCO0FBQUEsd0JBQ3pCSSxHQUR5QixHQUNYSixLQURXLENBQ3pCSSxHQUR5QjtBQUFBLHdCQUNwQkMsSUFEb0IsR0FDWEwsS0FEVyxDQUNwQkssSUFEb0I7O0FBRWpDSiw0QkFBUUMsR0FBUixDQUFZLEtBQVosRUFBbUJFLEdBQW5CLEVBQXdCQyxJQUF4QjtBQUNBLDBCQUFLSyxRQUFMLENBQWNELENBQWQsRUFBaUJMLEdBQWpCLEVBQXNCQyxJQUF0QjtBQUNIO0FBQ0osYUFURDtBQVVIOzs7NEJBaENZO0FBQ1QsbUJBQU8sS0FBS1IsT0FBWjtBQUNIOzs7Ozs7a0JBUmdCRixRIiwiZmlsZSI6IlBsYXlsaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBUcmFjayBmcm9tICcuL1RyYWNrJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWxpc3Qge1xuICAgIGNvbnN0cnVjdG9yKHRyYWNrcz1bXSkge1xuICAgICAgICB0aGlzLl90cmFja3MgPSBbXTtcbiAgICAgICAgdGhpcy5hZGRUcmFja0xpc3QodHJhY2tzKTtcbiAgICB9XG5cbiAgICBnZXQgdHJhY2tzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHJhY2tzO1xuICAgIH1cblxuICAgIGdldFRyYWNrKGlkKSB7XG4gICAgICAgIGNvbnN0IHRyYWNrID0gdGhpcy5fdHJhY2tzW2lkXTtcbiAgICAgICAgaWYodHJhY2spIHtcbiAgICAgICAgICAgIHJldHVybiB0cmFjaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMudHJhY2tzKTtcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBUcmFjayB3aXRoIGlkPSR7aWR9IGRvc2VuJ3QgZXhpc3QgaW4gcGxheWxpc3RgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZFRyYWNrKGlkLCBzcmMsIG5hbWUgPSAnJykge1xuICAgICAgICBjb25zdCB0cmFjayA9IG5ldyBUcmFjayhpZCwgc3JjLCBuYW1lKTtcbiAgICAgICAgdGhpcy50cmFja3MucHVzaCh0cmFjayk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYWRkVHJhY2tMaXN0KGxpc3QpIHtcbiAgICAgICAgbGlzdC5mb3JFYWNoKCh0cmFjaywgaSkgPT4ge1xuICAgICAgICAgICAgaWYodHlwZW9mIHRyYWNrID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdHInLCB0cmFjayk7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRUcmFjayhpLCB0cmFjayk7XG4gICAgICAgICAgICB9IGVsc2UgaWYodHlwZW9mIHRyYWNrID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3JjLCBuYW1lIH0gPSB0cmFjaztcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnb2JqJywgc3JjLCBuYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRyYWNrKGksIHNyYywgbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0iXX0=
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

var tracks = ["https://psv4.userapi.com/c813426/u371745449/audios/9c1312192a1f.mp3?extra=VJaBPkT9cAnq5pm3Awnbc7XC0YZYmz5-VQuceGER_P6cWML5Lwx8P9h_ucpPc9YLfsgCF-X-BZ6jbW12151MZSnHhsknnC09vP1rVFY0CWjd-UAWLwoOaDyF-cgBUZrPBh4-kGjeYM43-mA", 'http://freshly-ground.com/data/audio/mpc/20090207%20-%20Loverman.mp3', './../media/02 - Needles.mp3', './../media/03 - Deer Dance.mp3', './../media/04 - Jet Pilot.mp3', './../media/05 - X.mp3', './../media/06 - Chop Suey!.mp3'];

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

var player = new _AudioPlayer2.default(tracks);
player.volume = 0.1;
setVolume(player.volume);
// player.playlist.addTrack(['./../media/System_Of_A_Down_-_Aerials.mp3']);
// player.playlist.addTrackList(tracks);

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
    callback: setVolume
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
    // let ratio = (e.clientX - progressBar.offsetLeft) / progressBar.offsetWidth;
    drawProgress(ratio);
    player.rewind(ratio);
};
var progressSlider = new _Slider2.default(progressBar, {
    callback: setProgress
});

var updateBuffer = function updateBuffer(e) {
    var audio = e.target;
    var buffered = audio.buffered;
    var buffRatio = buffered.length ? buffered.end(buffered.length - 1) / audio.duration : 0;
    // console.log(buffered, buffRatio);

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
var equalizerBands = document.querySelectorAll('.equalizer-band__slider');
equalizerBands.forEach(function (band, i) {
    var bandFilled = band.querySelector('.slider-vert__filled');
    var bandSlider = new _Slider2.default(band, {
        vertical: true,
        callback: function callback(ratio) {
            bandFilled.style.height = ratio * 100 + '%';
        }
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfY2QxNTJhYTAuanMiXSwibmFtZXMiOlsidHJhY2tzIiwicGxheWVyTm9kZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwbGF5QnRuIiwicXVlcnlTZWxlY3RvciIsInBsYXlOZXh0QnRuIiwicGxheVByZXZCdG4iLCJ2b2x1bWVCdG4iLCJ2b2x1bWVTbGlkZXJOb2RlIiwidm9sdW1lU2xpZGVyRmlsbGVkIiwicHJvZ3Jlc3NCYXIiLCJwcm9ncmVzc0J1ZmZlciIsInByb2dyZXNzTGluZSIsInBsYXllciIsInZvbHVtZSIsInNldFZvbHVtZSIsInZhbHVlIiwiaWNvbiIsImNoaWxkcmVuIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkIiwic3R5bGUiLCJ3aWR0aCIsImRyYXdQcm9ncmVzcyIsInVwZGF0ZVZvbHVtZSIsImUiLCJyYXRpbyIsImNsaWVudFgiLCJvZmZzZXRMZWZ0Iiwib2Zmc2V0V2lkdGgiLCJ2b2x1bWVTbGlkZXIiLCJjYWxsYmFjayIsImFkZEV2ZW50TGlzdGVuZXIiLCJtdXRlZCIsInVubXV0ZSIsIm11dGUiLCJwcmV2ZW50RGVmYXVsdCIsIm5ld1ZhbHVlIiwiTWF0aCIsInNpZ24iLCJ3aGVlbERlbHRhWSIsInNldFByb2dyZXNzIiwicmV3aW5kIiwicHJvZ3Jlc3NTbGlkZXIiLCJ1cGRhdGVCdWZmZXIiLCJhdWRpbyIsInRhcmdldCIsImJ1ZmZlcmVkIiwiYnVmZlJhdGlvIiwibGVuZ3RoIiwiZW5kIiwiZHVyYXRpb24iLCJvbiIsInBsYXllZFJhdGlvIiwiY3VycmVudFRpbWUiLCJpc1BsYXlpbmciLCJwbGF5IiwicGF1c2UiLCJwbGF5TmV4dCIsInBsYXlQcmV2IiwiZXF1YWxpemVyQmFuZHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImJhbmQiLCJpIiwiYmFuZEZpbGxlZCIsImJhbmRTbGlkZXIiLCJ2ZXJ0aWNhbCIsImhlaWdodCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7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QUFXSCxJQUFYLEVBQWlCO0FBQ2hDSSxrQkFBVSxJQURzQjtBQUVoQ3BDLGtCQUFVLGtCQUFDTCxLQUFELEVBQVc7QUFDakJ1Qyx1QkFBVzVDLEtBQVgsQ0FBaUIrQyxNQUFqQixHQUE2QjFDLFFBQVEsR0FBckM7QUFDSDtBQUorQixLQUFqQixDQUFuQjtBQU1ILENBUkQiLCJmaWxlIjoiZmFrZV9jZDE1MmFhMC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBdWRpb1BsYXllciBmcm9tICcuL0F1ZGlvUGxheWVyJztcbmltcG9ydCBQbGF5bGlzdCBmcm9tICcuL1BsYXlsaXN0JztcbmltcG9ydCBET01CdWlkbGVyIGZyb20gJy4vdXRpbHMvRE9NQnVpbGRlcic7XG5pbXBvcnQgU2xpZGVyIGZyb20gJy4vdXRpbHMvU2xpZGVyLmpzJztcblxuY29uc3QgdHJhY2tzID0gW1xuICAgIFwiaHR0cHM6Ly9wc3Y0LnVzZXJhcGkuY29tL2M4MTM0MjYvdTM3MTc0NTQ0OS9hdWRpb3MvOWMxMzEyMTkyYTFmLm1wMz9leHRyYT1WSmFCUGtUOWNBbnE1cG0zQXduYmM3WEMwWVpZbXo1LVZRdWNlR0VSX1A2Y1dNTDVMd3g4UDloX3VjcFBjOVlMZnNnQ0YtWC1CWjZqYlcxMjE1MU1aU25IaHNrbm5DMDl2UDFyVkZZMENXamQtVUFXTHdvT2FEeUYtY2dCVVpyUEJoNC1rR2plWU00My1tQVwiLFxuICAgICdodHRwOi8vZnJlc2hseS1ncm91bmQuY29tL2RhdGEvYXVkaW8vbXBjLzIwMDkwMjA3JTIwLSUyMExvdmVybWFuLm1wMycsXG4gICAgJy4vLi4vbWVkaWEvMDIgLSBOZWVkbGVzLm1wMycsXG4gICAgJy4vLi4vbWVkaWEvMDMgLSBEZWVyIERhbmNlLm1wMycsXG4gICAgJy4vLi4vbWVkaWEvMDQgLSBKZXQgUGlsb3QubXAzJyxcbiAgICAnLi8uLi9tZWRpYS8wNSAtIFgubXAzJyxcbiAgICAnLi8uLi9tZWRpYS8wNiAtIENob3AgU3VleSEubXAzJyxcbl1cblxuY29uc3QgcGxheWVyTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyXCIpO1xuY29uc3QgcGxheUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9wbGF5Jyk7XG5jb25zdCBwbGF5TmV4dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9uZXh0Jyk7XG5jb25zdCBwbGF5UHJldkJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9wcmV2Jyk7XG5cbmNvbnN0IHZvbHVtZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52b2x1bWVfX2J0bicpO1xuY29uc3Qgdm9sdW1lU2xpZGVyTm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52b2x1bWVfX3NsaWRlcicpO1xuY29uc3Qgdm9sdW1lU2xpZGVyRmlsbGVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZvbHVtZV9fc2xpZGVyIC5zbGlkZXItaG9yaXpfX2ZpbGxlZCcpO1xuXG5jb25zdCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmVzc19fYmFyJyk7XG5jb25zdCBwcm9ncmVzc0J1ZmZlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmVzc19fYnVmZmVyJyk7XG5jb25zdCBwcm9ncmVzc0xpbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZ3Jlc3NfX2xpbmUnKTtcblxuY29uc3QgcGxheWVyID0gbmV3IEF1ZGlvUGxheWVyKHRyYWNrcyk7XG5wbGF5ZXIudm9sdW1lID0gMC4xO1xuc2V0Vm9sdW1lKHBsYXllci52b2x1bWUpO1xuLy8gcGxheWVyLnBsYXlsaXN0LmFkZFRyYWNrKFsnLi8uLi9tZWRpYS9TeXN0ZW1fT2ZfQV9Eb3duXy1fQWVyaWFscy5tcDMnXSk7XG4vLyBwbGF5ZXIucGxheWxpc3QuYWRkVHJhY2tMaXN0KHRyYWNrcyk7XG5cbmZ1bmN0aW9uIHNldFZvbHVtZSh2YWx1ZSkge1xuICAgIGNvbnN0IGljb24gPSB2b2x1bWVCdG4uY2hpbGRyZW5bMF07XG4gICAgaWYodmFsdWUgPT09IDApIHtcbiAgICAgICAgaWNvbi5jbGFzc0xpc3QucmVtb3ZlKCd2b2x1bWVfX2ljb25faGFsZicpO1xuICAgICAgICBpY29uLmNsYXNzTGlzdC5hZGQoJ3ZvbHVtZV9faWNvbl9tdXRlJyk7XG4gICAgfVxuICAgIGlmKHZhbHVlID4gMCAmJiB2YWx1ZSA8PSAwLjUpIHtcbiAgICAgICAgaWNvbi5jbGFzc0xpc3QucmVtb3ZlKCd2b2x1bWVfX2ljb25fbXV0ZScpO1xuICAgICAgICBpY29uLmNsYXNzTGlzdC5hZGQoJ3ZvbHVtZV9faWNvbl9oYWxmJyk7XG4gICAgfVxuICAgIGlmKHZhbHVlID4gMC41KSB7XG4gICAgICAgIGljb24uY2xhc3NMaXN0LnJlbW92ZSgndm9sdW1lX19pY29uX211dGUnKTtcbiAgICAgICAgaWNvbi5jbGFzc0xpc3QucmVtb3ZlKCd2b2x1bWVfX2ljb25faGFsZicpO1xuICAgIH1cbiAgICB2b2x1bWVTbGlkZXJGaWxsZWQuc3R5bGUud2lkdGggPSBgJHt2YWx1ZSAqIDEwMH0lYDtcbiAgICBwbGF5ZXIudm9sdW1lID0gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGRyYXdQcm9ncmVzcyh2YWx1ZSkge1xuICAgIHByb2dyZXNzTGluZS5zdHlsZS53aWR0aCA9IGAke3ZhbHVlICogMTAwfSVgO1xufVxuXG4vLyBWb2x1bWUgc2V0dGluZ3NcbmNvbnN0IHVwZGF0ZVZvbHVtZSA9IChlKSA9PiB7XG4gICAgbGV0IHJhdGlvID0gKGUuY2xpZW50WCAtIHZvbHVtZVNsaWRlck5vZGUub2Zmc2V0TGVmdCkgLyB2b2x1bWVTbGlkZXJOb2RlLm9mZnNldFdpZHRoO1xuICAgIHNldFZvbHVtZShyYXRpbyk7XG59XG5cbmNvbnN0IHZvbHVtZVNsaWRlciA9IG5ldyBTbGlkZXIodm9sdW1lU2xpZGVyTm9kZSwge1xuICAgIGNhbGxiYWNrOiBzZXRWb2x1bWVcbn0pO1xuXG52b2x1bWVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgY29uc3QgaWNvbiA9IHZvbHVtZUJ0bi5jaGlsZHJlblswXTtcbiAgICBpZihwbGF5ZXIubXV0ZWQpIHtcbiAgICAgICAgcGxheWVyLnVubXV0ZSgpO1xuICAgICAgICBpY29uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZvbHVtZV9faWNvbl9tdXRlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcGxheWVyLm11dGUoKTtcbiAgICAgICAgaWNvbi5jbGFzc0xpc3QuYWRkKCd2b2x1bWVfX2ljb25fbXV0ZScpO1xuICAgIH1cbn0pO1xuXG4vLyDQvtCx0YDQsNCx0L7RgtGH0LjQuiBNb3VzZVNjcm9sbCBldmVudCfQsCDQtNC70Y8g0YPQv9GA0LDQstC70LXQvdC40Y8g0LPRgNC+0LzQutC+0YHRgtGM0Y5cbnZvbHVtZUJ0bi5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gcGxheWVyLnZvbHVtZSArIE1hdGguc2lnbihlLndoZWVsRGVsdGFZKSAqIDAuMDU7XG4gICAgc2V0Vm9sdW1lKG5ld1ZhbHVlKTtcbn0pO1xuXG52b2x1bWVTbGlkZXJOb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBwbGF5ZXIudm9sdW1lICsgTWF0aC5zaWduKGUud2hlZWxEZWx0YVkpICogMC4wNTtcbiAgICBzZXRWb2x1bWUobmV3VmFsdWUpO1xufSk7XG5cbi8vIFByb2dyZXNzIHNldHRpbmdzXG5jb25zdCBzZXRQcm9ncmVzcyA9IChyYXRpbykgPT4ge1xuICAgIC8vIGxldCByYXRpbyA9IChlLmNsaWVudFggLSBwcm9ncmVzc0Jhci5vZmZzZXRMZWZ0KSAvIHByb2dyZXNzQmFyLm9mZnNldFdpZHRoO1xuICAgIGRyYXdQcm9ncmVzcyhyYXRpbyk7XG4gICAgcGxheWVyLnJld2luZChyYXRpbyk7XG59XG5jb25zdCBwcm9ncmVzc1NsaWRlciA9IG5ldyBTbGlkZXIocHJvZ3Jlc3NCYXIsIHtcbiAgICBjYWxsYmFjazogc2V0UHJvZ3Jlc3Ncbn0pO1xuXG5cbmNvbnN0IHVwZGF0ZUJ1ZmZlciA9IChlKSA9PiB7XG4gICAgY29uc3QgYXVkaW8gPSBlLnRhcmdldDtcbiAgICBjb25zdCBidWZmZXJlZCA9IGF1ZGlvLmJ1ZmZlcmVkO1xuICAgIGNvbnN0IGJ1ZmZSYXRpbyA9IGJ1ZmZlcmVkLmxlbmd0aCA/IGJ1ZmZlcmVkLmVuZChidWZmZXJlZC5sZW5ndGggLSAxKSAvIGF1ZGlvLmR1cmF0aW9uIDogMDtcbiAgICAvLyBjb25zb2xlLmxvZyhidWZmZXJlZCwgYnVmZlJhdGlvKTtcbiAgICBcbiAgICBwcm9ncmVzc0J1ZmZlci5zdHlsZS53aWR0aCA9IGAke2J1ZmZSYXRpbyAqIDEwMH0lYDtcbn1cblxucGxheWVyLm9uKCd0cmFjazpwcm9ncmVzcycsIHVwZGF0ZUJ1ZmZlcik7XG5wbGF5ZXIub24oJ3RyYWNrOmxvYWRlZGRhdGEnLCB1cGRhdGVCdWZmZXIpO1xucGxheWVyLm9uKCd0cmFjazpjYW5wbGF5dGhyb3VnaCcsIHVwZGF0ZUJ1ZmZlcik7XG5wbGF5ZXIub24oJ3RyYWNrOnRpbWV1cGRhdGUnLCAoZSkgPT4ge1xuICAgIGNvbnN0IGF1ZGlvID0gZS50YXJnZXQ7XG4gICAgY29uc3QgcGxheWVkUmF0aW8gPSBhdWRpby5jdXJyZW50VGltZSAvIGF1ZGlvLmR1cmF0aW9uO1xuICAgIGRyYXdQcm9ncmVzcyhwbGF5ZWRSYXRpbyk7XG59KTtcblxuXG4vLyBQbGF5ZXIgY29udHJvbHMgc2V0dGluZ3NcbnBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgaWYoIXBsYXllci5pc1BsYXlpbmcpIHtcbiAgICAgICAgcGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udHJvbHNfX2J0bl9wYXVzZScpO1xuICAgICAgICBwbGF5ZXIucGxheSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYXlCdG4uY2xhc3NMaXN0LnJlbW92ZSgncGxheWVyLWNvbnRyb2xzX19idG5fcGF1c2UnKTtcbiAgICAgICAgcGxheWVyLnBhdXNlKCk7XG4gICAgfVxufSk7XG5cbnBsYXlOZXh0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBwbGF5QnRuLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250cm9sc19fYnRuX3BhdXNlJyk7XG4gICAgcGxheWVyLnBsYXlOZXh0KCk7XG59KTtcblxucGxheVByZXZCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIHBsYXlCdG4uY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRyb2xzX19idG5fcGF1c2UnKTtcbiAgICBwbGF5ZXIucGxheVByZXYoKTtcbn0pO1xuXG4vL0VxdWFsaXplciBzZXR0aW5nc1xuY29uc3QgZXF1YWxpemVyQmFuZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZXF1YWxpemVyLWJhbmRfX3NsaWRlcicpO1xuZXF1YWxpemVyQmFuZHMuZm9yRWFjaCgoYmFuZCwgaSkgPT4ge1xuICAgIGNvbnN0IGJhbmRGaWxsZWQgPSBiYW5kLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXItdmVydF9fZmlsbGVkJyk7XG4gICAgY29uc3QgYmFuZFNsaWRlciA9IG5ldyBTbGlkZXIoYmFuZCwge1xuICAgICAgICB2ZXJ0aWNhbDogdHJ1ZSxcbiAgICAgICAgY2FsbGJhY2s6IChyYXRpbykgPT4ge1xuICAgICAgICAgICAgYmFuZEZpbGxlZC5zdHlsZS5oZWlnaHQgPSBgJHtyYXRpbyAqIDEwMH0lYFxuICAgICAgICB9XG4gICAgfSk7XG59KTtcbiJdfQ==
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

var Slider = function () {
    function Slider(node) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Slider);

        //updateFunction, vertical=false) {
        this.node = node;
        this.vertical = options.vertical || false;
        this.callback = options.callback;
        this.draggable = false;
        this.value = null;
        this._bind();

        //chrome bug with mousemove
        this.node.ondragstart = function () {
            return false;
        };
    }

    _createClass(Slider, [{
        key: '_bind',
        value: function _bind() {
            var _this = this;

            this.node.addEventListener('mousedown', function (e) {
                if (e.which === 1) {
                    //left mouse button
                    _this.draggable = true;
                    _this._getValue(e);
                }
            });

            document.addEventListener('mousemove', function (e) {
                if (_this.draggable) {
                    _this._getValue(e);
                }
            });

            document.addEventListener('mouseup', function (e) {
                if (_this.draggable) {
                    _this.draggable = false;
                    _this._getValue(e);
                }
            });
        }
    }, {
        key: '_getValue',
        value: function _getValue(e) {
            var value = null;
            if (this.vertical) {
                value = 1 - (e.clientY - this.node.offsetTop) / this.node.offsetHeight;
            } else {
                value = (e.clientX - this.node.offsetLeft) / this.node.offsetWidth;
            }
            var validValue = value > 1 ? 1 : value < 0 ? 0 : value;

            if ((0, _.isFunction)(this.callback)) {
                this.callback(validValue);
            }

            return this;
        }
    }]);

    return Slider;
}();

exports.default = Slider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNsaWRlci5qcyJdLCJuYW1lcyI6WyJTbGlkZXIiLCJub2RlIiwib3B0aW9ucyIsInZlcnRpY2FsIiwiY2FsbGJhY2siLCJkcmFnZ2FibGUiLCJ2YWx1ZSIsIl9iaW5kIiwib25kcmFnc3RhcnQiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsIndoaWNoIiwiX2dldFZhbHVlIiwiZG9jdW1lbnQiLCJjbGllbnRZIiwib2Zmc2V0VG9wIiwib2Zmc2V0SGVpZ2h0IiwiY2xpZW50WCIsIm9mZnNldExlZnQiLCJvZmZzZXRXaWR0aCIsInZhbGlkVmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7SUFFcUJBLE07QUFDakIsb0JBQVlDLElBQVosRUFBOEI7QUFBQSxZQUFaQyxPQUFZLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUM7QUFDM0IsYUFBS0QsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsYUFBS0UsUUFBTCxHQUFnQkQsUUFBUUMsUUFBUixJQUFvQixLQUFwQztBQUNBLGFBQUtDLFFBQUwsR0FBZ0JGLFFBQVFFLFFBQXhCO0FBQ0EsYUFBS0MsU0FBTCxHQUFpQixLQUFqQjtBQUNBLGFBQUtDLEtBQUwsR0FBYSxJQUFiO0FBQ0EsYUFBS0MsS0FBTDs7QUFFQTtBQUNBLGFBQUtOLElBQUwsQ0FBVU8sV0FBVixHQUF3QjtBQUFBLG1CQUFNLEtBQU47QUFBQSxTQUF4QjtBQUNIOzs7O2dDQUVPO0FBQUE7O0FBQ0osaUJBQUtQLElBQUwsQ0FBVVEsZ0JBQVYsQ0FBMkIsV0FBM0IsRUFBd0MsVUFBQ0MsQ0FBRCxFQUFPO0FBQzNDLG9CQUFHQSxFQUFFQyxLQUFGLEtBQVksQ0FBZixFQUFrQjtBQUFFO0FBQ2hCLDBCQUFLTixTQUFMLEdBQWlCLElBQWpCO0FBQ0EsMEJBQUtPLFNBQUwsQ0FBZUYsQ0FBZjtBQUNIO0FBQ0osYUFMRDs7QUFPQUcscUJBQVNKLGdCQUFULENBQTBCLFdBQTFCLEVBQXVDLFVBQUNDLENBQUQsRUFBTztBQUMxQyxvQkFBRyxNQUFLTCxTQUFSLEVBQW1CO0FBQ2YsMEJBQUtPLFNBQUwsQ0FBZUYsQ0FBZjtBQUNIO0FBQ0osYUFKRDs7QUFNQUcscUJBQVNKLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDLFVBQUNDLENBQUQsRUFBTztBQUN4QyxvQkFBRyxNQUFLTCxTQUFSLEVBQW1CO0FBQ2YsMEJBQUtBLFNBQUwsR0FBaUIsS0FBakI7QUFDQSwwQkFBS08sU0FBTCxDQUFlRixDQUFmO0FBQ0g7QUFDSixhQUxEO0FBTUg7OztrQ0FFU0EsQyxFQUFHO0FBQ1QsZ0JBQUlKLFFBQVEsSUFBWjtBQUNBLGdCQUFHLEtBQUtILFFBQVIsRUFBa0I7QUFDZEcsd0JBQVEsSUFBSyxDQUFDSSxFQUFFSSxPQUFGLEdBQVksS0FBS2IsSUFBTCxDQUFVYyxTQUF2QixJQUFvQyxLQUFLZCxJQUFMLENBQVVlLFlBQTNEO0FBQ0gsYUFGRCxNQUVPO0FBQ0hWLHdCQUFRLENBQUNJLEVBQUVPLE9BQUYsR0FBWSxLQUFLaEIsSUFBTCxDQUFVaUIsVUFBdkIsSUFBcUMsS0FBS2pCLElBQUwsQ0FBVWtCLFdBQXZEO0FBQ0g7QUFDRCxnQkFBTUMsYUFBYWQsUUFBUSxDQUFSLEdBQVksQ0FBWixHQUFpQkEsUUFBUSxDQUFSLEdBQVksQ0FBWixHQUFnQkEsS0FBcEQ7O0FBRUEsZ0JBQUcsa0JBQVcsS0FBS0YsUUFBaEIsQ0FBSCxFQUE4QjtBQUMxQixxQkFBS0EsUUFBTCxDQUFjZ0IsVUFBZDtBQUNIOztBQUVELG1CQUFPLElBQVA7QUFDSDs7Ozs7O2tCQWpEZ0JwQixNIiwiZmlsZSI6IlNsaWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuLyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNsaWRlciB7XG4gICAgY29uc3RydWN0b3Iobm9kZSwgb3B0aW9ucz17fSkgey8vdXBkYXRlRnVuY3Rpb24sIHZlcnRpY2FsPWZhbHNlKSB7XG4gICAgICAgIHRoaXMubm9kZSA9IG5vZGU7XG4gICAgICAgIHRoaXMudmVydGljYWwgPSBvcHRpb25zLnZlcnRpY2FsIHx8IGZhbHNlO1xuICAgICAgICB0aGlzLmNhbGxiYWNrID0gb3B0aW9ucy5jYWxsYmFjaztcbiAgICAgICAgdGhpcy5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2JpbmQoKTtcbiAgICAgICAgXG4gICAgICAgIC8vY2hyb21lIGJ1ZyB3aXRoIG1vdXNlbW92ZVxuICAgICAgICB0aGlzLm5vZGUub25kcmFnc3RhcnQgPSAoKSA9PiBmYWxzZTtcbiAgICB9XG5cbiAgICBfYmluZCgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChlKSA9PiB7XG4gICAgICAgICAgICBpZihlLndoaWNoID09PSAxKSB7IC8vbGVmdCBtb3VzZSBidXR0b25cbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdnYWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fZ2V0VmFsdWUoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChlKSA9PiB7XG4gICAgICAgICAgICBpZih0aGlzLmRyYWdnYWJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2dldFZhbHVlKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGUpID0+IHtcbiAgICAgICAgICAgIGlmKHRoaXMuZHJhZ2dhYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9nZXRWYWx1ZShlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX2dldFZhbHVlKGUpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYodGhpcy52ZXJ0aWNhbCkge1xuICAgICAgICAgICAgdmFsdWUgPSAxIC0gKChlLmNsaWVudFkgLSB0aGlzLm5vZGUub2Zmc2V0VG9wKSAvIHRoaXMubm9kZS5vZmZzZXRIZWlnaHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSAoZS5jbGllbnRYIC0gdGhpcy5ub2RlLm9mZnNldExlZnQpIC8gdGhpcy5ub2RlLm9mZnNldFdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHZhbGlkVmFsdWUgPSB2YWx1ZSA+IDEgPyAxIDogKHZhbHVlIDwgMCA/IDAgOiB2YWx1ZSk7XG5cbiAgICAgICAgaWYoaXNGdW5jdGlvbih0aGlzLmNhbGxiYWNrKSkge1xuICAgICAgICAgICAgdGhpcy5jYWxsYmFjayh2YWxpZFZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiJdfQ==
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImlzRnVuY3Rpb24iLCJmdW5jdGlvblRvQ2hlY2siLCJnZXRUeXBlIiwidG9TdHJpbmciLCJjYWxsIl0sIm1hcHBpbmdzIjoiOzs7OztRQUFnQkEsVSxHQUFBQSxVO0FBQVQsU0FBU0EsVUFBVCxDQUFvQkMsZUFBcEIsRUFBcUM7QUFDM0MsTUFBSUMsVUFBVSxFQUFkO0FBQ0EsU0FBT0QsbUJBQW1CQyxRQUFRQyxRQUFSLENBQWlCQyxJQUFqQixDQUFzQkgsZUFBdEIsTUFBMkMsbUJBQXJFO0FBQ0EiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbihmdW5jdGlvblRvQ2hlY2spIHtcbiB2YXIgZ2V0VHlwZSA9IHt9O1xuIHJldHVybiBmdW5jdGlvblRvQ2hlY2sgJiYgZ2V0VHlwZS50b1N0cmluZy5jYWxsKGZ1bmN0aW9uVG9DaGVjaykgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59Il19
},{}]},{},[5])