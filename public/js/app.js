(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Analyser = function () {
  function Analyser(context) {
    _classCallCheck(this, Analyser);

    this.analyser = null;
    this.fFrequencyData = null;
    this.bFrequencyData = null;
    this.bTimeData = null;

    this._context = context;
    this._create();
    this.updateData();
  }

  _createClass(Analyser, [{
    key: "_create",
    value: function _create() {
      this.analyser = this._context.createAnalyser();
      // Размерность преобразования Фурье
      // Если не понимаете, что это такое - ставьте 512, 1024 или 2048 ;)
      this.analyser.fftSize = 2048;
      // Создаем массивы для хранения данных
      this.fFrequencyData = new Float32Array(this.analyser.frequencyBinCount);
      this.bFrequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      this.bTimeData = new Uint8Array(this.analyser.frequencyBinCount);

      return this;
    }
  }, {
    key: "updateData",
    value: function updateData() {
      this.analyser.getFloatFrequencyData(this.fFrequencyData);
      this.analyser.getByteFrequencyData(this.bFrequencyData);
      this.analyser.getByteTimeDomainData(this.bTimeData);
      // console.log(this.fFrequencyData);
      // console.log(this.bFrequencyData);
      // console.log(this.bTimeData);

      return this;
    }
  }]);

  return Analyser;
}();

exports.default = Analyser;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFuYWx5c2VyLmpzIl0sIm5hbWVzIjpbIkFuYWx5c2VyIiwiY29udGV4dCIsImFuYWx5c2VyIiwiZkZyZXF1ZW5jeURhdGEiLCJiRnJlcXVlbmN5RGF0YSIsImJUaW1lRGF0YSIsIl9jb250ZXh0IiwiX2NyZWF0ZSIsInVwZGF0ZURhdGEiLCJjcmVhdGVBbmFseXNlciIsImZmdFNpemUiLCJGbG9hdDMyQXJyYXkiLCJmcmVxdWVuY3lCaW5Db3VudCIsIlVpbnQ4QXJyYXkiLCJnZXRGbG9hdEZyZXF1ZW5jeURhdGEiLCJnZXRCeXRlRnJlcXVlbmN5RGF0YSIsImdldEJ5dGVUaW1lRG9tYWluRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFxQkEsUTtBQUNuQixvQkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUNuQixTQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsU0FBS0MsY0FBTCxHQUFzQixJQUF0QjtBQUNBLFNBQUtDLGNBQUwsR0FBc0IsSUFBdEI7QUFDQSxTQUFLQyxTQUFMLEdBQWlCLElBQWpCOztBQUVBLFNBQUtDLFFBQUwsR0FBZ0JMLE9BQWhCO0FBQ0EsU0FBS00sT0FBTDtBQUNBLFNBQUtDLFVBQUw7QUFDRDs7Ozs4QkFFUztBQUNSLFdBQUtOLFFBQUwsR0FBZ0IsS0FBS0ksUUFBTCxDQUFjRyxjQUFkLEVBQWhCO0FBQ0E7QUFDQTtBQUNBLFdBQUtQLFFBQUwsQ0FBY1EsT0FBZCxHQUF3QixJQUF4QjtBQUNBO0FBQ0EsV0FBS1AsY0FBTCxHQUFzQixJQUFJUSxZQUFKLENBQWlCLEtBQUtULFFBQUwsQ0FBY1UsaUJBQS9CLENBQXRCO0FBQ0EsV0FBS1IsY0FBTCxHQUFzQixJQUFJUyxVQUFKLENBQWUsS0FBS1gsUUFBTCxDQUFjVSxpQkFBN0IsQ0FBdEI7QUFDQSxXQUFLUCxTQUFMLEdBQWlCLElBQUlRLFVBQUosQ0FBZSxLQUFLWCxRQUFMLENBQWNVLGlCQUE3QixDQUFqQjs7QUFFQSxhQUFPLElBQVA7QUFDRDs7O2lDQUVZO0FBQ1gsV0FBS1YsUUFBTCxDQUFjWSxxQkFBZCxDQUFvQyxLQUFLWCxjQUF6QztBQUNBLFdBQUtELFFBQUwsQ0FBY2Esb0JBQWQsQ0FBbUMsS0FBS1gsY0FBeEM7QUFDQSxXQUFLRixRQUFMLENBQWNjLHFCQUFkLENBQW9DLEtBQUtYLFNBQXpDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQU8sSUFBUDtBQUNEOzs7Ozs7a0JBbENrQkwsUSIsImZpbGUiOiJBbmFseXNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuYWx5c2VyIHtcbiAgY29uc3RydWN0b3IoY29udGV4dCkge1xuICAgIHRoaXMuYW5hbHlzZXIgPSBudWxsO1xuICAgIHRoaXMuZkZyZXF1ZW5jeURhdGEgPSBudWxsO1xuICAgIHRoaXMuYkZyZXF1ZW5jeURhdGEgPSBudWxsO1xuICAgIHRoaXMuYlRpbWVEYXRhID0gbnVsbDtcblxuICAgIHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMuX2NyZWF0ZSgpO1xuICAgIHRoaXMudXBkYXRlRGF0YSgpO1xuICB9XG5cbiAgX2NyZWF0ZSgpIHtcbiAgICB0aGlzLmFuYWx5c2VyID0gdGhpcy5fY29udGV4dC5jcmVhdGVBbmFseXNlcigpO1xuICAgIC8vINCg0LDQt9C80LXRgNC90L7RgdGC0Ywg0L/RgNC10L7QsdGA0LDQt9C+0LLQsNC90LjRjyDQpNGD0YDRjNC1XG4gICAgLy8g0JXRgdC70Lgg0L3QtSDQv9C+0L3QuNC80LDQtdGC0LUsINGH0YLQviDRjdGC0L4g0YLQsNC60L7QtSAtINGB0YLQsNCy0YzRgtC1IDUxMiwgMTAyNCDQuNC70LggMjA0OCA7KVxuICAgIHRoaXMuYW5hbHlzZXIuZmZ0U2l6ZSA9IDIwNDg7XG4gICAgLy8g0KHQvtC30LTQsNC10Lwg0LzQsNGB0YHQuNCy0Ysg0LTQu9GPINGF0YDQsNC90LXQvdC40Y8g0LTQsNC90L3Ri9GFXG4gICAgdGhpcy5mRnJlcXVlbmN5RGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5hbmFseXNlci5mcmVxdWVuY3lCaW5Db3VudCk7XG4gICAgdGhpcy5iRnJlcXVlbmN5RGF0YSA9IG5ldyBVaW50OEFycmF5KHRoaXMuYW5hbHlzZXIuZnJlcXVlbmN5QmluQ291bnQpO1xuICAgIHRoaXMuYlRpbWVEYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5hbmFseXNlci5mcmVxdWVuY3lCaW5Db3VudCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHVwZGF0ZURhdGEoKSB7XG4gICAgdGhpcy5hbmFseXNlci5nZXRGbG9hdEZyZXF1ZW5jeURhdGEodGhpcy5mRnJlcXVlbmN5RGF0YSk7XG4gICAgdGhpcy5hbmFseXNlci5nZXRCeXRlRnJlcXVlbmN5RGF0YSh0aGlzLmJGcmVxdWVuY3lEYXRhKTtcbiAgICB0aGlzLmFuYWx5c2VyLmdldEJ5dGVUaW1lRG9tYWluRGF0YSh0aGlzLmJUaW1lRGF0YSk7XG4gICAgLy8gY29uc29sZS5sb2codGhpcy5mRnJlcXVlbmN5RGF0YSk7XG4gICAgLy8gY29uc29sZS5sb2codGhpcy5iRnJlcXVlbmN5RGF0YSk7XG4gICAgLy8gY29uc29sZS5sb2codGhpcy5iVGltZURhdGEpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxufVxuIl19
},{}],2:[function(require,module,exports){
'use strict';

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

var _Analyser = require('./Analyser');

var _Analyser2 = _interopRequireDefault(_Analyser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
    _this.settings = settings;
    _this._playback = {};
    _this._resetPlaybackInfo();
    _this._setTrack();

    // init Audio API Nodes
    _this._ctx = null;
    _this._gain = null;
    _this._equalizer = null;
    _this._analyser = null;
    _this._createAudioApiNodes();
    return _this;
  }

  _createClass(AudioPlayer, [{
    key: 'play',
    value: function play() {
      var _this2 = this;

      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (this.isPlaying) {
        return this;
      }

      this.currentTrackIndex = id || this.currentTrackIndex;

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
        // Subscribe
        // чет не ок
        track.on('canplay', this._startPlayback.bind(this));
        track.on('ended', this.playNext.bind(this));
        track.on('progress', function (event) {
          _this2.emit('track:progress', event);
        });
        track.on('loadeddata', function (event) {
          _this2.emit('track:loadeddata', event);
        });
        track.on('canplaythrough', function (event) {
          _this2.emit('track:canplaythrough', event);
        });
        track.on('loadedmetadata', function (event) {
          _this2.emit('track:loadedmetadata', event);
        });
        track.on('timeupdate', function (event) {
          _this2.emit('track:timeupdate', event);
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
    key: '_setTrack',
    value: function _setTrack() {
      if (this.isPlaying) {
        return this;
      }
      console.log('Setting track', this.currentTrackIndex);
      // TODO: need to refactoring this
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
      };
      // console.log('RESET PLAYBACK');

      return this;
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

      // Unsubscribe because 'canplay' event triggered by changing the current time
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
      this._analyser = this.settings.analyser ? new _Analyser2.default(this._ctx) : null;

      return this;
    }
  }, {
    key: '_connectNodes',
    value: function _connectNodes() {
      var filters = this._equalizer ? this._equalizer.filters : [];
      var analyser = this._analyser ? this._analyser.analyser : null;
      console.log(analyser);
      var toConnectNodes = [this._playback.source].concat(_toConsumableArray(filters), [this._gain, analyser, this._dest]).filter(function (n) {
        return n;
      });

      toConnectNodes.reduce(function (prev, curr) {
        if (prev instanceof AudioNode && curr instanceof AudioNode) {
          prev.connect(curr);
        }
        return curr;
      });

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
  }, {
    key: 'equalizer',
    get: function get() {
      return this._equalizer;
    }
  }, {
    key: 'analyser',
    get: function get() {
      return this._analyser;
    }
  }]);

  return AudioPlayer;
}(_EventEmmiter3.default);

exports.default = AudioPlayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvUGxheWVyLmpzIl0sIm5hbWVzIjpbIkF1ZGlvUGxheWVyIiwidHJhY2tzIiwic2V0dGluZ3MiLCJwbGF5bGlzdCIsIm11dGVkIiwiY3VycmVudFRyYWNrSW5kZXgiLCJfcGxheWJhY2siLCJfcmVzZXRQbGF5YmFja0luZm8iLCJfc2V0VHJhY2siLCJfY3R4IiwiX2dhaW4iLCJfZXF1YWxpemVyIiwiX2FuYWx5c2VyIiwiX2NyZWF0ZUF1ZGlvQXBpTm9kZXMiLCJpZCIsImlzUGxheWluZyIsInRyYWNrIiwiY29uc29sZSIsImxvZyIsInNyYyIsImF1ZGlvIiwiaXNCdWZmZXJlZCIsInBsYXkiLCJwbGF5aW5nIiwibG9hZCIsIm9uIiwiX3N0YXJ0UGxheWJhY2siLCJiaW5kIiwicGxheU5leHQiLCJldmVudCIsImVtaXQiLCJwYXVzZSIsImN1cnJlbnRUaW1lIiwic3RvcCIsInJhdGlvIiwiRXJyb3IiLCJpc05hTiIsImR1cmF0aW9uIiwibmV3VGltZSIsImdldFRyYWNrIiwiZXJyb3IiLCJzb3VyY2UiLCJwbGF5YmFjayIsImNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZSIsIl9jb25uZWN0Tm9kZXMiLCJvZmYiLCJ3aW5kb3ciLCJBdWRpb0NvbnRleHQiLCJ3ZWJraXRBdWRpb0NvbnRleHQiLCJfZGVzdCIsImRlc3RpbmF0aW9uIiwiY3JlYXRlR2FpbiIsImVxdWFsaXplciIsImFuYWx5c2VyIiwiZmlsdGVycyIsInRvQ29ubmVjdE5vZGVzIiwiZmlsdGVyIiwibiIsInJlZHVjZSIsInByZXYiLCJjdXJyIiwiQXVkaW9Ob2RlIiwiY29ubmVjdCIsImdhaW4iLCJ2YWx1ZSIsIm11dGUiLCJ1bm11dGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7SUFFcUJBLFc7OztBQUNuQix5QkFBd0M7QUFBQSxRQUE1QkMsTUFBNEIsdUVBQW5CLEVBQW1CO0FBQUEsUUFBZkMsUUFB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QixVQUFDQyxJQUFELEVBQU9DLElBQVAsRUFBZ0I7QUFDcEMsWUFBSUQsZ0JBQWdCRSxTQUFoQixJQUE2QkQsZ0JBQWdCQyxTQUFqRCxFQUE0RDtBQUMxREYsZUFBS0csT0FBTCxDQUFhRixJQUFiO0FBQ0Q7QUFDRCxlQUFPQSxJQUFQO0FBQ0QsT0FMRDs7QUFPQSxhQUFPLElBQVA7QUFDRDs7O3dCQWhPZTtBQUNkLGFBQU8sS0FBS3RELFNBQUwsQ0FBZWlCLE9BQXRCO0FBQ0Q7Ozt3QkFFWTtBQUNYLGFBQU8sS0FBS2IsS0FBTCxDQUFXcUQsSUFBWCxDQUFnQkMsS0FBdkI7QUFDRCxLO3NCQVVVQSxLLEVBQU87QUFDaEIsVUFBSUEsUUFBUSxDQUFSLElBQWFBLFFBQVEsQ0FBekIsRUFBNEI7QUFDMUIsY0FBTTdCLE1BQU0scUNBQU4sQ0FBTjtBQUNEO0FBQ0QsVUFBSTZCLFVBQVUsQ0FBZCxFQUFpQjtBQUNmLGFBQUtDLElBQUw7QUFDRCxPQUZELE1BRU8sSUFBSSxLQUFLN0QsS0FBVCxFQUFnQjtBQUNyQixhQUFLOEQsTUFBTDtBQUNEO0FBQ0QsV0FBS3hELEtBQUwsQ0FBV3FELElBQVgsQ0FBZ0JDLEtBQWhCLEdBQXdCQSxLQUF4QjtBQUNEOzs7d0JBbEJlO0FBQ2QsYUFBTyxLQUFLckQsVUFBWjtBQUNEOzs7d0JBRWM7QUFDYixhQUFPLEtBQUtDLFNBQVo7QUFDRDs7Ozs7O2tCQWxDa0JaLFciLCJmaWxlIjoiQXVkaW9QbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGxheWxpc3QgZnJvbSAnLi9QbGF5bGlzdCc7XG5pbXBvcnQgVHJhY2sgZnJvbSAnLi9UcmFjayc7XG5pbXBvcnQgRXZlbnRFbW1pdGVyIGZyb20gJy4vdXRpbHMvRXZlbnRFbW1pdGVyJztcbmltcG9ydCBFcXVhbGl6ZXIgZnJvbSAnLi9FcXVhbGl6ZXInO1xuaW1wb3J0IEFuYWx5c2VyIGZyb20gJy4vQW5hbHlzZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdWRpb1BsYXllciBleHRlbmRzIEV2ZW50RW1taXRlciB7XG4gIGNvbnN0cnVjdG9yKHRyYWNrcyA9IFtdLCBzZXR0aW5ncyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMucGxheWxpc3QgPSBuZXcgUGxheWxpc3QodHJhY2tzKTtcbiAgICB0aGlzLm11dGVkID0gZmFsc2U7XG4gICAgdGhpcy5jdXJyZW50VHJhY2tJbmRleCA9IDA7XG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgIHRoaXMuX3BsYXliYWNrID0ge307XG4gICAgdGhpcy5fcmVzZXRQbGF5YmFja0luZm8oKTtcbiAgICB0aGlzLl9zZXRUcmFjaygpO1xuXG4gICAgLy8gaW5pdCBBdWRpbyBBUEkgTm9kZXNcbiAgICB0aGlzLl9jdHggPSBudWxsO1xuICAgIHRoaXMuX2dhaW4gPSBudWxsO1xuICAgIHRoaXMuX2VxdWFsaXplciA9IG51bGw7XG4gICAgdGhpcy5fYW5hbHlzZXIgPSBudWxsO1xuICAgIHRoaXMuX2NyZWF0ZUF1ZGlvQXBpTm9kZXMoKTtcbiAgfVxuXG4gIGdldCBpc1BsYXlpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BsYXliYWNrLnBsYXlpbmc7XG4gIH1cblxuICBnZXQgdm9sdW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9nYWluLmdhaW4udmFsdWU7XG4gIH1cblxuICBnZXQgZXF1YWxpemVyKCkge1xuICAgIHJldHVybiB0aGlzLl9lcXVhbGl6ZXI7XG4gIH1cblxuICBnZXQgYW5hbHlzZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FuYWx5c2VyO1xuICB9XG5cbiAgc2V0IHZvbHVtZSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA+IDEgJiYgdmFsdWUgPCAwKSB7XG4gICAgICB0aHJvdyBFcnJvcignVm9sdW1lIG11c3QgYmUgaW4gcmFuZ2UgZnJvbSAwIHRvIDEnKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlID09PSAwKSB7XG4gICAgICB0aGlzLm11dGUoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubXV0ZWQpIHtcbiAgICAgIHRoaXMudW5tdXRlKCk7XG4gICAgfVxuICAgIHRoaXMuX2dhaW4uZ2Fpbi52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgcGxheShpZCA9IG51bGwpIHtcbiAgICBpZiAodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudFRyYWNrSW5kZXggPSBpZCB8fCB0aGlzLmN1cnJlbnRUcmFja0luZGV4O1xuXG4gICAgaWYgKCF0aGlzLl9wbGF5YmFjay50cmFjayB8fCB0aGlzLl9wbGF5YmFjay50cmFjay5pZCAhPT0gdGhpcy5jdXJyZW50VHJhY2tJbmRleCkge1xuICAgICAgdGhpcy5fc2V0VHJhY2soKTtcbiAgICB9XG5cbiAgICBjb25zdCB0cmFjayA9IHRoaXMuX3BsYXliYWNrLnRyYWNrO1xuXG4gICAgY29uc29sZS5sb2coYFBsYXlpbmcgdHJhY2sgaWQ9JHt0aGlzLmN1cnJlbnRUcmFja0luZGV4fSAtICR7dHJhY2suc3JjfWApO1xuICAgIGlmICh0cmFjay5hdWRpbyAmJiB0cmFjay5pc0J1ZmZlcmVkKCkpIHtcbiAgICAgIHRyYWNrLmF1ZGlvLnBsYXkoKTtcbiAgICAgIHRoaXMuX3BsYXliYWNrLnBsYXlpbmcgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmFjay5sb2FkKCk7XG4gICAgICAvLyBTdWJzY3JpYmVcbiAgICAgIC8vINGH0LXRgiDQvdC1INC+0LpcbiAgICAgIHRyYWNrLm9uKCdjYW5wbGF5JywgdGhpcy5fc3RhcnRQbGF5YmFjay5iaW5kKHRoaXMpKTtcbiAgICAgIHRyYWNrLm9uKCdlbmRlZCcsIHRoaXMucGxheU5leHQuYmluZCh0aGlzKSk7XG4gICAgICB0cmFjay5vbigncHJvZ3Jlc3MnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KCd0cmFjazpwcm9ncmVzcycsIGV2ZW50KTtcbiAgICAgIH0pO1xuICAgICAgdHJhY2sub24oJ2xvYWRlZGRhdGEnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KCd0cmFjazpsb2FkZWRkYXRhJywgZXZlbnQpO1xuICAgICAgfSk7XG4gICAgICB0cmFjay5vbignY2FucGxheXRocm91Z2gnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KCd0cmFjazpjYW5wbGF5dGhyb3VnaCcsIGV2ZW50KTtcbiAgICAgIH0pO1xuICAgICAgdHJhY2sub24oJ2xvYWRlZG1ldGFkYXRhJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdCgndHJhY2s6bG9hZGVkbWV0YWRhdGEnLCBldmVudCk7XG4gICAgICB9KTtcbiAgICAgIHRyYWNrLm9uKCd0aW1ldXBkYXRlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdCgndHJhY2s6dGltZXVwZGF0ZScsIGV2ZW50KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLl9wbGF5YmFjay5wbGF5aW5nID0gZmFsc2U7XG4gICAgY29uc3QgdHJhY2sgPSB0aGlzLl9wbGF5YmFjay50cmFjaztcbiAgICB0cmFjay5hdWRpby5wYXVzZSgpO1xuICAgIHRyYWNrLmF1ZGlvLmN1cnJlbnRUaW1lID0gMDtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5fcGxheWJhY2sucGxheWluZyA9IGZhbHNlO1xuICAgIGNvbnN0IHRyYWNrID0gdGhpcy5fcGxheWJhY2sudHJhY2s7XG4gICAgdHJhY2suYXVkaW8ucGF1c2UoKTtcbiAgICBjb25zb2xlLmxvZygnUEFVU0VEJyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG11dGUoKSB7XG4gICAgdGhpcy5fcGxheWJhY2sudHJhY2subXV0ZWQgPSB0cnVlO1xuICAgIHRoaXMubXV0ZWQgPSB0cnVlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1bm11dGUoKSB7XG4gICAgdGhpcy5fcGxheWJhY2sudHJhY2subXV0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLm11dGVkID0gZmFsc2U7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHBsYXlOZXh0KCkge1xuICAgIGlmICh0aGlzLmlzUGxheWluZykge1xuICAgICAgdGhpcy5zdG9wKCk7XG4gICAgfVxuICAgIHRoaXMuX3Jlc2V0UGxheWJhY2tJbmZvKCk7XG5cbiAgICB0aGlzLmN1cnJlbnRUcmFja0luZGV4ICs9IDE7XG4gICAgdGhpcy5wbGF5KCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHBsYXlQcmV2KCkge1xuICAgIGlmICh0aGlzLmlzUGxheWluZykge1xuICAgICAgdGhpcy5zdG9wKCk7XG4gICAgfVxuICAgIHRoaXMuX3Jlc2V0UGxheWJhY2tJbmZvKCk7XG5cbiAgICB0aGlzLmN1cnJlbnRUcmFja0luZGV4IC09IDE7XG4gICAgdGhpcy5wbGF5KCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJld2luZChyYXRpbykge1xuICAgIGlmIChyYXRpbyA+IDEgJiYgcmF0aW8gPCAwKSB7XG4gICAgICB0aHJvdyBFcnJvcignVG8gcmV3aW5kIGF1ZGlvLCByYXRpbyBtdXN0IGJlIGluIHJhbmdlIGZyb20gMCB0byAxJyk7XG4gICAgfVxuXG4gICAgY29uc3QgYXVkaW8gPSB0aGlzLl9wbGF5YmFjay50cmFjay5hdWRpbztcbiAgICBpZiAoIWlzTmFOKGF1ZGlvLmR1cmF0aW9uKSkge1xuICAgICAgY29uc3QgbmV3VGltZSA9IGF1ZGlvLmR1cmF0aW9uICogcmF0aW87XG4gICAgICBhdWRpby5jdXJyZW50VGltZSA9IG5ld1RpbWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfc2V0VHJhY2soKSB7XG4gICAgaWYgKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgY29uc29sZS5sb2coJ1NldHRpbmcgdHJhY2snLCB0aGlzLmN1cnJlbnRUcmFja0luZGV4KTtcbiAgICAvLyBUT0RPOiBuZWVkIHRvIHJlZmFjdG9yaW5nIHRoaXNcbiAgICB0cnkge1xuICAgICAgdGhpcy5fcGxheWJhY2sudHJhY2sgPSB0aGlzLnBsYXlsaXN0LmdldFRyYWNrKHRoaXMuY3VycmVudFRyYWNrSW5kZXgpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICBjb25zb2xlLmxvZygnQ3VycmVudFRyYWNrSW5kZXggcmVzZXRlZCB0byAwJyk7XG4gICAgICB0aGlzLmN1cnJlbnRUcmFja0luZGV4ID0gMDtcbiAgICAgIHRoaXMuX3BsYXliYWNrLnRyYWNrID0gdGhpcy5wbGF5bGlzdC5nZXRUcmFjayh0aGlzLmN1cnJlbnRUcmFja0luZGV4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9yZXNldFBsYXliYWNrSW5mbygpIHtcbiAgICB0aGlzLl9wbGF5YmFjayA9IHtcbiAgICAgIHRyYWNrOiBudWxsLFxuICAgICAgc291cmNlOiBudWxsLFxuICAgICAgcGxheWluZzogZmFsc2UsXG4gICAgfTtcbiAgICAvLyBjb25zb2xlLmxvZygnUkVTRVQgUExBWUJBQ0snKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX3N0YXJ0UGxheWJhY2soKSB7XG4gICAgaWYgKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICBjb25zb2xlLmxvZygnQWxyZWFkeSBwbGF5aW5nITEnKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNvbnN0IHBsYXliYWNrID0gdGhpcy5fcGxheWJhY2s7XG4gICAgY29uc3QgdHJhY2sgPSB0aGlzLl9wbGF5YmFjay50cmFjaztcblxuICAgIHBsYXliYWNrLnNvdXJjZSA9IHRoaXMuX2N0eC5jcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UodHJhY2suYXVkaW8pO1xuICAgIHRoaXMuX2Nvbm5lY3ROb2RlcygpO1xuXG4gICAgY29uc29sZS5sb2coYExvYWRlZCAtICR7cGxheWJhY2sudHJhY2suc3JjfWApO1xuICAgIHBsYXliYWNrLnBsYXlpbmcgPSB0cnVlO1xuICAgIHRyYWNrLmF1ZGlvLnBsYXkoKTtcblxuICAgIC8vIFVuc3Vic2NyaWJlIGJlY2F1c2UgJ2NhbnBsYXknIGV2ZW50IHRyaWdnZXJlZCBieSBjaGFuZ2luZyB0aGUgY3VycmVudCB0aW1lXG4gICAgdHJhY2sub2ZmKCdjYW5wbGF5JywgdGhpcy5fc3RhcnRQbGF5YmFjay5iaW5kKHRoaXMpKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX2NyZWF0ZUF1ZGlvQXBpTm9kZXMoKSB7XG4gICAgaWYgKCEod2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0KSkgcmV0dXJuO1xuXG4gICAgdGhpcy5fY3R4ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKCk7XG4gICAgdGhpcy5fZGVzdCA9IHRoaXMuX2N0eC5kZXN0aW5hdGlvbjtcbiAgICB0aGlzLl9nYWluID0gdGhpcy5fY3R4LmNyZWF0ZUdhaW4oKTtcbiAgICB0aGlzLl9lcXVhbGl6ZXIgPSB0aGlzLnNldHRpbmdzLmVxdWFsaXplciA/IG5ldyBFcXVhbGl6ZXIodGhpcy5fY3R4KSA6IG51bGw7XG4gICAgdGhpcy5fYW5hbHlzZXIgPSB0aGlzLnNldHRpbmdzLmFuYWx5c2VyID8gbmV3IEFuYWx5c2VyKHRoaXMuX2N0eCkgOiBudWxsO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfY29ubmVjdE5vZGVzKCkge1xuICAgIGNvbnN0IGZpbHRlcnMgPSB0aGlzLl9lcXVhbGl6ZXIgPyB0aGlzLl9lcXVhbGl6ZXIuZmlsdGVycyA6IFtdO1xuICAgIGNvbnN0IGFuYWx5c2VyID0gdGhpcy5fYW5hbHlzZXIgPyB0aGlzLl9hbmFseXNlci5hbmFseXNlciA6IG51bGw7XG4gICAgY29uc29sZS5sb2coYW5hbHlzZXIpO1xuICAgIGNvbnN0IHRvQ29ubmVjdE5vZGVzID0gW1xuICAgICAgdGhpcy5fcGxheWJhY2suc291cmNlLFxuICAgICAgLi4uZmlsdGVycyxcbiAgICAgIHRoaXMuX2dhaW4sXG4gICAgICBhbmFseXNlcixcbiAgICAgIHRoaXMuX2Rlc3QsXG4gICAgXS5maWx0ZXIobiA9PiBuKTtcblxuICAgIHRvQ29ubmVjdE5vZGVzLnJlZHVjZSgocHJldiwgY3VycikgPT4ge1xuICAgICAgaWYgKHByZXYgaW5zdGFuY2VvZiBBdWRpb05vZGUgJiYgY3VyciBpbnN0YW5jZW9mIEF1ZGlvTm9kZSkge1xuICAgICAgICBwcmV2LmNvbm5lY3QoY3Vycik7XG4gICAgICB9XG4gICAgICByZXR1cm4gY3VycjtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG4iXX0=
},{"./Analyser":1,"./Equalizer":3,"./Playlist":4,"./Track":5,"./utils/EventEmmiter":8}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MIN_DB = -12;
var MAX_DB = 12;

var PRESETS = [{
  name: 'Acoustic',
  data: [5, 5, 4, 1, 2, 2, 3, 4, 3, 2]
}, {
  name: 'Bass Booster',
  data: [6, 5, 4, 3, 2, 0, 0, 0, 0, 0]
}, {
  name: 'Bass Reducer',
  data: [-6, -5, -4, -3, -2, 0, 0, 0, 0, 0]
}, {
  name: 'Classical',
  data: [5, 4, 3, 2, -1, -1, 0, 1, 3, 4]
}, {
  name: 'Dance',
  data: [4, 6, 5, 0, 2, 3, 5, 4, 3, 0]
}, {
  name: 'Deep',
  data: [5, 3, 2, 1, 3, 2, 1, -2, -4, -5]
}, {
  name: 'Electronic',
  data: [4, 4, 1, 0, -2, 2, 1, 2, 4, 5]
}, {
  name: 'Hip-Hop',
  data: [5, 3, 1, 3, -1, -1, 1, -1, 2, 3]
}, {
  name: 'Jazz',
  data: [4, 3, 1, 2, -1, -1, 0, 1, 3, 4]
}, {
  name: 'Latin',
  data: [5, 3, 0, 0, -1, -1, -1, 0, 3, 5]
}, {
  name: 'Loudness',
  data: [6, 4, 0, 0, -2, 0, -1, -5, 4, 1]
}, {
  name: 'Lounge',
  data: [-3, -2, -1, 1, 4, 3, 0, -1, 2, 1]
}, {
  name: 'Piano',
  data: [3, 2, 0, 2, 3, 1, 3, 5, 3, 4]
}, {
  name: 'Pop',
  data: [-2, -1, 0, 2, 4, 4, 2, 0, -1, -2]
}, {
  name: 'R&B',
  data: [2, 7, 6, 1, -2, -1, 2, 3, 3, 4]
}, {
  name: 'Rock',
  data: [5, 4, 3, 2, -1, -2, 0, 2, 3, 4]
}, {
  name: 'Small Speakers',
  data: [5, 4, 3, 2, 1, 0, -2, -3, -4, -5]
}, {
  name: 'Spoken Word',
  data: [-4, -1, 0, 1, 3, 5, 5, 4, 2, 0]
}, {
  name: 'Treble Booster',
  data: [0, 0, 0, 0, 0, 1, 2, 3, 4, 5]
}, {
  name: 'Treble Reducer',
  data: [0, 0, 0, 0, 0, -1, -2, -3, -4, -5]
}, {
  name: 'Vocal Booster',
  data: [-1, -3, -3, 1, 4, 4, 3, 1, 0, -1]
}];
var FREQS = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

var Equalizer = function () {
  function Equalizer(context) {
    _classCallCheck(this, Equalizer);

    this.filters = [];
    this.presets = PRESETS;
    this._context = context;
    this._frequencies = FREQS;
    this._createFilters();
  }

  _createClass(Equalizer, [{
    key: 'changeFilterGain',
    value: function changeFilterGain(id, value) {
      if (id in this.filters) {
        this.filters[id].gain.value = (0, _utils.validateInRange)(value, MIN_DB, MAX_DB);
      }

      return this;
    }
  }, {
    key: 'getFilterGain',
    value: function getFilterGain(id) {
      return id in this.filters ? this.filters[id].gain.value : null;
    }
  }, {
    key: '_createFilter',
    value: function _createFilter(frequency) {
      var filter = this._context.createBiquadFilter();

      filter.type = 'peaking';
      filter.frequency.value = frequency;
      filter.Q.value = 1; // Q-factor
      filter.gain.value = 0;

      return filter;
    }
  }, {
    key: '_createFilters',
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
    key: 'frequencies',
    get: function get() {
      return this._frequencies;
    }
  }]);

  return Equalizer;
}();

exports.default = Equalizer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVxdWFsaXplci5qcyJdLCJuYW1lcyI6WyJNSU5fREIiLCJNQVhfREIiLCJQUkVTRVRTIiwibmFtZSIsImRhdGEiLCJGUkVRUyIsIkVxdWFsaXplciIsImNvbnRleHQiLCJmaWx0ZXJzIiwicHJlc2V0cyIsIl9jb250ZXh0IiwiX2ZyZXF1ZW5jaWVzIiwiX2NyZWF0ZUZpbHRlcnMiLCJpZCIsInZhbHVlIiwiZ2FpbiIsImZyZXF1ZW5jeSIsImZpbHRlciIsImNyZWF0ZUJpcXVhZEZpbHRlciIsInR5cGUiLCJRIiwibWFwIiwiX2NyZWF0ZUZpbHRlciIsImJpbmQiLCJyZWR1Y2UiLCJwcmV2IiwiY3VyciIsImNvbm5lY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFFQSxJQUFNQSxTQUFTLENBQUMsRUFBaEI7QUFDQSxJQUFNQyxTQUFTLEVBQWY7O0FBRUEsSUFBTUMsVUFBVSxDQUNkO0FBQ0VDLFFBQU0sVUFEUjtBQUVFQyxRQUFNLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUI7QUFGUixDQURjLEVBSVg7QUFDREQsUUFBTSxjQURMO0FBRURDLFFBQU0sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QixDQUF6QixFQUE0QixDQUE1QjtBQUZMLENBSlcsRUFPWDtBQUNERCxRQUFNLGNBREw7QUFFREMsUUFBTSxDQUFDLENBQUMsQ0FBRixFQUFLLENBQUMsQ0FBTixFQUFTLENBQUMsQ0FBVixFQUFhLENBQUMsQ0FBZCxFQUFpQixDQUFDLENBQWxCLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLEVBQWlDLENBQWpDO0FBRkwsQ0FQVyxFQVVY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SUFBMUQ7QUFDRDs7O2tDQUVhRSxTLEVBQVc7QUFDdkIsVUFBTUMsU0FBUyxLQUFLUCxRQUFMLENBQWNRLGtCQUFkLEVBQWY7O0FBRUFELGFBQU9FLElBQVAsR0FBYyxTQUFkO0FBQ0FGLGFBQU9ELFNBQVAsQ0FBaUJGLEtBQWpCLEdBQXlCRSxTQUF6QjtBQUNBQyxhQUFPRyxDQUFQLENBQVNOLEtBQVQsR0FBaUIsQ0FBakIsQ0FMdUIsQ0FLSDtBQUNwQkcsYUFBT0YsSUFBUCxDQUFZRCxLQUFaLEdBQW9CLENBQXBCOztBQUVBLGFBQU9HLE1BQVA7QUFDRDs7O3FDQUVnQjtBQUNmLFVBQU1ULFVBQVUsS0FBS0csWUFBTCxDQUFrQlUsR0FBbEIsQ0FBc0IsS0FBS0MsYUFBTCxDQUFtQkMsSUFBbkIsQ0FBd0IsSUFBeEIsQ0FBdEIsQ0FBaEI7QUFDQWYsY0FBUWdCLE1BQVIsQ0FBZSxVQUFDQyxJQUFELEVBQU9DLElBQVAsRUFBZ0I7QUFDN0JELGFBQUtFLE9BQUwsQ0FBYUQsSUFBYjtBQUNBLGVBQU9BLElBQVA7QUFDRCxPQUhEO0FBSUEsV0FBS2xCLE9BQUwsR0FBZUEsT0FBZjs7QUFFQSxhQUFPLElBQVA7QUFDRDs7O3dCQXBDaUI7QUFDaEIsYUFBTyxLQUFLRyxZQUFaO0FBQ0Q7Ozs7OztrQkFYa0JMLFMiLCJmaWxlIjoiRXF1YWxpemVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdmFsaWRhdGVJblJhbmdlIH0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IE1JTl9EQiA9IC0xMjtcbmNvbnN0IE1BWF9EQiA9IDEyO1xuXG5jb25zdCBQUkVTRVRTID0gW1xuICB7XG4gICAgbmFtZTogJ0Fjb3VzdGljJyxcbiAgICBkYXRhOiBbNSwgNSwgNCwgMSwgMiwgMiwgMywgNCwgMywgMl0sXG4gIH0sIHtcbiAgICBuYW1lOiAnQmFzcyBCb29zdGVyJyxcbiAgICBkYXRhOiBbNiwgNSwgNCwgMywgMiwgMCwgMCwgMCwgMCwgMF0sXG4gIH0sIHtcbiAgICBuYW1lOiAnQmFzcyBSZWR1Y2VyJyxcbiAgICBkYXRhOiBbLTYsIC01LCAtNCwgLTMsIC0yLCAwLCAwLCAwLCAwLCAwXSxcbiAgfSwge1xuICAgIG5hbWU6ICdDbGFzc2ljYWwnLFxuICAgIGRhdGE6IFs1LCA0LCAzLCAyLCAtMSwgLTEsIDAsIDEsIDMsIDRdLFxuICB9LCB7XG4gICAgbmFtZTogJ0RhbmNlJyxcbiAgICBkYXRhOiBbNCwgNiwgNSwgMCwgMiwgMywgNSwgNCwgMywgMF0sXG4gIH0sIHtcbiAgICBuYW1lOiAnRGVlcCcsXG4gICAgZGF0YTogWzUsIDMsIDIsIDEsIDMsIDIsIDEsIC0yLCAtNCwgLTVdLFxuICB9LCB7XG4gICAgbmFtZTogJ0VsZWN0cm9uaWMnLFxuICAgIGRhdGE6IFs0LCA0LCAxLCAwLCAtMiwgMiwgMSwgMiwgNCwgNV0sXG4gIH0sIHtcbiAgICBuYW1lOiAnSGlwLUhvcCcsXG4gICAgZGF0YTogWzUsIDMsIDEsIDMsIC0xLCAtMSwgMSwgLTEsIDIsIDNdLFxuICB9LCB7XG4gICAgbmFtZTogJ0phenonLFxuICAgIGRhdGE6IFs0LCAzLCAxLCAyLCAtMSwgLTEsIDAsIDEsIDMsIDRdLFxuICB9LCB7XG4gICAgbmFtZTogJ0xhdGluJyxcbiAgICBkYXRhOiBbNSwgMywgMCwgMCwgLTEsIC0xLCAtMSwgMCwgMywgNV0sXG4gIH0sIHtcbiAgICBuYW1lOiAnTG91ZG5lc3MnLFxuICAgIGRhdGE6IFs2LCA0LCAwLCAwLCAtMiwgMCwgLTEsIC01LCA0LCAxXSxcbiAgfSwge1xuICAgIG5hbWU6ICdMb3VuZ2UnLFxuICAgIGRhdGE6IFstMywgLTIsIC0xLCAxLCA0LCAzLCAwLCAtMSwgMiwgMV0sXG4gIH0sIHtcbiAgICBuYW1lOiAnUGlhbm8nLFxuICAgIGRhdGE6IFszLCAyLCAwLCAyLCAzLCAxLCAzLCA1LCAzLCA0XSxcbiAgfSwge1xuICAgIG5hbWU6ICdQb3AnLFxuICAgIGRhdGE6IFstMiwgLTEsIDAsIDIsIDQsIDQsIDIsIDAsIC0xLCAtMl0sXG4gIH0sIHtcbiAgICBuYW1lOiAnUiZCJyxcbiAgICBkYXRhOiBbMiwgNywgNiwgMSwgLTIsIC0xLCAyLCAzLCAzLCA0XSxcbiAgfSwge1xuICAgIG5hbWU6ICdSb2NrJyxcbiAgICBkYXRhOiBbNSwgNCwgMywgMiwgLTEsIC0yLCAwLCAyLCAzLCA0XSxcbiAgfSwge1xuICAgIG5hbWU6ICdTbWFsbCBTcGVha2VycycsXG4gICAgZGF0YTogWzUsIDQsIDMsIDIsIDEsIDAsIC0yLCAtMywgLTQsIC01XSxcbiAgfSwge1xuICAgIG5hbWU6ICdTcG9rZW4gV29yZCcsXG4gICAgZGF0YTogWy00LCAtMSwgMCwgMSwgMywgNSwgNSwgNCwgMiwgMF0sXG4gIH0sIHtcbiAgICBuYW1lOiAnVHJlYmxlIEJvb3N0ZXInLFxuICAgIGRhdGE6IFswLCAwLCAwLCAwLCAwLCAxLCAyLCAzLCA0LCA1XSxcbiAgfSwge1xuICAgIG5hbWU6ICdUcmVibGUgUmVkdWNlcicsXG4gICAgZGF0YTogWzAsIDAsIDAsIDAsIDAsIC0xLCAtMiwgLTMsIC00LCAtNV0sXG4gIH0sIHtcbiAgICBuYW1lOiAnVm9jYWwgQm9vc3RlcicsXG4gICAgZGF0YTogWy0xLCAtMywgLTMsIDEsIDQsIDQsIDMsIDEsIDAsIC0xXSxcbiAgfSxcbl07XG5jb25zdCBGUkVRUyA9IFs2MCwgMTcwLCAzMTAsIDYwMCwgMTAwMCwgMzAwMCwgNjAwMCwgMTIwMDAsIDE0MDAwLCAxNjAwMF07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVxdWFsaXplciB7XG4gIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcbiAgICB0aGlzLmZpbHRlcnMgPSBbXTtcbiAgICB0aGlzLnByZXNldHMgPSBQUkVTRVRTO1xuICAgIHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMuX2ZyZXF1ZW5jaWVzID0gRlJFUVM7XG4gICAgdGhpcy5fY3JlYXRlRmlsdGVycygpO1xuICB9XG5cbiAgZ2V0IGZyZXF1ZW5jaWVzKCkge1xuICAgIHJldHVybiB0aGlzLl9mcmVxdWVuY2llcztcbiAgfVxuXG4gIGNoYW5nZUZpbHRlckdhaW4oaWQsIHZhbHVlKSB7XG4gICAgaWYgKGlkIGluIHRoaXMuZmlsdGVycykge1xuICAgICAgdGhpcy5maWx0ZXJzW2lkXS5nYWluLnZhbHVlID0gdmFsaWRhdGVJblJhbmdlKHZhbHVlLCBNSU5fREIsIE1BWF9EQik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXRGaWx0ZXJHYWluKGlkKSB7XG4gICAgcmV0dXJuIGlkIGluIHRoaXMuZmlsdGVycyA/IHRoaXMuZmlsdGVyc1tpZF0uZ2Fpbi52YWx1ZSA6IG51bGw7XG4gIH1cblxuICBfY3JlYXRlRmlsdGVyKGZyZXF1ZW5jeSkge1xuICAgIGNvbnN0IGZpbHRlciA9IHRoaXMuX2NvbnRleHQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG5cbiAgICBmaWx0ZXIudHlwZSA9ICdwZWFraW5nJztcbiAgICBmaWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gZnJlcXVlbmN5O1xuICAgIGZpbHRlci5RLnZhbHVlID0gMTsgLy8gUS1mYWN0b3JcbiAgICBmaWx0ZXIuZ2Fpbi52YWx1ZSA9IDA7XG5cbiAgICByZXR1cm4gZmlsdGVyO1xuICB9XG5cbiAgX2NyZWF0ZUZpbHRlcnMoKSB7XG4gICAgY29uc3QgZmlsdGVycyA9IHRoaXMuX2ZyZXF1ZW5jaWVzLm1hcCh0aGlzLl9jcmVhdGVGaWx0ZXIuYmluZCh0aGlzKSk7XG4gICAgZmlsdGVycy5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcbiAgICAgIHByZXYuY29ubmVjdChjdXJyKTtcbiAgICAgIHJldHVybiBjdXJyO1xuICAgIH0pO1xuICAgIHRoaXMuZmlsdGVycyA9IGZpbHRlcnM7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuIl19
},{"./utils":11}],4:[function(require,module,exports){
'use strict';

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
      if (!track) {
        throw Error('Track with id=' + id + ' dosen\'t exist in playlist');
      }
      return track;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXlsaXN0LmpzIl0sIm5hbWVzIjpbIlBsYXlsaXN0IiwidHJhY2tzIiwiX3RyYWNrcyIsImFkZFRyYWNrTGlzdCIsImlkIiwidHJhY2siLCJFcnJvciIsInNyYyIsIm5hbWUiLCJwdXNoIiwibGlzdCIsImZvckVhY2giLCJpIiwiYWRkVHJhY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7SUFFcUJBLFE7QUFDbkIsc0JBQXlCO0FBQUEsUUFBYkMsTUFBYSx1RUFBSixFQUFJOztBQUFBOztBQUN2QixTQUFLQyxPQUFMLEdBQWUsRUFBZjtBQUNBLFNBQUtDLFlBQUwsQ0FBa0JGLE1BQWxCO0FBQ0Q7Ozs7NkJBTVFHLEUsRUFBSTtBQUNYLFVBQU1DLFFBQVEsS0FBS0gsT0FBTCxDQUFhRSxFQUFiLENBQWQ7QUFDQSxVQUFJLENBQUNDLEtBQUwsRUFBWTtBQUNWLGNBQU1DLHlCQUF1QkYsRUFBdkIsaUNBQU47QUFDRDtBQUNELGFBQU9DLEtBQVA7QUFDRDs7OzZCQUVRRCxFLEVBQUlHLEcsRUFBZ0I7QUFBQSxVQUFYQyxJQUFXLHVFQUFKLEVBQUk7O0FBQzNCLFVBQU1ILFFBQVEsb0JBQVVELEVBQVYsRUFBY0csR0FBZCxFQUFtQkMsSUFBbkIsQ0FBZDtBQUNBLFdBQUtQLE1BQUwsQ0FBWVEsSUFBWixDQUFpQkosS0FBakI7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7OztpQ0FFWUssSSxFQUFNO0FBQUE7O0FBQ2pCQSxXQUFLQyxPQUFMLENBQWEsVUFBQ04sS0FBRCxFQUFRTyxDQUFSLEVBQWM7QUFDekIsWUFBSSxPQUFPUCxLQUFQLEtBQWlCLFFBQXJCLEVBQStCO0FBQzdCO0FBQ0EsZ0JBQUtRLFFBQUwsQ0FBY0QsQ0FBZCxFQUFpQlAsS0FBakI7QUFDRCxTQUhELE1BR08sSUFBSSxRQUFPQSxLQUFQLHlDQUFPQSxLQUFQLE9BQWlCLFFBQXJCLEVBQStCO0FBQUEsY0FDNUJFLEdBRDRCLEdBQ2RGLEtBRGMsQ0FDNUJFLEdBRDRCO0FBQUEsY0FDdkJDLElBRHVCLEdBQ2RILEtBRGMsQ0FDdkJHLElBRHVCO0FBRXBDOztBQUNBLGdCQUFLSyxRQUFMLENBQWNELENBQWQsRUFBaUJMLEdBQWpCLEVBQXNCQyxJQUF0QjtBQUNEO0FBQ0YsT0FURDtBQVVEOzs7d0JBOUJZO0FBQ1gsYUFBTyxLQUFLTixPQUFaO0FBQ0Q7Ozs7OztrQkFSa0JGLFEiLCJmaWxlIjoiUGxheWxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVHJhY2sgZnJvbSAnLi9UcmFjayc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXlsaXN0IHtcbiAgY29uc3RydWN0b3IodHJhY2tzID0gW10pIHtcbiAgICB0aGlzLl90cmFja3MgPSBbXTtcbiAgICB0aGlzLmFkZFRyYWNrTGlzdCh0cmFja3MpO1xuICB9XG5cbiAgZ2V0IHRyYWNrcygpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhY2tzO1xuICB9XG5cbiAgZ2V0VHJhY2soaWQpIHtcbiAgICBjb25zdCB0cmFjayA9IHRoaXMuX3RyYWNrc1tpZF07XG4gICAgaWYgKCF0cmFjaykge1xuICAgICAgdGhyb3cgRXJyb3IoYFRyYWNrIHdpdGggaWQ9JHtpZH0gZG9zZW4ndCBleGlzdCBpbiBwbGF5bGlzdGApO1xuICAgIH1cbiAgICByZXR1cm4gdHJhY2s7XG4gIH1cblxuICBhZGRUcmFjayhpZCwgc3JjLCBuYW1lID0gJycpIHtcbiAgICBjb25zdCB0cmFjayA9IG5ldyBUcmFjayhpZCwgc3JjLCBuYW1lKTtcbiAgICB0aGlzLnRyYWNrcy5wdXNoKHRyYWNrKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkVHJhY2tMaXN0KGxpc3QpIHtcbiAgICBsaXN0LmZvckVhY2goKHRyYWNrLCBpKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHRyYWNrID09PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnc3RyJywgdHJhY2spO1xuICAgICAgICB0aGlzLmFkZFRyYWNrKGksIHRyYWNrKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRyYWNrID09PSAnb2JqZWN0Jykge1xuICAgICAgICBjb25zdCB7IHNyYywgbmFtZSB9ID0gdHJhY2s7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdvYmonLCBzcmMsIG5hbWUpO1xuICAgICAgICB0aGlzLmFkZFRyYWNrKGksIHNyYywgbmFtZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==
},{"./Track":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventEmmiter2 = require('./utils/EventEmmiter');

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
      this._audio.crossOrigin = 'anonymous';
      this._audio.src = this._src;
      this._audio.load();
      return this;
    }

    // emiting all <audio> tag events

  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this2 = this;

      var _loop = function _loop(key) {
        if (key.search('on') === 0) {
          _this2._audio.addEventListener(key.slice(2), function (event) {
            _this2.emit(key.slice(2), event);
          });
        }
      };

      for (var key in this._audio) {
        _loop(key);
      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRyYWNrLmpzIl0sIm5hbWVzIjpbIlRyYWNrIiwiaWQiLCJzcmMiLCJuYW1lIiwiX3NyYyIsIl9uYW1lIiwiX2F1ZGlvIiwiQXVkaW8iLCJfYmluZEV2ZW50cyIsImJ1ZmZlcmVkIiwibGVuZ3RoIiwiY3Jvc3NPcmlnaW4iLCJsb2FkIiwia2V5Iiwic2VhcmNoIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNsaWNlIiwiZXZlbnQiLCJlbWl0IiwidmFsdWUiLCJtdXRlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBRXFCQSxLOzs7QUFDbkIsaUJBQVlDLEVBQVosRUFBZ0JDLEdBQWhCLEVBQWdDO0FBQUEsUUFBWEMsSUFBVyx1RUFBSixFQUFJOztBQUFBOztBQUFBOztBQUU5QixVQUFLRixFQUFMLEdBQVVBLEVBQVY7QUFDQSxVQUFLRyxJQUFMLEdBQVlGLEdBQVo7QUFDQSxVQUFLRyxLQUFMLEdBQWFGLElBQWI7QUFDQSxVQUFLRyxNQUFMLEdBQWMsSUFBSUMsS0FBSixFQUFkO0FBQ0EsVUFBS0MsV0FBTDtBQU44QjtBQU8vQjs7OztpQ0FrQlk7QUFDWCxhQUFPLEtBQUtGLE1BQUwsQ0FBWUcsUUFBWixDQUFxQkMsTUFBckIsR0FBOEIsQ0FBckM7QUFDRDs7OzJCQUVNO0FBQ0wsV0FBS0osTUFBTCxDQUFZSyxXQUFaLEdBQTBCLFdBQTFCO0FBQ0EsV0FBS0wsTUFBTCxDQUFZSixHQUFaLEdBQWtCLEtBQUtFLElBQXZCO0FBQ0EsV0FBS0UsTUFBTCxDQUFZTSxJQUFaO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2M7QUFBQTs7QUFBQSxpQ0FDREMsR0FEQztBQUVWLFlBQUlBLElBQUlDLE1BQUosQ0FBVyxJQUFYLE1BQXFCLENBQXpCLEVBQTRCO0FBQzFCLGlCQUFLUixNQUFMLENBQVlTLGdCQUFaLENBQTZCRixJQUFJRyxLQUFKLENBQVUsQ0FBVixDQUE3QixFQUEyQyxVQUFDQyxLQUFELEVBQVc7QUFDcEQsbUJBQUtDLElBQUwsQ0FBVUwsSUFBSUcsS0FBSixDQUFVLENBQVYsQ0FBVixFQUF3QkMsS0FBeEI7QUFDRCxXQUZEO0FBR0Q7QUFOUzs7QUFDWixXQUFLLElBQU1KLEdBQVgsSUFBa0IsS0FBS1AsTUFBdkIsRUFBK0I7QUFBQSxjQUFwQk8sR0FBb0I7QUFNOUI7QUFDRjs7O3dCQXBDUztBQUNSLGFBQU8sS0FBS1QsSUFBWjtBQUNEOzs7d0JBRVU7QUFDVCxhQUFPLEtBQUtDLEtBQVo7QUFDRDs7O3dCQUVXO0FBQ1YsYUFBTyxLQUFLQyxNQUFaO0FBQ0Q7OztzQkFFU2EsSyxFQUFPO0FBQ2YsV0FBS2IsTUFBTCxDQUFZYyxLQUFaLEdBQW9CLENBQUMsQ0FBQ0QsS0FBdEI7QUFDRDs7Ozs7O2tCQXhCa0JuQixLIiwiZmlsZSI6IlRyYWNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV2ZW50RW1taXRlciBmcm9tICcuL3V0aWxzL0V2ZW50RW1taXRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNrIGV4dGVuZHMgRXZlbnRFbW1pdGVyIHtcbiAgY29uc3RydWN0b3IoaWQsIHNyYywgbmFtZSA9ICcnKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5fc3JjID0gc3JjO1xuICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICAgIHRoaXMuX2F1ZGlvID0gbmV3IEF1ZGlvKCk7XG4gICAgdGhpcy5fYmluZEV2ZW50cygpO1xuICB9XG5cbiAgZ2V0IHNyYygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3JjO1xuICB9XG5cbiAgZ2V0IG5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gIH1cblxuICBnZXQgYXVkaW8oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F1ZGlvO1xuICB9XG5cbiAgc2V0IG11dGVkKHZhbHVlKSB7XG4gICAgdGhpcy5fYXVkaW8ubXV0ZWQgPSAhIXZhbHVlO1xuICB9XG5cbiAgaXNCdWZmZXJlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXVkaW8uYnVmZmVyZWQubGVuZ3RoID4gMDtcbiAgfVxuXG4gIGxvYWQoKSB7XG4gICAgdGhpcy5fYXVkaW8uY3Jvc3NPcmlnaW4gPSAnYW5vbnltb3VzJztcbiAgICB0aGlzLl9hdWRpby5zcmMgPSB0aGlzLl9zcmM7XG4gICAgdGhpcy5fYXVkaW8ubG9hZCgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdGluZyBhbGwgPGF1ZGlvPiB0YWcgZXZlbnRzXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuX2F1ZGlvKSB7XG4gICAgICBpZiAoa2V5LnNlYXJjaCgnb24nKSA9PT0gMCkge1xuICAgICAgICB0aGlzLl9hdWRpby5hZGRFdmVudExpc3RlbmVyKGtleS5zbGljZSgyKSwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5lbWl0KGtleS5zbGljZSgyKSwgZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==
},{"./utils/EventEmmiter":8}],6:[function(require,module,exports){
'use strict';

var _AudioPlayer = require('./AudioPlayer');

var _AudioPlayer2 = _interopRequireDefault(_AudioPlayer);

var _RangeSlider = require('./utils/RangeSlider');

var _RangeSlider2 = _interopRequireDefault(_RangeSlider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var playBtn = document.querySelector('.player-controls__btn_play');
var playNextBtn = document.querySelector('.player-controls__btn_next');
var playPrevBtn = document.querySelector('.player-controls__btn_prev');

var volumeBtn = document.querySelector('.volume__btn');
var volumeSliderNode = document.querySelector('.volume__slider');

var progressBar = document.querySelector('.progress__bar');

var equalizerBtn = document.querySelector('.player-controls__btn_equalizer');
var equalizerPopup = document.querySelector('.equalizer-popup');
var equalizerBands = document.querySelectorAll('.equalizer-band__slider');

var visualizerCanvas = document.querySelector('#visualizer');

var tracks = ['http://freshly-ground.com/data/audio/mpc/20090207%20-%20Loverman.mp3', './../media/02 - Needles.mp3', './../media/03 - Deer Dance.mp3', './../media/04 - Jet Pilot.mp3', './../media/05 - X.mp3', './../media/06 - Chop Suey!.mp3'];

var player = new _AudioPlayer2.default(tracks, { equalizer: true, analyser: true });
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

volumeBtn.addEventListener('click', function (event) {
  event.preventDefault();
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
var onwheelUpdateVolume = function onwheelUpdateVolume(event) {
  event.preventDefault();
  var newValue = player.volume + Math.sign(event.wheelDeltaY) * 0.05;
  volumeSlider.setValue(newValue);
  setVolume(newValue);
};

volumeBtn.addEventListener('wheel', onwheelUpdateVolume);
volumeSliderNode.addEventListener('wheel', onwheelUpdateVolume);

// Progress settings
var progressSlider = new _RangeSlider2.default(progressBar, {
  handle: false,
  buffer: true,
  onchange: function onchange(value) {
    player.rewind(value);
  }
});

var updateBuffer = function updateBuffer(event) {
  var audio = event.target;
  var buffered = audio.buffered;
  var buffRatio = buffered.length ? buffered.end(buffered.length - 1) / audio.duration : 0;

  progressSlider.setBuffer(buffRatio);
};

player.on('track:progress', updateBuffer);
player.on('track:loadeddata', updateBuffer);
player.on('track:canplaythrough', updateBuffer);
player.on('track:timeupdate', function (event) {
  var audio = event.target;
  var ratio = audio.currentTime / audio.duration;
  progressSlider.setValue(ratio);
});

// Player controls settings
playBtn.addEventListener('click', function () {
  if (!player.isPlaying) {
    playBtn.classList.add('player-controls__btn_pause');
    player.play();
    visualize();
  } else {
    playBtn.classList.remove('player-controls__btn_pause');
    player.pause();
  }
});

playNextBtn.addEventListener('click', function () {
  playBtn.classList.add('player-controls__btn_pause');
  player.playNext();
});

playPrevBtn.addEventListener('click', function () {
  playBtn.classList.add('player-controls__btn_pause');
  player.playPrev();
});

// Equalizer settings
equalizerBtn.addEventListener('click', function (event) {
  event.preventDefault();
  equalizerPopup.classList.toggle('equalizer-popup__open');
});

equalizerBands.forEach(function (band, i) {
  var filterValue = player.equalizer.getFilterGain(i);
  var bandSlider = new _RangeSlider2.default(band, {
    vertical: true,
    min: -12,
    max: 12,
    value: filterValue,
    onchange: function onchange(value) {
      player.equalizer.changeFilterGain(i, value);
    },
    onmove: function onmove(value) {
      player.equalizer.changeFilterGain(i, value);
    }
  });
});

// Visualize
var canvasContext = visualizerCanvas.getContext('2d');
var width = visualizerCanvas.width,
    height = visualizerCanvas.height;

var columnWidth = 15;
var marginWidth = 5;
var sectionWidth = columnWidth + marginWidth;
var columnCount = width / sectionWidth;

// console.log(analyser.bFrequencyData);

var visualize = function visualize() {
  var analyser = player.analyser;
  var animationId = void 0;
  var draw = function draw() {
    canvasContext.clearRect(0, 0, width, height);
    analyser.updateData();
    var frequencyData = analyser.bFrequencyData;
    var step = Math.round(frequencyData.length / columnCount);

    for (var i = 0; i < columnCount; i += 1) {
      var frequencyValue = frequencyData[i * step];
      canvasContext.fillRect(i * sectionWidth, height - frequencyValue, columnWidth, frequencyValue);
    }
    if (!player.isPlaying) {
      cancelAnimationFrame(animationId);
    }
    animationId = requestAnimationFrame(draw);
  };
  if (!animationId) {
    animationId = requestAnimationFrame(draw);
  }
};

console.log(canvasContext);
// canvasContext.clearRect(45, 45, 60, 60);
// canvasContext.strokeRect(50, 50, 50, 50);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfNWU2OTZiMjcuanMiXSwibmFtZXMiOlsicGxheUJ0biIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInBsYXlOZXh0QnRuIiwicGxheVByZXZCdG4iLCJ2b2x1bWVCdG4iLCJ2b2x1bWVTbGlkZXJOb2RlIiwicHJvZ3Jlc3NCYXIiLCJlcXVhbGl6ZXJCdG4iLCJlcXVhbGl6ZXJQb3B1cCIsImVxdWFsaXplckJhbmRzIiwicXVlcnlTZWxlY3RvckFsbCIsInZpc3VhbGl6ZXJDYW52YXMiLCJ0cmFja3MiLCJwbGF5ZXIiLCJlcXVhbGl6ZXIiLCJhbmFseXNlciIsInZvbHVtZSIsInNldFZvbHVtZSIsInZhbHVlIiwiaWNvbiIsImNoaWxkcmVuIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkIiwidm9sdW1lU2xpZGVyIiwib25jaGFuZ2UiLCJvbm1vdmUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIm11dGVkIiwidW5tdXRlIiwibXV0ZSIsIm9ud2hlZWxVcGRhdGVWb2x1bWUiLCJuZXdWYWx1ZSIsIk1hdGgiLCJzaWduIiwid2hlZWxEZWx0YVkiLCJzZXRWYWx1ZSIsInByb2dyZXNzU2xpZGVyIiwiaGFuZGxlIiwiYnVmZmVyIiwicmV3aW5kIiwidXBkYXRlQnVmZmVyIiwiYXVkaW8iLCJ0YXJnZXQiLCJidWZmZXJlZCIsImJ1ZmZSYXRpbyIsImxlbmd0aCIsImVuZCIsImR1cmF0aW9uIiwic2V0QnVmZmVyIiwib24iLCJyYXRpbyIsImN1cnJlbnRUaW1lIiwiaXNQbGF5aW5nIiwicGxheSIsInZpc3VhbGl6ZSIsInBhdXNlIiwicGxheU5leHQiLCJwbGF5UHJldiIsInRvZ2dsZSIsImZvckVhY2giLCJiYW5kIiwiaSIsImZpbHRlclZhbHVlIiwiZ2V0RmlsdGVyR2FpbiIsImJhbmRTbGlkZXIiLCJ2ZXJ0aWNhbCIsIm1pbiIsIm1heCIsImNoYW5nZUZpbHRlckdhaW4iLCJjYW52YXNDb250ZXh0IiwiZ2V0Q29udGV4dCIsIndpZHRoIiwiaGVpZ2h0IiwiY29sdW1uV2lkdGgiLCJtYXJnaW5XaWR0aCIsInNlY3Rpb25XaWR0aCIsImNvbHVtbkNvdW50IiwiYW5pbWF0aW9uSWQiLCJkcmF3IiwiY2xlYXJSZWN0IiwidXBkYXRlRGF0YSIsImZyZXF1ZW5jeURhdGEiLCJiRnJlcXVlbmN5RGF0YSIsInN0ZXAiLCJyb3VuZCIsImZyZXF1ZW5jeVZhbHVlIiwiZmlsbFJlY3QiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsVUFBVUMsU0FBU0MsYUFBVCxDQUF1Qiw0QkFBdkIsQ0FBaEI7QUFDQSxJQUFNQyxjQUFjRixTQUFTQyxhQUFULENBQXVCLDRCQUF2QixDQUFwQjtBQUNBLElBQU1FLGNBQWNILFNBQVNDLGFBQVQsQ0FBdUIsNEJBQXZCLENBQXBCOztBQUVBLElBQU1HLFlBQVlKLFNBQVNDLGFBQVQsQ0FBdUIsY0FBdkIsQ0FBbEI7QUFDQSxJQUFNSSxtQkFBbUJMLFNBQVNDLGFBQVQsQ0FBdUIsaUJBQXZCLENBQXpCOztBQUVBLElBQU1LLGNBQWNOLFNBQVNDLGFBQVQsQ0FBdUIsZ0JBQXZCLENBQXBCOztBQUVBLElBQU1NLGVBQWVQLFNBQVNDLGFBQVQsQ0FBdUIsaUNBQXZCLENBQXJCO0FBQ0EsSUFBTU8saUJBQWlCUixTQUFTQyxhQUFULENBQXVCLGtCQUF2QixDQUF2QjtBQUNBLElBQU1RLGlCQUFpQlQsU0FBU1UsZ0JBQVQsQ0FBMEIseUJBQTFCLENBQXZCOztBQUVBLElBQU1DLG1CQUFtQlgsU0FBU0MsYUFBVCxDQUF1QixhQUF2QixDQUF6Qjs7QUFFQSxJQUFNVyxTQUFTLENBQ2Isc0VBRGEsRUFFYiw2QkFGYSxFQUdiLGdDQUhhLEVBSWIsK0JBSmEsRUFLYix1QkFMYSxFQU1iLGdDQU5hLENBQWY7O0FBU0EsSUFBTUMsU0FBUywwQkFBZ0JELE1BQWhC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LEdBQXVCK0IsV0FBbEMsQ0FBYjs7QUFFQSxTQUFLLElBQUlmLElBQUksQ0FBYixFQUFnQkEsSUFBSWUsV0FBcEIsRUFBaUNmLEtBQUssQ0FBdEMsRUFBeUM7QUFDdkMsVUFBTXdCLGlCQUFpQkosY0FBY3BCLElBQUlzQixJQUFsQixDQUF2QjtBQUNBZCxvQkFBY2lCLFFBQWQsQ0FDR3pCLElBQUljLFlBRFAsRUFFR0gsU0FBU2EsY0FGWixFQUdFWixXQUhGLEVBSUVZLGNBSkY7QUFLRDtBQUNELFFBQUksQ0FBQzNFLE9BQU8wQyxTQUFaLEVBQXVCO0FBQ3JCbUMsMkJBQXFCVixXQUFyQjtBQUNEO0FBQ0RBLGtCQUFjVyxzQkFBc0JWLElBQXRCLENBQWQ7QUFDRCxHQWxCRDtBQW1CQSxNQUFJLENBQUNELFdBQUwsRUFBa0I7QUFDaEJBLGtCQUFjVyxzQkFBc0JWLElBQXRCLENBQWQ7QUFDRDtBQUNGLENBekJEOztBQTJCQVcsUUFBUUMsR0FBUixDQUFZckIsYUFBWjtBQUNBO0FBQ0EiLCJmaWxlIjoiZmFrZV81ZTY5NmIyNy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBdWRpb1BsYXllciBmcm9tICcuL0F1ZGlvUGxheWVyJztcbmltcG9ydCBSYW5nZVNsaWRlciBmcm9tICcuL3V0aWxzL1JhbmdlU2xpZGVyJztcblxuY29uc3QgcGxheUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9wbGF5Jyk7XG5jb25zdCBwbGF5TmV4dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9uZXh0Jyk7XG5jb25zdCBwbGF5UHJldkJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9wcmV2Jyk7XG5cbmNvbnN0IHZvbHVtZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52b2x1bWVfX2J0bicpO1xuY29uc3Qgdm9sdW1lU2xpZGVyTm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52b2x1bWVfX3NsaWRlcicpO1xuXG5jb25zdCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmVzc19fYmFyJyk7XG5cbmNvbnN0IGVxdWFsaXplckJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9lcXVhbGl6ZXInKTtcbmNvbnN0IGVxdWFsaXplclBvcHVwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVxdWFsaXplci1wb3B1cCcpO1xuY29uc3QgZXF1YWxpemVyQmFuZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZXF1YWxpemVyLWJhbmRfX3NsaWRlcicpO1xuXG5jb25zdCB2aXN1YWxpemVyQ2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Zpc3VhbGl6ZXInKTtcblxuY29uc3QgdHJhY2tzID0gW1xuICAnaHR0cDovL2ZyZXNobHktZ3JvdW5kLmNvbS9kYXRhL2F1ZGlvL21wYy8yMDA5MDIwNyUyMC0lMjBMb3Zlcm1hbi5tcDMnLFxuICAnLi8uLi9tZWRpYS8wMiAtIE5lZWRsZXMubXAzJyxcbiAgJy4vLi4vbWVkaWEvMDMgLSBEZWVyIERhbmNlLm1wMycsXG4gICcuLy4uL21lZGlhLzA0IC0gSmV0IFBpbG90Lm1wMycsXG4gICcuLy4uL21lZGlhLzA1IC0gWC5tcDMnLFxuICAnLi8uLi9tZWRpYS8wNiAtIENob3AgU3VleSEubXAzJyxcbl07XG5cbmNvbnN0IHBsYXllciA9IG5ldyBBdWRpb1BsYXllcih0cmFja3MsIHsgZXF1YWxpemVyOiB0cnVlLCBhbmFseXNlcjogdHJ1ZSB9KTtcbnBsYXllci52b2x1bWUgPSAwLjU7XG5cbi8vIFZvbHVtZSBzZXR0aW5nc1xuY29uc3Qgc2V0Vm9sdW1lID0gKHZhbHVlKSA9PiB7XG4gIGNvbnN0IGljb24gPSB2b2x1bWVCdG4uY2hpbGRyZW5bMF07XG4gIGlmICh2YWx1ZSA9PT0gMCkge1xuICAgIGljb24uY2xhc3NMaXN0LnJlbW92ZSgndm9sdW1lX19pY29uX2hhbGYnKTtcbiAgICBpY29uLmNsYXNzTGlzdC5hZGQoJ3ZvbHVtZV9faWNvbl9tdXRlJyk7XG4gIH1cbiAgaWYgKHZhbHVlID4gMCAmJiB2YWx1ZSA8PSAwLjUpIHtcbiAgICBpY29uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZvbHVtZV9faWNvbl9tdXRlJyk7XG4gICAgaWNvbi5jbGFzc0xpc3QuYWRkKCd2b2x1bWVfX2ljb25faGFsZicpO1xuICB9XG4gIGlmICh2YWx1ZSA+IDAuNSkge1xuICAgIGljb24uY2xhc3NMaXN0LnJlbW92ZSgndm9sdW1lX19pY29uX211dGUnKTtcbiAgICBpY29uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZvbHVtZV9faWNvbl9oYWxmJyk7XG4gIH1cbiAgcGxheWVyLnZvbHVtZSA9IHZhbHVlO1xufTtcblxuY29uc3Qgdm9sdW1lU2xpZGVyID0gbmV3IFJhbmdlU2xpZGVyKHZvbHVtZVNsaWRlck5vZGUsIHtcbiAgdmFsdWU6IHBsYXllci52b2x1bWUsXG4gIG9uY2hhbmdlOiBzZXRWb2x1bWUsXG4gIG9ubW92ZTogc2V0Vm9sdW1lLFxufSk7XG5cbnZvbHVtZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zdCBpY29uID0gdm9sdW1lQnRuLmNoaWxkcmVuWzBdO1xuICBpZiAocGxheWVyLm11dGVkKSB7XG4gICAgcGxheWVyLnVubXV0ZSgpO1xuICAgIGljb24uY2xhc3NMaXN0LnJlbW92ZSgndm9sdW1lX19pY29uX211dGUnKTtcbiAgfSBlbHNlIHtcbiAgICBwbGF5ZXIubXV0ZSgpO1xuICAgIGljb24uY2xhc3NMaXN0LmFkZCgndm9sdW1lX19pY29uX211dGUnKTtcbiAgfVxufSk7XG5cbi8vIE1vdXNlU2Nyb2xsIGV2ZW50IGhhbmRsZXIgdG8gY29udHJvbCB0aGUgdm9sdW1lXG5jb25zdCBvbndoZWVsVXBkYXRlVm9sdW1lID0gKGV2ZW50KSA9PiB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIGNvbnN0IG5ld1ZhbHVlID0gcGxheWVyLnZvbHVtZSArIChNYXRoLnNpZ24oZXZlbnQud2hlZWxEZWx0YVkpICogMC4wNSk7XG4gIHZvbHVtZVNsaWRlci5zZXRWYWx1ZShuZXdWYWx1ZSk7XG4gIHNldFZvbHVtZShuZXdWYWx1ZSk7XG59O1xuXG52b2x1bWVCdG4uYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCBvbndoZWVsVXBkYXRlVm9sdW1lKTtcbnZvbHVtZVNsaWRlck5vZGUuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCBvbndoZWVsVXBkYXRlVm9sdW1lKTtcblxuLy8gUHJvZ3Jlc3Mgc2V0dGluZ3NcbmNvbnN0IHByb2dyZXNzU2xpZGVyID0gbmV3IFJhbmdlU2xpZGVyKHByb2dyZXNzQmFyLCB7XG4gIGhhbmRsZTogZmFsc2UsXG4gIGJ1ZmZlcjogdHJ1ZSxcbiAgb25jaGFuZ2U6ICh2YWx1ZSkgPT4ge1xuICAgIHBsYXllci5yZXdpbmQodmFsdWUpO1xuICB9LFxufSk7XG5cbmNvbnN0IHVwZGF0ZUJ1ZmZlciA9IChldmVudCkgPT4ge1xuICBjb25zdCBhdWRpbyA9IGV2ZW50LnRhcmdldDtcbiAgY29uc3QgYnVmZmVyZWQgPSBhdWRpby5idWZmZXJlZDtcbiAgY29uc3QgYnVmZlJhdGlvID0gYnVmZmVyZWQubGVuZ3RoID8gYnVmZmVyZWQuZW5kKGJ1ZmZlcmVkLmxlbmd0aCAtIDEpIC8gYXVkaW8uZHVyYXRpb24gOiAwO1xuXG4gIHByb2dyZXNzU2xpZGVyLnNldEJ1ZmZlcihidWZmUmF0aW8pO1xufTtcblxucGxheWVyLm9uKCd0cmFjazpwcm9ncmVzcycsIHVwZGF0ZUJ1ZmZlcik7XG5wbGF5ZXIub24oJ3RyYWNrOmxvYWRlZGRhdGEnLCB1cGRhdGVCdWZmZXIpO1xucGxheWVyLm9uKCd0cmFjazpjYW5wbGF5dGhyb3VnaCcsIHVwZGF0ZUJ1ZmZlcik7XG5wbGF5ZXIub24oJ3RyYWNrOnRpbWV1cGRhdGUnLCAoZXZlbnQpID0+IHtcbiAgY29uc3QgYXVkaW8gPSBldmVudC50YXJnZXQ7XG4gIGNvbnN0IHJhdGlvID0gYXVkaW8uY3VycmVudFRpbWUgLyBhdWRpby5kdXJhdGlvbjtcbiAgcHJvZ3Jlc3NTbGlkZXIuc2V0VmFsdWUocmF0aW8pO1xufSk7XG5cblxuLy8gUGxheWVyIGNvbnRyb2xzIHNldHRpbmdzXG5wbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBpZiAoIXBsYXllci5pc1BsYXlpbmcpIHtcbiAgICBwbGF5QnRuLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250cm9sc19fYnRuX3BhdXNlJyk7XG4gICAgcGxheWVyLnBsYXkoKTtcbiAgICB2aXN1YWxpemUoKTtcbiAgfSBlbHNlIHtcbiAgICBwbGF5QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3BsYXllci1jb250cm9sc19fYnRuX3BhdXNlJyk7XG4gICAgcGxheWVyLnBhdXNlKCk7XG4gIH1cbn0pO1xuXG5wbGF5TmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgcGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udHJvbHNfX2J0bl9wYXVzZScpO1xuICBwbGF5ZXIucGxheU5leHQoKTtcbn0pO1xuXG5wbGF5UHJldkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgcGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udHJvbHNfX2J0bl9wYXVzZScpO1xuICBwbGF5ZXIucGxheVByZXYoKTtcbn0pO1xuXG4vLyBFcXVhbGl6ZXIgc2V0dGluZ3NcbmVxdWFsaXplckJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBlcXVhbGl6ZXJQb3B1cC5jbGFzc0xpc3QudG9nZ2xlKCdlcXVhbGl6ZXItcG9wdXBfX29wZW4nKTtcbn0pO1xuXG5lcXVhbGl6ZXJCYW5kcy5mb3JFYWNoKChiYW5kLCBpKSA9PiB7XG4gIGNvbnN0IGZpbHRlclZhbHVlID0gcGxheWVyLmVxdWFsaXplci5nZXRGaWx0ZXJHYWluKGkpO1xuICBjb25zdCBiYW5kU2xpZGVyID0gbmV3IFJhbmdlU2xpZGVyKGJhbmQsIHtcbiAgICB2ZXJ0aWNhbDogdHJ1ZSxcbiAgICBtaW46IC0xMixcbiAgICBtYXg6IDEyLFxuICAgIHZhbHVlOiBmaWx0ZXJWYWx1ZSxcbiAgICBvbmNoYW5nZTogKHZhbHVlKSA9PiB7XG4gICAgICBwbGF5ZXIuZXF1YWxpemVyLmNoYW5nZUZpbHRlckdhaW4oaSwgdmFsdWUpO1xuICAgIH0sXG4gICAgb25tb3ZlOiAodmFsdWUpID0+IHtcbiAgICAgIHBsYXllci5lcXVhbGl6ZXIuY2hhbmdlRmlsdGVyR2FpbihpLCB2YWx1ZSk7XG4gICAgfSxcbiAgfSk7XG59KTtcblxuLy8gVmlzdWFsaXplXG5jb25zdCBjYW52YXNDb250ZXh0ID0gdmlzdWFsaXplckNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSB2aXN1YWxpemVyQ2FudmFzO1xuY29uc3QgY29sdW1uV2lkdGggPSAxNTtcbmNvbnN0IG1hcmdpbldpZHRoID0gNTtcbmNvbnN0IHNlY3Rpb25XaWR0aCA9IGNvbHVtbldpZHRoICsgbWFyZ2luV2lkdGg7XG5jb25zdCBjb2x1bW5Db3VudCA9IHdpZHRoIC8gc2VjdGlvbldpZHRoO1xuXG4vLyBjb25zb2xlLmxvZyhhbmFseXNlci5iRnJlcXVlbmN5RGF0YSk7XG5cbmNvbnN0IHZpc3VhbGl6ZSA9ICgpID0+IHtcbiAgY29uc3QgYW5hbHlzZXIgPSBwbGF5ZXIuYW5hbHlzZXI7XG4gIGxldCBhbmltYXRpb25JZDtcbiAgY29uc3QgZHJhdyA9ICgpID0+IHtcbiAgICBjYW52YXNDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBhbmFseXNlci51cGRhdGVEYXRhKCk7XG4gICAgY29uc3QgZnJlcXVlbmN5RGF0YSA9IGFuYWx5c2VyLmJGcmVxdWVuY3lEYXRhO1xuICAgIGNvbnN0IHN0ZXAgPSBNYXRoLnJvdW5kKGZyZXF1ZW5jeURhdGEubGVuZ3RoIC8gY29sdW1uQ291bnQpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2x1bW5Db3VudDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBmcmVxdWVuY3lWYWx1ZSA9IGZyZXF1ZW5jeURhdGFbaSAqIHN0ZXBdO1xuICAgICAgY2FudmFzQ29udGV4dC5maWxsUmVjdChcbiAgICAgICAgKGkgKiBzZWN0aW9uV2lkdGgpLFxuICAgICAgICAoaGVpZ2h0IC0gZnJlcXVlbmN5VmFsdWUpLFxuICAgICAgICBjb2x1bW5XaWR0aCxcbiAgICAgICAgZnJlcXVlbmN5VmFsdWUpO1xuICAgIH1cbiAgICBpZiAoIXBsYXllci5pc1BsYXlpbmcpIHtcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbklkKTtcbiAgICB9XG4gICAgYW5pbWF0aW9uSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG4gIH07XG4gIGlmICghYW5pbWF0aW9uSWQpIHtcbiAgICBhbmltYXRpb25JZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbiAgfVxufTtcblxuY29uc29sZS5sb2coY2FudmFzQ29udGV4dCk7XG4vLyBjYW52YXNDb250ZXh0LmNsZWFyUmVjdCg0NSwgNDUsIDYwLCA2MCk7XG4vLyBjYW52YXNDb250ZXh0LnN0cm9rZVJlY3QoNTAsIDUwLCA1MCwgNTApO1xuXG4iXX0=
},{"./AudioPlayer":2,"./utils/RangeSlider":10}],7:[function(require,module,exports){
'use strict';

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
    key: 'createElement',
    value: function createElement(tagName, _ref) {
      var attrs = _ref.attrs,
          callback = _ref.callback,
          parent = _ref.parent;

      var element = document.createElement('' + tagName);

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
    key: 'insertAttributes',
    value: function insertAttributes(element, attrs) {
      if (element instanceof HTMLElement) {
        Object.keys(attrs).forEach(function (prop) {
          element.setAttribute(prop, attrs[prop]);
        });
      }
    }
  }]);

  return DOMBuilder;
}();

exports.default = DOMBuilder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRPTUJ1aWxkZXIuanMiXSwibmFtZXMiOlsiRE9NQnVpbGRlciIsIkVycm9yIiwidGFnTmFtZSIsImF0dHJzIiwiY2FsbGJhY2siLCJwYXJlbnQiLCJlbGVtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaW5zZXJ0QXR0cmlidXRlcyIsIkhUTUxFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsInByb3AiLCJzZXRBdHRyaWJ1dGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBcUJBLFU7QUFDbkIsd0JBQWM7QUFBQTs7QUFDWixVQUFNLElBQUlDLEtBQUosQ0FBVSx3REFBVixDQUFOO0FBQ0Q7Ozs7a0NBRW9CQyxPLFFBQXNDO0FBQUEsVUFBM0JDLEtBQTJCLFFBQTNCQSxLQUEyQjtBQUFBLFVBQXBCQyxRQUFvQixRQUFwQkEsUUFBb0I7QUFBQSxVQUFWQyxNQUFVLFFBQVZBLE1BQVU7O0FBQ3pELFVBQU1DLFVBQVVDLFNBQVNDLGFBQVQsTUFBMEJOLE9BQTFCLENBQWhCOztBQUVBLFVBQUlDLEtBQUosRUFBVztBQUNUSCxtQkFBV1MsZ0JBQVgsQ0FBNEJILE9BQTVCLEVBQXFDSCxLQUFyQztBQUNEOztBQUVELFVBQUlDLFFBQUosRUFBYztBQUNaQSxpQkFBU0UsT0FBVDtBQUNEOztBQUVELFVBQUlELGtCQUFrQkssV0FBdEIsRUFBbUM7QUFDakNMLGVBQU9NLFdBQVAsQ0FBbUJMLE9BQW5CO0FBQ0Q7O0FBRUQsYUFBT0EsT0FBUDtBQUNEOzs7cUNBRXVCQSxPLEVBQVNILEssRUFBTztBQUN0QyxVQUFJRyxtQkFBbUJJLFdBQXZCLEVBQW9DO0FBQ2xDRSxlQUFPQyxJQUFQLENBQVlWLEtBQVosRUFBbUJXLE9BQW5CLENBQTJCLFVBQUNDLElBQUQsRUFBVTtBQUNuQ1Qsa0JBQVFVLFlBQVIsQ0FBcUJELElBQXJCLEVBQTJCWixNQUFNWSxJQUFOLENBQTNCO0FBQ0QsU0FGRDtBQUdEO0FBQ0Y7Ozs7OztrQkE3QmtCZixVIiwiZmlsZSI6IkRPTUJ1aWxkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBET01CdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIGlzIHN0YXRpYyBjbGFzcy4gQ3JlYXRpbmcgaW5zdGFuY2VzIGlzIGZvcmJpZGRlbi4nKTtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGVFbGVtZW50KHRhZ05hbWUsIHsgYXR0cnMsIGNhbGxiYWNrLCBwYXJlbnQgfSkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGAke3RhZ05hbWV9YCk7XG5cbiAgICBpZiAoYXR0cnMpIHtcbiAgICAgIERPTUJ1aWxkZXIuaW5zZXJ0QXR0cmlidXRlcyhlbGVtZW50LCBhdHRycyk7XG4gICAgfVxuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayhlbGVtZW50KTtcbiAgICB9XG5cbiAgICBpZiAocGFyZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIHN0YXRpYyBpbnNlcnRBdHRyaWJ1dGVzKGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgT2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goKHByb3ApID0+IHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUocHJvcCwgYXR0cnNbcHJvcF0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iXX0=
},{}],8:[function(require,module,exports){
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
    value: function on(event, callback) {
      if (typeof callback === 'undefined') {
        throw Error('You must provide a callback function');
      }

      if (typeof callback !== 'function') {
        throw Error('Callback must be a function');
      }

      this._events[event] = this._events[event] || [];
      this._events[event].push(callback);

      return this;
    }
  }, {
    key: 'off',
    value: function off(event, callback) {
      if (typeof callback === 'undefined') {
        throw Error('You must provide a callback function');
      }

      if (typeof callback !== 'function') {
        throw Error('Callback must be a function');
      }

      if (typeof this._events[event] === 'undefined') {
        throw Error('Event not found');
      }

      var listeners = this._events[event];
      listeners.forEach(function (listener, i) {
        if (listener.toString() === callback.toString()) {
          listeners.splice(i, 1);
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

        callbacks.forEach(function (callback, i) {
          callback.apply(_this, args);
        });
      }

      return this;
    }
  }]);

  return EventEmmiter;
}();

exports.default = EventEmmiter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50RW1taXRlci5qcyJdLCJuYW1lcyI6WyJFdmVudEVtbWl0ZXIiLCJfZXZlbnRzIiwiZXZlbnQiLCJjYWxsYmFjayIsIkVycm9yIiwicHVzaCIsImxpc3RlbmVycyIsImZvckVhY2giLCJsaXN0ZW5lciIsImkiLCJ0b1N0cmluZyIsInNwbGljZSIsImFyZ3MiLCJjYWxsYmFja3MiLCJzbGljZSIsImFwcGx5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQXFCQSxZO0FBQ25CLDBCQUFjO0FBQUE7O0FBQ1osU0FBS0MsT0FBTCxHQUFlLEVBQWY7QUFDRDs7Ozt1QkFFRUMsSyxFQUFPQyxRLEVBQVU7QUFDbEIsVUFBSSxPQUFPQSxRQUFQLEtBQW9CLFdBQXhCLEVBQXFDO0FBQ25DLGNBQU1DLE1BQU0sc0NBQU4sQ0FBTjtBQUNEOztBQUVELFVBQUksT0FBT0QsUUFBUCxLQUFvQixVQUF4QixFQUFvQztBQUNsQyxjQUFNQyxNQUFNLDZCQUFOLENBQU47QUFDRDs7QUFFRCxXQUFLSCxPQUFMLENBQWFDLEtBQWIsSUFBc0IsS0FBS0QsT0FBTCxDQUFhQyxLQUFiLEtBQXVCLEVBQTdDO0FBQ0EsV0FBS0QsT0FBTCxDQUFhQyxLQUFiLEVBQW9CRyxJQUFwQixDQUF5QkYsUUFBekI7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7Ozt3QkFFR0QsSyxFQUFPQyxRLEVBQVU7QUFDbkIsVUFBSSxPQUFPQSxRQUFQLEtBQW9CLFdBQXhCLEVBQXFDO0FBQ25DLGNBQU1DLE1BQU0sc0NBQU4sQ0FBTjtBQUNEOztBQUVELFVBQUksT0FBT0QsUUFBUCxLQUFvQixVQUF4QixFQUFvQztBQUNsQyxjQUFNQyxNQUFNLDZCQUFOLENBQU47QUFDRDs7QUFFRCxVQUFJLE9BQU8sS0FBS0gsT0FBTCxDQUFhQyxLQUFiLENBQVAsS0FBK0IsV0FBbkMsRUFBZ0Q7QUFDOUMsY0FBTUUsTUFBTSxpQkFBTixDQUFOO0FBQ0Q7O0FBRUQsVUFBTUUsWUFBWSxLQUFLTCxPQUFMLENBQWFDLEtBQWIsQ0FBbEI7QUFDQUksZ0JBQVVDLE9BQVYsQ0FBa0IsVUFBQ0MsUUFBRCxFQUFXQyxDQUFYLEVBQWlCO0FBQ2pDLFlBQUlELFNBQVNFLFFBQVQsT0FBd0JQLFNBQVNPLFFBQVQsRUFBNUIsRUFBaUQ7QUFDL0NKLG9CQUFVSyxNQUFWLENBQWlCRixDQUFqQixFQUFvQixDQUFwQjtBQUNEO0FBQ0YsT0FKRDs7QUFNQSxhQUFPLElBQVA7QUFDRDs7O3lCQUVJUCxLLEVBQWdCO0FBQUE7O0FBQUEsd0NBQU5VLElBQU07QUFBTkEsWUFBTTtBQUFBOztBQUNuQixVQUFJLE9BQU9WLEtBQVAsS0FBaUIsV0FBckIsRUFBa0M7QUFDaEMsY0FBTUUsTUFBTSxtQ0FBTixDQUFOO0FBQ0Q7O0FBRUQsVUFBSVMsWUFBWSxLQUFLWixPQUFMLENBQWFDLEtBQWIsQ0FBaEI7QUFDQSxVQUFJLE9BQU9XLFNBQVAsS0FBcUIsV0FBekIsRUFBc0M7QUFDcENBLG9CQUFZQSxVQUFVQyxLQUFWLEVBQVo7O0FBRUFELGtCQUFVTixPQUFWLENBQWtCLFVBQUNKLFFBQUQsRUFBV00sQ0FBWCxFQUFpQjtBQUNqQ04sbUJBQVNZLEtBQVQsUUFBcUJILElBQXJCO0FBQ0QsU0FGRDtBQUdEOztBQUVELGFBQU8sSUFBUDtBQUNEOzs7Ozs7a0JBMURrQlosWSIsImZpbGUiOiJFdmVudEVtbWl0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudEVtbWl0ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9ldmVudHMgPSBbXTtcbiAgfVxuXG4gIG9uKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBFcnJvcignWW91IG11c3QgcHJvdmlkZSBhIGNhbGxiYWNrIGZ1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgRXJyb3IoJ0NhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgIH1cblxuICAgIHRoaXMuX2V2ZW50c1tldmVudF0gPSB0aGlzLl9ldmVudHNbZXZlbnRdIHx8IFtdO1xuICAgIHRoaXMuX2V2ZW50c1tldmVudF0ucHVzaChjYWxsYmFjayk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG9mZihldmVudCwgY2FsbGJhY2spIHtcbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgRXJyb3IoJ1lvdSBtdXN0IHByb3ZpZGUgYSBjYWxsYmFjayBmdW5jdGlvbicpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IEVycm9yKCdDYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRoaXMuX2V2ZW50c1tldmVudF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBFcnJvcignRXZlbnQgbm90IGZvdW5kJyk7XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW2V2ZW50XTtcbiAgICBsaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIsIGkpID0+IHtcbiAgICAgIGlmIChsaXN0ZW5lci50b1N0cmluZygpID09PSBjYWxsYmFjay50b1N0cmluZygpKSB7XG4gICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGVtaXQoZXZlbnQsIC4uLmFyZ3MpIHtcbiAgICBpZiAodHlwZW9mIGV2ZW50ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgRXJyb3IoJ1lvdSBtdXN0IHByb3ZpZGUgYW4gZXZlbnQgdG8gZW1pdCcpO1xuICAgIH1cblxuICAgIGxldCBjYWxsYmFja3MgPSB0aGlzLl9ldmVudHNbZXZlbnRdO1xuICAgIGlmICh0eXBlb2YgY2FsbGJhY2tzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKCk7XG5cbiAgICAgIGNhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaywgaSkgPT4ge1xuICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG4iXX0=
},{}],9:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk9iamVjdEFzc2lnbi5qcyJdLCJuYW1lcyI6WyJPYmplY3QiLCJhc3NpZ24iLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsInZhbHVlIiwidGFyZ2V0IiwiZmlyc3RTb3VyY2UiLCJ1bmRlZmluZWQiLCJUeXBlRXJyb3IiLCJ0byIsImkiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJuZXh0U291cmNlIiwia2V5c0FycmF5Iiwia2V5cyIsIm5leHRJbmRleCIsImxlbiIsIm5leHRLZXkiLCJkZXNjIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksQ0FBQ0EsT0FBT0MsTUFBWixFQUFvQjtBQUNsQkQsU0FBT0UsY0FBUCxDQUFzQkYsTUFBdEIsRUFBOEIsUUFBOUIsRUFBd0M7QUFDdENHLGdCQUFZLEtBRDBCO0FBRXRDQyxrQkFBYyxJQUZ3QjtBQUd0Q0MsY0FBVSxJQUg0QjtBQUl0Q0MsV0FBTyxlQUFVQyxNQUFWLEVBQWtCQyxXQUFsQixFQUErQjtBQUNwQzs7QUFDQSxVQUFJRCxXQUFXRSxTQUFYLElBQXdCRixXQUFXLElBQXZDLEVBQTZDO0FBQzNDLGNBQU0sSUFBSUcsU0FBSixDQUFjLHlDQUFkLENBQU47QUFDRDs7QUFFRCxVQUFJQyxLQUFLWCxPQUFPTyxNQUFQLENBQVQ7QUFDQSxXQUFLLElBQUlLLElBQUksQ0FBYixFQUFnQkEsSUFBSUMsVUFBVUMsTUFBOUIsRUFBc0NGLEdBQXRDLEVBQTJDO0FBQ3pDLFlBQUlHLGFBQWFGLFVBQVVELENBQVYsQ0FBakI7QUFDQSxZQUFJRyxlQUFlTixTQUFmLElBQTRCTSxlQUFlLElBQS9DLEVBQXFEO0FBQ25EO0FBQ0Q7O0FBRUQsWUFBSUMsWUFBWWhCLE9BQU9pQixJQUFQLENBQVlqQixPQUFPZSxVQUFQLENBQVosQ0FBaEI7QUFDQSxhQUFLLElBQUlHLFlBQVksQ0FBaEIsRUFBbUJDLE1BQU1ILFVBQVVGLE1BQXhDLEVBQWdESSxZQUFZQyxHQUE1RCxFQUFpRUQsV0FBakUsRUFBOEU7QUFDNUUsY0FBSUUsVUFBVUosVUFBVUUsU0FBVixDQUFkO0FBQ0EsY0FBSUcsT0FBT3JCLE9BQU9zQix3QkFBUCxDQUFnQ1AsVUFBaEMsRUFBNENLLE9BQTVDLENBQVg7QUFDQSxjQUFJQyxTQUFTWixTQUFULElBQXNCWSxLQUFLbEIsVUFBL0IsRUFBMkM7QUFDekNRLGVBQUdTLE9BQUgsSUFBY0wsV0FBV0ssT0FBWCxDQUFkO0FBQ0Q7QUFDRjtBQUNGO0FBQ0QsYUFBT1QsRUFBUDtBQUNEO0FBM0JxQyxHQUF4QztBQTZCRCIsImZpbGUiOiJPYmplY3RBc3NpZ24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpZiAoIU9iamVjdC5hc3NpZ24pIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2Fzc2lnbicsIHtcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgdmFsdWU6IGZ1bmN0aW9uICh0YXJnZXQsIGZpcnN0U291cmNlKSB7XG4gICAgICAndXNlIHN0cmljdCc7XG4gICAgICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQgfHwgdGFyZ2V0ID09PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IGZpcnN0IGFyZ3VtZW50IHRvIG9iamVjdCcpO1xuICAgICAgfVxuXG4gICAgICB2YXIgdG8gPSBPYmplY3QodGFyZ2V0KTtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBuZXh0U291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBpZiAobmV4dFNvdXJjZSA9PT0gdW5kZWZpbmVkIHx8IG5leHRTb3VyY2UgPT09IG51bGwpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBrZXlzQXJyYXkgPSBPYmplY3Qua2V5cyhPYmplY3QobmV4dFNvdXJjZSkpO1xuICAgICAgICBmb3IgKHZhciBuZXh0SW5kZXggPSAwLCBsZW4gPSBrZXlzQXJyYXkubGVuZ3RoOyBuZXh0SW5kZXggPCBsZW47IG5leHRJbmRleCsrKSB7XG4gICAgICAgICAgdmFyIG5leHRLZXkgPSBrZXlzQXJyYXlbbmV4dEluZGV4XTtcbiAgICAgICAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobmV4dFNvdXJjZSwgbmV4dEtleSk7XG4gICAgICAgICAgaWYgKGRlc2MgIT09IHVuZGVmaW5lZCAmJiBkZXNjLmVudW1lcmFibGUpIHtcbiAgICAgICAgICAgIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0bztcbiAgICB9LFxuICB9KTtcbn1cbiJdfQ==
},{}],10:[function(require,module,exports){
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
    // chrome bug with mousemove
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
      var validValue = (0, _.validateInRange)(value, this.min, this.max);
      this.value = validValue;
      this.ratio = (this.value - this.min) / this.length;

      this._updateFill();

      return this;
    }
  }, {
    key: 'setValueByRatio',
    value: function setValueByRatio(ratio) {
      var validRatio = (0, _.validateInRange)(ratio, 0, 1);
      this.ratio = validRatio;
      this.value = this.min + this.ratio * this.length;

      this._updateFill();

      return this;
    }
  }, {
    key: 'setBuffer',
    value: function setBuffer(ratio) {
      if (this.options.buffer) {
        var validRatio = (0, _.validateInRange)(ratio, 0, 1);

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
    value: function _updateValue(event) {
      var pos = this.node.getBoundingClientRect();

      var ratio = null;
      if (this.vertical) {
        ratio = 1 - (event.clientY - pos.top) / this.node.offsetHeight;
      } else {
        ratio = (event.clientX - pos.left) / this.node.offsetWidth;
      }

      this.setValueByRatio(ratio);

      return this;
    }
  }, {
    key: '_bindEvents',
    value: function _bindEvents() {
      var _this = this;

      this.node.addEventListener('mousedown', function (event) {
        if (event.which === 1) {
          // left mouse button
          _this.draggable = true;
          _this._updateValue(event);
        }
      });

      document.addEventListener('mousemove', function (event) {
        if (_this.draggable) {
          _this._updateValue(event);

          if ((0, _.isFunction)(_this.onmove)) {
            _this.onmove(_this.value);
          }
        }
      });

      document.addEventListener('mouseup', function (event) {
        if (_this.draggable) {
          _this.draggable = false;
          _this._updateValue(event);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJhbmdlU2xpZGVyLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRzIiwibWluIiwibWF4IiwidmFsdWUiLCJ2ZXJ0aWNhbCIsImhhbmRsZSIsImJ1ZmZlciIsIlJhbmdlU2xpZGVyIiwibm9kZSIsIm9wdGlvbnMiLCJPYmplY3QiLCJhc3NpZ24iLCJ0cmFjayIsImZpbGwiLCJsZW5ndGgiLCJNYXRoIiwiYWJzIiwicmF0aW8iLCJkcmFnZ2FibGUiLCJvbm1vdmUiLCJvbmNoYW5nZSIsIm9uZHJhZ3N0YXJ0IiwiX2NyZWF0ZURPTSIsIl9iaW5kRXZlbnRzIiwic2V0VmFsdWUiLCJ2YWxpZFZhbHVlIiwiX3VwZGF0ZUZpbGwiLCJ2YWxpZFJhdGlvIiwic3R5bGUiLCJoZWlnaHQiLCJ3aWR0aCIsImV2ZW50IiwicG9zIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xpZW50WSIsInRvcCIsIm9mZnNldEhlaWdodCIsImNsaWVudFgiLCJsZWZ0Iiwib2Zmc2V0V2lkdGgiLCJzZXRWYWx1ZUJ5UmF0aW8iLCJhZGRFdmVudExpc3RlbmVyIiwid2hpY2giLCJfdXBkYXRlVmFsdWUiLCJkb2N1bWVudCIsIm1haW5DbGFzc05hbWUiLCJjbGFzc0xpc3QiLCJhZGQiLCJjcmVhdGVFbGVtZW50IiwiYXR0cnMiLCJjbGFzcyIsInBhcmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxXQUFXO0FBQ2ZDLE9BQUssQ0FEVTtBQUVmQyxPQUFLLENBRlU7QUFHZkMsU0FBTyxDQUhRO0FBSWZDLFlBQVUsS0FKSztBQUtmQyxVQUFRLElBTE87QUFNZkMsVUFBUTtBQU5PLENBQWpCOztJQVNxQkMsVztBQUNuQix1QkFBWUMsSUFBWixFQUFnQztBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTs7QUFBQTs7QUFDOUIsU0FBS0QsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS0MsT0FBTCxHQUFlQyxPQUFPQyxNQUFQLENBQWNELE9B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LEtBQUt6QyxRQUFMLEdBQWdCLGFBQWhCLEdBQWdDLGNBQXREO0FBQ0EsV0FBS0ksSUFBTCxDQUFVc0MsU0FBVixDQUFvQkMsR0FBcEIsQ0FBd0JGLGFBQXhCO0FBQ0EsV0FBS2pDLEtBQUwsR0FBYSxxQkFBV29DLGFBQVgsQ0FBeUIsS0FBekIsRUFBZ0M7QUFDM0NDLGVBQU87QUFDTEMsaUJBQVVMLGFBQVY7QUFESyxTQURvQztBQUkzQ00sZ0JBQVEsS0FBSzNDO0FBSjhCLE9BQWhDLENBQWI7QUFNQSxXQUFLSyxJQUFMLEdBQVkscUJBQVdtQyxhQUFYLENBQXlCLEtBQXpCLEVBQWdDO0FBQzFDQyxlQUFPO0FBQ0xDLGlCQUFVTCxhQUFWO0FBREssU0FEbUM7QUFJMUNNLGdCQUFRLEtBQUt2QztBQUo2QixPQUFoQyxDQUFaO0FBTUEsVUFBSSxLQUFLSCxPQUFMLENBQWFKLE1BQWpCLEVBQXlCO0FBQ3ZCLGFBQUtBLE1BQUwsR0FBYyxxQkFBVzJDLGFBQVgsQ0FBeUIsS0FBekIsRUFBZ0M7QUFDNUNDLGlCQUFPO0FBQ0xDLG1CQUFVTCxhQUFWO0FBREssV0FEcUM7QUFJNUNNLGtCQUFRLEtBQUt0QztBQUorQixTQUFoQyxDQUFkO0FBTUQ7QUFDRCxVQUFJLEtBQUtKLE9BQUwsQ0FBYUgsTUFBakIsRUFBeUI7QUFDdkIsYUFBS0EsTUFBTCxHQUFjLHFCQUFXMEMsYUFBWCxDQUF5QixLQUF6QixFQUFnQztBQUM1Q0MsaUJBQU87QUFDTEMsbUJBQVVMLGFBQVY7QUFESyxXQURxQztBQUk1Q00sa0JBQVEsS0FBS3ZDO0FBSitCLFNBQWhDLENBQWQ7QUFNRDtBQUNGOzs7Ozs7a0JBckprQkwsVyIsImZpbGUiOiJSYW5nZVNsaWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBET01CdWlsZGVyIGZyb20gJy4vRE9NQnVpbGRlcic7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uLCB2YWxpZGF0ZUluUmFuZ2UgfSBmcm9tICcuLyc7XG5pbXBvcnQgJy4vT2JqZWN0QXNzaWduJztcblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIG1pbjogMCxcbiAgbWF4OiAxLFxuICB2YWx1ZTogMCxcbiAgdmVydGljYWw6IGZhbHNlLFxuICBoYW5kbGU6IHRydWUsXG4gIGJ1ZmZlcjogZmFsc2UsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSYW5nZVNsaWRlciB7XG4gIGNvbnN0cnVjdG9yKG5vZGUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMubm9kZSA9IG5vZGU7XG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cyksIG9wdGlvbnMpO1xuXG4gICAgdGhpcy50cmFjayA9IG51bGw7XG4gICAgdGhpcy5maWxsID0gbnVsbDtcbiAgICB0aGlzLmhhbmRsZSA9IG51bGw7XG4gICAgdGhpcy5idWZmZXIgPSBudWxsO1xuXG4gICAgdGhpcy52ZXJ0aWNhbCA9IHRoaXMub3B0aW9ucy52ZXJ0aWNhbDtcblxuICAgIHRoaXMubWluID0gdGhpcy5vcHRpb25zLm1pbjtcbiAgICB0aGlzLm1heCA9IHRoaXMub3B0aW9ucy5tYXg7XG4gICAgdGhpcy5sZW5ndGggPSBNYXRoLmFicyh0aGlzLm1pbikgKyBNYXRoLmFicyh0aGlzLm1heCk7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMub3B0aW9ucy52YWx1ZTtcbiAgICB0aGlzLnJhdGlvID0gbnVsbDtcblxuICAgIHRoaXMuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgdGhpcy5vbm1vdmUgPSB0aGlzLm9wdGlvbnMub25tb3ZlO1xuICAgIHRoaXMub25jaGFuZ2UgPSB0aGlzLm9wdGlvbnMub25jaGFuZ2U7XG4gICAgLy8gY2hyb21lIGJ1ZyB3aXRoIG1vdXNlbW92ZVxuICAgIHRoaXMubm9kZS5vbmRyYWdzdGFydCA9ICgpID0+IGZhbHNlO1xuXG4gICAgdGhpcy5fY3JlYXRlRE9NKCk7XG4gICAgdGhpcy5fYmluZEV2ZW50cygpO1xuICAgIHRoaXMuc2V0VmFsdWUodGhpcy52YWx1ZSk7XG4gIH1cblxuICBzZXRWYWx1ZSh2YWx1ZSkge1xuICAgIGNvbnN0IHZhbGlkVmFsdWUgPSB2YWxpZGF0ZUluUmFuZ2UodmFsdWUsIHRoaXMubWluLCB0aGlzLm1heCk7XG4gICAgdGhpcy52YWx1ZSA9IHZhbGlkVmFsdWU7XG4gICAgdGhpcy5yYXRpbyA9ICh0aGlzLnZhbHVlIC0gdGhpcy5taW4pIC8gdGhpcy5sZW5ndGg7XG5cbiAgICB0aGlzLl91cGRhdGVGaWxsKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldFZhbHVlQnlSYXRpbyhyYXRpbykge1xuICAgIGNvbnN0IHZhbGlkUmF0aW8gPSB2YWxpZGF0ZUluUmFuZ2UocmF0aW8sIDAsIDEpO1xuICAgIHRoaXMucmF0aW8gPSB2YWxpZFJhdGlvO1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLm1pbiArICh0aGlzLnJhdGlvICogdGhpcy5sZW5ndGgpO1xuXG4gICAgdGhpcy5fdXBkYXRlRmlsbCgpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRCdWZmZXIocmF0aW8pIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmJ1ZmZlcikge1xuICAgICAgY29uc3QgdmFsaWRSYXRpbyA9IHZhbGlkYXRlSW5SYW5nZShyYXRpbywgMCwgMSk7XG5cbiAgICAgIGlmICh0aGlzLnZlcnRpY2FsKSB7XG4gICAgICAgIHRoaXMuYnVmZmVyLnN0eWxlLmhlaWdodCA9IGAke3ZhbGlkUmF0aW8gKiAxMDB9JWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmJ1ZmZlci5zdHlsZS53aWR0aCA9IGAke3ZhbGlkUmF0aW8gKiAxMDB9JWA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfdXBkYXRlRmlsbCgpIHtcbiAgICBpZiAodGhpcy52ZXJ0aWNhbCkge1xuICAgICAgdGhpcy5maWxsLnN0eWxlLmhlaWdodCA9IGAke3RoaXMucmF0aW8gKiAxMDB9JWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmlsbC5zdHlsZS53aWR0aCA9IGAke3RoaXMucmF0aW8gKiAxMDB9JWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfdXBkYXRlVmFsdWUoZXZlbnQpIHtcbiAgICBjb25zdCBwb3MgPSB0aGlzLm5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICBsZXQgcmF0aW8gPSBudWxsO1xuICAgIGlmICh0aGlzLnZlcnRpY2FsKSB7XG4gICAgICByYXRpbyA9IDEgLSAoKGV2ZW50LmNsaWVudFkgLSBwb3MudG9wKSAvIHRoaXMubm9kZS5vZmZzZXRIZWlnaHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByYXRpbyA9IChldmVudC5jbGllbnRYIC0gcG9zLmxlZnQpIC8gdGhpcy5ub2RlLm9mZnNldFdpZHRoO1xuICAgIH1cblxuICAgIHRoaXMuc2V0VmFsdWVCeVJhdGlvKHJhdGlvKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX2JpbmRFdmVudHMoKSB7XG4gICAgdGhpcy5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LndoaWNoID09PSAxKSB7IC8vIGxlZnQgbW91c2UgYnV0dG9uXG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fdXBkYXRlVmFsdWUoZXZlbnQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAodGhpcy5kcmFnZ2FibGUpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlVmFsdWUoZXZlbnQpO1xuXG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKHRoaXMub25tb3ZlKSkge1xuICAgICAgICAgIHRoaXMub25tb3ZlKHRoaXMudmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAodGhpcy5kcmFnZ2FibGUpIHtcbiAgICAgICAgdGhpcy5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fdXBkYXRlVmFsdWUoZXZlbnQpO1xuXG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKHRoaXMub25jaGFuZ2UpKSB7XG4gICAgICAgICAgdGhpcy5vbmNoYW5nZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX2NyZWF0ZURPTSgpIHtcbiAgICBjb25zdCBtYWluQ2xhc3NOYW1lID0gdGhpcy52ZXJ0aWNhbCA/ICdzbGlkZXItdmVydCcgOiAnc2xpZGVyLWhvcml6JztcbiAgICB0aGlzLm5vZGUuY2xhc3NMaXN0LmFkZChtYWluQ2xhc3NOYW1lKTtcbiAgICB0aGlzLnRyYWNrID0gRE9NQnVpbGRlci5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICBhdHRyczoge1xuICAgICAgICBjbGFzczogYCR7bWFpbkNsYXNzTmFtZX1fX3RyYWNrYCxcbiAgICAgIH0sXG4gICAgICBwYXJlbnQ6IHRoaXMubm9kZSxcbiAgICB9KTtcbiAgICB0aGlzLmZpbGwgPSBET01CdWlsZGVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgIGF0dHJzOiB7XG4gICAgICAgIGNsYXNzOiBgJHttYWluQ2xhc3NOYW1lfV9fZmlsbGVkYCxcbiAgICAgIH0sXG4gICAgICBwYXJlbnQ6IHRoaXMudHJhY2ssXG4gICAgfSk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5oYW5kbGUpIHtcbiAgICAgIHRoaXMuaGFuZGxlID0gRE9NQnVpbGRlci5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgY2xhc3M6IGAke21haW5DbGFzc05hbWV9X19oYW5kbGVgLFxuICAgICAgICB9LFxuICAgICAgICBwYXJlbnQ6IHRoaXMuZmlsbCxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zLmJ1ZmZlcikge1xuICAgICAgdGhpcy5idWZmZXIgPSBET01CdWlsZGVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICBjbGFzczogYCR7bWFpbkNsYXNzTmFtZX1fX2J1ZmZlcmAsXG4gICAgICAgIH0sXG4gICAgICAgIHBhcmVudDogdGhpcy50cmFjayxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIl19
},{"./":11,"./DOMBuilder":7,"./ObjectAssign":9}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFunction = isFunction;
exports.validateInRange = validateInRange;
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function validateInRange(value, min, max) {
  var validValue = void 0;
  if (value > max) {
    validValue = max;
  } else if (value < min) {
    validValue = min;
  } else {
    validValue = value;
  }
  return validValue;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImlzRnVuY3Rpb24iLCJ2YWxpZGF0ZUluUmFuZ2UiLCJmdW5jdGlvblRvQ2hlY2siLCJnZXRUeXBlIiwidG9TdHJpbmciLCJjYWxsIiwidmFsdWUiLCJtaW4iLCJtYXgiLCJ2YWxpZFZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7OztRQUFnQkEsVSxHQUFBQSxVO1FBS0FDLGUsR0FBQUEsZTtBQUxULFNBQVNELFVBQVQsQ0FBb0JFLGVBQXBCLEVBQXFDO0FBQzFDLE1BQU1DLFVBQVUsRUFBaEI7QUFDQSxTQUFPRCxtQkFBbUJDLFFBQVFDLFFBQVIsQ0FBaUJDLElBQWpCLENBQXNCSCxlQUF0QixNQUEyQyxtQkFBckU7QUFDRDs7QUFFTSxTQUFTRCxlQUFULENBQXlCSyxLQUF6QixFQUFnQ0MsR0FBaEMsRUFBcUNDLEdBQXJDLEVBQTBDO0FBQy9DLE1BQUlDLG1CQUFKO0FBQ0EsTUFBSUgsUUFBUUUsR0FBWixFQUFpQjtBQUNmQyxpQkFBYUQsR0FBYjtBQUNELEdBRkQsTUFFTyxJQUFJRixRQUFRQyxHQUFaLEVBQWlCO0FBQ3RCRSxpQkFBYUYsR0FBYjtBQUNELEdBRk0sTUFFQTtBQUNMRSxpQkFBYUgsS0FBYjtBQUNEO0FBQ0QsU0FBT0csVUFBUDtBQUNEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb24oZnVuY3Rpb25Ub0NoZWNrKSB7XG4gIGNvbnN0IGdldFR5cGUgPSB7fTtcbiAgcmV0dXJuIGZ1bmN0aW9uVG9DaGVjayAmJiBnZXRUeXBlLnRvU3RyaW5nLmNhbGwoZnVuY3Rpb25Ub0NoZWNrKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlSW5SYW5nZSh2YWx1ZSwgbWluLCBtYXgpIHtcbiAgbGV0IHZhbGlkVmFsdWU7XG4gIGlmICh2YWx1ZSA+IG1heCkge1xuICAgIHZhbGlkVmFsdWUgPSBtYXg7XG4gIH0gZWxzZSBpZiAodmFsdWUgPCBtaW4pIHtcbiAgICB2YWxpZFZhbHVlID0gbWluO1xuICB9IGVsc2Uge1xuICAgIHZhbGlkVmFsdWUgPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdmFsaWRWYWx1ZTtcbn1cbiJdfQ==
},{}]},{},[6])