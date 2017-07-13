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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvUGxheWVyLmpzIl0sIm5hbWVzIjpbIkF1ZGlvUGxheWVyIiwidHJhY2tzIiwic2V0dGluZ3MiLCJwbGF5bGlzdCIsIm11dGVkIiwiY3VycmVudFRyYWNrSW5kZXgiLCJfcGxheWJhY2siLCJfcmVzZXRQbGF5YmFja0luZm8iLCJfc2V0VHJhY2siLCJfY3R4IiwiX2dhaW4iLCJfZXF1YWxpemVyIiwiX2FuYWx5c2VyIiwiX2NyZWF0ZUF1ZGlvQXBpTm9kZXMiLCJpZCIsImlzUGxheWluZyIsInRyYWNrIiwiY29uc29sZSIsImxvZyIsInNyYyIsImF1ZGlvIiwiaXNCdWZmZXJlZCIsInBsYXkiLCJwbGF5aW5nIiwibG9hZCIsIm9uIiwiX3N0YXJ0UGxheWJhY2siLCJiaW5kIiwicGxheU5leHQiLCJlIiwiZW1pdCIsInBhdXNlIiwiY3VycmVudFRpbWUiLCJzdG9wIiwicmF0aW8iLCJFcnJvciIsImlzTmFOIiwiZHVyYXRpb24iLCJuZXdUaW1lIiwiZ2V0VHJhY2siLCJlcnJvciIsInNvdXJjZSIsInBsYXliYWNrIiwiY3JlYXRlTWVkaWFFbGVtZW50U291cmNlIiwiX2Nvbm5lY3ROb2RlcyIsIm9mZiIsIndpbmRvdyIsIkF1ZGlvQ29udGV4dCIsIndlYmtpdEF1ZGlvQ29udGV4dCIsIl9kZXN0IiwiZGVzdGluYXRpb24iLCJjcmVhdGVHYWluIiwiZXF1YWxpemVyIiwiYW5hbHlzZXIiLCJmaWx0ZXJzIiwidG9Db25uZWN0Tm9kZXMiLCJmaWx0ZXIiLCJuIiwicmVkdWNlIiwicHJldiIsImN1cnIiLCJBdWRpb05vZGUiLCJjb25uZWN0IiwiZ2FpbiIsInZhbHVlIiwibXV0ZSIsInVubXV0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7OztJQUVxQkEsVzs7O0FBQ25CLHlCQUF3QztBQUFBLFFBQTVCQyxNQUE0Qix1RUFBbkIsRUFBbUI7QUFBQSxRQUFmQyxRQUFlLHVF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cEMsWUFBSUQsZ0JBQWdCRSxTQUFoQixJQUE2QkQsZ0JBQWdCQyxTQUFqRCxFQUE0RDtBQUMxREYsZUFBS0csT0FBTCxDQUFhRixJQUFiO0FBQ0Q7QUFDRCxlQUFPQSxJQUFQO0FBQ0QsT0FMRDs7QUFPQSxhQUFPLElBQVA7QUFDRDs7O3dCQS9OZTtBQUNkLGFBQU8sS0FBS3RELFNBQUwsQ0FBZWlCLE9BQXRCO0FBQ0Q7Ozt3QkFFWTtBQUNYLGFBQU8sS0FBS2IsS0FBTCxDQUFXcUQsSUFBWCxDQUFnQkMsS0FBdkI7QUFDRCxLO3NCQVVVQSxLLEVBQU87QUFDaEIsVUFBSUEsUUFBUSxDQUFSLElBQWFBLFFBQVEsQ0FBekIsRUFBNEI7QUFDMUIsY0FBTTdCLE1BQU0scUNBQU4sQ0FBTjtBQUNEO0FBQ0QsVUFBSTZCLFVBQVUsQ0FBZCxFQUFpQjtBQUNmLGFBQUtDLElBQUw7QUFDRCxPQUZELE1BRU8sSUFBSSxLQUFLN0QsS0FBVCxFQUFnQjtBQUNyQixhQUFLOEQsTUFBTDtBQUNEO0FBQ0QsV0FBS3hELEtBQUwsQ0FBV3FELElBQVgsQ0FBZ0JDLEtBQWhCLEdBQXdCQSxLQUF4QjtBQUNEOzs7d0JBbEJlO0FBQ2QsYUFBTyxLQUFLckQsVUFBWjtBQUNEOzs7d0JBRWM7QUFDYixhQUFPLEtBQUtDLFNBQVo7QUFDRDs7Ozs7O2tCQWxDa0JaLFciLCJmaWxlIjoiQXVkaW9QbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGxheWxpc3QgZnJvbSAnLi9QbGF5bGlzdCc7XG5pbXBvcnQgVHJhY2sgZnJvbSAnLi9UcmFjayc7XG5pbXBvcnQgRXZlbnRFbW1pdGVyIGZyb20gJy4vdXRpbHMvRXZlbnRFbW1pdGVyJztcbmltcG9ydCBFcXVhbGl6ZXIgZnJvbSAnLi9FcXVhbGl6ZXInO1xuaW1wb3J0IEFuYWx5c2VyIGZyb20gJy4vQW5hbHlzZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdWRpb1BsYXllciBleHRlbmRzIEV2ZW50RW1taXRlciB7XG4gIGNvbnN0cnVjdG9yKHRyYWNrcyA9IFtdLCBzZXR0aW5ncyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMucGxheWxpc3QgPSBuZXcgUGxheWxpc3QodHJhY2tzKTtcbiAgICB0aGlzLm11dGVkID0gZmFsc2U7XG4gICAgdGhpcy5jdXJyZW50VHJhY2tJbmRleCA9IDA7XG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgIHRoaXMuX3BsYXliYWNrID0ge307XG4gICAgdGhpcy5fcmVzZXRQbGF5YmFja0luZm8oKTtcbiAgICB0aGlzLl9zZXRUcmFjaygpO1xuXG4gICAgLy8gaW5pdCBBdWRpbyBBUEkgTm9kZXNcbiAgICB0aGlzLl9jdHggPSBudWxsO1xuICAgIHRoaXMuX2dhaW4gPSBudWxsO1xuICAgIHRoaXMuX2VxdWFsaXplciA9IG51bGw7XG4gICAgdGhpcy5fYW5hbHlzZXIgPSBudWxsO1xuICAgIHRoaXMuX2NyZWF0ZUF1ZGlvQXBpTm9kZXMoKTtcbiAgfVxuXG4gIGdldCBpc1BsYXlpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BsYXliYWNrLnBsYXlpbmc7XG4gIH1cblxuICBnZXQgdm9sdW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9nYWluLmdhaW4udmFsdWU7XG4gIH1cblxuICBnZXQgZXF1YWxpemVyKCkge1xuICAgIHJldHVybiB0aGlzLl9lcXVhbGl6ZXI7XG4gIH1cblxuICBnZXQgYW5hbHlzZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FuYWx5c2VyO1xuICB9XG5cbiAgc2V0IHZvbHVtZSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA+IDEgJiYgdmFsdWUgPCAwKSB7XG4gICAgICB0aHJvdyBFcnJvcignVm9sdW1lIG11c3QgYmUgaW4gcmFuZ2UgZnJvbSAwIHRvIDEnKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlID09PSAwKSB7XG4gICAgICB0aGlzLm11dGUoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubXV0ZWQpIHtcbiAgICAgIHRoaXMudW5tdXRlKCk7XG4gICAgfVxuICAgIHRoaXMuX2dhaW4uZ2Fpbi52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgcGxheShpZCA9IG51bGwpIHtcbiAgICBpZiAodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudFRyYWNrSW5kZXggPSBpZCB8fCB0aGlzLmN1cnJlbnRUcmFja0luZGV4O1xuXG4gICAgaWYgKCF0aGlzLl9wbGF5YmFjay50cmFjayB8fCB0aGlzLl9wbGF5YmFjay50cmFjay5pZCAhPT0gdGhpcy5jdXJyZW50VHJhY2tJbmRleCkge1xuICAgICAgdGhpcy5fc2V0VHJhY2soKTtcbiAgICB9XG5cbiAgICBjb25zdCB0cmFjayA9IHRoaXMuX3BsYXliYWNrLnRyYWNrO1xuXG4gICAgY29uc29sZS5sb2coYFBsYXlpbmcgdHJhY2sgaWQ9JHt0aGlzLmN1cnJlbnRUcmFja0luZGV4fSAtICR7dHJhY2suc3JjfWApO1xuICAgIGlmICh0cmFjay5hdWRpbyAmJiB0cmFjay5pc0J1ZmZlcmVkKCkpIHtcbiAgICAgIHRyYWNrLmF1ZGlvLnBsYXkoKTtcbiAgICAgIHRoaXMuX3BsYXliYWNrLnBsYXlpbmcgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmFjay5sb2FkKCk7XG4gICAgICAvLyBTdWJzY3JpYmVcbiAgICAgIC8vINGH0LXRgiDQvdC1INC+0LpcbiAgICAgIHRyYWNrLm9uKCdjYW5wbGF5JywgdGhpcy5fc3RhcnRQbGF5YmFjay5iaW5kKHRoaXMpKTtcbiAgICAgIHRyYWNrLm9uKCdlbmRlZCcsIHRoaXMucGxheU5leHQuYmluZCh0aGlzKSk7XG4gICAgICB0cmFjay5vbigncHJvZ3Jlc3MnLCAoZSkgPT4ge1xuICAgICAgICB0aGlzLmVtaXQoJ3RyYWNrOnByb2dyZXNzJywgZSk7XG4gICAgICB9KTtcbiAgICAgIHRyYWNrLm9uKCdsb2FkZWRkYXRhJywgKGUpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KCd0cmFjazpsb2FkZWRkYXRhJywgZSk7XG4gICAgICB9KTtcbiAgICAgIHRyYWNrLm9uKCdjYW5wbGF5dGhyb3VnaCcsIChlKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdCgndHJhY2s6Y2FucGxheXRocm91Z2gnLCBlKTtcbiAgICAgIH0pO1xuICAgICAgdHJhY2sub24oJ2xvYWRlZG1ldGFkYXRhJywgKGUpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KCd0cmFjazpsb2FkZWRtZXRhZGF0YScsIGUpO1xuICAgICAgfSk7XG4gICAgICB0cmFjay5vbigndGltZXVwZGF0ZScsIChlKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdCgndHJhY2s6dGltZXVwZGF0ZScsIGUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuX3BsYXliYWNrLnBsYXlpbmcgPSBmYWxzZTtcbiAgICBjb25zdCB0cmFjayA9IHRoaXMuX3BsYXliYWNrLnRyYWNrO1xuICAgIHRyYWNrLmF1ZGlvLnBhdXNlKCk7XG4gICAgdHJhY2suYXVkaW8uY3VycmVudFRpbWUgPSAwO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwYXVzZSgpIHtcbiAgICB0aGlzLl9wbGF5YmFjay5wbGF5aW5nID0gZmFsc2U7XG4gICAgY29uc3QgdHJhY2sgPSB0aGlzLl9wbGF5YmFjay50cmFjaztcbiAgICB0cmFjay5hdWRpby5wYXVzZSgpO1xuICAgIGNvbnNvbGUubG9nKCdQQVVTRUQnKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbXV0ZSgpIHtcbiAgICB0aGlzLl9wbGF5YmFjay50cmFjay5tdXRlZCA9IHRydWU7XG4gICAgdGhpcy5tdXRlZCA9IHRydWU7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHVubXV0ZSgpIHtcbiAgICB0aGlzLl9wbGF5YmFjay50cmFjay5tdXRlZCA9IGZhbHNlO1xuICAgIHRoaXMubXV0ZWQgPSBmYWxzZTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcGxheU5leHQoKSB7XG4gICAgaWYgKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICB0aGlzLnN0b3AoKTtcbiAgICB9XG4gICAgdGhpcy5fcmVzZXRQbGF5YmFja0luZm8oKTtcblxuICAgIHRoaXMuY3VycmVudFRyYWNrSW5kZXggKz0gMTtcbiAgICB0aGlzLnBsYXkoKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcGxheVByZXYoKSB7XG4gICAgaWYgKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICB0aGlzLnN0b3AoKTtcbiAgICB9XG4gICAgdGhpcy5fcmVzZXRQbGF5YmFja0luZm8oKTtcblxuICAgIHRoaXMuY3VycmVudFRyYWNrSW5kZXggLT0gMTtcbiAgICB0aGlzLnBsYXkoKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmV3aW5kKHJhdGlvKSB7XG4gICAgaWYgKHJhdGlvID4gMSAmJiByYXRpbyA8IDApIHtcbiAgICAgIHRocm93IEVycm9yKCdUbyByZXdpbmQgYXVkaW8sIHJhdGlvIG11c3QgYmUgaW4gcmFuZ2UgZnJvbSAwIHRvIDEnKTtcbiAgICB9XG5cbiAgICBjb25zdCBhdWRpbyA9IHRoaXMuX3BsYXliYWNrLnRyYWNrLmF1ZGlvO1xuICAgIGlmICghaXNOYU4oYXVkaW8uZHVyYXRpb24pKSB7XG4gICAgICBjb25zdCBuZXdUaW1lID0gYXVkaW8uZHVyYXRpb24gKiByYXRpbztcbiAgICAgIGF1ZGlvLmN1cnJlbnRUaW1lID0gbmV3VGltZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9zZXRUcmFjaygpIHtcbiAgICBpZiAodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygnU2V0dGluZyB0cmFjaycsIHRoaXMuY3VycmVudFRyYWNrSW5kZXgpO1xuICAgIC8vIFRPRE86IG5lZWQgdG8gcmVmYWN0b3JpbmcgdGhpc1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9wbGF5YmFjay50cmFjayA9IHRoaXMucGxheWxpc3QuZ2V0VHJhY2sodGhpcy5jdXJyZW50VHJhY2tJbmRleCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIGNvbnNvbGUubG9nKCdDdXJyZW50VHJhY2tJbmRleCByZXNldGVkIHRvIDAnKTtcbiAgICAgIHRoaXMuY3VycmVudFRyYWNrSW5kZXggPSAwO1xuICAgICAgdGhpcy5fcGxheWJhY2sudHJhY2sgPSB0aGlzLnBsYXlsaXN0LmdldFRyYWNrKHRoaXMuY3VycmVudFRyYWNrSW5kZXgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX3Jlc2V0UGxheWJhY2tJbmZvKCkge1xuICAgIHRoaXMuX3BsYXliYWNrID0ge1xuICAgICAgdHJhY2s6IG51bGwsXG4gICAgICBzb3VyY2U6IG51bGwsXG4gICAgICBwbGF5aW5nOiBmYWxzZSxcbiAgICB9O1xuICAgIC8vIGNvbnNvbGUubG9nKCdSRVNFVCBQTEFZQkFDSycpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfc3RhcnRQbGF5YmFjaygpIHtcbiAgICBpZiAodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdBbHJlYWR5IHBsYXlpbmchMScpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29uc3QgcGxheWJhY2sgPSB0aGlzLl9wbGF5YmFjaztcbiAgICBjb25zdCB0cmFjayA9IHRoaXMuX3BsYXliYWNrLnRyYWNrO1xuXG4gICAgcGxheWJhY2suc291cmNlID0gdGhpcy5fY3R4LmNyZWF0ZU1lZGlhRWxlbWVudFNvdXJjZSh0cmFjay5hdWRpbyk7XG4gICAgdGhpcy5fY29ubmVjdE5vZGVzKCk7XG5cbiAgICBjb25zb2xlLmxvZyhgTG9hZGVkIC0gJHtwbGF5YmFjay50cmFjay5zcmN9YCk7XG4gICAgcGxheWJhY2sucGxheWluZyA9IHRydWU7XG4gICAgdHJhY2suYXVkaW8ucGxheSgpO1xuXG4gICAgLy8gVW5zdWJzY3JpYmUgYmVjYXVzZSAnY2FucGxheScgZXZlbnQgdHJpZ2dlcmVkIGJ5IGNoYW5naW5nIHRoZSBjdXJyZW50IHRpbWVcbiAgICB0cmFjay5vZmYoJ2NhbnBsYXknLCB0aGlzLl9zdGFydFBsYXliYWNrLmJpbmQodGhpcykpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfY3JlYXRlQXVkaW9BcGlOb2RlcygpIHtcbiAgICBpZiAoISh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKSByZXR1cm47XG5cbiAgICB0aGlzLl9jdHggPSBuZXcgKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCkoKTtcbiAgICB0aGlzLl9kZXN0ID0gdGhpcy5fY3R4LmRlc3RpbmF0aW9uO1xuICAgIHRoaXMuX2dhaW4gPSB0aGlzLl9jdHguY3JlYXRlR2FpbigpO1xuICAgIHRoaXMuX2VxdWFsaXplciA9IHRoaXMuc2V0dGluZ3MuZXF1YWxpemVyID8gbmV3IEVxdWFsaXplcih0aGlzLl9jdHgpIDogbnVsbDtcbiAgICB0aGlzLl9hbmFseXNlciA9IHRoaXMuc2V0dGluZ3MuYW5hbHlzZXIgPyBuZXcgQW5hbHlzZXIodGhpcy5fY3R4KSA6IG51bGw7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9jb25uZWN0Tm9kZXMoKSB7XG4gICAgY29uc3QgZmlsdGVycyA9IHRoaXMuX2VxdWFsaXplciA/IHRoaXMuX2VxdWFsaXplci5maWx0ZXJzIDogW107XG4gICAgY29uc3QgYW5hbHlzZXIgPSB0aGlzLl9hbmFseXNlciA/IHRoaXMuX2VxdWFsaXplci5hbmFseXNlciA6IG51bGw7XG4gICAgY29uc3QgdG9Db25uZWN0Tm9kZXMgPSBbXG4gICAgICB0aGlzLl9wbGF5YmFjay5zb3VyY2UsXG4gICAgICAuLi5maWx0ZXJzLFxuICAgICAgdGhpcy5fZ2FpbixcbiAgICAgIGFuYWx5c2VyLFxuICAgICAgdGhpcy5fZGVzdCxcbiAgICBdLmZpbHRlcihuID0+IG4pO1xuXG4gICAgdG9Db25uZWN0Tm9kZXMucmVkdWNlKChwcmV2LCBjdXJyKSA9PiB7XG4gICAgICBpZiAocHJldiBpbnN0YW5jZW9mIEF1ZGlvTm9kZSAmJiBjdXJyIGluc3RhbmNlb2YgQXVkaW9Ob2RlKSB7XG4gICAgICAgIHByZXYuY29ubmVjdChjdXJyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdXJyO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cbiJdfQ==
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRyYWNrLmpzIl0sIm5hbWVzIjpbIlRyYWNrIiwiaWQiLCJzcmMiLCJuYW1lIiwiX3NyYyIsIl9uYW1lIiwiX2F1ZGlvIiwiQXVkaW8iLCJfYmluZEV2ZW50cyIsImJ1ZmZlcmVkIiwibGVuZ3RoIiwiY3Jvc3NPcmlnaW4iLCJsb2FkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJlbWl0IiwidmFsdWUiLCJtdXRlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBRXFCQSxLOzs7QUFDbkIsaUJBQVlDLEVBQVosRUFBZ0JDLEdBQWhCLEVBQWdDO0FBQUEsUUFBWEMsSUFBVyx1RUFBSixFQUFJOztBQUFBOztBQUFBOztBQUU5QixVQUFLRixFQUFMLEdBQVVBLEVBQVY7QUFDQSxVQUFLRyxJQUFMLEdBQVlGLEdBQVo7QUFDQSxVQUFLRyxLQUFMLEdBQWFGLElBQWI7QUFDQSxVQUFLRyxNQUFMLEdBQWMsSUFBSUMsS0FBSixFQUFkO0FBQ0EsVUFBS0MsV0FBTDtBQU44QjtBQU8vQjs7OztpQ0FrQlk7QUFDWCxhQUFPLEtBQUtGLE1BQUwsQ0FBWUcsUUFBWixDQUFxQkMsTUFBckIsR0FBOEIsQ0FBckM7QUFDRDs7OzJCQUVNO0FBQ0wsV0FBS0osTUFBTCxDQUFZSyxXQUFaLEdBQTBCLFdBQTFCO0FBQ0EsV0FBS0wsTUFBTCxDQUFZSixHQUFaLEdBQWtCLEtBQUtFLElBQXZCO0FBQ0EsV0FBS0UsTUFBTCxDQUFZTSxJQUFaO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7OztrQ0FFYTtBQUFBOztBQUNaLFdBQUtOLE1BQUwsQ0FBWU8sZ0JBQVosQ0FBNkIsU0FBN0IsRUFBd0MsVUFBQ0MsQ0FBRCxFQUFPO0FBQzdDLGVBQUtDLElBQUwsQ0FBVSxTQUFWLEVBQXFCRCxDQUFyQjtBQUNELE9BRkQ7QUFHQSxXQUFLUixNQUFMLENBQVlPLGdCQUFaLENBQTZCLE9BQTdCLEVBQXNDLFlBQU07QUFDMUMsZUFBS0UsSUFBTCxDQUFVLE9BQVY7QUFDRCxPQUZEO0FBR0EsV0FBS1QsTUFBTCxDQUFZTyxnQkFBWixDQUE2QixVQUE3QixFQUF5QyxVQUFDQyxDQUFELEVBQU87QUFDOUMsZUFBS0MsSUFBTCxDQUFVLFVBQVYsRUFBc0JELENBQXRCO0FBQ0QsT0FGRDtBQUdBLFdBQUtSLE1BQUwsQ0FBWU8sZ0JBQVosQ0FBNkIsWUFBN0IsRUFBMkMsVUFBQ0MsQ0FBRCxFQUFPO0FBQ2hELGVBQUtDLElBQUwsQ0FBVSxZQUFWLEVBQXdCRCxDQUF4QjtBQUNELE9BRkQ7QUFHQSxXQUFLUixNQUFMLENBQVlPLGdCQUFaLENBQTZCLGdCQUE3QixFQUErQyxVQUFDQyxDQUFELEVBQU87QUFDcEQsZUFBS0MsSUFBTCxDQUFVLGdCQUFWLEVBQTRCRCxDQUE1QjtBQUNELE9BRkQ7QUFHQSxXQUFLUixNQUFMLENBQVlPLGdCQUFaLENBQTZCLGdCQUE3QixFQUErQyxVQUFDQyxDQUFELEVBQU87QUFDcEQsZUFBS0MsSUFBTCxDQUFVLGdCQUFWLEVBQTRCRCxDQUE1QjtBQUNELE9BRkQ7QUFHQSxXQUFLUixNQUFMLENBQVlPLGdCQUFaLENBQTZCLFlBQTdCLEVBQTJDLFVBQUNDLENBQUQsRUFBTztBQUNoRCxlQUFLQyxJQUFMLENBQVUsWUFBVixFQUF3QkQsQ0FBeEI7QUFDRCxPQUZEO0FBR0Q7Ozt3QkFqRFM7QUFDUixhQUFPLEtBQUtWLElBQVo7QUFDRDs7O3dCQUVVO0FBQ1QsYUFBTyxLQUFLQyxLQUFaO0FBQ0Q7Ozt3QkFFVztBQUNWLGFBQU8sS0FBS0MsTUFBWjtBQUNEOzs7c0JBRVNVLEssRUFBTztBQUNmLFdBQUtWLE1BQUwsQ0FBWVcsS0FBWixHQUFvQixDQUFDLENBQUNELEtBQXRCO0FBQ0Q7Ozs7OztrQkF4QmtCaEIsSyIsImZpbGUiOiJUcmFjay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFdmVudEVtbWl0ZXIgZnJvbSAnLi91dGlscy9FdmVudEVtbWl0ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFjayBleHRlbmRzIEV2ZW50RW1taXRlciB7XG4gIGNvbnN0cnVjdG9yKGlkLCBzcmMsIG5hbWUgPSAnJykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMuX3NyYyA9IHNyYztcbiAgICB0aGlzLl9uYW1lID0gbmFtZTtcbiAgICB0aGlzLl9hdWRpbyA9IG5ldyBBdWRpbygpO1xuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcbiAgfVxuXG4gIGdldCBzcmMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NyYztcbiAgfVxuXG4gIGdldCBuYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICB9XG5cbiAgZ2V0IGF1ZGlvKCkge1xuICAgIHJldHVybiB0aGlzLl9hdWRpbztcbiAgfVxuXG4gIHNldCBtdXRlZCh2YWx1ZSkge1xuICAgIHRoaXMuX2F1ZGlvLm11dGVkID0gISF2YWx1ZTtcbiAgfVxuXG4gIGlzQnVmZmVyZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F1ZGlvLmJ1ZmZlcmVkLmxlbmd0aCA+IDA7XG4gIH1cblxuICBsb2FkKCkge1xuICAgIHRoaXMuX2F1ZGlvLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cyc7XG4gICAgdGhpcy5fYXVkaW8uc3JjID0gdGhpcy5fc3JjO1xuICAgIHRoaXMuX2F1ZGlvLmxvYWQoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIHRoaXMuX2F1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2NhbnBsYXknLCAoZSkgPT4ge1xuICAgICAgdGhpcy5lbWl0KCdjYW5wbGF5JywgZSk7XG4gICAgfSk7XG4gICAgdGhpcy5fYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCAoKSA9PiB7XG4gICAgICB0aGlzLmVtaXQoJ2VuZGVkJyk7XG4gICAgfSk7XG4gICAgdGhpcy5fYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCAoZSkgPT4ge1xuICAgICAgdGhpcy5lbWl0KCdwcm9ncmVzcycsIGUpO1xuICAgIH0pO1xuICAgIHRoaXMuX2F1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlZGRhdGEnLCAoZSkgPT4ge1xuICAgICAgdGhpcy5lbWl0KCdsb2FkZWRkYXRhJywgZSk7XG4gICAgfSk7XG4gICAgdGhpcy5fYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcignY2FucGxheXRocm91Z2gnLCAoZSkgPT4ge1xuICAgICAgdGhpcy5lbWl0KCdjYW5wbGF5dGhyb3VnaCcsIGUpO1xuICAgIH0pO1xuICAgIHRoaXMuX2F1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlZG1ldGFkYXRhJywgKGUpID0+IHtcbiAgICAgIHRoaXMuZW1pdCgnbG9hZGVkbWV0YWRhdGEnLCBlKTtcbiAgICB9KTtcbiAgICB0aGlzLl9hdWRpby5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgKGUpID0+IHtcbiAgICAgIHRoaXMuZW1pdCgndGltZXVwZGF0ZScsIGUpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=
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

volumeBtn.addEventListener('click', function (e) {
  e.preventDefault();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfZjYyMGU3LmpzIl0sIm5hbWVzIjpbInBsYXlCdG4iLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJwbGF5TmV4dEJ0biIsInBsYXlQcmV2QnRuIiwidm9sdW1lQnRuIiwidm9sdW1lU2xpZGVyTm9kZSIsInByb2dyZXNzQmFyIiwiZXF1YWxpemVyQmFuZHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwidHJhY2tzIiwicGxheWVyIiwiZXF1YWxpemVyIiwiYW5hbHlzZXIiLCJ2b2x1bWUiLCJzZXRWb2x1bWUiLCJ2YWx1ZSIsImljb24iLCJjaGlsZHJlbiIsImNsYXNzTGlzdCIsInJlbW92ZSIsImFkZCIsInZvbHVtZVNsaWRlciIsIm9uY2hhbmdlIiwib25tb3ZlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIm11dGVkIiwidW5tdXRlIiwibXV0ZSIsIm9ud2hlZWxIYW5kbGVyIiwibmV3VmFsdWUiLCJNYXRoIiwic2lnbiIsIndoZWVsRGVsdGFZIiwic2V0VmFsdWUiLCJwcm9ncmVzc1NsaWRlciIsImhhbmRsZSIsImJ1ZmZlciIsInJld2luZCIsInVwZGF0ZUJ1ZmZlciIsImF1ZGlvIiwidGFyZ2V0IiwiYnVmZmVyZWQiLCJidWZmUmF0aW8iLCJsZW5ndGgiLCJlbmQiLCJkdXJhdGlvbiIsInNldEJ1ZmZlciIsIm9uIiwicmF0aW8iLCJjdXJyZW50VGltZSIsImlzUGxheWluZyIsInBsYXkiLCJwYXVzZSIsInBsYXlOZXh0IiwicGxheVByZXYiLCJmb3JFYWNoIiwiYmFuZCIsImkiLCJmaWx0ZXJWYWx1ZSIsImdldEZpbHRlckdhaW4iLCJiYW5kU2xpZGVyIiwidmVydGljYWwiLCJtaW4iLCJtYXgiLCJjaGFuZ2VGaWx0ZXJHYWluIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFVBQVVDLFNBQVNDLGFBQVQsQ0FBdUIsNEJBQXZCLENBQWhCO0FBQ0EsSUFBTUMsY0FBY0YsU0FBU0MsYUFBVCxDQUF1Qiw0QkFBdkIsQ0FBcEI7QUFDQSxJQUFNRSxjQUFjSCxTQUFTQyxhQUFULENBQXVCLDRCQUF2QixDQUFwQjs7QUFFQSxJQUFNRyxZQUFZSixTQUFTQyxhQUFULENBQXVCLGNBQXZCLENBQWxCO0FBQ0EsSUFBTUksbUJBQW1CTCxTQUFTQyxhQUFULENBQXVCLGlCQUF2QixDQUF6Qjs7QUFFQSxJQUFNSyxjQUFjTixTQUFTQyxhQUFULENBQXVCLGdCQUF2QixDQUFwQjs7QUFFQSxJQUFNTSxpQkFBaUJQLFNBQVNRLGdCQUFULENBQTBCLHlCQUExQixDQUF2Qjs7QUFFQSxJQUFNQyxTQUFTLENBQ2Isc0VBRGEsRUFFYiw2QkFGYSxFQUdiLGdDQUhhLEVBSWIsK0JBSmEsRUFLYix1QkFMYSxFQU1iLGdDQU5hLENBQWY7O0FBU0EsSUFBTUMsU0FBUywwQkFBZ0JELE1BQWhCLEVBQXdCLEVBQUVFLFdBQVcsSUFBYixFQUFtQkMsVUFBVSxLQUE3QixFQUF4QixDQUFmO0FBQ0FGLE9BQU9HLE1BQVAsR0FBZ0IsR0FBaEI7O0FBRUE7QUFDQSxJQUFNQyxZQUFZLFNBQVpBLFNBQVksQ0FBQ0MsS0FBRCxFQUFXO0FBQzNCLE1BQU1DLE9BQU9aLFVBQVVhLFFBQVYsQ0FBbUIsQ0FBbkIsQ0FBYjtBQUNBLE1BQUlGLFVBQVUsQ0FBZCxFQUFpQjtBQUNmQyxTQUFLRSxTQUFMLENBQWVDLE1BQWYsQ0FBc0IsbUJBQXRCO0FBQ0FILFNBQUtFLFNBQUwsQ0FBZUUsR0FBZixDQUFtQixtQkFBbkI7QUFDRDtBQUNELE1BQUlMLFFBQVEsQ0FBUixJQUFhQSxTQUFTLEdBQTFCLEVBQStCO0FBQzdCQyxTQUFLRSxTQUFMLENBQWVDLE1BQWYsQ0FBc0IsbUJBQXRCO0FBQ0FILFNBQUtFLFNBQUwsQ0FBZUUsR0FBZixDQUFtQixtQkFBbkI7QUFDRDtBQUNELE1BQUlMLFFBQVEsR0FBWixFQUFpQjtBQUNmQyxTQUFLRSxTQUFMLENBQWVDLE1BQWYsQ0FBc0IsbUJBQXRCO0FBQ0FILFNBQUtFLFNBQUwsQ0FBZUMsTUFBZixDQUFzQixtQkFBdEI7QUFDRDtBQUNEVCxTQUFPRyxNQUFQLEdBQWdCRSxLQUFoQjtBQUNELENBZkQ7O0FBaUJBLElBQU1NLGVBQWUsMEJBQWdCaEIsZ0JBQWhCLEVBQWtDO0FBQ3JEVSxTQUFPTCxPQUFPRyxNQUR1QztBQUVyRFMsWUFBVVIsU0FGMkM7QUFHckRTLFVBQVFUO0FBSDZDLENBQWxDLENBQXJCOztBQU1BVixVQUFVb0IsZ0JBQVYsQ0FBMkIsT0FBM0IsRUFBb0MsVUFBQ0MsQ0FBRCxFQUFPO0FBQ3pDQSxJQUFFQyxjQUFGO0FBQ0EsTUFBTVYsT0FBT1osVUFBVWEsUUFBVixDQUFtQixDQUFuQixDQUFiO0FBQ0EsTUFBSVAsT0FBT2lCLEtBQVgsRUFBa0I7QUFDaEJqQixXQUFPa0IsTUFBUDtBQUNBWixTQUFLRSxTQUFMLENBQWVDLE1BQWYsQ0FBc0IsbUJBQXRCO0FBQ0QsR0FIRCxNQUdPO0FBQ0xULFdBQU9tQixJQUFQO0FBQ0FiLFNBQUtFLFNBQUwsQ0FBZUUsR0FBZixDQUFtQixtQkFBbkI7QUFDRDtBQUNGLENBVkQ7O0FBWUE7QUFDQSxJQUFNVSxpQkFBaUIsU0FBakJBLGNBQWlCLENBQUNMLENBQUQsRUFBTztBQUM1QkEsSUFBRUMsY0FBRjtBQUNBLE1BQU1LLFdBQVdyQixPQUFPRyxNQUFQLEdBQWlCbUIsS0FBS0MsSUFBTCxDQUFVUixFQUFFUyxXQUFaLElBQTJCLElBQTdEO0FBQ0FiLGVBQWFjLFFBQWIsQ0FBc0JKLFFBQXRCO0FBQ0FyQixTQUFPRyxNQUFQLEdBQWdCa0IsUUFBaEI7QUFDRCxDQUxEOztBQU9BM0IsVUFBVW9CLGdCQUFWLENBQTJCLE9BQTNCLEVBQW9DTSxjQUFwQztBQUNBekIsaUJBQWlCbUIsZ0JBQWpCLENBQWtDLE9BQWxDLEVBQTJDTSxjQUEzQzs7QUFFQTtBQUNBLElBQU1NLGlCQUFpQiwwQkFBZ0I5QixXQUFoQixFQUE2QjtBQUNsRCtCLFVBQVEsS0FEMEM7QUFFbERDLFVBQVEsSUFGMEM7QUFHbERoQixZQUFVLGtCQUFDUCxLQUFELEVBQVc7QUFDbkJMLFdBQU82QixNQUFQLENBQWN4QixLQUFkO0FBQ0Q7QUFMaUQsQ0FBN0IsQ0FBdkI7O0FBUUEsSUFBTXlCLGVBQWUsU0FBZkEsWUFBZSxDQUFDZixDQUFELEVBQU87QUFDMUIsTUFBTWdCLFFBQVFoQixFQUFFaUIsTUFBaEI7QUFDQSxNQUFNQyxXQUFXRixNQUFNRSxRQUF2QjtBQUNBLE1BQU1DLFlBQVlELFNBQVNFLE1BQVQsR0FBa0JGLFNBQVNHLEdBQVQsQ0FBYUgsU0FBU0UsTUFBVCxHQUFrQixDQUEvQixJQUFvQ0osTUFBTU0sUUFBNUQsR0FBdUUsQ0FBekY7O0FBRUFYLGlCQUFlWSxTQUFmLENBQXlCSixTQUF6QjtBQUNELENBTkQ7O0FBUUFsQyxPQUFPdUMsRUFBUCxDQUFVLGdCQUFWLEVBQTRCVCxZQUE1QjtBQUNBOUIsT0FBT3VDLEVBQVAsQ0FBVSxrQkFBVixFQUE4QlQsWUFBOUI7QUFDQTlCLE9BQU91QyxFQUFQLENBQVUsc0JBQVYsRUFBa0NULFlBQWxDO0FBQ0E5QixPQUFPdUMsRUFBUCxDQUFVLGtCQUFWLEVBQThCLFVBQUN4QixDQUFELEVBQU87QUFDbkMsTUFBTWdCLFFBQVFoQixFQUFFaUIsTUFBaEI7QUFDQSxNQUFNUSxRQUFRVCxNQUFNVSxXQUFOLEdBQW9CVixNQUFNTSxRQUF4QztBQUNBWCxpQkFBZUQsUUFBZixDQUF3QmUsS0FBeEI7QUFDRCxDQUpEOztBQU9BO0FBQ0FuRCxRQUFReUIsZ0JBQVIsQ0FBeUIsT0FBekIsRUFBa0MsWUFBTTtBQUN0QyxNQUFJLENBQUNkLE9BQU8wQyxTQUFaLEVBQXVCO0FBQ3JCckQsWUFBUW1CLFNBQVIsQ0FBa0JFLEdBQWxCLENBQXNCLDRCQUF0QjtBQUNBVixXQUFPMkMsSUFBUDtBQUNELEdBSEQsTUFHTztBQUNMdEQsWUFBUW1CLFNBQVIsQ0FBa0JDLE1BQWxCLENBQXlCLDRCQUF6QjtBQUNBVCxXQUFPNEMsS0FBUDtBQUNEO0FBQ0YsQ0FSRDs7QUFVQXBELFlBQVlzQixnQkFBWixDQUE2QixPQUE3QixFQUFzQyxZQUFNO0FBQzFDekIsVUFBUW1CLFNBQVIsQ0FBa0JFLEdBQWxCLENBQXNCLDRCQUF0QjtBQUNBVixTQUFPNkMsUUFBUDtBQUNELENBSEQ7O0FBS0FwRCxZQUFZcUIsZ0JBQVosQ0FBNkIsT0FBN0IsRUFBc0MsWUFBTTtBQUMxQ3pCLFVBQVFtQixTQUFSLENBQWtCRSxHQUFsQixDQUFzQiw0QkFBdEI7QUFDQVYsU0FBTzhDLFFBQVA7QUFDRCxDQUhEOztBQUtBO0FBQ0FqRCxlQUFla0QsT0FBZixDQUF1QixVQUFDQyxJQUFELEVBQU9DLENBQVAsRUFBYTtBQUNsQyxNQUFNQyxjQUFjbEQsT0FBT0MsU0FBUCxDQUFpQmtELGFBQWpCLENBQStCRixDQUEvQixDQUFwQjtBQUNBLE1BQU1HLGFBQWEsMEJBQWdCSixJQUFoQixFQUFzQjtBQUN2Q0ssY0FBVSxJQUQ2QjtBQUV2Q0MsU0FBSyxDQUFDLEVBRmlDO0FBR3ZDQyxTQUFLLEVBSGtDO0FBSXZDbEQsV0FBTzZDLFdBSmdDO0FBS3ZDdEMsY0FBVSxrQkFBQ1AsS0FBRCxFQUFXO0FBQ25CTCxhQUFPQyxTQUFQLENBQWlCdUQsZ0JBQWpCLENBQWtDUCxDQUFsQyxFQUFxQzVDLEtBQXJDO0FBQ0QsS0FQc0M7QUFRdkNRLFlBQVEsZ0JBQUNSLEtBQUQsRUFBVztBQUNqQkwsYUFBT0MsU0FBUCxDQUFpQnVELGdCQUFqQixDQUFrQ1AsQ0FBbEMsRUFBcUM1QyxLQUFyQztBQUNEO0FBVnNDLEdBQXRCLENBQW5CO0FBWUQsQ0FkRCIsImZpbGUiOiJmYWtlX2Y2MjBlNy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBdWRpb1BsYXllciBmcm9tICcuL0F1ZGlvUGxheWVyJztcbmltcG9ydCBSYW5nZVNsaWRlciBmcm9tICcuL3V0aWxzL1JhbmdlU2xpZGVyJztcblxuY29uc3QgcGxheUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9wbGF5Jyk7XG5jb25zdCBwbGF5TmV4dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9uZXh0Jyk7XG5jb25zdCBwbGF5UHJldkJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9wcmV2Jyk7XG5cbmNvbnN0IHZvbHVtZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52b2x1bWVfX2J0bicpO1xuY29uc3Qgdm9sdW1lU2xpZGVyTm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52b2x1bWVfX3NsaWRlcicpO1xuXG5jb25zdCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmVzc19fYmFyJyk7XG5cbmNvbnN0IGVxdWFsaXplckJhbmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmVxdWFsaXplci1iYW5kX19zbGlkZXInKTtcblxuY29uc3QgdHJhY2tzID0gW1xuICAnaHR0cDovL2ZyZXNobHktZ3JvdW5kLmNvbS9kYXRhL2F1ZGlvL21wYy8yMDA5MDIwNyUyMC0lMjBMb3Zlcm1hbi5tcDMnLFxuICAnLi8uLi9tZWRpYS8wMiAtIE5lZWRsZXMubXAzJyxcbiAgJy4vLi4vbWVkaWEvMDMgLSBEZWVyIERhbmNlLm1wMycsXG4gICcuLy4uL21lZGlhLzA0IC0gSmV0IFBpbG90Lm1wMycsXG4gICcuLy4uL21lZGlhLzA1IC0gWC5tcDMnLFxuICAnLi8uLi9tZWRpYS8wNiAtIENob3AgU3VleSEubXAzJyxcbl07XG5cbmNvbnN0IHBsYXllciA9IG5ldyBBdWRpb1BsYXllcih0cmFja3MsIHsgZXF1YWxpemVyOiB0cnVlLCBhbmFseXNlcjogZmFsc2UgfSk7XG5wbGF5ZXIudm9sdW1lID0gMC41O1xuXG4vLyBWb2x1bWUgc2V0dGluZ3NcbmNvbnN0IHNldFZvbHVtZSA9ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBpY29uID0gdm9sdW1lQnRuLmNoaWxkcmVuWzBdO1xuICBpZiAodmFsdWUgPT09IDApIHtcbiAgICBpY29uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZvbHVtZV9faWNvbl9oYWxmJyk7XG4gICAgaWNvbi5jbGFzc0xpc3QuYWRkKCd2b2x1bWVfX2ljb25fbXV0ZScpO1xuICB9XG4gIGlmICh2YWx1ZSA+IDAgJiYgdmFsdWUgPD0gMC41KSB7XG4gICAgaWNvbi5jbGFzc0xpc3QucmVtb3ZlKCd2b2x1bWVfX2ljb25fbXV0ZScpO1xuICAgIGljb24uY2xhc3NMaXN0LmFkZCgndm9sdW1lX19pY29uX2hhbGYnKTtcbiAgfVxuICBpZiAodmFsdWUgPiAwLjUpIHtcbiAgICBpY29uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZvbHVtZV9faWNvbl9tdXRlJyk7XG4gICAgaWNvbi5jbGFzc0xpc3QucmVtb3ZlKCd2b2x1bWVfX2ljb25faGFsZicpO1xuICB9XG4gIHBsYXllci52b2x1bWUgPSB2YWx1ZTtcbn07XG5cbmNvbnN0IHZvbHVtZVNsaWRlciA9IG5ldyBSYW5nZVNsaWRlcih2b2x1bWVTbGlkZXJOb2RlLCB7XG4gIHZhbHVlOiBwbGF5ZXIudm9sdW1lLFxuICBvbmNoYW5nZTogc2V0Vm9sdW1lLFxuICBvbm1vdmU6IHNldFZvbHVtZSxcbn0pO1xuXG52b2x1bWVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGNvbnN0IGljb24gPSB2b2x1bWVCdG4uY2hpbGRyZW5bMF07XG4gIGlmIChwbGF5ZXIubXV0ZWQpIHtcbiAgICBwbGF5ZXIudW5tdXRlKCk7XG4gICAgaWNvbi5jbGFzc0xpc3QucmVtb3ZlKCd2b2x1bWVfX2ljb25fbXV0ZScpO1xuICB9IGVsc2Uge1xuICAgIHBsYXllci5tdXRlKCk7XG4gICAgaWNvbi5jbGFzc0xpc3QuYWRkKCd2b2x1bWVfX2ljb25fbXV0ZScpO1xuICB9XG59KTtcblxuLy8gTW91c2VTY3JvbGwgZXZlbnQgaGFuZGxlciB0byBjb250cm9sIHRoZSB2b2x1bWVcbmNvbnN0IG9ud2hlZWxIYW5kbGVyID0gKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBjb25zdCBuZXdWYWx1ZSA9IHBsYXllci52b2x1bWUgKyAoTWF0aC5zaWduKGUud2hlZWxEZWx0YVkpICogMC4wNSk7XG4gIHZvbHVtZVNsaWRlci5zZXRWYWx1ZShuZXdWYWx1ZSk7XG4gIHBsYXllci52b2x1bWUgPSBuZXdWYWx1ZTtcbn07XG5cbnZvbHVtZUJ0bi5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIG9ud2hlZWxIYW5kbGVyKTtcbnZvbHVtZVNsaWRlck5vZGUuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCBvbndoZWVsSGFuZGxlcik7XG5cbi8vIFByb2dyZXNzIHNldHRpbmdzXG5jb25zdCBwcm9ncmVzc1NsaWRlciA9IG5ldyBSYW5nZVNsaWRlcihwcm9ncmVzc0Jhciwge1xuICBoYW5kbGU6IGZhbHNlLFxuICBidWZmZXI6IHRydWUsXG4gIG9uY2hhbmdlOiAodmFsdWUpID0+IHtcbiAgICBwbGF5ZXIucmV3aW5kKHZhbHVlKTtcbiAgfSxcbn0pO1xuXG5jb25zdCB1cGRhdGVCdWZmZXIgPSAoZSkgPT4ge1xuICBjb25zdCBhdWRpbyA9IGUudGFyZ2V0O1xuICBjb25zdCBidWZmZXJlZCA9IGF1ZGlvLmJ1ZmZlcmVkO1xuICBjb25zdCBidWZmUmF0aW8gPSBidWZmZXJlZC5sZW5ndGggPyBidWZmZXJlZC5lbmQoYnVmZmVyZWQubGVuZ3RoIC0gMSkgLyBhdWRpby5kdXJhdGlvbiA6IDA7XG5cbiAgcHJvZ3Jlc3NTbGlkZXIuc2V0QnVmZmVyKGJ1ZmZSYXRpbyk7XG59O1xuXG5wbGF5ZXIub24oJ3RyYWNrOnByb2dyZXNzJywgdXBkYXRlQnVmZmVyKTtcbnBsYXllci5vbigndHJhY2s6bG9hZGVkZGF0YScsIHVwZGF0ZUJ1ZmZlcik7XG5wbGF5ZXIub24oJ3RyYWNrOmNhbnBsYXl0aHJvdWdoJywgdXBkYXRlQnVmZmVyKTtcbnBsYXllci5vbigndHJhY2s6dGltZXVwZGF0ZScsIChlKSA9PiB7XG4gIGNvbnN0IGF1ZGlvID0gZS50YXJnZXQ7XG4gIGNvbnN0IHJhdGlvID0gYXVkaW8uY3VycmVudFRpbWUgLyBhdWRpby5kdXJhdGlvbjtcbiAgcHJvZ3Jlc3NTbGlkZXIuc2V0VmFsdWUocmF0aW8pO1xufSk7XG5cblxuLy8gUGxheWVyIGNvbnRyb2xzIHNldHRpbmdzXG5wbGF5QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICBpZiAoIXBsYXllci5pc1BsYXlpbmcpIHtcbiAgICBwbGF5QnRuLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250cm9sc19fYnRuX3BhdXNlJyk7XG4gICAgcGxheWVyLnBsYXkoKTtcbiAgfSBlbHNlIHtcbiAgICBwbGF5QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3BsYXllci1jb250cm9sc19fYnRuX3BhdXNlJyk7XG4gICAgcGxheWVyLnBhdXNlKCk7XG4gIH1cbn0pO1xuXG5wbGF5TmV4dEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgcGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udHJvbHNfX2J0bl9wYXVzZScpO1xuICBwbGF5ZXIucGxheU5leHQoKTtcbn0pO1xuXG5wbGF5UHJldkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgcGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udHJvbHNfX2J0bl9wYXVzZScpO1xuICBwbGF5ZXIucGxheVByZXYoKTtcbn0pO1xuXG4vLyBFcXVhbGl6ZXIgc2V0dGluZ3NcbmVxdWFsaXplckJhbmRzLmZvckVhY2goKGJhbmQsIGkpID0+IHtcbiAgY29uc3QgZmlsdGVyVmFsdWUgPSBwbGF5ZXIuZXF1YWxpemVyLmdldEZpbHRlckdhaW4oaSk7XG4gIGNvbnN0IGJhbmRTbGlkZXIgPSBuZXcgUmFuZ2VTbGlkZXIoYmFuZCwge1xuICAgIHZlcnRpY2FsOiB0cnVlLFxuICAgIG1pbjogLTEyLFxuICAgIG1heDogMTIsXG4gICAgdmFsdWU6IGZpbHRlclZhbHVlLFxuICAgIG9uY2hhbmdlOiAodmFsdWUpID0+IHtcbiAgICAgIHBsYXllci5lcXVhbGl6ZXIuY2hhbmdlRmlsdGVyR2FpbihpLCB2YWx1ZSk7XG4gICAgfSxcbiAgICBvbm1vdmU6ICh2YWx1ZSkgPT4ge1xuICAgICAgcGxheWVyLmVxdWFsaXplci5jaGFuZ2VGaWx0ZXJHYWluKGksIHZhbHVlKTtcbiAgICB9LFxuICB9KTtcbn0pO1xuIl19
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50RW1taXRlci5qcyJdLCJuYW1lcyI6WyJFdmVudEVtbWl0ZXIiLCJfZXZlbnRzIiwiZXZlbnQiLCJjYiIsIkVycm9yIiwicHVzaCIsImNhbGxiYWNrcyIsImZvckVhY2giLCJjYWxsYmFjayIsImkiLCJ0b1N0cmluZyIsInNwbGljZSIsImFyZ3MiLCJzbGljZSIsImFwcGx5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQXFCQSxZO0FBQ25CLDBCQUFjO0FBQUE7O0FBQ1osU0FBS0MsT0FBTCxHQUFlLEVBQWY7QUFDRDs7Ozt1QkFFRUMsSyxFQUFPQyxFLEVBQUk7QUFDWixVQUFJLE9BQU9BLEVBQVAsS0FBYyxXQUFsQixFQUErQjtBQUM3QixjQUFNQyxNQUFNLHNDQUFOLENBQU47QUFDRDs7QUFFRCxVQUFJLE9BQU9ELEVBQVAsS0FBYyxVQUFsQixFQUE4QjtBQUM1QixjQUFNQyxNQUFNLDZCQUFOLENBQU47QUFDRDs7QUFFRCxXQUFLSCxPQUFMLENBQWFDLEtBQWIsSUFBc0IsS0FBS0QsT0FBTCxDQUFhQyxLQUFiLEtBQXVCLEVBQTdDO0FBQ0EsV0FBS0QsT0FBTCxDQUFhQyxLQUFiLEVBQW9CRyxJQUFwQixDQUF5QkYsRUFBekI7O0FBRUEsYUFBTyxJQUFQO0FBQ0Q7Ozt3QkFFR0QsSyxFQUFPQyxFLEVBQUk7QUFDYixVQUFJLE9BQU9BLEVBQVAsS0FBYyxXQUFsQixFQUErQjtBQUM3QixjQUFNQyxNQUFNLHNDQUFOLENBQU47QUFDRDs7QUFFRCxVQUFJLE9BQU9ELEVBQVAsS0FBYyxVQUFsQixFQUE4QjtBQUM1QixjQUFNQyxNQUFNLDZCQUFOLENBQU47QUFDRDs7QUFFRCxVQUFJLE9BQU8sS0FBS0gsT0FBTCxDQUFhQyxLQUFiLENBQVAsS0FBK0IsV0FBbkMsRUFBZ0Q7QUFDOUMsY0FBTUUsTUFBTSxpQkFBTixDQUFOO0FBQ0Q7O0FBRUQsVUFBTUUsWUFBWSxLQUFLTCxPQUFMLENBQWFDLEtBQWIsQ0FBbEI7QUFDQUksZ0JBQVVDLE9BQVYsQ0FBa0IsVUFBQ0MsUUFBRCxFQUFXQyxDQUFYLEVBQWlCO0FBQ2pDLFlBQUlELFNBQVNFLFFBQVQsT0FBd0JQLEdBQUdPLFFBQUgsRUFBNUIsRUFBMkM7QUFDekNKLG9CQUFVSyxNQUFWLENBQWlCRixDQUFqQixFQUFvQixDQUFwQjtBQUNEO0FBQ0YsT0FKRDs7QUFNQSxhQUFPLElBQVA7QUFDRDs7O3lCQUVJUCxLLEVBQWdCO0FBQUE7O0FBQUEsd0NBQU5VLElBQU07QUFBTkEsWUFBTTtBQUFBOztBQUNuQixVQUFJLE9BQU9WLEtBQVAsS0FBaUIsV0FBckIsRUFBa0M7QUFDaEMsY0FBTUUsTUFBTSxtQ0FBTixDQUFOO0FBQ0Q7O0FBRUQsVUFBSUUsWUFBWSxLQUFLTCxPQUFMLENBQWFDLEtBQWIsQ0FBaEI7QUFDQSxVQUFJLE9BQU9JLFNBQVAsS0FBcUIsV0FBekIsRUFBc0M7QUFDcENBLG9CQUFZQSxVQUFVTyxLQUFWLEVBQVo7O0FBRUFQLGtCQUFVQyxPQUFWLENBQWtCLFVBQUNKLEVBQUQsRUFBS00sQ0FBTCxFQUFXO0FBQzNCTixhQUFHVyxLQUFILFFBQWVGLElBQWY7QUFDRCxTQUZEO0FBR0Q7O0FBRUQsYUFBTyxJQUFQO0FBQ0Q7Ozs7OztrQkExRGtCWixZIiwiZmlsZSI6IkV2ZW50RW1taXRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50RW1taXRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2V2ZW50cyA9IFtdO1xuICB9XG5cbiAgb24oZXZlbnQsIGNiKSB7XG4gICAgaWYgKHR5cGVvZiBjYiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IEVycm9yKCdZb3UgbXVzdCBwcm92aWRlIGEgY2FsbGJhY2sgZnVuY3Rpb24nKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBFcnJvcignQ2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50XSA9IHRoaXMuX2V2ZW50c1tldmVudF0gfHwgW107XG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50XS5wdXNoKGNiKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgb2ZmKGV2ZW50LCBjYikge1xuICAgIGlmICh0eXBlb2YgY2IgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBFcnJvcignWW91IG11c3QgcHJvdmlkZSBhIGNhbGxiYWNrIGZ1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgRXJyb3IoJ0NhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGhpcy5fZXZlbnRzW2V2ZW50XSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IEVycm9yKCdFdmVudCBub3QgZm91bmQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBjYWxsYmFja3MgPSB0aGlzLl9ldmVudHNbZXZlbnRdO1xuICAgIGNhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaywgaSkgPT4ge1xuICAgICAgaWYgKGNhbGxiYWNrLnRvU3RyaW5nKCkgPT09IGNiLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZW1pdChldmVudCwgLi4uYXJncykge1xuICAgIGlmICh0eXBlb2YgZXZlbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBFcnJvcignWW91IG11c3QgcHJvdmlkZSBhbiBldmVudCB0byBlbWl0Jyk7XG4gICAgfVxuXG4gICAgbGV0IGNhbGxiYWNrcyA9IHRoaXMuX2V2ZW50c1tldmVudF07XG4gICAgaWYgKHR5cGVvZiBjYWxsYmFja3MgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoKTtcblxuICAgICAgY2FsbGJhY2tzLmZvckVhY2goKGNiLCBpKSA9PiB7XG4gICAgICAgIGNiLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cbiJdfQ==
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
          // left mouse button
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJhbmdlU2xpZGVyLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRzIiwibWluIiwibWF4IiwidmFsdWUiLCJ2ZXJ0aWNhbCIsImhhbmRsZSIsImJ1ZmZlciIsIlJhbmdlU2xpZGVyIiwibm9kZSIsIm9wdGlvbnMiLCJPYmplY3QiLCJhc3NpZ24iLCJ0cmFjayIsImZpbGwiLCJsZW5ndGgiLCJNYXRoIiwiYWJzIiwicmF0aW8iLCJkcmFnZ2FibGUiLCJvbm1vdmUiLCJvbmNoYW5nZSIsIm9uZHJhZ3N0YXJ0IiwiX2NyZWF0ZURPTSIsIl9iaW5kRXZlbnRzIiwic2V0VmFsdWUiLCJ2YWxpZFZhbHVlIiwiX3VwZGF0ZUZpbGwiLCJ2YWxpZFJhdGlvIiwic3R5bGUiLCJoZWlnaHQiLCJ3aWR0aCIsImUiLCJwb3MiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJjbGllbnRZIiwidG9wIiwib2Zmc2V0SGVpZ2h0IiwiY2xpZW50WCIsImxlZnQiLCJvZmZzZXRXaWR0aCIsInNldFZhbHVlQnlSYXRpbyIsImFkZEV2ZW50TGlzdGVuZXIiLCJ3aGljaCIsIl91cGRhdGVWYWx1ZSIsImRvY3VtZW50IiwibWFpbkNsYXNzTmFtZSIsImNsYXNzTGlzdCIsImFkZCIsImNyZWF0ZUVsZW1lbnQiLCJhdHRycyIsImNsYXNzIiwicGFyZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFdBQVc7QUFDZkMsT0FBSyxDQURVO0FBRWZDLE9BQUssQ0FGVTtBQUdmQyxTQUFPLENBSFE7QUFJZkMsWUFBVSxLQUpLO0FBS2ZDLFVBQVEsSUFMTztBQU1mQyxVQUFRO0FBTk8sQ0FBakI7O0lBU3FCQyxXO0FBQ25CLHVCQUFZQyxJQUFaLEVBQWdDO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJOztBQUFBOztBQUM5QixTQUFLRCxJQUFMLEdBQVlBLElBQVo7QUFDQSxTQUFLQyxPQUFMLEdBQWVDLE9BQU9DLE1BQVAsQ0FBY0QsT0FBT0Ms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UUFBTCxHQUFnQixhQUFoQixHQUFnQyxjQUF0RDtBQUNBLFdBQUtJLElBQUwsQ0FBVXNDLFNBQVYsQ0FBb0JDLEdBQXBCLENBQXdCRixhQUF4QjtBQUNBLFdBQUtqQyxLQUFMLEdBQWEscUJBQVdvQyxhQUFYLENBQXlCLEtBQXpCLEVBQWdDO0FBQzNDQyxlQUFPO0FBQ0xDLGlCQUFVTCxhQUFWO0FBREssU0FEb0M7QUFJM0NNLGdCQUFRLEtBQUszQztBQUo4QixPQUFoQyxDQUFiO0FBTUEsV0FBS0ssSUFBTCxHQUFZLHFCQUFXbUMsYUFBWCxDQUF5QixLQUF6QixFQUFnQztBQUMxQ0MsZUFBTztBQUNMQyxpQkFBVUwsYUFBVjtBQURLLFNBRG1DO0FBSTFDTSxnQkFBUSxLQUFLdkM7QUFKNkIsT0FBaEMsQ0FBWjtBQU1BLFVBQUksS0FBS0gsT0FBTCxDQUFhSixNQUFqQixFQUF5QjtBQUN2QixhQUFLQSxNQUFMLEdBQWMscUJBQVcyQyxhQUFYLENBQXlCLEtBQXpCLEVBQWdDO0FBQzVDQyxpQkFBTztBQUNMQyxtQkFBVUwsYUFBVjtBQURLLFdBRHFDO0FBSTVDTSxrQkFBUSxLQUFLdEM7QUFKK0IsU0FBaEMsQ0FBZDtBQU1EO0FBQ0QsVUFBSSxLQUFLSixPQUFMLENBQWFILE1BQWpCLEVBQXlCO0FBQ3ZCLGFBQUtBLE1BQUwsR0FBYyxxQkFBVzBDLGFBQVgsQ0FBeUIsS0FBekIsRUFBZ0M7QUFDNUNDLGlCQUFPO0FBQ0xDLG1CQUFVTCxhQUFWO0FBREssV0FEcUM7QUFJNUNNLGtCQUFRLEtBQUt2QztBQUorQixTQUFoQyxDQUFkO0FBTUQ7QUFDRjs7Ozs7O2tCQXJKa0JMLFciLCJmaWxlIjoiUmFuZ2VTbGlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRE9NQnVpbGRlciBmcm9tICcuL0RPTUJ1aWxkZXInO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiwgdmFsaWRhdGVJblJhbmdlIH0gZnJvbSAnLi8nO1xuaW1wb3J0ICcuL09iamVjdEFzc2lnbic7XG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICBtaW46IDAsXG4gIG1heDogMSxcbiAgdmFsdWU6IDAsXG4gIHZlcnRpY2FsOiBmYWxzZSxcbiAgaGFuZGxlOiB0cnVlLFxuICBidWZmZXI6IGZhbHNlLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmFuZ2VTbGlkZXIge1xuICBjb25zdHJ1Y3Rvcihub2RlLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLm5vZGUgPSBub2RlO1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMpLCBvcHRpb25zKTtcblxuICAgIHRoaXMudHJhY2sgPSBudWxsO1xuICAgIHRoaXMuZmlsbCA9IG51bGw7XG4gICAgdGhpcy5oYW5kbGUgPSBudWxsO1xuICAgIHRoaXMuYnVmZmVyID0gbnVsbDtcblxuICAgIHRoaXMudmVydGljYWwgPSB0aGlzLm9wdGlvbnMudmVydGljYWw7XG5cbiAgICB0aGlzLm1pbiA9IHRoaXMub3B0aW9ucy5taW47XG4gICAgdGhpcy5tYXggPSB0aGlzLm9wdGlvbnMubWF4O1xuICAgIHRoaXMubGVuZ3RoID0gTWF0aC5hYnModGhpcy5taW4pICsgTWF0aC5hYnModGhpcy5tYXgpO1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLm9wdGlvbnMudmFsdWU7XG4gICAgdGhpcy5yYXRpbyA9IG51bGw7XG5cbiAgICB0aGlzLmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgIHRoaXMub25tb3ZlID0gdGhpcy5vcHRpb25zLm9ubW92ZTtcbiAgICB0aGlzLm9uY2hhbmdlID0gdGhpcy5vcHRpb25zLm9uY2hhbmdlO1xuICAgIC8vIGNocm9tZSBidWcgd2l0aCBtb3VzZW1vdmVcbiAgICB0aGlzLm5vZGUub25kcmFnc3RhcnQgPSAoKSA9PiBmYWxzZTtcblxuICAgIHRoaXMuX2NyZWF0ZURPTSgpO1xuICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcbiAgICB0aGlzLnNldFZhbHVlKHRoaXMudmFsdWUpO1xuICB9XG5cbiAgc2V0VmFsdWUodmFsdWUpIHtcbiAgICBjb25zdCB2YWxpZFZhbHVlID0gdmFsaWRhdGVJblJhbmdlKHZhbHVlLCB0aGlzLm1pbiwgdGhpcy5tYXgpO1xuICAgIHRoaXMudmFsdWUgPSB2YWxpZFZhbHVlO1xuICAgIHRoaXMucmF0aW8gPSAodGhpcy52YWx1ZSAtIHRoaXMubWluKSAvIHRoaXMubGVuZ3RoO1xuXG4gICAgdGhpcy5fdXBkYXRlRmlsbCgpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRWYWx1ZUJ5UmF0aW8ocmF0aW8pIHtcbiAgICBjb25zdCB2YWxpZFJhdGlvID0gdmFsaWRhdGVJblJhbmdlKHJhdGlvLCAwLCAxKTtcbiAgICB0aGlzLnJhdGlvID0gdmFsaWRSYXRpbztcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5taW4gKyAodGhpcy5yYXRpbyAqIHRoaXMubGVuZ3RoKTtcblxuICAgIHRoaXMuX3VwZGF0ZUZpbGwoKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0QnVmZmVyKHJhdGlvKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5idWZmZXIpIHtcbiAgICAgIGNvbnN0IHZhbGlkUmF0aW8gPSB2YWxpZGF0ZUluUmFuZ2UocmF0aW8sIDAsIDEpO1xuXG4gICAgICBpZiAodGhpcy52ZXJ0aWNhbCkge1xuICAgICAgICB0aGlzLmJ1ZmZlci5zdHlsZS5oZWlnaHQgPSBgJHt2YWxpZFJhdGlvICogMTAwfSVgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5idWZmZXIuc3R5bGUud2lkdGggPSBgJHt2YWxpZFJhdGlvICogMTAwfSVgO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX3VwZGF0ZUZpbGwoKSB7XG4gICAgaWYgKHRoaXMudmVydGljYWwpIHtcbiAgICAgIHRoaXMuZmlsbC5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLnJhdGlvICogMTAwfSVgO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZpbGwuc3R5bGUud2lkdGggPSBgJHt0aGlzLnJhdGlvICogMTAwfSVgO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX3VwZGF0ZVZhbHVlKGUpIHtcbiAgICBjb25zdCBwb3MgPSB0aGlzLm5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICBsZXQgcmF0aW8gPSBudWxsO1xuICAgIGlmICh0aGlzLnZlcnRpY2FsKSB7XG4gICAgICByYXRpbyA9IDEgLSAoKGUuY2xpZW50WSAtIHBvcy50b3ApIC8gdGhpcy5ub2RlLm9mZnNldEhlaWdodCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJhdGlvID0gKGUuY2xpZW50WCAtIHBvcy5sZWZ0KSAvIHRoaXMubm9kZS5vZmZzZXRXaWR0aDtcbiAgICB9XG5cbiAgICB0aGlzLnNldFZhbHVlQnlSYXRpbyhyYXRpbyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9iaW5kRXZlbnRzKCkge1xuICAgIHRoaXMubm9kZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZSkgPT4ge1xuICAgICAgaWYgKGUud2hpY2ggPT09IDEpIHsgLy8gbGVmdCBtb3VzZSBidXR0b25cbiAgICAgICAgdGhpcy5kcmFnZ2FibGUgPSB0cnVlO1xuICAgICAgICB0aGlzLl91cGRhdGVWYWx1ZShlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChlKSA9PiB7XG4gICAgICBpZiAodGhpcy5kcmFnZ2FibGUpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlVmFsdWUoZSk7XG5cbiAgICAgICAgaWYgKGlzRnVuY3Rpb24odGhpcy5vbm1vdmUpKSB7XG4gICAgICAgICAgdGhpcy5vbm1vdmUodGhpcy52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZSkgPT4ge1xuICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlKSB7XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVZhbHVlKGUpO1xuXG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKHRoaXMub25jaGFuZ2UpKSB7XG4gICAgICAgICAgdGhpcy5vbmNoYW5nZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX2NyZWF0ZURPTSgpIHtcbiAgICBjb25zdCBtYWluQ2xhc3NOYW1lID0gdGhpcy52ZXJ0aWNhbCA/ICdzbGlkZXItdmVydCcgOiAnc2xpZGVyLWhvcml6JztcbiAgICB0aGlzLm5vZGUuY2xhc3NMaXN0LmFkZChtYWluQ2xhc3NOYW1lKTtcbiAgICB0aGlzLnRyYWNrID0gRE9NQnVpbGRlci5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICBhdHRyczoge1xuICAgICAgICBjbGFzczogYCR7bWFpbkNsYXNzTmFtZX1fX3RyYWNrYCxcbiAgICAgIH0sXG4gICAgICBwYXJlbnQ6IHRoaXMubm9kZSxcbiAgICB9KTtcbiAgICB0aGlzLmZpbGwgPSBET01CdWlsZGVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgIGF0dHJzOiB7XG4gICAgICAgIGNsYXNzOiBgJHttYWluQ2xhc3NOYW1lfV9fZmlsbGVkYCxcbiAgICAgIH0sXG4gICAgICBwYXJlbnQ6IHRoaXMudHJhY2ssXG4gICAgfSk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5oYW5kbGUpIHtcbiAgICAgIHRoaXMuaGFuZGxlID0gRE9NQnVpbGRlci5jcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgY2xhc3M6IGAke21haW5DbGFzc05hbWV9X19oYW5kbGVgLFxuICAgICAgICB9LFxuICAgICAgICBwYXJlbnQ6IHRoaXMuZmlsbCxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zLmJ1ZmZlcikge1xuICAgICAgdGhpcy5idWZmZXIgPSBET01CdWlsZGVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICBjbGFzczogYCR7bWFpbkNsYXNzTmFtZX1fX2J1ZmZlcmAsXG4gICAgICAgIH0sXG4gICAgICAgIHBhcmVudDogdGhpcy50cmFjayxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIl19
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