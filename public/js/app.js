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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvUGxheWVyLmpzIl0sIm5hbWVzIjpbIlBMQVlJTkdfVElNRSIsIkF1ZGlvUGxheWVyIiwibm9kZSIsInBsYXlsaXN0IiwicGFyYW1zIiwiY3VycmVudFRyYWNrSW5kZXgiLCJfcGxheWJhY2siLCJfcmVzZXRQbGF5YmFja0luZm8iLCJfY3R4IiwiX2dhaW4iLCJfY3JlYXRlQXVkaW9BcGlOb2RlcyIsImdhaW4iLCJ2YWx1ZSIsIm9uIiwiX3N0YXJ0UGxheWJhY2siLCJwbGF5aW5nIiwidHJhY2siLCJidWZmZXIiLCJjb25zb2xlIiwibG9nIiwidHJhY2tzIiwiX2xvYWRUcmFjayIsInNvdXJjZSIsInN0b3AiLCJvZmZzZXQiLCJjdXJyZW50VGltZSIsInN0YXJ0VGltZSIsImlzUGxheWluZyIsInBsYXkiLCJsb2FkaW5nIiwic3JjIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwicmVzcG9uc2VUeXBlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJkZWNvZGVBdWRpb0RhdGEiLCJyZXNwb25zZSIsImRlY29kZWRBcnJheUJ1ZmZlciIsImVtaXQiLCJzZW5kIiwicGxheWJhY2siLCJjcmVhdGVCdWZmZXJTb3VyY2UiLCJjb25uZWN0Iiwic3RhcnQiLCJkdXJhdGlvbiIsInBsYXlOZXh0Iiwid2luZG93IiwiQXVkaW9Db250ZXh0Iiwid2Via2l0QXVkaW9Db250ZXh0IiwiX2Rlc3QiLCJkZXN0aW5hdGlvbiIsImNyZWF0ZUdhaW4iLCJFcnJvciJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsZUFBZSxDQUFyQixDLENBQXdCOztJQUVIQyxXOzs7QUFDakIseUJBQVlDLElBQVosRUFBa0JDLFFBQWxCLEVBQXlDO0FBQUEsWUFBYkMsTUFBYSx1RUFBSixFQUFJOztBQUFBOztBQUFBOztBQUdyQyxjQUFLRCxRQUFMLEdBQWdCQSxZQUFZLHdCQUE1QjtBQUNBLGNBQUtFLGlCQUFMLEdB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QW1CLElBQW5COztBQUVBMkIscUJBQVNwQixNQUFULENBQWdCYSxnQkFBaEIsQ0FBaUMsT0FBakMsRUFBMEMsVUFBQ0MsQ0FBRCxFQUFPO0FBQzdDO0FBQ0E7QUFDQTtBQUNBLG9CQUFHLE9BQUtULFNBQVIsRUFBbUI7QUFDZjtBQUNBVCw0QkFBUUMsR0FBUixDQUFZLGFBQVo7QUFDQSwyQkFBSzRCLFFBQUw7QUFDSDtBQUNKLGFBVEQ7O0FBV0EsbUJBQU8sSUFBUDtBQUNIOzs7K0NBRXNCO0FBQ25CLGlCQUFLdkMsSUFBTCxHQUFZLEtBQUt3QyxPQUFPQyxZQUFQLElBQXVCRCxPQUFPRSxrQkFBbkMsR0FBWjtBQUNBLGlCQUFLQyxLQUFMLEdBQWEsS0FBSzNDLElBQUwsQ0FBVTRDLFdBQXZCO0FBQ0EsaUJBQUszQyxLQUFMLEdBQWEsS0FBS0QsSUFBTCxDQUFVNkMsVUFBVixFQUFiOztBQUVBO0FBQ0EsaUJBQUs1QyxLQUFMLENBQVdtQyxPQUFYLENBQW1CLEtBQUtPLEtBQXhCOztBQUVBLG1CQUFPLElBQVA7QUFDSDs7OzRCQWxKZTtBQUNaLG1CQUFPLEtBQUs3QyxTQUFMLENBQWVTLE9BQXRCO0FBQ0g7OzswQkFFVUgsSyxFQUFPO0FBQ2QsZ0JBQUdBLFFBQVEsQ0FBUixJQUFhQSxRQUFRLENBQXhCLEVBQTJCO0FBQ3ZCLHNCQUFNMEMsTUFBTSxxQ0FBTixDQUFOO0FBQ0g7QUFDRCxpQkFBSzdDLEtBQUwsQ0FBV0UsSUFBWCxDQUFnQkMsS0FBaEIsR0FBd0JBLEtBQXhCO0FBQ0g7Ozs7OztrQkEzQmdCWCxXIiwiZmlsZSI6IkF1ZGlvUGxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBQbGF5bGlzdCBmcm9tICcuL1BsYXlsaXN0JztcbmltcG9ydCBFdmVudEVtbWl0ZXIgZnJvbSAnLi91dGlscy9FdmVudEVtbWl0ZXInO1xuXG5jb25zdCBQTEFZSU5HX1RJTUUgPSA1OyAvL2ZvciB0ZXN0XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1ZGlvUGxheWVyIGV4dGVuZHMgRXZlbnRFbW1pdGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihub2RlLCBwbGF5bGlzdCwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLnBsYXlsaXN0ID0gcGxheWxpc3QgfHwgbmV3IFBsYXlsaXN0KCk7XG4gICAgICAgIHRoaXMuY3VycmVudFRyYWNrSW5kZXggPSAwO1xuICAgICAgICB0aGlzLl9wbGF5YmFjayA9IHt9XG4gICAgICAgIHRoaXMuX3Jlc2V0UGxheWJhY2tJbmZvKCk7XG4gICAgICAgIC8vIGluaXQgQXVkaW8gQVBJIE5vZGVzXG4gICAgICAgIHRoaXMuX2N0eCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2dhaW4gPSBudWxsO1xuICAgICAgICB0aGlzLl9jcmVhdGVBdWRpb0FwaU5vZGVzKCk7XG4gICAgICAgIHRoaXMuX2dhaW4uZ2Fpbi52YWx1ZSA9IDAuMDQ7XG5cbiAgICAgICAgLy9TdWJzY3JpYmVcbiAgICAgICAgdGhpcy5vbigndHJhY2s6bG9hZCcsIHRoaXMuX3N0YXJ0UGxheWJhY2spO1xuICAgIH1cblxuICAgIGdldCBpc1BsYXlpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wbGF5YmFjay5wbGF5aW5nO1xuICAgIH1cblxuICAgIHNldCB2b2x1bWUodmFsdWUpIHtcbiAgICAgICAgaWYodmFsdWUgPiAxICYmIHZhbHVlIDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1ZvbHVtZSBtdXN0IGJlIGluIHJhbmdlIGZyb20gMCB0byAxJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZ2Fpbi5nYWluLnZhbHVlID0gdmFsdWU7IFxuICAgIH1cblxuICAgIHBsYXkoKSB7XG4gICAgICAgIGlmKHRoaXMuX3BsYXliYWNrLnBsYXlpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLl9wbGF5YmFjay50cmFjayAmJiB0aGlzLl9wbGF5YmFjay5idWZmZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSRVNVTUUnKTtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0UGxheWJhY2soKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMucGxheWxpc3QudHJhY2tzW3RoaXMuY3VycmVudFRyYWNrSW5kZXhdKTtcbiAgICAgICAgICAgIHRoaXMuX2xvYWRUcmFjayh0aGlzLnBsYXlsaXN0LnRyYWNrc1t0aGlzLmN1cnJlbnRUcmFja0luZGV4XSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdG9wKCkge1xuICAgICAgICB0aGlzLl9wbGF5YmFjay5zb3VyY2Uuc3RvcCgpO1xuICAgICAgICB0aGlzLl9yZXNldFBsYXliYWNrSW5mbygpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHBhdXNlKCkge1xuICAgICAgICBpZih0aGlzLl9wbGF5YmFjay5wbGF5aW5nICYmIHRoaXMuX3BsYXliYWNrLnNvdXJjZSkge1xuICAgICAgICAgICAgdGhpcy5fcGxheWJhY2sucGxheWluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fcGxheWJhY2suc291cmNlLnN0b3AoKTtcbiAgICAgICAgICAgIHRoaXMuX3BsYXliYWNrLm9mZnNldCArPSB0aGlzLl9jdHguY3VycmVudFRpbWUgLSB0aGlzLl9wbGF5YmFjay5zdGFydFRpbWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUEFVU0VEJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcGxheU5leHQoKSB7XG4gICAgICAgIGlmKHRoaXMuaXNQbGF5aW5nICYmIHRoaXMuX3BsYXliYWNrLnNvdXJjZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRUcmFja0luZGV4ICs9IDE7XG4gICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwbGF5UHJldigpIHtcbiAgICAgICAgaWYodGhpcy5pc1BsYXlpbmcgJiYgdGhpcy5fcGxheWJhY2suc291cmNlKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3VycmVudFRyYWNrSW5kZXggLT0gMTtcbiAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9yZXNldFBsYXliYWNrSW5mbygpIHtcbiAgICAgICAgdGhpcy5fcGxheWJhY2sgPSB7XG4gICAgICAgICAgICB0cmFjazogbnVsbCxcbiAgICAgICAgICAgIHNvdXJjZTogbnVsbCxcbiAgICAgICAgICAgIGJ1ZmZlcjogbnVsbCxcbiAgICAgICAgICAgIHBsYXlpbmc6IGZhbHNlLFxuICAgICAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgICBzdGFydFRpbWU6IDAsXG4gICAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKCdSRVNFVCBQTEFZQkFDSycpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9sb2FkVHJhY2sodHJhY2spIHtcbiAgICAgICAgaWYodGhpcy5fcGxheWJhY2subG9hZGluZyAmJiB0aGlzLl9wbGF5YmFjay50cmFjaykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgeyBzcmMgfSA9IHRyYWNrO1xuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHRoaXMuX3BsYXliYWNrLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLl9wbGF5YmFjay50cmFjayA9IHRyYWNrO1xuXG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCBzcmMsIHRydWUpO1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcbiAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY3R4LmRlY29kZUF1ZGlvRGF0YSh4aHIucmVzcG9uc2UsXG4gICAgICAgICAgICAgICAgKGRlY29kZWRBcnJheUJ1ZmZlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wbGF5YmFjay5idWZmZXIgPSBkZWNvZGVkQXJyYXlCdWZmZXI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BsYXliYWNrLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd0cmFjazpsb2FkJyk7XG4gICAgICAgICAgICAgICAgfSwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGRlY29kaW5nIGZpbGUnLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgICAgeGhyLnNlbmQoKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfc2V0TmV4dFRyYWNrKCkge1xuXG4gICAgfVxuXG4gICAgX3N0YXJ0UGxheWJhY2soKSB7XG4gICAgICAgIGNvbnN0IHBsYXliYWNrID0gdGhpcy5fcGxheWJhY2s7XG4gICAgICAgIHBsYXliYWNrLnN0YXJ0VGltZSA9IHRoaXMuX2N0eC5jdXJyZW50VGltZTtcblxuICAgICAgICBwbGF5YmFjay5zb3VyY2UgPSB0aGlzLl9jdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgICAgIHBsYXliYWNrLnNvdXJjZS5jb25uZWN0KHRoaXMuX2dhaW4pO1xuICAgICAgICBwbGF5YmFjay5zb3VyY2UuYnVmZmVyID0gcGxheWJhY2suYnVmZmVyO1xuICAgICAgICBwbGF5YmFjay5zb3VyY2Uuc3RhcnQoMCwgcGxheWJhY2sub2Zmc2V0ICUgcGxheWJhY2suYnVmZmVyLmR1cmF0aW9uKTtcbiAgICAgICAgY29uc29sZS5sb2coJ1BMQVlJTkcnKTtcbiAgICAgICAgcGxheWJhY2sucGxheWluZyA9IHRydWU7XG5cbiAgICAgICAgcGxheWJhY2suc291cmNlLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKGUpID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnN0IHNvdXJjZSA9IGUudGFyZ2V0LmJ1ZmZlcjtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuX2N0eC5jdXJyZW50VGltZSAtICh0aGlzLl9wbGF5YmFjay5zdGFydFRpbWUgKyBzb3VyY2UuYnVmZmVyLmR1cmF0aW9uKSk7XG4gICAgICAgICAgICAvLyBtYXkgYmUgYnVnc1xuICAgICAgICAgICAgaWYodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICAvL2lzUGxheWluZyA9PSBub3QgcGF1c2VkXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1RSQUNLIEVOREVEJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5TmV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfY3JlYXRlQXVkaW9BcGlOb2RlcygpIHtcbiAgICAgICAgdGhpcy5fY3R4ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKCk7XG4gICAgICAgIHRoaXMuX2Rlc3QgPSB0aGlzLl9jdHguZGVzdGluYXRpb247XG4gICAgICAgIHRoaXMuX2dhaW4gPSB0aGlzLl9jdHguY3JlYXRlR2FpbigpO1xuXG4gICAgICAgIC8vIENvbm5lY3QgTm9kZXNcbiAgICAgICAgdGhpcy5fZ2Fpbi5jb25uZWN0KHRoaXMuX2Rlc3QpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiJdfQ==
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
    player.playPrev();
});

volumeSlider.addEventListener('click', function (e) {
    e.preventDefault();
    var ratio = (e.clientX - volumeSlider.offsetLeft) / volumeSlider.offsetWidth;
    var filledWidth = ratio * 100;
    volumeSliderFilled.style.width = filledWidth + '%';
    player.volume = ratio;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfOTA2OWQ1ZGIuanMiXSwibmFtZXMiOlsidHJhY2tzIiwicGxheWVyTm9kZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwbGF5QnRuIiwicXVlcnlTZWxlY3RvciIsInBsYXlOZXh0QnRuIiwicGxheVByZXZCdG4iLCJ2b2x1bWVTbGlkZXIiLCJ2b2x1bWVTbGlkZXJGaWxsZWQiLCJwbGF5ZXIiLCJwbGF5bGlzdCIsImFkZFRyYWNrTGlzdCIsImFkZEV2ZW50TGlzdGVuZXIiLCJpc1BsYXlpbmciLCJjbGFzc0xpc3QiLCJhZGQiLCJwbGF5IiwicmVtb3ZlIiwicGF1c2UiLCJlIiwicGxheU5leHQiLCJwbGF5UHJldiIsInByZXZlbnREZWZhdWx0IiwicmF0aW8iLCJjbGllbnRYIiwib2Zmc2V0TGVmdCIsIm9mZnNldFdpZHRoIiwiZmlsbGVkV2lkdGgiLCJzdHlsZSIsIndpZHRoIiwidm9sdW1lIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxDQUNYLGlDQURXLEVBRVgsNkJBRlcsRUFHWCxnQ0FIVyxFQUlYLCtCQUpXLEVBS1gsdUJBTFcsRUFNWCxnQ0FOVyxDQUFmOztBQVNBLElBQU1DLGFBQWFDLFNBQVNDLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBbkI7QUFDQSxJQUFNQyxVQUFVRixTQUFTRyxhQUFULENBQXVCLDRCQUF2QixDQUFoQjtBQUNBLElBQU1DLGNBQWNKLFNBQVNHLGFBQVQsQ0FBdUIsNEJBQXZCLENBQXBCO0FBQ0EsSUFBTUUsY0FBY0wsU0FBU0csYUFBVCxDQUF1Qiw0QkFBdkIsQ0FBcEI7O0FBRUEsSUFBTUcsZUFBZU4sU0FBU0csYUFBVCxDQUF1QixpQkFBdkIsQ0FBckI7QUFDQSxJQUFNSSxxQkFBcUJQLFNBQVNHLGFBQVQsQ0FBdUIsaUNBQXZCLENBQTNCOztBQUVBLElBQU1LLFNBQVMsMkJBQWY7QUFDQTtBQUNBQSxPQUFPQyxRQUFQLENBQWdCQyxZQUFoQixDQUE2QlosTUFBN0I7O0FBRUFJLFFBQVFTLGdCQUFSLENBQXlCLE9BQXpCLEVBQWtDLFlBQU07QUFDcEMsUUFBRyxDQUFDSCxPQUFPSSxTQUFYLEVBQXNCO0FBQ2xCVixnQkFBUVcsU0FBUixDQUFrQkMsR0FBbEIsQ0FBc0IsNEJBQXRCO0FBQ0FOLGVBQU9PLElBQVA7QUFDSCxLQUhELE1BR087QUFDSGIsZ0JBQVFXLFNBQVIsQ0FBa0JHLE1BQWxCLENBQXlCLDRCQUF6QjtBQUNBUixlQUFPUyxLQUFQO0FBQ0g7QUFDSixDQVJEOztBQVVBYixZQUFZTyxnQkFBWixDQUE2QixPQUE3QixFQUFzQyxVQUFDTyxDQUFELEVBQU87QUFDekNoQixZQUFRVyxTQUFSLENBQWtCQyxHQUFsQixDQUFzQiw0QkFBdEI7QUFDQU4sV0FBT1csUUFBUDtBQUNILENBSEQ7O0FBS0FkLFlBQVlNLGdCQUFaLENBQTZCLE9BQTdCLEVBQXNDLFVBQUNPLENBQUQsRUFBTztBQUN6Q1YsV0FBT1ksUUFBUDtBQUNILENBRkQ7O0FBSUFkLGFBQWFLLGdCQUFiLENBQThCLE9BQTlCLEVBQXVDLFVBQUNPLENBQUQsRUFBTztBQUMxQ0EsTUFBRUcsY0FBRjtBQUNBLFFBQU1DLFFBQVEsQ0FBQ0osRUFBRUssT0FBRixHQUFZakIsYUFBYWtCLFVBQTFCLElBQXdDbEIsYUFBYW1CLFdBQW5FO0FBQ0EsUUFBTUMsY0FBY0osUUFBUSxHQUE1QjtBQUNBZix1QkFBbUJvQixLQUFuQixDQUF5QkMsS0FBekIsR0FBb0NGLFdBQXBDO0FBQ0FsQixXQUFPcUIsTUFBUCxHQUFnQlAsS0FBaEI7QUFDSCxDQU5EIiwiZmlsZSI6ImZha2VfOTA2OWQ1ZGIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXVkaW9QbGF5ZXIgZnJvbSAnLi9BdWRpb1BsYXllcic7XG5pbXBvcnQgUGxheWxpc3QgZnJvbSAnLi9QbGF5bGlzdCc7XG5pbXBvcnQgRE9NQnVpZGxlciBmcm9tICcuL3V0aWxzL0RPTUJ1aWxkZXInXG5cbmNvbnN0IHRyYWNrcyA9IFtcbiAgICAnLi8uLi9tZWRpYS8wMSAtIFByaXNvbiBTb25nLm1wMycsXG4gICAgJy4vLi4vbWVkaWEvMDIgLSBOZWVkbGVzLm1wMycsXG4gICAgJy4vLi4vbWVkaWEvMDMgLSBEZWVyIERhbmNlLm1wMycsXG4gICAgJy4vLi4vbWVkaWEvMDQgLSBKZXQgUGlsb3QubXAzJyxcbiAgICAnLi8uLi9tZWRpYS8wNSAtIFgubXAzJyxcbiAgICAnLi8uLi9tZWRpYS8wNiAtIENob3AgU3VleSEubXAzJyxcbl1cblxuY29uc3QgcGxheWVyTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyXCIpO1xuY29uc3QgcGxheUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9wbGF5Jyk7XG5jb25zdCBwbGF5TmV4dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9uZXh0Jyk7XG5jb25zdCBwbGF5UHJldkJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9wcmV2Jyk7XG5cbmNvbnN0IHZvbHVtZVNsaWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52b2x1bWVfX3NsaWRlcicpO1xuY29uc3Qgdm9sdW1lU2xpZGVyRmlsbGVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZvbHVtZV9fc2xpZGVyIC5zbGlkZXJfX2ZpbGxlZCcpO1xuXG5jb25zdCBwbGF5ZXIgPSBuZXcgQXVkaW9QbGF5ZXIoKTtcbi8vIHBsYXllci5wbGF5bGlzdC5hZGRUcmFjayhbJy4vLi4vbWVkaWEvU3lzdGVtX09mX0FfRG93bl8tX0FlcmlhbHMubXAzJ10pO1xucGxheWVyLnBsYXlsaXN0LmFkZFRyYWNrTGlzdCh0cmFja3MpO1xuXG5wbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmKCFwbGF5ZXIuaXNQbGF5aW5nKSB7XG4gICAgICAgIHBsYXlCdG4uY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRyb2xzX19idG5fcGF1c2UnKTtcbiAgICAgICAgcGxheWVyLnBsYXkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBwbGF5QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3BsYXllci1jb250cm9sc19fYnRuX3BhdXNlJyk7XG4gICAgICAgIHBsYXllci5wYXVzZSgpO1xuICAgIH1cbn0pO1xuXG5wbGF5TmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgcGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udHJvbHNfX2J0bl9wYXVzZScpO1xuICAgIHBsYXllci5wbGF5TmV4dCgpO1xufSk7XG5cbnBsYXlQcmV2QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBwbGF5ZXIucGxheVByZXYoKTtcbn0pO1xuXG52b2x1bWVTbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCByYXRpbyA9IChlLmNsaWVudFggLSB2b2x1bWVTbGlkZXIub2Zmc2V0TGVmdCkgLyB2b2x1bWVTbGlkZXIub2Zmc2V0V2lkdGg7XG4gICAgY29uc3QgZmlsbGVkV2lkdGggPSByYXRpbyAqIDEwMDtcbiAgICB2b2x1bWVTbGlkZXJGaWxsZWQuc3R5bGUud2lkdGggPSBgJHtmaWxsZWRXaWR0aH0lYDtcbiAgICBwbGF5ZXIudm9sdW1lID0gcmF0aW87XG59KTsiXX0=
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