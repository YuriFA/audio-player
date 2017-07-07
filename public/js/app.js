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
        return _this;
    }

    _createClass(AudioPlayer, [{
        key: 'play',
        value: function play() {
            if (this.isPlaying) {
                return this;
            }

            if (!this._playback.track) {
                this._playback.track = this.playlist.getTrack(this.currentTrackIndex);
            }
            console.log('Playing track id=' + this.currentTrackIndex);

            var track = this._playback.track;
            if (track.audio && track.isBuffered()) {
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
        key: '_resetPlaybackInfo',
        value: function _resetPlaybackInfo() {
            this._playback = {
                track: null,
                source: null,
                playing: false,
                loading: false,
                startTime: 0,
                offset: 0
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

            console.log('Playing - ' + playback.track.src);
            playback.playing = true;
            track.audio.play();

            //Unsubscribe because changing current time triggering 'canplay' event
            track.off('track:canplay', this._startPlayback.bind(this));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvUGxheWVyLmpzIl0sIm5hbWVzIjpbIlBMQVlJTkdfVElNRSIsIkF1ZGlvUGxheWVyIiwibm9kZSIsInBsYXlsaXN0IiwicGFyYW1zIiwiY3VycmVudFRyYWNrSW5kZXgiLCJfcGxheWJhY2siLCJfcmVzZXRQbGF5YmFja0luZm8iLCJfY3R4IiwiX2dhaW4iLCJfY3JlYXRlQXVkaW9BcGlOb2RlcyIsImdhaW4iLCJ2YWx1ZSIsImlzUGxheWluZyIsInRyYWNrIiwiZ2V0VHJhY2siLCJjb25zb2xlIiwibG9nIiwiYXVkaW8iLCJpc0J1ZmZlcmVkIiwicGxheSIsInBsYXlpbmciLCJsb2FkIiwib24iLCJfc3RhcnRQbGF5YmFjayIsImJpbmQiLCJwbGF5TmV4dCIsInBhdXNlIiwiY3VycmVudFRpbWUiLCJzdG9wIiwic291cmNlIiwibG9hZGluZyIsInN0YXJ0VGltZSIsIm9mZnNldCIsInBsYXliYWNrIiwiY3JlYXRlTWVkaWFFbGVtZW50U291cmNlIiwiY29ubmVjdCIsInNyYyIsIm9mZiIsIndpbmRvdyIsIkF1ZGlvQ29udGV4dCIsIndlYmtpdEF1ZGlvQ29udGV4dCIsIl9kZXN0IiwiZGVzdGluYXRpb24iLCJjcmVhdGVHYWluIiwiRXJyb3IiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsZUFBZSxDQUFyQixDLENBQXdCOztJQUVIQyxXOzs7QUFDakIseUJBQVlDLElBQVosRUFBa0JDLFFBQWxCLEVBQXlDO0FBQUEsWUFBYkMsTUFBYSx1RUFBSixFQUFJOztBQUFBOztBQUFBOztBQUdyQyxjQUFLRCxRQUFMLEdBQWdCQSxZQUFZLHdCQUE1QjtBQUNBLGNBQUtFLGlCQUFMLEdBQXlCLENBQXpCO0FBQ0EsY0FBS0MsU0FBTCxHQUFpQixFQUFqQjtBQUNBLGNBQUtDLGtCQUFMO0FBQ0E7QUFDQSxjQUFLQyxJQUFMLEdBQVksSUFBWjtBQUNBLGNBQUtDLEtBQUwsR0FBYSxJ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T0FBaEIsQ0FBd0IsS0FBSzNCLEtBQTdCOztBQUVBTyxvQkFBUUMsR0FBUixnQkFBeUJpQixTQUFTcEIsS0FBVCxDQUFldUIsR0FBeEM7QUFDQUgscUJBQVNiLE9BQVQsR0FBbUIsSUFBbkI7QUFDQVAsa0JBQU1JLEtBQU4sQ0FBWUUsSUFBWjs7QUFFQTtBQUNBTixrQkFBTXdCLEdBQU4sQ0FBVSxlQUFWLEVBQTJCLEtBQUtkLGNBQUwsQ0FBb0JDLElBQXBCLENBQXlCLElBQXpCLENBQTNCOztBQUVBLG1CQUFPLElBQVA7QUFDSDs7OytDQUVzQjtBQUNuQixpQkFBS2pCLElBQUwsR0FBWSxLQUFLK0IsT0FBT0MsWUFBUCxJQUF1QkQsT0FBT0Usa0JBQW5DLEdBQVo7QUFDQSxpQkFBS0MsS0FBTCxHQUFhLEtBQUtsQyxJQUFMLENBQVVtQyxXQUF2QjtBQUNBLGlCQUFLbEMsS0FBTCxHQUFhLEtBQUtELElBQUwsQ0FBVW9DLFVBQVYsRUFBYjs7QUFFQTtBQUNBLGlCQUFLbkMsS0FBTCxDQUFXMkIsT0FBWCxDQUFtQixLQUFLTSxLQUF4Qjs7QUFFQSxtQkFBTyxJQUFQO0FBQ0g7Ozs0QkExSGU7QUFDWixtQkFBTyxLQUFLcEMsU0FBTCxDQUFlZSxPQUF0QjtBQUNIOzs7MEJBRVVULEssRUFBTztBQUNkLGdCQUFHQSxRQUFRLENBQVIsSUFBYUEsUUFBUSxDQUF4QixFQUEyQjtBQUN2QixzQkFBTWlDLE1BQU0scUNBQU4sQ0FBTjtBQUNIO0FBQ0QsaUJBQUtwQyxLQUFMLENBQVdFLElBQVgsQ0FBZ0JDLEtBQWhCLEdBQXdCQSxLQUF4QjtBQUNIOzs7Ozs7a0JBeEJnQlgsVyIsImZpbGUiOiJBdWRpb1BsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgUGxheWxpc3QgZnJvbSAnLi9QbGF5bGlzdCc7XG5pbXBvcnQgVHJhY2sgZnJvbSAnLi9UcmFjayc7XG5pbXBvcnQgRXZlbnRFbW1pdGVyIGZyb20gJy4vdXRpbHMvRXZlbnRFbW1pdGVyJztcblxuY29uc3QgUExBWUlOR19USU1FID0gNTsgLy9mb3IgdGVzdFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdWRpb1BsYXllciBleHRlbmRzIEV2ZW50RW1taXRlciB7XG4gICAgY29uc3RydWN0b3Iobm9kZSwgcGxheWxpc3QsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5wbGF5bGlzdCA9IHBsYXlsaXN0IHx8IG5ldyBQbGF5bGlzdCgpO1xuICAgICAgICB0aGlzLmN1cnJlbnRUcmFja0luZGV4ID0gMDtcbiAgICAgICAgdGhpcy5fcGxheWJhY2sgPSB7fVxuICAgICAgICB0aGlzLl9yZXNldFBsYXliYWNrSW5mbygpO1xuICAgICAgICAvLyBpbml0IEF1ZGlvIEFQSSBOb2Rlc1xuICAgICAgICB0aGlzLl9jdHggPSBudWxsO1xuICAgICAgICB0aGlzLl9nYWluID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY3JlYXRlQXVkaW9BcGlOb2RlcygpO1xuICAgICAgICB0aGlzLl9nYWluLmdhaW4udmFsdWUgPSAwLjA0O1xuICAgIH1cblxuICAgIGdldCBpc1BsYXlpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wbGF5YmFjay5wbGF5aW5nO1xuICAgIH1cblxuICAgIHNldCB2b2x1bWUodmFsdWUpIHtcbiAgICAgICAgaWYodmFsdWUgPiAxICYmIHZhbHVlIDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ1ZvbHVtZSBtdXN0IGJlIGluIHJhbmdlIGZyb20gMCB0byAxJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZ2Fpbi5nYWluLnZhbHVlID0gdmFsdWU7IFxuICAgIH1cblxuICAgIHBsYXkoKSB7XG4gICAgICAgIGlmKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCF0aGlzLl9wbGF5YmFjay50cmFjaykge1xuICAgICAgICAgICAgdGhpcy5fcGxheWJhY2sudHJhY2sgPSB0aGlzLnBsYXlsaXN0LmdldFRyYWNrKHRoaXMuY3VycmVudFRyYWNrSW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGBQbGF5aW5nIHRyYWNrIGlkPSR7dGhpcy5jdXJyZW50VHJhY2tJbmRleH1gKTtcblxuICAgICAgICBjb25zdCB0cmFjayA9IHRoaXMuX3BsYXliYWNrLnRyYWNrO1xuICAgICAgICBpZih0cmFjay5hdWRpbyAmJiB0cmFjay5pc0J1ZmZlcmVkKCkpIHtcbiAgICAgICAgICAgIHRyYWNrLmF1ZGlvLnBsYXkoKTtcbiAgICAgICAgICAgIHRoaXMuX3BsYXliYWNrLnBsYXlpbmcgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJhY2subG9hZCgpO1xuICAgICAgICAgICAgLy9TdWJzY3JpYmVcbiAgICAgICAgICAgIHRyYWNrLm9uKCd0cmFjazpjYW5wbGF5JywgdGhpcy5fc3RhcnRQbGF5YmFjay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRyYWNrLm9uKCd0cmFjazplbmRlZCcsIHRoaXMucGxheU5leHQuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzdG9wKCkge1xuICAgICAgICB0aGlzLl9wbGF5YmFjay5wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHRyYWNrID0gdGhpcy5fcGxheWJhY2sudHJhY2s7XG4gICAgICAgIHRyYWNrLmF1ZGlvLnBhdXNlKCk7XG4gICAgICAgIHRyYWNrLmF1ZGlvLmN1cnJlbnRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fcmVzZXRQbGF5YmFja0luZm8oKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBwYXVzZSgpIHtcbiAgICAgICAgdGhpcy5fcGxheWJhY2sucGxheWluZyA9IGZhbHNlO1xuICAgICAgICBjb25zdCB0cmFjayA9IHRoaXMuX3BsYXliYWNrLnRyYWNrO1xuICAgICAgICB0cmFjay5hdWRpby5wYXVzZSgpO1xuICAgICAgICBjb25zb2xlLmxvZygnUEFVU0VEJyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcGxheU5leHQoKSB7XG4gICAgICAgIGlmKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3VycmVudFRyYWNrSW5kZXggKz0gMTtcbiAgICAgICAgdGhpcy5wbGF5KCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcGxheVByZXYoKSB7XG4gICAgICAgIGlmKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3VycmVudFRyYWNrSW5kZXggLT0gMTtcbiAgICAgICAgdGhpcy5wbGF5KCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX3Jlc2V0UGxheWJhY2tJbmZvKCkge1xuICAgICAgICB0aGlzLl9wbGF5YmFjayA9IHtcbiAgICAgICAgICAgIHRyYWNrOiBudWxsLFxuICAgICAgICAgICAgc291cmNlOiBudWxsLFxuICAgICAgICAgICAgcGxheWluZzogZmFsc2UsXG4gICAgICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgIHN0YXJ0VGltZTogMCxcbiAgICAgICAgICAgIG9mZnNldDogMFxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdSRVNFVCBQTEFZQkFDSycpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIF9zdGFydFBsYXliYWNrKCkge1xuICAgICAgICBpZih0aGlzLmlzUGxheWluZykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0FscmVhZHkgcGxheWluZyExJyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBsYXliYWNrID0gdGhpcy5fcGxheWJhY2s7XG4gICAgICAgIGNvbnN0IHRyYWNrID0gdGhpcy5fcGxheWJhY2sudHJhY2s7XG4gICAgICAgIFxuICAgICAgICBwbGF5YmFjay5zdGFydFRpbWUgPSB0aGlzLl9jdHguY3VycmVudFRpbWU7XG4gICAgICAgIHBsYXliYWNrLnNvdXJjZSA9IHRoaXMuX2N0eC5jcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UodHJhY2suYXVkaW8pO1xuICAgICAgICBwbGF5YmFjay5zb3VyY2UuY29ubmVjdCh0aGlzLl9nYWluKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhgUGxheWluZyAtICR7cGxheWJhY2sudHJhY2suc3JjfWApO1xuICAgICAgICBwbGF5YmFjay5wbGF5aW5nID0gdHJ1ZTtcbiAgICAgICAgdHJhY2suYXVkaW8ucGxheSgpO1xuXG4gICAgICAgIC8vVW5zdWJzY3JpYmUgYmVjYXVzZSBjaGFuZ2luZyBjdXJyZW50IHRpbWUgdHJpZ2dlcmluZyAnY2FucGxheScgZXZlbnRcbiAgICAgICAgdHJhY2sub2ZmKCd0cmFjazpjYW5wbGF5JywgdGhpcy5fc3RhcnRQbGF5YmFjay5iaW5kKHRoaXMpKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfY3JlYXRlQXVkaW9BcGlOb2RlcygpIHtcbiAgICAgICAgdGhpcy5fY3R4ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKCk7XG4gICAgICAgIHRoaXMuX2Rlc3QgPSB0aGlzLl9jdHguZGVzdGluYXRpb247XG4gICAgICAgIHRoaXMuX2dhaW4gPSB0aGlzLl9jdHguY3JlYXRlR2FpbigpO1xuXG4gICAgICAgIC8vIENvbm5lY3QgTm9kZXNcbiAgICAgICAgdGhpcy5fZ2Fpbi5jb25uZWN0KHRoaXMuX2Rlc3QpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiJdfQ==
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXlsaXN0LmpzIl0sIm5hbWVzIjpbIlBsYXlsaXN0IiwiX3RyYWNrcyIsImlkIiwidHJhY2siLCJjb25zb2xlIiwibG9nIiwidHJhY2tzIiwiRXJyb3IiLCJzcmMiLCJuYW1lIiwicHVzaCIsImxpc3QiLCJmb3JFYWNoIiwiYWRkVHJhY2siXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7O0lBRXFCQSxRO0FBQ2pCLHdCQUFjO0FBQUE7O0FBQ1YsYUFBS0MsT0FBTCxHQUFlLEVBQWY7QUFDSDs7OztpQ0FNUUMsRSxFQUFJO0FBQ1QsZ0JBQU1DLFFBQVEsS0FBS0YsT0FBTCxDQUFhQyxFQUFiLENBQWQ7QUFDQSxnQkFBR0MsS0FBSCxFQUFVO0FBQ04sdUJBQU9BLEtBQVA7QUFDSCxhQUZELE1BRU87QUFDSEMsd0JBQVFDLEdBQVIsQ0FBWSxLQUFLQyxNQUFqQjtBQUNBLHNCQUFNQyx5QkFBdUJMLEVBQXZCLGlDQUFOO0FBQ0g7QUFDSjs7O2lDQUVRTSxHLEVBQWdCO0FBQUEsZ0JBQVhDLElBQVcsdUVBQUosRUFBSTs7QUFDckIsZ0JBQU1OLFFBQVEsb0JBQVVLLEdBQVYsRUFBZUMsSUFBZixDQUFkO0FBQ0EsaUJBQUtILE1BQUwsQ0FBWUksSUFBWixDQUFpQlAsS0FBakI7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOzs7cUNBRVlRLEksRUFBTTtBQUFBOztBQUNmQSxpQkFBS0MsT0FBTCxDQUFhLFVBQUNULEtBQUQsRUFBVztBQUNwQixvQkFBRyxPQUFPQSxLQUFQLEtBQWlCLFFBQXBCLEVBQThCO0FBQzFCQyw0QkFBUUMsR0FBUixDQUFZLEtBQVosRUFBbUJGLEtBQW5CO0FBQ0EsMEJBQUtVLFFBQUwsQ0FBY1YsS0FBZDtBQUNILGlCQUhELE1BR08sSUFBRyxRQUFPQSxLQUFQLHlDQUFPQSxLQUFQLE9BQWlCLFFBQXBCLEVBQThCO0FBQUEsd0JBQ3pCSyxHQUR5QixHQUNYTCxLQURXLENBQ3pCSyxHQUR5QjtBQUFBLHdCQUNwQkMsSUFEb0IsR0FDWE4sS0FEVyxDQUNwQk0sSUFEb0I7O0FBRWpDTCw0QkFBUUMsR0FBUixDQUFZLEtBQVosRUFBbUJHLEdBQW5CLEVBQXdCQyxJQUF4QjtBQUNBLDBCQUFLSSxRQUFMLENBQWNMLEdBQWQsRUFBbUJDLElBQW5CO0FBQ0g7QUFDSixhQVREO0FBVUg7Ozs0QkFoQ1k7QUFDVCxtQkFBTyxLQUFLUixPQUFaO0FBQ0g7Ozs7OztrQkFQZ0JELFEiLCJmaWxlIjoiUGxheWxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFRyYWNrIGZyb20gJy4vVHJhY2snO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5bGlzdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3RyYWNrcyA9IFtdO1xuICAgIH1cblxuICAgIGdldCB0cmFja3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90cmFja3M7XG4gICAgfVxuXG4gICAgZ2V0VHJhY2soaWQpIHtcbiAgICAgICAgY29uc3QgdHJhY2sgPSB0aGlzLl90cmFja3NbaWRdO1xuICAgICAgICBpZih0cmFjaykge1xuICAgICAgICAgICAgcmV0dXJuIHRyYWNrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy50cmFja3MpO1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoYFRyYWNrIHdpdGggaWQ9JHtpZH0gZG9zZW4ndCBleGlzdCBpbiBwbGF5bGlzdGApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkVHJhY2soc3JjLCBuYW1lID0gJycpIHtcbiAgICAgICAgY29uc3QgdHJhY2sgPSBuZXcgVHJhY2soc3JjLCBuYW1lKTtcbiAgICAgICAgdGhpcy50cmFja3MucHVzaCh0cmFjayk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYWRkVHJhY2tMaXN0KGxpc3QpIHtcbiAgICAgICAgbGlzdC5mb3JFYWNoKCh0cmFjaykgPT4ge1xuICAgICAgICAgICAgaWYodHlwZW9mIHRyYWNrID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdHInLCB0cmFjayk7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRUcmFjayh0cmFjayk7XG4gICAgICAgICAgICB9IGVsc2UgaWYodHlwZW9mIHRyYWNrID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3JjLCBuYW1lIH0gPSB0cmFjaztcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnb2JqJywgc3JjLCBuYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRyYWNrKHNyYywgbmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0iXX0=
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
        _this._audio = null;
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

            if (!this._audio) {
                this._audio = new Audio();
                this._audio.addEventListener('canplay', function (e) {
                    _this2.emit('track:canplay', e);
                });
                this._audio.addEventListener('ended', function () {
                    _this2.emit('track:ended');
                });
                this._audio.src = this._src;
            }

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
    }]);

    return Track;
}(_EventEmmiter3.default);

exports.default = Track;
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRyYWNrLmpzIl0sIm5hbWVzIjpbIlRyYWNrIiwic3JjIiwibmFtZSIsIl9zcmMiLCJfbmFtZSIsIl9idWZmZXIiLCJfYXVkaW8iLCJidWZmZXJlZCIsImxlbmd0aCIsIkF1ZGlvIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJlbWl0Il0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7O0lBRXFCQSxLOzs7QUFDakIsbUJBQVlDLEdBQVosRUFBMEI7QUFBQSxZQUFUQyxJQUFTLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUE7O0FBR3RCLGNBQUtDLElBQUwsR0FBWUYsR0FBWjtBQUNBLGNBQUtHLEtBQUwsR0FBYUYsSUFBYjtBQUNBLGNBQUtHLE9BQUwsR0FBZSxJQUFmO0FBQ0EsY0FBS0MsTUFBTCxHQUFjLElBQWQ7QUFOc0I7QUFPekI7Ozs7cUNBY1k7QUFDVCxtQkFBTyxLQUFLQSxNQUFMLENBQVlDLFFBQVosQ0FBcUJDLE1BQXJCLEdBQThCLENBQXJDO0FBQ0g7OzsrQkFFTTtBQUFBOztBQUNILGdCQUFHLENBQUMsS0FBS0YsTUFBVCxFQUFpQjtBQUNiLHFCQUFLQSxNQUFMLEdBQWMsSUFBSUcsS0FBSixFQUFkO0FBQ0EscUJBQUtILE1BQUwsQ0FBWUksZ0JBQVosQ0FBNkIsU0FBN0IsRUFBd0MsVUFBQ0MsQ0FBRCxFQUFPO0FBQzNDLDJCQUFLQyxJQUFMLENBQVUsZUFBVixFQUEyQkQsQ0FBM0I7QUFDSCxpQkFGRDtBQUdBLHFCQUFLTCxNQUFMLENBQVlJLGdCQUFaLENBQTZCLE9BQTdCLEVBQXNDLFlBQU07QUFDeEMsMkJBQUtFLElBQUwsQ0FBVSxhQUFWO0FBQ0gsaUJBRkQ7QUFHQSxxQkFBS04sTUFBTCxDQUFZTCxHQUFaLEdBQWtCLEtBQUtFLElBQXZCO0FBQ0g7O0FBRUQsbUJBQU8sSUFBUDtBQUNIOzs7NEJBN0JTO0FBQ04sbUJBQU8sS0FBS0EsSUFBWjtBQUNIOzs7NEJBRVU7QUFDUCxtQkFBTyxLQUFLQyxLQUFaO0FBQ0g7Ozs0QkFFVztBQUNSLG1CQUFPLEtBQUtFLE1BQVo7QUFDSDs7Ozs7O2tCQXBCZ0JOLEs7QUF3Q3BCIiwiZmlsZSI6IlRyYWNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBFdmVudEVtbWl0ZXIgZnJvbSAnLi91dGlscy9FdmVudEVtbWl0ZXIuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFjayBleHRlbmRzIEV2ZW50RW1taXRlcntcbiAgICBjb25zdHJ1Y3RvcihzcmMsIG5hbWU9JycpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLl9zcmMgPSBzcmM7XG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLl9idWZmZXIgPSBudWxsO1xuICAgICAgICB0aGlzLl9hdWRpbyA9IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IHNyYygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NyYztcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuXG4gICAgZ2V0IGF1ZGlvKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXVkaW87XG4gICAgfVxuXG4gICAgaXNCdWZmZXJlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F1ZGlvLmJ1ZmZlcmVkLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgbG9hZCgpIHtcbiAgICAgICAgaWYoIXRoaXMuX2F1ZGlvKSB7XG4gICAgICAgICAgICB0aGlzLl9hdWRpbyA9IG5ldyBBdWRpbygpO1xuICAgICAgICAgICAgdGhpcy5fYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcignY2FucGxheScsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCd0cmFjazpjYW5wbGF5JywgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2F1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgndHJhY2s6ZW5kZWQnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLl9hdWRpby5zcmMgPSB0aGlzLl9zcmM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59O1xuIl19
},{"./utils/EventEmmiter.js":6}],4:[function(require,module,exports){
'use strict';

var _AudioPlayer = require('./AudioPlayer');

var _AudioPlayer2 = _interopRequireDefault(_AudioPlayer);

var _Playlist = require('./Playlist');

var _Playlist2 = _interopRequireDefault(_Playlist);

var _DOMBuilder = require('./utils/DOMBuilder');

var _DOMBuilder2 = _interopRequireDefault(_DOMBuilder);

var _EventEmmiter = require('./utils/EventEmmiter');

var _EventEmmiter2 = _interopRequireDefault(_EventEmmiter);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfYzkxOTE1YTYuanMiXSwibmFtZXMiOlsidHJhY2tzIiwicGxheWVyTm9kZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwbGF5QnRuIiwicXVlcnlTZWxlY3RvciIsInBsYXlOZXh0QnRuIiwicGxheVByZXZCdG4iLCJ2b2x1bWVTbGlkZXIiLCJ2b2x1bWVTbGlkZXJGaWxsZWQiLCJwbGF5ZXIiLCJwbGF5bGlzdCIsImFkZFRyYWNrTGlzdCIsImFkZEV2ZW50TGlzdGVuZXIiLCJpc1BsYXlpbmciLCJjbGFzc0xpc3QiLCJhZGQiLCJwbGF5IiwicmVtb3ZlIiwicGF1c2UiLCJlIiwicGxheU5leHQiLCJwbGF5UHJldiIsInByZXZlbnREZWZhdWx0IiwicmF0aW8iLCJjbGllbnRYIiwib2Zmc2V0TGVmdCIsIm9mZnNldFdpZHRoIiwiZmlsbGVkV2lkdGgiLCJzdHlsZSIsIndpZHRoIiwidm9sdW1lIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxTQUFTLENBQ1gsaUNBRFcsRUFFWCw2QkFGVyxFQUdYLGdDQUhXLEVBSVgsK0JBSlcsRUFLWCx1QkFMVyxFQU1YLGdDQU5XLENBQWY7O0FBU0EsSUFBTUMsYUFBYUMsU0FBU0MsY0FBVCxDQUF3QixRQUF4QixDQUFuQjtBQUNBLElBQU1DLFVBQVVGLFNBQVNHLGFBQVQsQ0FBdUIsNEJBQXZCLENBQWhCO0FBQ0EsSUFBTUMsY0FBY0osU0FBU0csYUFBVCxDQUF1Qiw0QkFBdkIsQ0FBcEI7QUFDQSxJQUFNRSxjQUFjTCxTQUFTRyxhQUFULENBQXVCLDRCQUF2QixDQUFwQjs7QUFFQSxJQUFNRyxlQUFlTixTQUFTRyxhQUFULENBQXVCLGlCQUF2QixDQUFyQjtBQUNBLElBQU1JLHFCQUFxQlAsU0FBU0csYUFBVCxDQUF1QixpQ0FBdkIsQ0FBM0I7O0FBRUEsSUFBTUssU0FBUywyQkFBZjtBQUNBO0FBQ0FBLE9BQU9DLFFBQVAsQ0FBZ0JDLFlBQWhCLENBQTZCWixNQUE3Qjs7QUFFQUksUUFBUVMsZ0JBQVIsQ0FBeUIsT0FBekIsRUFBa0MsWUFBTTtBQUNwQyxRQUFHLENBQUNILE9BQU9JLFNBQVgsRUFBc0I7QUFDbEJWLGdCQUFRVyxTQUFSLENBQWtCQyxHQUFsQixDQUFzQiw0QkFBdEI7QUFDQU4sZUFBT08sSUFBUDtBQUNILEtBSEQsTUFHTztBQUNIYixnQkFBUVcsU0FBUixDQUFrQkcsTUFBbEIsQ0FBeUIsNEJBQXpCO0FBQ0FSLGVBQU9TLEtBQVA7QUFDSDtBQUNKLENBUkQ7O0FBVUFiLFlBQVlPLGdCQUFaLENBQTZCLE9BQTdCLEVBQXNDLFVBQUNPLENBQUQsRUFBTztBQUN6Q2hCLFlBQVFXLFNBQVIsQ0FBa0JDLEdBQWxCLENBQXNCLDRCQUF0QjtBQUNBTixXQUFPVyxRQUFQO0FBQ0gsQ0FIRDs7QUFLQWQsWUFBWU0sZ0JBQVosQ0FBNkIsT0FBN0IsRUFBc0MsVUFBQ08sQ0FBRCxFQUFPO0FBQ3pDaEIsWUFBUVcsU0FBUixDQUFrQkMsR0FBbEIsQ0FBc0IsNEJBQXRCO0FBQ0FOLFdBQU9ZLFFBQVA7QUFDSCxDQUhEOztBQUtBZCxhQUFhSyxnQkFBYixDQUE4QixPQUE5QixFQUF1QyxVQUFDTyxDQUFELEVBQU87QUFDMUNBLE1BQUVHLGNBQUY7QUFDQSxRQUFNQyxRQUFRLENBQUNKLEVBQUVLLE9BQUYsR0FBWWpCLGFBQWFrQixVQUExQixJQUF3Q2xCLGFBQWFtQixXQUFuRTtBQUNBLFFBQU1DLGNBQWNKLFFBQVEsR0FBNUI7QUFDQWYsdUJBQW1Cb0IsS0FBbkIsQ0FBeUJDLEtBQXpCLEdBQW9DRixXQUFwQztBQUNBbEIsV0FBT3FCLE1BQVAsR0FBZ0JQLEtBQWhCO0FBQ0gsQ0FORCIsImZpbGUiOiJmYWtlX2M5MTkxNWE2LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEF1ZGlvUGxheWVyIGZyb20gJy4vQXVkaW9QbGF5ZXInO1xuaW1wb3J0IFBsYXlsaXN0IGZyb20gJy4vUGxheWxpc3QnO1xuaW1wb3J0IERPTUJ1aWRsZXIgZnJvbSAnLi91dGlscy9ET01CdWlsZGVyJ1xuaW1wb3J0IEV2ZW50RW1taXRlciBmcm9tICcuL3V0aWxzL0V2ZW50RW1taXRlcidcblxuY29uc3QgdHJhY2tzID0gW1xuICAgICcuLy4uL21lZGlhLzAxIC0gUHJpc29uIFNvbmcubXAzJyxcbiAgICAnLi8uLi9tZWRpYS8wMiAtIE5lZWRsZXMubXAzJyxcbiAgICAnLi8uLi9tZWRpYS8wMyAtIERlZXIgRGFuY2UubXAzJyxcbiAgICAnLi8uLi9tZWRpYS8wNCAtIEpldCBQaWxvdC5tcDMnLFxuICAgICcuLy4uL21lZGlhLzA1IC0gWC5tcDMnLFxuICAgICcuLy4uL21lZGlhLzA2IC0gQ2hvcCBTdWV5IS5tcDMnLFxuXVxuXG5jb25zdCBwbGF5ZXJOb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5ZXJcIik7XG5jb25zdCBwbGF5QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1jb250cm9sc19fYnRuX3BsYXknKTtcbmNvbnN0IHBsYXlOZXh0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1jb250cm9sc19fYnRuX25leHQnKTtcbmNvbnN0IHBsYXlQcmV2QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1jb250cm9sc19fYnRuX3ByZXYnKTtcblxuY29uc3Qgdm9sdW1lU2xpZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZvbHVtZV9fc2xpZGVyJyk7XG5jb25zdCB2b2x1bWVTbGlkZXJGaWxsZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudm9sdW1lX19zbGlkZXIgLnNsaWRlcl9fZmlsbGVkJyk7XG5cbmNvbnN0IHBsYXllciA9IG5ldyBBdWRpb1BsYXllcigpO1xuLy8gcGxheWVyLnBsYXlsaXN0LmFkZFRyYWNrKFsnLi8uLi9tZWRpYS9TeXN0ZW1fT2ZfQV9Eb3duXy1fQWVyaWFscy5tcDMnXSk7XG5wbGF5ZXIucGxheWxpc3QuYWRkVHJhY2tMaXN0KHRyYWNrcyk7XG5cbnBsYXlCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgaWYoIXBsYXllci5pc1BsYXlpbmcpIHtcbiAgICAgICAgcGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udHJvbHNfX2J0bl9wYXVzZScpO1xuICAgICAgICBwbGF5ZXIucGxheSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHBsYXlCdG4uY2xhc3NMaXN0LnJlbW92ZSgncGxheWVyLWNvbnRyb2xzX19idG5fcGF1c2UnKTtcbiAgICAgICAgcGxheWVyLnBhdXNlKCk7XG4gICAgfVxufSk7XG5cbnBsYXlOZXh0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBwbGF5QnRuLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250cm9sc19fYnRuX3BhdXNlJyk7XG4gICAgcGxheWVyLnBsYXlOZXh0KCk7XG59KTtcblxucGxheVByZXZCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIHBsYXlCdG4uY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRyb2xzX19idG5fcGF1c2UnKTtcbiAgICBwbGF5ZXIucGxheVByZXYoKTtcbn0pO1xuXG52b2x1bWVTbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCByYXRpbyA9IChlLmNsaWVudFggLSB2b2x1bWVTbGlkZXIub2Zmc2V0TGVmdCkgLyB2b2x1bWVTbGlkZXIub2Zmc2V0V2lkdGg7XG4gICAgY29uc3QgZmlsbGVkV2lkdGggPSByYXRpbyAqIDEwMDtcbiAgICB2b2x1bWVTbGlkZXJGaWxsZWQuc3R5bGUud2lkdGggPSBgJHtmaWxsZWRXaWR0aH0lYDtcbiAgICBwbGF5ZXIudm9sdW1lID0gcmF0aW87XG59KTsiXX0=
},{"./AudioPlayer":1,"./Playlist":2,"./utils/DOMBuilder":5,"./utils/EventEmmiter":6}],5:[function(require,module,exports){
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
},{}]},{},[4])