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
      console.log(this.fFrequencyData);
      console.log(this.bFrequencyData);
      console.log(this.bTimeData);

      return this;
    }
  }]);

  return Analyser;
}();

exports.default = Analyser;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFuYWx5c2VyLmpzIl0sIm5hbWVzIjpbIkFuYWx5c2VyIiwiY29udGV4dCIsImFuYWx5c2VyIiwiZkZyZXF1ZW5jeURhdGEiLCJiRnJlcXVlbmN5RGF0YSIsImJUaW1lRGF0YSIsIl9jb250ZXh0IiwiX2NyZWF0ZSIsInVwZGF0ZURhdGEiLCJjcmVhdGVBbmFseXNlciIsImZmdFNpemUiLCJGbG9hdDMyQXJyYXkiLCJmcmVxdWVuY3lCaW5Db3VudCIsIlVpbnQ4QXJyYXkiLCJnZXRGbG9hdEZyZXF1ZW5jeURhdGEiLCJnZXRCeXRlRnJlcXVlbmN5RGF0YSIsImdldEJ5dGVUaW1lRG9tYWluRGF0YSIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBcUJBLFE7QUFDbkIsb0JBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFDbkIsU0FBS0MsUUFBTCxHQUFnQixJQUFoQjtBQUNBLFNBQUtDLGNBQUwsR0FBc0IsSUFBdEI7QUFDQSxTQUFLQyxjQUFMLEdBQXNCLElBQXRCO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQixJQUFqQjs7QUFFQSxTQUFLQyxRQUFMLEdBQWdCTCxPQUFoQjtBQUNBLFNBQUtNLE9BQUw7QUFDQSxTQUFLQyxVQUFMO0FBQ0Q7Ozs7OEJBRVM7QUFDUixXQUFLTixRQUFMLEdBQWdCLEtBQUtJLFFBQUwsQ0FBY0csY0FBZCxFQUFoQjtBQUNBO0FBQ0E7QUFDQSxXQUFLUCxRQUFMLENBQWNRLE9BQWQsR0FBd0IsSUFBeEI7QUFDQTtBQUNBLFdBQUtQLGNBQUwsR0FBc0IsSUFBSVEsWUFBSixDQUFpQixLQUFLVCxRQUFMLENBQWNVLGlCQUEvQixDQUF0QjtBQUNBLFdBQUtSLGNBQUwsR0FBc0IsSUFBSVMsVUFBSixDQUFlLEtBQUtYLFFBQUwsQ0FBY1UsaUJBQTdCLENBQXRCO0FBQ0EsV0FBS1AsU0FBTCxHQUFpQixJQUFJUSxVQUFKLENBQWUsS0FBS1gsUUFBTCxDQUFjVSxpQkFBN0IsQ0FBakI7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7OztpQ0FFWTtBQUNYLFdBQUtWLFFBQUwsQ0FBY1kscUJBQWQsQ0FBb0MsS0FBS1gsY0FBekM7QUFDQSxXQUFLRCxRQUFMLENBQWNhLG9CQUFkLENBQW1DLEtBQUtYLGNBQXhDO0FBQ0EsV0FBS0YsUUFBTCxDQUFjYyxxQkFBZCxDQUFvQyxLQUFLWCxTQUF6QztBQUNBWSxjQUFRQyxHQUFSLENBQVksS0FBS2YsY0FBakI7QUFDQWMsY0FBUUMsR0FBUixDQUFZLEtBQUtkLGNBQWpCO0FBQ0FhLGNBQVFDLEdBQVIsQ0FBWSxLQUFLYixTQUFqQjs7QUFFQSxhQUFPLElBQVA7QUFDRDs7Ozs7O2tCQWxDa0JMLFEiLCJmaWxlIjoiQW5hbHlzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBBbmFseXNlciB7XG4gIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcbiAgICB0aGlzLmFuYWx5c2VyID0gbnVsbDtcbiAgICB0aGlzLmZGcmVxdWVuY3lEYXRhID0gbnVsbDtcbiAgICB0aGlzLmJGcmVxdWVuY3lEYXRhID0gbnVsbDtcbiAgICB0aGlzLmJUaW1lRGF0YSA9IG51bGw7XG5cbiAgICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLl9jcmVhdGUoKTtcbiAgICB0aGlzLnVwZGF0ZURhdGEoKTtcbiAgfVxuXG4gIF9jcmVhdGUoKSB7XG4gICAgdGhpcy5hbmFseXNlciA9IHRoaXMuX2NvbnRleHQuY3JlYXRlQW5hbHlzZXIoKTtcbiAgICAvLyDQoNCw0LfQvNC10YDQvdC+0YHRgtGMINC/0YDQtdC+0LHRgNCw0LfQvtCy0LDQvdC40Y8g0KTRg9GA0YzQtVxuICAgIC8vINCV0YHQu9C4INC90LUg0L/QvtC90LjQvNCw0LXRgtC1LCDRh9GC0L4g0Y3RgtC+INGC0LDQutC+0LUgLSDRgdGC0LDQstGM0YLQtSA1MTIsIDEwMjQg0LjQu9C4IDIwNDggOylcbiAgICB0aGlzLmFuYWx5c2VyLmZmdFNpemUgPSAyMDQ4O1xuICAgIC8vINCh0L7Qt9C00LDQtdC8INC80LDRgdGB0LjQstGLINC00LvRjyDRhdGA0LDQvdC10L3QuNGPINC00LDQvdC90YvRhVxuICAgIHRoaXMuZkZyZXF1ZW5jeURhdGEgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuYW5hbHlzZXIuZnJlcXVlbmN5QmluQ291bnQpO1xuICAgIHRoaXMuYkZyZXF1ZW5jeURhdGEgPSBuZXcgVWludDhBcnJheSh0aGlzLmFuYWx5c2VyLmZyZXF1ZW5jeUJpbkNvdW50KTtcbiAgICB0aGlzLmJUaW1lRGF0YSA9IG5ldyBVaW50OEFycmF5KHRoaXMuYW5hbHlzZXIuZnJlcXVlbmN5QmluQ291bnQpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1cGRhdGVEYXRhKCkge1xuICAgIHRoaXMuYW5hbHlzZXIuZ2V0RmxvYXRGcmVxdWVuY3lEYXRhKHRoaXMuZkZyZXF1ZW5jeURhdGEpO1xuICAgIHRoaXMuYW5hbHlzZXIuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEodGhpcy5iRnJlcXVlbmN5RGF0YSk7XG4gICAgdGhpcy5hbmFseXNlci5nZXRCeXRlVGltZURvbWFpbkRhdGEodGhpcy5iVGltZURhdGEpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuZkZyZXF1ZW5jeURhdGEpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuYkZyZXF1ZW5jeURhdGEpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuYlRpbWVEYXRhKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbn1cbiJdfQ==
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
      var analyser = this._analyser ? this._equalizer.analyser : null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvUGxheWVyLmpzIl0sIm5hbWVzIjpbIkF1ZGlvUGxheWVyIiwidHJhY2tzIiwic2V0dGluZ3MiLCJwbGF5bGlzdCIsIm11dGVkIiwiY3VycmVudFRyYWNrSW5kZXgiLCJfcGxheWJhY2siLCJfcmVzZXRQbGF5YmFja0luZm8iLCJfc2V0VHJhY2siLCJfY3R4IiwiX2dhaW4iLCJfZXF1YWxpemVyIiwiX2FuYWx5c2VyIiwiX2NyZWF0ZUF1ZGlvQXBpTm9kZXMiLCJpZCIsImlzUGxheWluZyIsInRyYWNrIiwiY29uc29sZSIsImxvZyIsInNyYyIsImF1ZGlvIiwiaXNCdWZmZXJlZCIsInBsYXkiLCJwbGF5aW5nIiwibG9hZCIsIm9uIiwiX3N0YXJ0UGxheWJhY2siLCJiaW5kIiwicGxheU5leHQiLCJldmVudCIsImVtaXQiLCJwYXVzZSIsImN1cnJlbnRUaW1lIiwic3RvcCIsInJhdGlvIiwiRXJyb3IiLCJpc05hTiIsImR1cmF0aW9uIiwibmV3VGltZSIsImdldFRyYWNrIiwiZXJyb3IiLCJzb3VyY2UiLCJwbGF5YmFjayIsImNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZSIsIl9jb25uZWN0Tm9kZXMiLCJvZmYiLCJ3aW5kb3ciLCJBdWRpb0NvbnRleHQiLCJ3ZWJraXRBdWRpb0NvbnRleHQiLCJfZGVzdCIsImRlc3RpbmF0aW9uIiwiY3JlYXRlR2FpbiIsImVxdWFsaXplciIsImFuYWx5c2VyIiwiZmlsdGVycyIsInRvQ29ubmVjdE5vZGVzIiwiZmlsdGVyIiwibiIsInJlZHVjZSIsInByZXYiLCJjdXJyIiwiQXVkaW9Ob2RlIiwiY29ubmVjdCIsImdhaW4iLCJ2YWx1ZSIsIm11dGUiLCJ1bm11dGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7SUFFcUJBLFc7OztBQUNuQix5QkFBd0M7QUFBQSxRQUE1QkMsTUFBNEIsdUVBQW5CLEVBQW1CO0FBQUEsUUFBZkMsUUFB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O0FBQ3BDLFlBQUlELGdCQUFnQkUsU0FBaEIsSUFBNkJELGdCQUFnQkMsU0FBakQsRUFBNEQ7QUFDMURGLGVBQUtHLE9BQUwsQ0FBYUYsSUFBYjtBQUNEO0FBQ0QsZUFBT0EsSUFBUDtBQUNELE9BTEQ7O0FBT0EsYUFBTyxJQUFQO0FBQ0Q7Ozt3QkEvTmU7QUFDZCxhQUFPLEtBQUt0RCxTQUFMLENBQWVpQixPQUF0QjtBQUNEOzs7d0JBRVk7QUFDWCxhQUFPLEtBQUtiLEtBQUwsQ0FBV3FELElBQVgsQ0FBZ0JDLEtBQXZCO0FBQ0QsSztzQkFVVUEsSyxFQUFPO0FBQ2hCLFVBQUlBLFFBQVEsQ0FBUixJQUFhQSxRQUFRLENBQXpCLEVBQTRCO0FBQzFCLGNBQU03QixNQUFNLHFDQUFOLENBQU47QUFDRDtBQUNELFVBQUk2QixVQUFVLENBQWQsRUFBaUI7QUFDZixhQUFLQyxJQUFMO0FBQ0QsT0FGRCxNQUVPLElBQUksS0FBSzdELEtBQVQsRUFBZ0I7QUFDckIsYUFBSzhELE1BQUw7QUFDRDtBQUNELFdBQUt4RCxLQUFMLENBQVdxRCxJQUFYLENBQWdCQyxLQUFoQixHQUF3QkEsS0FBeEI7QUFDRDs7O3dCQWxCZTtBQUNkLGFBQU8sS0FBS3JELFVBQVo7QUFDRDs7O3dCQUVjO0FBQ2IsYUFBTyxLQUFLQyxTQUFaO0FBQ0Q7Ozs7OztrQkFsQ2tCWixXIiwiZmlsZSI6IkF1ZGlvUGxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBsYXlsaXN0IGZyb20gJy4vUGxheWxpc3QnO1xuaW1wb3J0IFRyYWNrIGZyb20gJy4vVHJhY2snO1xuaW1wb3J0IEV2ZW50RW1taXRlciBmcm9tICcuL3V0aWxzL0V2ZW50RW1taXRlcic7XG5pbXBvcnQgRXF1YWxpemVyIGZyb20gJy4vRXF1YWxpemVyJztcbmltcG9ydCBBbmFseXNlciBmcm9tICcuL0FuYWx5c2VyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXVkaW9QbGF5ZXIgZXh0ZW5kcyBFdmVudEVtbWl0ZXIge1xuICBjb25zdHJ1Y3Rvcih0cmFja3MgPSBbXSwgc2V0dGluZ3MgPSB7fSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnBsYXlsaXN0ID0gbmV3IFBsYXlsaXN0KHRyYWNrcyk7XG4gICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuICAgIHRoaXMuY3VycmVudFRyYWNrSW5kZXggPSAwO1xuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICB0aGlzLl9wbGF5YmFjayA9IHt9O1xuICAgIHRoaXMuX3Jlc2V0UGxheWJhY2tJbmZvKCk7XG4gICAgdGhpcy5fc2V0VHJhY2soKTtcblxuICAgIC8vIGluaXQgQXVkaW8gQVBJIE5vZGVzXG4gICAgdGhpcy5fY3R4ID0gbnVsbDtcbiAgICB0aGlzLl9nYWluID0gbnVsbDtcbiAgICB0aGlzLl9lcXVhbGl6ZXIgPSBudWxsO1xuICAgIHRoaXMuX2FuYWx5c2VyID0gbnVsbDtcbiAgICB0aGlzLl9jcmVhdGVBdWRpb0FwaU5vZGVzKCk7XG4gIH1cblxuICBnZXQgaXNQbGF5aW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9wbGF5YmFjay5wbGF5aW5nO1xuICB9XG5cbiAgZ2V0IHZvbHVtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2Fpbi5nYWluLnZhbHVlO1xuICB9XG5cbiAgZ2V0IGVxdWFsaXplcigpIHtcbiAgICByZXR1cm4gdGhpcy5fZXF1YWxpemVyO1xuICB9XG5cbiAgZ2V0IGFuYWx5c2VyKCkge1xuICAgIHJldHVybiB0aGlzLl9hbmFseXNlcjtcbiAgfVxuXG4gIHNldCB2b2x1bWUodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPiAxICYmIHZhbHVlIDwgMCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1ZvbHVtZSBtdXN0IGJlIGluIHJhbmdlIGZyb20gMCB0byAxJyk7XG4gICAgfVxuICAgIGlmICh2YWx1ZSA9PT0gMCkge1xuICAgICAgdGhpcy5tdXRlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm11dGVkKSB7XG4gICAgICB0aGlzLnVubXV0ZSgpO1xuICAgIH1cbiAgICB0aGlzLl9nYWluLmdhaW4udmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIHBsYXkoaWQgPSBudWxsKSB7XG4gICAgaWYgKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRUcmFja0luZGV4ID0gaWQgfHwgdGhpcy5jdXJyZW50VHJhY2tJbmRleDtcblxuICAgIGlmICghdGhpcy5fcGxheWJhY2sudHJhY2sgfHwgdGhpcy5fcGxheWJhY2sudHJhY2suaWQgIT09IHRoaXMuY3VycmVudFRyYWNrSW5kZXgpIHtcbiAgICAgIHRoaXMuX3NldFRyYWNrKCk7XG4gICAgfVxuXG4gICAgY29uc3QgdHJhY2sgPSB0aGlzLl9wbGF5YmFjay50cmFjaztcblxuICAgIGNvbnNvbGUubG9nKGBQbGF5aW5nIHRyYWNrIGlkPSR7dGhpcy5jdXJyZW50VHJhY2tJbmRleH0gLSAke3RyYWNrLnNyY31gKTtcbiAgICBpZiAodHJhY2suYXVkaW8gJiYgdHJhY2suaXNCdWZmZXJlZCgpKSB7XG4gICAgICB0cmFjay5hdWRpby5wbGF5KCk7XG4gICAgICB0aGlzLl9wbGF5YmFjay5wbGF5aW5nID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHJhY2subG9hZCgpO1xuICAgICAgLy8gU3Vic2NyaWJlXG4gICAgICAvLyDRh9C10YIg0L3QtSDQvtC6XG4gICAgICB0cmFjay5vbignY2FucGxheScsIHRoaXMuX3N0YXJ0UGxheWJhY2suYmluZCh0aGlzKSk7XG4gICAgICB0cmFjay5vbignZW5kZWQnLCB0aGlzLnBsYXlOZXh0LmJpbmQodGhpcykpO1xuICAgICAgdHJhY2sub24oJ3Byb2dyZXNzJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdCgndHJhY2s6cHJvZ3Jlc3MnLCBldmVudCk7XG4gICAgICB9KTtcbiAgICAgIHRyYWNrLm9uKCdsb2FkZWRkYXRhJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdCgndHJhY2s6bG9hZGVkZGF0YScsIGV2ZW50KTtcbiAgICAgIH0pO1xuICAgICAgdHJhY2sub24oJ2NhbnBsYXl0aHJvdWdoJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdCgndHJhY2s6Y2FucGxheXRocm91Z2gnLCBldmVudCk7XG4gICAgICB9KTtcbiAgICAgIHRyYWNrLm9uKCdsb2FkZWRtZXRhZGF0YScsIChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLmVtaXQoJ3RyYWNrOmxvYWRlZG1ldGFkYXRhJywgZXZlbnQpO1xuICAgICAgfSk7XG4gICAgICB0cmFjay5vbigndGltZXVwZGF0ZScsIChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLmVtaXQoJ3RyYWNrOnRpbWV1cGRhdGUnLCBldmVudCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5fcGxheWJhY2sucGxheWluZyA9IGZhbHNlO1xuICAgIGNvbnN0IHRyYWNrID0gdGhpcy5fcGxheWJhY2sudHJhY2s7XG4gICAgdHJhY2suYXVkaW8ucGF1c2UoKTtcbiAgICB0cmFjay5hdWRpby5jdXJyZW50VGltZSA9IDA7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHBhdXNlKCkge1xuICAgIHRoaXMuX3BsYXliYWNrLnBsYXlpbmcgPSBmYWxzZTtcbiAgICBjb25zdCB0cmFjayA9IHRoaXMuX3BsYXliYWNrLnRyYWNrO1xuICAgIHRyYWNrLmF1ZGlvLnBhdXNlKCk7XG4gICAgY29uc29sZS5sb2coJ1BBVVNFRCcpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBtdXRlKCkge1xuICAgIHRoaXMuX3BsYXliYWNrLnRyYWNrLm11dGVkID0gdHJ1ZTtcbiAgICB0aGlzLm11dGVkID0gdHJ1ZTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdW5tdXRlKCkge1xuICAgIHRoaXMuX3BsYXliYWNrLnRyYWNrLm11dGVkID0gZmFsc2U7XG4gICAgdGhpcy5tdXRlZCA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwbGF5TmV4dCgpIHtcbiAgICBpZiAodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgIHRoaXMuc3RvcCgpO1xuICAgIH1cbiAgICB0aGlzLl9yZXNldFBsYXliYWNrSW5mbygpO1xuXG4gICAgdGhpcy5jdXJyZW50VHJhY2tJbmRleCArPSAxO1xuICAgIHRoaXMucGxheSgpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwbGF5UHJldigpIHtcbiAgICBpZiAodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgIHRoaXMuc3RvcCgpO1xuICAgIH1cbiAgICB0aGlzLl9yZXNldFBsYXliYWNrSW5mbygpO1xuXG4gICAgdGhpcy5jdXJyZW50VHJhY2tJbmRleCAtPSAxO1xuICAgIHRoaXMucGxheSgpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXdpbmQocmF0aW8pIHtcbiAgICBpZiAocmF0aW8gPiAxICYmIHJhdGlvIDwgMCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ1RvIHJld2luZCBhdWRpbywgcmF0aW8gbXVzdCBiZSBpbiByYW5nZSBmcm9tIDAgdG8gMScpO1xuICAgIH1cblxuICAgIGNvbnN0IGF1ZGlvID0gdGhpcy5fcGxheWJhY2sudHJhY2suYXVkaW87XG4gICAgaWYgKCFpc05hTihhdWRpby5kdXJhdGlvbikpIHtcbiAgICAgIGNvbnN0IG5ld1RpbWUgPSBhdWRpby5kdXJhdGlvbiAqIHJhdGlvO1xuICAgICAgYXVkaW8uY3VycmVudFRpbWUgPSBuZXdUaW1lO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX3NldFRyYWNrKCkge1xuICAgIGlmICh0aGlzLmlzUGxheWluZykge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdTZXR0aW5nIHRyYWNrJywgdGhpcy5jdXJyZW50VHJhY2tJbmRleCk7XG4gICAgLy8gVE9ETzogbmVlZCB0byByZWZhY3RvcmluZyB0aGlzXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX3BsYXliYWNrLnRyYWNrID0gdGhpcy5wbGF5bGlzdC5nZXRUcmFjayh0aGlzLmN1cnJlbnRUcmFja0luZGV4KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgY29uc29sZS5sb2coJ0N1cnJlbnRUcmFja0luZGV4IHJlc2V0ZWQgdG8gMCcpO1xuICAgICAgdGhpcy5jdXJyZW50VHJhY2tJbmRleCA9IDA7XG4gICAgICB0aGlzLl9wbGF5YmFjay50cmFjayA9IHRoaXMucGxheWxpc3QuZ2V0VHJhY2sodGhpcy5jdXJyZW50VHJhY2tJbmRleCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfcmVzZXRQbGF5YmFja0luZm8oKSB7XG4gICAgdGhpcy5fcGxheWJhY2sgPSB7XG4gICAgICB0cmFjazogbnVsbCxcbiAgICAgIHNvdXJjZTogbnVsbCxcbiAgICAgIHBsYXlpbmc6IGZhbHNlLFxuICAgIH07XG4gICAgLy8gY29uc29sZS5sb2coJ1JFU0VUIFBMQVlCQUNLJyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9zdGFydFBsYXliYWNrKCkge1xuICAgIGlmICh0aGlzLmlzUGxheWluZykge1xuICAgICAgY29uc29sZS5sb2coJ0FscmVhZHkgcGxheWluZyExJyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb25zdCBwbGF5YmFjayA9IHRoaXMuX3BsYXliYWNrO1xuICAgIGNvbnN0IHRyYWNrID0gdGhpcy5fcGxheWJhY2sudHJhY2s7XG5cbiAgICBwbGF5YmFjay5zb3VyY2UgPSB0aGlzLl9jdHguY3JlYXRlTWVkaWFFbGVtZW50U291cmNlKHRyYWNrLmF1ZGlvKTtcbiAgICB0aGlzLl9jb25uZWN0Tm9kZXMoKTtcblxuICAgIGNvbnNvbGUubG9nKGBMb2FkZWQgLSAke3BsYXliYWNrLnRyYWNrLnNyY31gKTtcbiAgICBwbGF5YmFjay5wbGF5aW5nID0gdHJ1ZTtcbiAgICB0cmFjay5hdWRpby5wbGF5KCk7XG5cbiAgICAvLyBVbnN1YnNjcmliZSBiZWNhdXNlICdjYW5wbGF5JyBldmVudCB0cmlnZ2VyZWQgYnkgY2hhbmdpbmcgdGhlIGN1cnJlbnQgdGltZVxuICAgIHRyYWNrLm9mZignY2FucGxheScsIHRoaXMuX3N0YXJ0UGxheWJhY2suYmluZCh0aGlzKSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9jcmVhdGVBdWRpb0FwaU5vZGVzKCkge1xuICAgIGlmICghKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCkpIHJldHVybjtcblxuICAgIHRoaXMuX2N0eCA9IG5ldyAod2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0KSgpO1xuICAgIHRoaXMuX2Rlc3QgPSB0aGlzLl9jdHguZGVzdGluYXRpb247XG4gICAgdGhpcy5fZ2FpbiA9IHRoaXMuX2N0eC5jcmVhdGVHYWluKCk7XG4gICAgdGhpcy5fZXF1YWxpemVyID0gdGhpcy5zZXR0aW5ncy5lcXVhbGl6ZXIgPyBuZXcgRXF1YWxpemVyKHRoaXMuX2N0eCkgOiBudWxsO1xuICAgIHRoaXMuX2FuYWx5c2VyID0gdGhpcy5zZXR0aW5ncy5hbmFseXNlciA/IG5ldyBBbmFseXNlcih0aGlzLl9jdHgpIDogbnVsbDtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX2Nvbm5lY3ROb2RlcygpIHtcbiAgICBjb25zdCBmaWx0ZXJzID0gdGhpcy5fZXF1YWxpemVyID8gdGhpcy5fZXF1YWxpemVyLmZpbHRlcnMgOiBbXTtcbiAgICBjb25zdCBhbmFseXNlciA9IHRoaXMuX2FuYWx5c2VyID8gdGhpcy5fZXF1YWxpemVyLmFuYWx5c2VyIDogbnVsbDtcbiAgICBjb25zdCB0b0Nvbm5lY3ROb2RlcyA9IFtcbiAgICAgIHRoaXMuX3BsYXliYWNrLnNvdXJjZSxcbiAgICAgIC4uLmZpbHRlcnMsXG4gICAgICB0aGlzLl9nYWluLFxuICAgICAgYW5hbHlzZXIsXG4gICAgICB0aGlzLl9kZXN0LFxuICAgIF0uZmlsdGVyKG4gPT4gbik7XG5cbiAgICB0b0Nvbm5lY3ROb2Rlcy5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcbiAgICAgIGlmIChwcmV2IGluc3RhbmNlb2YgQXVkaW9Ob2RlICYmIGN1cnIgaW5zdGFuY2VvZiBBdWRpb05vZGUpIHtcbiAgICAgICAgcHJldi5jb25uZWN0KGN1cnIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGN1cnI7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuIl19
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

var equalizerBands = document.querySelectorAll('.equalizer-band__slider');

var tracks = ['http://freshly-ground.com/data/audio/mpc/20090207%20-%20Loverman.mp3', './../media/02 - Needles.mp3', './../media/03 - Deer Dance.mp3', './../media/04 - Jet Pilot.mp3', './../media/05 - X.mp3', './../media/06 - Chop Suey!.mp3'];

var player = new _AudioPlayer2.default(tracks, { equalizer: true, analyser: false });
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
var onwheelHandler = function onwheelHandler(event) {
  event.preventDefault();
  var newValue = player.volume + Math.sign(event.wheelDeltaY) * 0.05;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfYTMyN2Y5YmMuanMiXSwibmFtZXMiOlsicGxheUJ0biIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInBsYXlOZXh0QnRuIiwicGxheVByZXZCdG4iLCJ2b2x1bWVCdG4iLCJ2b2x1bWVTbGlkZXJOb2RlIiwicHJvZ3Jlc3NCYXIiLCJlcXVhbGl6ZXJCYW5kcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJ0cmFja3MiLCJwbGF5ZXIiLCJlcXVhbGl6ZXIiLCJhbmFseXNlciIsInZvbHVtZSIsInNldFZvbHVtZSIsInZhbHVlIiwiaWNvbiIsImNoaWxkcmVuIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkIiwidm9sdW1lU2xpZGVyIiwib25jaGFuZ2UiLCJvbm1vdmUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIm11dGVkIiwidW5tdXRlIiwibXV0ZSIsIm9ud2hlZWxIYW5kbGVyIiwibmV3VmFsdWUiLCJNYXRoIiwic2lnbiIsIndoZWVsRGVsdGFZIiwic2V0VmFsdWUiLCJwcm9ncmVzc1NsaWRlciIsImhhbmRsZSIsImJ1ZmZlciIsInJld2luZCIsInVwZGF0ZUJ1ZmZlciIsImF1ZGlvIiwidGFyZ2V0IiwiYnVmZmVyZWQiLCJidWZmUmF0aW8iLCJsZW5ndGgiLCJlbmQiLCJkdXJhdGlvbiIsInNldEJ1ZmZlciIsIm9uIiwicmF0aW8iLCJjdXJyZW50VGltZSIsImlzUGxheWluZyIsInBsYXkiLCJwYXVzZSIsInBsYXlOZXh0IiwicGxheVByZXYiLCJmb3JFYWNoIiwiYmFuZCIsImkiLCJmaWx0ZXJWYWx1ZSIsImdldEZpbHRlckdhaW4iLCJiYW5kU2xpZGVyIiwidmVydGljYWwiLCJtaW4iLCJtYXgiLCJjaGFuZ2VGaWx0ZXJHYWluIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFVBQVVDLFNBQVNDLGFBQVQsQ0FBdUIsNEJBQXZCLENBQWhCO0FBQ0EsSUFBTUMsY0FBY0YsU0FBU0MsYUFBVCxDQUF1Qiw0QkFBdkIsQ0FBcEI7QUFDQSxJQUFNRSxjQUFjSCxTQUFTQyxhQUFULENBQXVCLDRCQUF2QixDQUFwQjs7QUFFQSxJQUFNRyxZQUFZSixTQUFTQyxhQUFULENBQXVCLGNBQXZCLENBQWxCO0FBQ0EsSUFBTUksbUJBQW1CTCxTQUFTQyxhQUFULENBQXVCLGlCQUF2QixDQUF6Qjs7QUFFQSxJQUFNSyxjQUFjTixTQUFTQyxhQUFULENBQXVCLGdCQUF2QixDQUFwQjs7QUFFQSxJQUFNTSxpQkFBaUJQLFNBQVNRLGdCQUFULENBQTBCLHlCQUExQixDQUF2Qjs7QUFFQSxJQUFNQyxTQUFTLENBQ2Isc0VBRGEsRUFFYiw2QkFGYSxFQUdiLGdDQUhhLEVBSWIsK0JBSmEsRUFLYix1QkFMYSxFQU1iLGdDQU5hLENBQWY7O0FBU0EsSUFBTUMsU0FBUywwQkFBZ0JELE1BQWhCLEVBQXdCLEVBQUVFLFdBQVcsSUFBYixFQUFtQkMsVUFBVSxLQUE3QixFQUF4QixDQUFmO0FBQ0FGLE9BQU9HLE1BQVAsR0FBZ0IsR0FBaEI7O0FBRUE7QUFDQSxJQUFNQyxZQUFZLFNBQVpBLFNBQVksQ0FBQ0MsS0FBRCxFQUFXO0FBQzNCLE1BQU1DLE9BQU9aLFVBQVVhLFFBQVYsQ0FBbUIsQ0FBbkIsQ0FBYjtBQUNBLE1BQUlGLFVBQVUsQ0FBZCxFQUFpQjtBQUNmQyxTQUFLRSxTQUFMLENBQWVDLE1BQWYsQ0FBc0IsbUJBQXRCO0FBQ0FILFNBQUtFLFNBQUwsQ0FBZUUsR0FBZixDQUFtQixtQkFBbkI7QUFDRDtBQUNELE1BQUlMLFFBQVEsQ0FBUixJQUFhQSxTQUFTLEdBQTFCLEVBQStCO0FBQzdCQyxTQUFLRSxTQUFMLENBQWVDLE1BQWYsQ0FBc0IsbUJBQXRCO0FBQ0FILFNBQUtFLFNBQUwsQ0FBZUUsR0FBZixDQUFtQixtQkFBbkI7QUFDRDtBQUNELE1BQUlMLFFBQVEsR0FBWixFQUFpQjtBQUNmQyxTQUFLRSxTQUFMLENBQWVDLE1BQWYsQ0FBc0IsbUJBQXRCO0FBQ0FILFNBQUtFLFNBQUwsQ0FBZUMsTUFBZixDQUFzQixtQkFBdEI7QUFDRDtBQUNEVCxTQUFPRyxNQUFQLEdBQWdCRSxLQUFoQjtBQUNELENBZkQ7O0FBaUJBLElBQU1NLGVBQWUsMEJBQWdCaEIsZ0JBQWhCLEVBQWtDO0FBQ3JEVSxTQUFPTCxPQUFPRyxNQUR1QztBQUVyRFMsWUFBVVIsU0FGMkM7QUFHckRTLFVBQVFUO0FBSDZDLENBQWxDLENBQXJCOztBQU1BVixVQUFVb0IsZ0JBQVYsQ0FBMkIsT0FBM0IsRUFBb0MsVUFBQ0MsS0FBRCxFQUFXO0FBQzdDQSxRQUFNQyxjQUFOO0FBQ0EsTUFBTVYsT0FBT1osVUFBVWEsUUFBVixDQUFtQixDQUFuQixDQUFiO0FBQ0EsTUFBSVAsT0FBT2lCLEtBQVgsRUFBa0I7QUFDaEJqQixXQUFPa0IsTUFBUDtBQUNBWixTQUFLRSxTQUFMLENBQWVDLE1BQWYsQ0FBc0IsbUJBQXRCO0FBQ0QsR0FIRCxNQUdPO0FBQ0xULFdBQU9tQixJQUFQO0FBQ0FiLFNBQUtFLFNBQUwsQ0FBZUUsR0FBZixDQUFtQixtQkFBbkI7QUFDRDtBQUNGLENBVkQ7O0FBWUE7QUFDQSxJQUFNVSxpQkFBaUIsU0FBakJBLGNBQWlCLENBQUNMLEtBQUQsRUFBVztBQUNoQ0EsUUFBTUMsY0FBTjtBQUNBLE1BQU1LLFdBQVdyQixPQUFPRyxNQUFQLEdBQWlCbUIsS0FBS0MsSUFBTCxDQUFVUixNQUFNUyxXQUFoQixJQUErQixJQUFqRTtBQUNBYixlQUFhYyxRQUFiLENBQXNCSixRQUF0QjtBQUNBckIsU0FBT0csTUFBUCxHQUFnQmtCLFFBQWhCO0FBQ0QsQ0FMRDs7QUFPQTNCLFVBQVVvQixnQkFBVixDQUEyQixPQUEzQixFQUFvQ00sY0FBcEM7QUFDQXpCLGlCQUFpQm1CLGdCQUFqQixDQUFrQyxPQUFsQyxFQUEyQ00sY0FBM0M7O0FBRUE7QUFDQSxJQUFNTSxpQkFBaUIsMEJBQWdCOUIsV0FBaEIsRUFBNkI7QUFDbEQrQixVQUFRLEtBRDBDO0FBRWxEQyxVQUFRLElBRjBDO0FBR2xEaEIsWUFBVSxrQkFBQ1AsS0FBRCxFQUFXO0FBQ25CTCxXQUFPNkIsTUFBUCxDQUFjeEIsS0FBZDtBQUNEO0FBTGlELENBQTdCLENBQXZCOztBQVFBLElBQU15QixlQUFlLFNBQWZBLFlBQWUsQ0FBQ2YsS0FBRCxFQUFXO0FBQzlCLE1BQU1nQixRQUFRaEIsTUFBTWlCLE1BQXBCO0FBQ0EsTUFBTUMsV0FBV0YsTUFBTUUsUUFBdkI7QUFDQSxNQUFNQyxZQUFZRCxTQUFTRSxNQUFULEdBQWtCRixTQUFTRyxHQUFULENBQWFILFNBQVNFLE1BQVQsR0FBa0IsQ0FBL0IsSUFBb0NKLE1BQU1NLFFBQTVELEdBQXVFLENBQXpGOztBQUVBWCxpQkFBZVksU0FBZixDQUF5QkosU0FBekI7QUFDRCxDQU5EOztBQVFBbEMsT0FBT3VDLEVBQVAsQ0FBVSxnQkFBVixFQUE0QlQsWUFBNUI7QUFDQTlCLE9BQU91QyxFQUFQLENBQVUsa0JBQVYsRUFBOEJULFlBQTlCO0FBQ0E5QixPQUFPdUMsRUFBUCxDQUFVLHNCQUFWLEVBQWtDVCxZQUFsQztBQUNBOUIsT0FBT3VDLEVBQVAsQ0FBVSxrQkFBVixFQUE4QixVQUFDeEIsS0FBRCxFQUFXO0FBQ3ZDLE1BQU1nQixRQUFRaEIsTUFBTWlCLE1BQXBCO0FBQ0EsTUFBTVEsUUFBUVQsTUFBTVUsV0FBTixHQUFvQlYsTUFBTU0sUUFBeEM7QUFDQVgsaUJBQWVELFFBQWYsQ0FBd0JlLEtBQXhCO0FBQ0QsQ0FKRDs7QUFPQTtBQUNBbkQsUUFBUXlCLGdCQUFSLENBQXlCLE9BQXpCLEVBQWtDLFlBQU07QUFDdEMsTUFBSSxDQUFDZCxPQUFPMEMsU0FBWixFQUF1QjtBQUNyQnJELFlBQVFtQixTQUFSLENBQWtCRSxHQUFsQixDQUFzQiw0QkFBdEI7QUFDQVYsV0FBTzJDLElBQVA7QUFDRCxHQUhELE1BR087QUFDTHRELFlBQVFtQixTQUFSLENBQWtCQyxNQUFsQixDQUF5Qiw0QkFBekI7QUFDQVQsV0FBTzRDLEtBQVA7QUFDRDtBQUNGLENBUkQ7O0FBVUFwRCxZQUFZc0IsZ0JBQVosQ0FBNkIsT0FBN0IsRUFBc0MsWUFBTTtBQUMxQ3pCLFVBQVFtQixTQUFSLENBQWtCRSxHQUFsQixDQUFzQiw0QkFBdEI7QUFDQVYsU0FBTzZDLFFBQVA7QUFDRCxDQUhEOztBQUtBcEQsWUFBWXFCLGdCQUFaLENBQTZCLE9BQTdCLEVBQXNDLFlBQU07QUFDMUN6QixVQUFRbUIsU0FBUixDQUFrQkUsR0FBbEIsQ0FBc0IsNEJBQXRCO0FBQ0FWLFNBQU84QyxRQUFQO0FBQ0QsQ0FIRDs7QUFLQTtBQUNBakQsZUFBZWtELE9BQWYsQ0FBdUIsVUFBQ0MsSUFBRCxFQUFPQyxDQUFQLEVBQWE7QUFDbEMsTUFBTUMsY0FBY2xELE9BQU9DLFNBQVAsQ0FBaUJrRCxhQUFqQixDQUErQkYsQ0FBL0IsQ0FBcEI7QUFDQSxNQUFNRyxhQUFhLDBCQUFnQkosSUFBaEIsRUFBc0I7QUFDdkNLLGNBQVUsSUFENkI7QUFFdkNDLFNBQUssQ0FBQyxFQUZpQztBQUd2Q0MsU0FBSyxFQUhrQztBQUl2Q2xELFdBQU82QyxXQUpnQztBQUt2Q3RDLGNBQVUsa0JBQUNQLEtBQUQsRUFBVztBQUNuQkwsYUFBT0MsU0FBUCxDQUFpQnVELGdCQUFqQixDQUFrQ1AsQ0FBbEMsRUFBcUM1QyxLQUFyQztBQUNELEtBUHNDO0FBUXZDUSxZQUFRLGdCQUFDUixLQUFELEVBQVc7QUFDakJMLGFBQU9DLFNBQVAsQ0FBaUJ1RCxnQkFBakIsQ0FBa0NQLENBQWxDLEVBQXFDNUMsS0FBckM7QUFDRDtBQVZzQyxHQUF0QixDQUFuQjtBQVlELENBZEQiLCJmaWxlIjoiZmFrZV9hMzI3ZjliYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBdWRpb1BsYXllciBmcm9tICcuL0F1ZGlvUGxheWVyJztcbmltcG9ydCBSYW5nZVNsaWRlciBmcm9tICcuL3V0aWxzL1JhbmdlU2xpZGVyJztcblxuY29uc3QgcGxheUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9wbGF5Jyk7XG5jb25zdCBwbGF5TmV4dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9uZXh0Jyk7XG5jb25zdCBwbGF5UHJldkJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9wcmV2Jyk7XG5cbmNvbnN0IHZvbHVtZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52b2x1bWVfX2J0bicpO1xuY29uc3Qgdm9sdW1lU2xpZGVyTm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52b2x1bWVfX3NsaWRlcicpO1xuXG5jb25zdCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmVzc19fYmFyJyk7XG5cbmNvbnN0IGVxdWFsaXplckJhbmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmVxdWFsaXplci1iYW5kX19zbGlkZXInKTtcblxuY29uc3QgdHJhY2tzID0gW1xuICAnaHR0cDovL2ZyZXNobHktZ3JvdW5kLmNvbS9kYXRhL2F1ZGlvL21wYy8yMDA5MDIwNyUyMC0lMjBMb3Zlcm1hbi5tcDMnLFxuICAnLi8uLi9tZWRpYS8wMiAtIE5lZWRsZXMubXAzJyxcbiAgJy4vLi4vbWVkaWEvMDMgLSBEZWVyIERhbmNlLm1wMycsXG4gICcuLy4uL21lZGlhLzA0IC0gSmV0IFBpbG90Lm1wMycsXG4gICcuLy4uL21lZGlhLzA1IC0gWC5tcDMnLFxuICAnLi8uLi9tZWRpYS8wNiAtIENob3AgU3VleSEubXAzJyxcbl07XG5cbmNvbnN0IHBsYXllciA9IG5ldyBBdWRpb1BsYXllcih0cmFja3MsIHsgZXF1YWxpemVyOiB0cnVlLCBhbmFseXNlcjogZmFsc2UgfSk7XG5wbGF5ZXIudm9sdW1lID0gMC41O1xuXG4vLyBWb2x1bWUgc2V0dGluZ3NcbmNvbnN0IHNldFZvbHVtZSA9ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBpY29uID0gdm9sdW1lQnRuLmNoaWxkcmVuWzBdO1xuICBpZiAodmFsdWUgPT09IDApIHtcbiAgICBpY29uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZvbHVtZV9faWNvbl9oYWxmJyk7XG4gICAgaWNvbi5jbGFzc0xpc3QuYWRkKCd2b2x1bWVfX2ljb25fbXV0ZScpO1xuICB9XG4gIGlmICh2YWx1ZSA+IDAgJiYgdmFsdWUgPD0gMC41KSB7XG4gICAgaWNvbi5jbGFzc0xpc3QucmVtb3ZlKCd2b2x1bWVfX2ljb25fbXV0ZScpO1xuICAgIGljb24uY2xhc3NMaXN0LmFkZCgndm9sdW1lX19pY29uX2hhbGYnKTtcbiAgfVxuICBpZiAodmFsdWUgPiAwLjUpIHtcbiAgICBpY29uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZvbHVtZV9faWNvbl9tdXRlJyk7XG4gICAgaWNvbi5jbGFzc0xpc3QucmVtb3ZlKCd2b2x1bWVfX2ljb25faGFsZicpO1xuICB9XG4gIHBsYXllci52b2x1bWUgPSB2YWx1ZTtcbn07XG5cbmNvbnN0IHZvbHVtZVNsaWRlciA9IG5ldyBSYW5nZVNsaWRlcih2b2x1bWVTbGlkZXJOb2RlLCB7XG4gIHZhbHVlOiBwbGF5ZXIudm9sdW1lLFxuICBvbmNoYW5nZTogc2V0Vm9sdW1lLFxuICBvbm1vdmU6IHNldFZvbHVtZSxcbn0pO1xuXG52b2x1bWVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgY29uc3QgaWNvbiA9IHZvbHVtZUJ0bi5jaGlsZHJlblswXTtcbiAgaWYgKHBsYXllci5tdXRlZCkge1xuICAgIHBsYXllci51bm11dGUoKTtcbiAgICBpY29uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZvbHVtZV9faWNvbl9tdXRlJyk7XG4gIH0gZWxzZSB7XG4gICAgcGxheWVyLm11dGUoKTtcbiAgICBpY29uLmNsYXNzTGlzdC5hZGQoJ3ZvbHVtZV9faWNvbl9tdXRlJyk7XG4gIH1cbn0pO1xuXG4vLyBNb3VzZVNjcm9sbCBldmVudCBoYW5kbGVyIHRvIGNvbnRyb2wgdGhlIHZvbHVtZVxuY29uc3Qgb253aGVlbEhhbmRsZXIgPSAoZXZlbnQpID0+IHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgY29uc3QgbmV3VmFsdWUgPSBwbGF5ZXIudm9sdW1lICsgKE1hdGguc2lnbihldmVudC53aGVlbERlbHRhWSkgKiAwLjA1KTtcbiAgdm9sdW1lU2xpZGVyLnNldFZhbHVlKG5ld1ZhbHVlKTtcbiAgcGxheWVyLnZvbHVtZSA9IG5ld1ZhbHVlO1xufTtcblxudm9sdW1lQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgb253aGVlbEhhbmRsZXIpO1xudm9sdW1lU2xpZGVyTm9kZS5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIG9ud2hlZWxIYW5kbGVyKTtcblxuLy8gUHJvZ3Jlc3Mgc2V0dGluZ3NcbmNvbnN0IHByb2dyZXNzU2xpZGVyID0gbmV3IFJhbmdlU2xpZGVyKHByb2dyZXNzQmFyLCB7XG4gIGhhbmRsZTogZmFsc2UsXG4gIGJ1ZmZlcjogdHJ1ZSxcbiAgb25jaGFuZ2U6ICh2YWx1ZSkgPT4ge1xuICAgIHBsYXllci5yZXdpbmQodmFsdWUpO1xuICB9LFxufSk7XG5cbmNvbnN0IHVwZGF0ZUJ1ZmZlciA9IChldmVudCkgPT4ge1xuICBjb25zdCBhdWRpbyA9IGV2ZW50LnRhcmdldDtcbiAgY29uc3QgYnVmZmVyZWQgPSBhdWRpby5idWZmZXJlZDtcbiAgY29uc3QgYnVmZlJhdGlvID0gYnVmZmVyZWQubGVuZ3RoID8gYnVmZmVyZWQuZW5kKGJ1ZmZlcmVkLmxlbmd0aCAtIDEpIC8gYXVkaW8uZHVyYXRpb24gOiAwO1xuXG4gIHByb2dyZXNzU2xpZGVyLnNldEJ1ZmZlcihidWZmUmF0aW8pO1xufTtcblxucGxheWVyLm9uKCd0cmFjazpwcm9ncmVzcycsIHVwZGF0ZUJ1ZmZlcik7XG5wbGF5ZXIub24oJ3RyYWNrOmxvYWRlZGRhdGEnLCB1cGRhdGVCdWZmZXIpO1xucGxheWVyLm9uKCd0cmFjazpjYW5wbGF5dGhyb3VnaCcsIHVwZGF0ZUJ1ZmZlcik7XG5wbGF5ZXIub24oJ3RyYWNrOnRpbWV1cGRhdGUnLCAoZXZlbnQpID0+IHtcbiAgY29uc3QgYXVkaW8gPSBldmVudC50YXJnZXQ7XG4gIGNvbnN0IHJhdGlvID0gYXVkaW8uY3VycmVudFRpbWUgLyBhdWRpby5kdXJhdGlvbjtcbiAgcHJvZ3Jlc3NTbGlkZXIuc2V0VmFsdWUocmF0aW8pO1xufSk7XG5cblxuLy8gUGxheWVyIGNvbnRyb2xzIHNldHRpbmdzXG5wbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBpZiAoIXBsYXllci5pc1BsYXlpbmcpIHtcbiAgICBwbGF5QnRuLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250cm9sc19fYnRuX3BhdXNlJyk7XG4gICAgcGxheWVyLnBsYXkoKTtcbiAgfSBlbHNlIHtcbiAgICBwbGF5QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3BsYXllci1jb250cm9sc19fYnRuX3BhdXNlJyk7XG4gICAgcGxheWVyLnBhdXNlKCk7XG4gIH1cbn0pO1xuXG5wbGF5TmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgcGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udHJvbHNfX2J0bl9wYXVzZScpO1xuICBwbGF5ZXIucGxheU5leHQoKTtcbn0pO1xuXG5wbGF5UHJldkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgcGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udHJvbHNfX2J0bl9wYXVzZScpO1xuICBwbGF5ZXIucGxheVByZXYoKTtcbn0pO1xuXG4vLyBFcXVhbGl6ZXIgc2V0dGluZ3NcbmVxdWFsaXplckJhbmRzLmZvckVhY2goKGJhbmQsIGkpID0+IHtcbiAgY29uc3QgZmlsdGVyVmFsdWUgPSBwbGF5ZXIuZXF1YWxpemVyLmdldEZpbHRlckdhaW4oaSk7XG4gIGNvbnN0IGJhbmRTbGlkZXIgPSBuZXcgUmFuZ2VTbGlkZXIoYmFuZCwge1xuICAgIHZlcnRpY2FsOiB0cnVlLFxuICAgIG1pbjogLTEyLFxuICAgIG1heDogMTIsXG4gICAgdmFsdWU6IGZpbHRlclZhbHVlLFxuICAgIG9uY2hhbmdlOiAodmFsdWUpID0+IHtcbiAgICAgIHBsYXllci5lcXVhbGl6ZXIuY2hhbmdlRmlsdGVyR2FpbihpLCB2YWx1ZSk7XG4gICAgfSxcbiAgICBvbm1vdmU6ICh2YWx1ZSkgPT4ge1xuICAgICAgcGxheWVyLmVxdWFsaXplci5jaGFuZ2VGaWx0ZXJHYWluKGksIHZhbHVlKTtcbiAgICB9LFxuICB9KTtcbn0pO1xuIl19
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