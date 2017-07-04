(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Playlist = require('./Playlist');

var _Playlist2 = _interopRequireDefault(_Playlist);

var _EventEmmiter2 = require('./utils/EventEmmiter');

var _EventEmmiter3 = _interopRequireDefault(_EventEmmiter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PLAYING_TIME = 5; //for test

var AudioPlayer = function (_EventEmmiter) {
    _inherits(AudioPlayer, _EventEmmiter);

    // TODO: Create simple audio player with Web Audio API
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

            if (this._playback.track && this._playback.buffer) {
                console.log('RESUME');
                this._startPlayback();
            } else {
                console.log(this.playlist.tracks[this.currentTrackIndex]);
                this._loadTrack(this.playlist.tracks[this.currentTrackIndex]);
            }

            return this;
        }
    }, {
        key: 'stop',
        value: function stop() {}
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
    }, {
        key: 'playNext',
        value: function playNext() {
            if (this.isPlaying && this._playback.source) {
                this._playback.source.stop();
            }

            this.currentTrackIndex += 1;
            this._resetPlaybackInfo();
            this.play();
        }
    }, {
        key: 'playPrev',
        value: function playPrev() {
            if (this.isPlaying && this._playback.source) {
                this._playback.source.stop();
            }

            this.currentTrackIndex -= 1;
            this._resetPlaybackInfo();
            this.play();
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
        value: function _loadTrack(track) {
            var _this2 = this;

            if (this._playback.loading && this._playback.track) {
                return this;
            }

            var src = track.src;

            var xhr = new XMLHttpRequest();
            this._playback.loading = true;
            this._playback.track = track;

            xhr.open('GET', src, true);
            xhr.responseType = 'arraybuffer';
            xhr.addEventListener('load', function (e) {
                _this2._ctx.decodeAudioData(xhr.response, function (decodedArrayBuffer) {
                    _this2._playback.buffer = decodedArrayBuffer;
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
        key: '_setNextTrack',
        value: function _setNextTrack() {}
    }, {
        key: '_startPlayback',
        value: function _startPlayback() {
            var _this3 = this;

            var playback = this._playback;
            playback.startTime = this._ctx.currentTime;

            playback.source = this._ctx.createBufferSource();
            playback.source.connect(this._gain);
            playback.source.buffer = playback.buffer;
            playback.source.start(0, playback.offset % playback.buffer.duration);
            console.log('PLAYING');
            playback.playing = true;

            playback.source.addEventListener('ended', function (e) {
                // const source = e.target.buffer;
                // console.log(this._ctx.currentTime - (this._playback.startTime + source.buffer.duration));
                // may be bugs
                if (_this3.isPlaying) {
                    //isPlaying == not paused
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
    }]);

    return AudioPlayer;
}(_EventEmmiter3.default);

exports.default = AudioPlayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvUGxheWVyLmpzIl0sIm5hbWVzIjpbIlBMQVlJTkdfVElNRSIsIkF1ZGlvUGxheWVyIiwibm9kZSIsInBsYXlsaXN0IiwicGFyYW1zIiwiY3VycmVudFRyYWNrSW5kZXgiLCJfcGxheWJhY2siLCJfcmVzZXRQbGF5YmFja0luZm8iLCJfY3R4IiwiX2dhaW4iLCJfY3JlYXRlQXVkaW9BcGlOb2RlcyIsImdhaW4iLCJ2YWx1ZSIsIm9uIiwiX3N0YXJ0UGxheWJhY2siLCJwbGF5aW5nIiwidHJhY2siLCJidWZmZXIiLCJjb25zb2xlIiwibG9nIiwidHJhY2tzIiwiX2xvYWRUcmFjayIsInNvdXJjZSIsInN0b3AiLCJvZmZzZXQiLCJjdXJyZW50VGltZSIsInN0YXJ0VGltZSIsImlzUGxheWluZyIsInBsYXkiLCJsb2FkaW5nIiwic3JjIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwicmVzcG9uc2VUeXBlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJkZWNvZGVBdWRpb0RhdGEiLCJyZXNwb25zZSIsImRlY29kZWRBcnJheUJ1ZmZlciIsImVtaXQiLCJzZW5kIiwicGxheWJhY2siLCJjcmVhdGVCdWZmZXJTb3VyY2UiLCJjb25uZWN0Iiwic3RhcnQiLCJkdXJhdGlvbiIsInBsYXlOZXh0Iiwid2luZG93IiwiQXVkaW9Db250ZXh0Iiwid2Via2l0QXVkaW9Db250ZXh0IiwiX2Rlc3QiLCJkZXN0aW5hdGlvbiIsImNyZWF0ZUdhaW4iXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLGVBQWUsQ0FBckIsQyxDQUF3Qjs7SUFFSEMsVzs7O0FBQ2pCO0FBQ0EseUJBQVlDLElBQVosRUFBa0JDLFFBQWxCLEVBQXlDO0FBQUEsWUFBYkMsTUFBYSx1RUFBSixFQUFJOztBQUFBOztBQUFBOztBQUdyQyxjQUFLRCxRQUFMLEdBQWdCQSxZQUFZLHdCQUE1QjtBQUNBLGNBQUtFLGlCQUFMLEdBQXlC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LE1BQVQsQ0FBZ0JhLGdCQUFoQixDQUFpQyxPQUFqQyxFQUEwQyxVQUFDQyxDQUFELEVBQU87QUFDN0M7QUFDQTtBQUNBO0FBQ0Esb0JBQUcsT0FBS1QsU0FBUixFQUFtQjtBQUNmO0FBQ0FULDRCQUFRQyxHQUFSLENBQVksYUFBWjtBQUNBLDJCQUFLNEIsUUFBTDtBQUNIO0FBQ0osYUFURDs7QUFXQSxtQkFBTyxJQUFQO0FBQ0g7OzsrQ0FFc0I7QUFDbkIsaUJBQUt2QyxJQUFMLEdBQVksS0FBS3dDLE9BQU9DLFlBQVAsSUFBdUJELE9BQU9FLGtCQUFuQyxHQUFaO0FBQ0EsaUJBQUtDLEtBQUwsR0FBYSxLQUFLM0MsSUFBTCxDQUFVNEMsV0FBdkI7QUFDQSxpQkFBSzNDLEtBQUwsR0FBYSxLQUFLRCxJQUFMLENBQVU2QyxVQUFWLEVBQWI7O0FBRUE7QUFDQSxpQkFBSzVDLEtBQUwsQ0FBV21DLE9BQVgsQ0FBbUIsS0FBS08sS0FBeEI7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOzs7NEJBdEllO0FBQ1osbUJBQU8sS0FBSzdDLFNBQUwsQ0FBZVMsT0FBdEI7QUFDSDs7Ozs7O2tCQXJCZ0JkLFciLCJmaWxlIjoiQXVkaW9QbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFBsYXlsaXN0IGZyb20gJy4vUGxheWxpc3QnO1xuaW1wb3J0IEV2ZW50RW1taXRlciBmcm9tICcuL3V0aWxzL0V2ZW50RW1taXRlcic7XG5cbmNvbnN0IFBMQVlJTkdfVElNRSA9IDU7IC8vZm9yIHRlc3RcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXVkaW9QbGF5ZXIgZXh0ZW5kcyBFdmVudEVtbWl0ZXIge1xuICAgIC8vIFRPRE86IENyZWF0ZSBzaW1wbGUgYXVkaW8gcGxheWVyIHdpdGggV2ViIEF1ZGlvIEFQSVxuICAgIGNvbnN0cnVjdG9yKG5vZGUsIHBsYXlsaXN0LCBwYXJhbXMgPSB7fSkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMucGxheWxpc3QgPSBwbGF5bGlzdCB8fCBuZXcgUGxheWxpc3QoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50VHJhY2tJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuX3BsYXliYWNrID0ge31cbiAgICAgICAgdGhpcy5fcmVzZXRQbGF5YmFja0luZm8oKTtcbiAgICAgICAgLy8gaW5pdCBBdWRpbyBBUEkgTm9kZXNcbiAgICAgICAgdGhpcy5fY3R4ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZ2FpbiA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NyZWF0ZUF1ZGlvQXBpTm9kZXMoKTtcbiAgICAgICAgdGhpcy5fZ2Fpbi5nYWluLnZhbHVlID0gMC4wNDtcblxuICAgICAgICAvL1N1YnNjcmliZVxuICAgICAgICB0aGlzLm9uKCd0cmFjazpsb2FkJywgdGhpcy5fc3RhcnRQbGF5YmFjayk7XG4gICAgfVxuXG4gICAgZ2V0IGlzUGxheWluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BsYXliYWNrLnBsYXlpbmc7XG4gICAgfVxuXG4gICAgcGxheSgpIHtcbiAgICAgICAgaWYodGhpcy5fcGxheWJhY2sucGxheWluZykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuX3BsYXliYWNrLnRyYWNrICYmIHRoaXMuX3BsYXliYWNrLmJ1ZmZlcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1JFU1VNRScpO1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRQbGF5YmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5wbGF5bGlzdC50cmFja3NbdGhpcy5jdXJyZW50VHJhY2tJbmRleF0pO1xuICAgICAgICAgICAgdGhpcy5fbG9hZFRyYWNrKHRoaXMucGxheWxpc3QudHJhY2tzW3RoaXMuY3VycmVudFRyYWNrSW5kZXhdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHN0b3AoKSB7fVxuXG4gICAgcGF1c2UoKSB7XG4gICAgICAgIGlmKHRoaXMuX3BsYXliYWNrLnBsYXlpbmcgJiYgdGhpcy5fcGxheWJhY2suc291cmNlKSB7XG4gICAgICAgICAgICB0aGlzLl9wbGF5YmFjay5wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl9wbGF5YmFjay5zb3VyY2Uuc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy5fcGxheWJhY2sub2Zmc2V0ICs9IHRoaXMuX2N0eC5jdXJyZW50VGltZSAtIHRoaXMuX3BsYXliYWNrLnN0YXJ0VGltZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQQVVTRUQnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwbGF5TmV4dCgpIHtcbiAgICAgICAgaWYodGhpcy5pc1BsYXlpbmcgJiYgdGhpcy5fcGxheWJhY2suc291cmNlKSB7XG4gICAgICAgICAgICB0aGlzLl9wbGF5YmFjay5zb3VyY2Uuc3RvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJyZW50VHJhY2tJbmRleCArPSAxO1xuICAgICAgICB0aGlzLl9yZXNldFBsYXliYWNrSW5mbygpO1xuICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICB9XG5cbiAgICBwbGF5UHJldigpIHtcbiAgICAgICAgaWYodGhpcy5pc1BsYXlpbmcgJiYgdGhpcy5fcGxheWJhY2suc291cmNlKSB7XG4gICAgICAgICAgICB0aGlzLl9wbGF5YmFjay5zb3VyY2Uuc3RvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJyZW50VHJhY2tJbmRleCAtPSAxO1xuICAgICAgICB0aGlzLl9yZXNldFBsYXliYWNrSW5mbygpO1xuICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICB9XG5cbiAgICBfcmVzZXRQbGF5YmFja0luZm8oKSB7XG4gICAgICAgIHRoaXMuX3BsYXliYWNrID0ge1xuICAgICAgICAgICAgdHJhY2s6IG51bGwsXG4gICAgICAgICAgICBzb3VyY2U6IG51bGwsXG4gICAgICAgICAgICBidWZmZXI6IG51bGwsXG4gICAgICAgICAgICBwbGF5aW5nOiBmYWxzZSxcbiAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgc3RhcnRUaW1lOiAwLFxuICAgICAgICAgICAgb2Zmc2V0OiAwXG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZygnUkVTRVQgUExBWUJBQ0snKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfbG9hZFRyYWNrKHRyYWNrKSB7XG4gICAgICAgIGlmKHRoaXMuX3BsYXliYWNrLmxvYWRpbmcgJiYgdGhpcy5fcGxheWJhY2sudHJhY2spIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHsgc3JjIH0gPSB0cmFjaztcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB0aGlzLl9wbGF5YmFjay5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fcGxheWJhY2sudHJhY2sgPSB0cmFjaztcblxuICAgICAgICB4aHIub3BlbignR0VUJywgc3JjLCB0cnVlKTtcbiAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG4gICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5kZWNvZGVBdWRpb0RhdGEoeGhyLnJlc3BvbnNlLFxuICAgICAgICAgICAgICAgIChkZWNvZGVkQXJyYXlCdWZmZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGxheWJhY2suYnVmZmVyID0gZGVjb2RlZEFycmF5QnVmZmVyO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wbGF5YmFjay5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgndHJhY2s6bG9hZCcpO1xuICAgICAgICAgICAgICAgIH0sIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBkZWNvZGluZyBmaWxlJywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHhoci5zZW5kKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX3NldE5leHRUcmFjaygpIHtcblxuICAgIH1cblxuICAgIF9zdGFydFBsYXliYWNrKCkge1xuICAgICAgICBjb25zdCBwbGF5YmFjayA9IHRoaXMuX3BsYXliYWNrO1xuICAgICAgICBwbGF5YmFjay5zdGFydFRpbWUgPSB0aGlzLl9jdHguY3VycmVudFRpbWU7XG5cbiAgICAgICAgcGxheWJhY2suc291cmNlID0gdGhpcy5fY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgICBwbGF5YmFjay5zb3VyY2UuY29ubmVjdCh0aGlzLl9nYWluKTtcbiAgICAgICAgcGxheWJhY2suc291cmNlLmJ1ZmZlciA9IHBsYXliYWNrLmJ1ZmZlcjtcbiAgICAgICAgcGxheWJhY2suc291cmNlLnN0YXJ0KDAsIHBsYXliYWNrLm9mZnNldCAlIHBsYXliYWNrLmJ1ZmZlci5kdXJhdGlvbik7XG4gICAgICAgIGNvbnNvbGUubG9nKCdQTEFZSU5HJyk7XG4gICAgICAgIHBsYXliYWNrLnBsYXlpbmcgPSB0cnVlO1xuXG4gICAgICAgIHBsYXliYWNrLnNvdXJjZS5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsIChlKSA9PiB7XG4gICAgICAgICAgICAvLyBjb25zdCBzb3VyY2UgPSBlLnRhcmdldC5idWZmZXI7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLl9jdHguY3VycmVudFRpbWUgLSAodGhpcy5fcGxheWJhY2suc3RhcnRUaW1lICsgc291cmNlLmJ1ZmZlci5kdXJhdGlvbikpO1xuICAgICAgICAgICAgLy8gbWF5IGJlIGJ1Z3NcbiAgICAgICAgICAgIGlmKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICAgICAgLy9pc1BsYXlpbmcgPT0gbm90IHBhdXNlZFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdUUkFDSyBFTkRFRCcpO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheU5leHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUF1ZGlvQXBpTm9kZXMoKSB7XG4gICAgICAgIHRoaXMuX2N0eCA9IG5ldyAod2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0KSgpO1xuICAgICAgICB0aGlzLl9kZXN0ID0gdGhpcy5fY3R4LmRlc3RpbmF0aW9uO1xuICAgICAgICB0aGlzLl9nYWluID0gdGhpcy5fY3R4LmNyZWF0ZUdhaW4oKTtcblxuICAgICAgICAvLyBDb25uZWN0IE5vZGVzXG4gICAgICAgIHRoaXMuX2dhaW4uY29ubmVjdCh0aGlzLl9kZXN0KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iXX0=
},{"./Playlist":2,"./utils/EventEmmiter":6}],2:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXlsaXN0LmpzIl0sIm5hbWVzIjpbIlBsYXlsaXN0IiwiX3RyYWNrcyIsInNyYyIsIm5hbWUiLCJ0cmFjayIsInRyYWNrcyIsInB1c2giLCJsaXN0IiwiZm9yRWFjaCIsImNvbnNvbGUiLCJsb2ciLCJhZGRUcmFjayJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7SUFFcUJBLFE7QUFDakIsd0JBQWM7QUFBQTs7QUFDVixhQUFLQyxPQUFMLEdBQWUsRUFBZjtBQUNIOzs7O2lDQU1RQyxHLEVBQWdCO0FBQUEsZ0JBQVhDLElBQVcsdUVBQUosRUFBSTs7QUFDckIsZ0JBQU1DLFFBQVEsb0JBQVVGLEdBQVYsRUFBZUMsSUFBZixDQUFkO0FBQ0EsaUJBQUtFLE1BQUwsQ0FBWUMsSUFBWixDQUFpQkYsS0FBakI7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOzs7cUNBRVlHLEksRUFBTTtBQUFBOztBQUNmQSxpQkFBS0MsT0FBTCxDQUFhLFVBQUNKLEtBQUQsRUFBVztBQUNwQixvQkFBRyxPQUFPQSxLQUFQLEtBQWlCLFFBQXBCLEVBQThCO0FBQzFCSyw0QkFBUUMsR0FBUixDQUFZLEtBQVosRUFBbUJOLEtBQW5CO0FBQ0EsMEJBQUtPLFFBQUwsQ0FBY1AsS0FBZDtBQUNILGlCQUhELE1BR08sSUFBRyxRQUFPQSxLQUFQLHlDQUFPQSxLQUFQLE9BQWlCLFFBQXBCLEVBQThCO0FBQUEsd0JBQ3pCRixHQUR5QixHQUNYRSxLQURXLENBQ3pCRixHQUR5QjtBQUFBLHdCQUNwQkMsSUFEb0IsR0FDWEMsS0FEVyxDQUNwQkQsSUFEb0I7O0FBRWpDTSw0QkFBUUMsR0FBUixDQUFZLEtBQVosRUFBbUJSLEdBQW5CLEVBQXdCQyxJQUF4QjtBQUNBLDBCQUFLUSxRQUFMLENBQWNULEdBQWQsRUFBbUJDLElBQW5CO0FBQ0g7QUFDSixhQVREO0FBVUg7Ozs0QkF0Qlk7QUFDVCxtQkFBTyxLQUFLRixPQUFaO0FBQ0g7Ozs7OztrQkFQZ0JELFEiLCJmaWxlIjoiUGxheWxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFRyYWNrIGZyb20gJy4vVHJhY2snO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5bGlzdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3RyYWNrcyA9IFtdO1xuICAgIH1cblxuICAgIGdldCB0cmFja3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90cmFja3M7XG4gICAgfVxuXG4gICAgYWRkVHJhY2soc3JjLCBuYW1lID0gJycpIHtcbiAgICAgICAgY29uc3QgdHJhY2sgPSBuZXcgVHJhY2soc3JjLCBuYW1lKTtcbiAgICAgICAgdGhpcy50cmFja3MucHVzaCh0cmFjayk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYWRkVHJhY2tMaXN0KGxpc3QpIHtcbiAgICAgICAgbGlzdC5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgICAgICAgaWYodHlwZW9mIHRyYWNrID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdHInLCB0cmFjayk7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRUcmFjayh0cmFjayk7XG4gICAgICAgICAgICB9IGVsc2UgaWYodHlwZW9mIHRyYWNrID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3JjLCBuYW1lIH0gPSB0cmFjaztcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnb2JqJywgc3JjLCBuYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRyYWNrKHNyYywgbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0iXX0=
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
    }]);

    return Track;
}();

exports.default = Track;
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRyYWNrLmpzIl0sIm5hbWVzIjpbIlRyYWNrIiwic3JjIiwibmFtZSIsIl9zcmMiLCJfbmFtZSJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7SUFFcUJBLEs7QUFDakIsbUJBQVlDLEdBQVosRUFBMEI7QUFBQSxZQUFUQyxJQUFTLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3RCLGFBQUtDLElBQUwsR0FBWUYsR0FBWjtBQUNBLGFBQUtHLEtBQUwsR0FBYUYsSUFBYjtBQUNIOzs7OzRCQUVTO0FBQ04sbUJBQU8sS0FBS0MsSUFBWjtBQUNIOzs7NEJBRVU7QUFDUCxtQkFBTyxLQUFLQyxLQUFaO0FBQ0g7Ozs7OztrQkFaZ0JKLEs7QUFhcEIiLCJmaWxlIjoiVHJhY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2sge1xuICAgIGNvbnN0cnVjdG9yKHNyYywgbmFtZT0nJykge1xuICAgICAgICB0aGlzLl9zcmMgPSBzcmM7XG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICAgIH1cblxuICAgIGdldCBzcmMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zcmM7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgIH1cbn07XG4iXX0=
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

var player = new _AudioPlayer2.default();
// player.playlist.addTrack(['./../media/System_Of_A_Down_-_Aerials.mp3']);
player.playlist.addTrackList(tracks);

playBtn.addEventListener('click', function () {
    if (!player.isPlaying) {
        player.play();
    } else {
        player.pause();
    }
});

playNextBtn.addEventListener('click', function () {
    player.playNext();
});

playPrevBtn.addEventListener('click', function () {
    player.playPrev();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfZGY4MGJkMWMuanMiXSwibmFtZXMiOlsidHJhY2tzIiwicGxheWVyTm9kZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwbGF5QnRuIiwicXVlcnlTZWxlY3RvciIsInBsYXlOZXh0QnRuIiwicGxheVByZXZCdG4iLCJwbGF5ZXIiLCJwbGF5bGlzdCIsImFkZFRyYWNrTGlzdCIsImFkZEV2ZW50TGlzdGVuZXIiLCJpc1BsYXlpbmciLCJwbGF5IiwicGF1c2UiLCJwbGF5TmV4dCIsInBsYXlQcmV2Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxDQUNYLGlDQURXLEVBRVgsNkJBRlcsRUFHWCxnQ0FIVyxFQUlYLCtCQUpXLEVBS1gsdUJBTFcsRUFNWCxnQ0FOVyxDQUFmOztBQVNBLElBQU1DLGFBQWFDLFNBQVNDLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBbkI7QUFDQSxJQUFNQyxVQUFVRixTQUFTRyxhQUFULENBQXVCLDRCQUF2QixDQUFoQjtBQUNBLElBQU1DLGNBQWNKLFNBQVNHLGFBQVQsQ0FBdUIsNEJBQXZCLENBQXBCO0FBQ0EsSUFBTUUsY0FBY0wsU0FBU0csYUFBVCxDQUF1Qiw0QkFBdkIsQ0FBcEI7O0FBR0EsSUFBTUcsU0FBUywyQkFBZjtBQUNBO0FBQ0FBLE9BQU9DLFFBQVAsQ0FBZ0JDLFlBQWhCLENBQTZCVixNQUE3Qjs7QUFFQUksUUFBUU8sZ0JBQVIsQ0FBeUIsT0FBekIsRUFBa0MsWUFBTTtBQUNwQyxRQUFHLENBQUNILE9BQU9JLFNBQVgsRUFBc0I7QUFDbEJKLGVBQU9LLElBQVA7QUFDSCxLQUZELE1BRU87QUFDSEwsZUFBT00sS0FBUDtBQUNIO0FBQ0osQ0FORDs7QUFRQVIsWUFBWUssZ0JBQVosQ0FBNkIsT0FBN0IsRUFBc0MsWUFBTTtBQUN4Q0gsV0FBT08sUUFBUDtBQUNILENBRkQ7O0FBSUFSLFlBQVlJLGdCQUFaLENBQTZCLE9BQTdCLEVBQXNDLFlBQU07QUFDeENILFdBQU9RLFFBQVA7QUFDSCxDQUZEIiwiZmlsZSI6ImZha2VfZGY4MGJkMWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXVkaW9QbGF5ZXIgZnJvbSAnLi9BdWRpb1BsYXllcic7XG5pbXBvcnQgUGxheWxpc3QgZnJvbSAnLi9QbGF5bGlzdCc7XG5pbXBvcnQgRE9NQnVpZGxlciBmcm9tICcuL3V0aWxzL0RPTUJ1aWxkZXInXG5cbmNvbnN0IHRyYWNrcyA9IFtcbiAgICAnLi8uLi9tZWRpYS8wMSAtIFByaXNvbiBTb25nLm1wMycsXG4gICAgJy4vLi4vbWVkaWEvMDIgLSBOZWVkbGVzLm1wMycsXG4gICAgJy4vLi4vbWVkaWEvMDMgLSBEZWVyIERhbmNlLm1wMycsXG4gICAgJy4vLi4vbWVkaWEvMDQgLSBKZXQgUGlsb3QubXAzJyxcbiAgICAnLi8uLi9tZWRpYS8wNSAtIFgubXAzJyxcbiAgICAnLi8uLi9tZWRpYS8wNiAtIENob3AgU3VleSEubXAzJyxcbl1cblxuY29uc3QgcGxheWVyTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyXCIpO1xuY29uc3QgcGxheUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9wbGF5Jyk7XG5jb25zdCBwbGF5TmV4dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9uZXh0Jyk7XG5jb25zdCBwbGF5UHJldkJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9wcmV2Jyk7XG5cblxuY29uc3QgcGxheWVyID0gbmV3IEF1ZGlvUGxheWVyKCk7XG4vLyBwbGF5ZXIucGxheWxpc3QuYWRkVHJhY2soWycuLy4uL21lZGlhL1N5c3RlbV9PZl9BX0Rvd25fLV9BZXJpYWxzLm1wMyddKTtcbnBsYXllci5wbGF5bGlzdC5hZGRUcmFja0xpc3QodHJhY2tzKTtcblxucGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBpZighcGxheWVyLmlzUGxheWluZykge1xuICAgICAgICBwbGF5ZXIucGxheSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYXllci5wYXVzZSgpO1xuICAgIH1cbn0pO1xuXG5wbGF5TmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBwbGF5ZXIucGxheU5leHQoKTtcbn0pO1xuXG5wbGF5UHJldkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBwbGF5ZXIucGxheVByZXYoKTtcbn0pOyJdfQ==
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