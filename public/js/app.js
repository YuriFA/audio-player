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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvUGxheWVyLmpzIl0sIm5hbWVzIjpbIlBMQVlJTkdfVElNRSIsIkF1ZGlvUGxheWVyIiwidHJhY2tzIiwicGFyYW1zIiwicGxheWxpc3QiLCJtdXRlZCIsImN1cnJlbnRUcmFja0luZGV4IiwiX3BsYXliYWNrIiwiX3Jlc2V0UGxheWJhY2tJbmZvIiwiX3NldFRyYWNrIiwiX2N0eCIsIl9nYWluIiwiX2NyZWF0ZUF1ZGlvQXBpTm9kZXMiLCJnYWluIiwidmFsdWUiLCJpc1BsYXlpbmciLCJjb25zb2xlIiwibG9nIiwidHJhY2siLCJhdWRpbyIsImlzQnVmZmVyZWQiLCJwbGF5IiwicGxheWluZyIsImxvYWQiLCJvbiIsIl9zdGFydFBsYXliYWNrIiwiYmluZCIsInBsYXlOZXh0IiwiZSIsImVtaXQiLCJwYXVzZSIsImN1cnJlbnRUaW1lIiwic3RvcCIsInJhdGlvIiwiRXJyb3IiLCJpc05hTiIsImR1cmF0aW9uIiwibmV3VGltZSIsImdldFRyYWNrIiwic291cmNlIiwicGxheWJhY2siLCJzdGFydFRpbWUiLCJjcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UiLCJjb25uZWN0Iiwic3JjIiwib2ZmIiwid2luZG93IiwiQXVkaW9Db250ZXh0Iiwid2Via2l0QXVkaW9Db250ZXh0IiwiX2Rlc3QiLCJkZXN0aW5hdGlvbiIsImNyZWF0ZUdhaW4iLCJtdXRlIiwidW5tdXRlIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLGVBQWUsQ0FBckIsQyxDQUF3Qjs7SUFFSEMsVzs7O0FBQ2pCLDJCQUFvQztBQUFBLFlBQXhCQyxNQUF3Qix1RUFBakIsRUFBaUI7QUFBQSxZQUFiQyxNQUFhLHVFQUFKLEVBQUk7O0FBQUE7O0FBQUE7O0FBR2hDLGNBQUtDLFFBQUwsR0FBZ0IsdUJBQWFGLE1BQWIsQ0FBaEI7QUFDQSxjQUFLRyxLQUFMLEdBQWEsS0FBYjtBQUNBLGNBQUtDLGlCQUFMLEdBQXlCLENBQXpCO0FBQ0EsY0FBS0MsU0FBTCxHQUFpQixFQUFqQjtBQUNBLGNBQUtDLGtCQUFMO0FBQ0EsY0FBS0MsU0FBTDs7QUFFQTtBQUNBLGNBQUtDLElBQUwsR0FBWSxJQUFaO0FBQ0EsY0FBS0MsS0FBTCxHQUFhLElBQWI7QUFDQSxjQUFLQyxvQkFBTDtBQUNBLGNBQUtELEtBQUwsQ0FBV0UsSUFBWCxDQUFnQkMsS0FBaEIsR0FBd0IsR0FBeEI7QUFkZ0M7QUFlbkM7Ozs7K0JBc0JNO0FBQUE7O0FBQ0gsZ0JBQUcsS0FBS0MsU0FBUixFQUFtQjtBQUNmLHVCQUFPLElBQVA7QUFDSDtBQUNEQyxvQkFBUUMsR0FBUix1QkFBZ0MsS0FBS1gsaUJBQXJDOztBQUdBLGdCQUFHLENBQUMsS0FBS0MsU0FBTCxDQUFlVyxLQUFuQixFQUEwQjtBQUN0QixxQkFBS1QsU0FBTDtBQUNIOztBQUVELGdCQUFNUyxRQUFRLEtBQUtYLFNBQUwsQ0FBZVcsS0FBN0I7QUFDQSxnQkFBR0EsTUFBTUMsS0FBTixJQUFlRCxNQUFNRSxVQUFOLEVBQWxCLEVBQXNDO0FBQ2xDRixzQkFBTUMsS0FBTixDQUFZRSxJQUFaO0FBQ0EscUJBQUtkLFNBQUwsQ0FBZWUsT0FBZixHQUF5QixJQUF6QjtBQUNILGFBSEQsTUFHTztBQUNISixzQkFBTUssSUFBTjtBQUNBO0FBQ0FMLHNCQUFNTSxFQUFOLENBQVMsU0FBVCxFQUFvQixLQUFLQyxjQUFMLENBQW9CQyxJQUFwQixDQUF5QixJQUF6QixDQUFwQjtBQUNBUixzQkFBTU0sRUFBTixDQUFTLE9BQVQsRUFBa0IsS0FBS0csUUFBTCxDQUFjRCxJQUFkLENBQW1CLElBQW5CLENBQWxCO0FBQ0FSLHNCQUFNTSxFQUFOLENBQVMsVUFBVCxFQUFxQixVQUFDSSxDQUFELEVBQU87QUFDeEIsMkJBQUtDLElBQUwsQ0FBVSxnQkFBVixFQUE0QkQsQ0FBNUI7QUFDSCxpQkFGRDtBQUdBVixzQkFBTU0sRUFBTixDQUFTLFlBQVQsRUFBdUIsVUFBQ0ksQ0FBRCxFQUFPO0FBQzFCLDJCQUFLQyxJQUFMLENBQVUsa0JBQVYsRUFBOEJELENBQTlCO0FBQ0gsaUJBRkQ7QUFHQVYsc0JBQU1NLEVBQU4sQ0FBUyxnQkFBVCxFQUEyQixVQUFDSSxDQUFELEVBQU87QUFDOUIsMkJBQUtDLElBQUwsQ0FBVSxzQkFBVixFQUFrQ0QsQ0FBbEM7QUFDSCxpQkFGRDtBQUdBVixzQkFBTU0sRUFBTixDQUFTLFlBQVQsRUFBdUIsVUFBQ0ksQ0FBRCxFQUFPO0FBQzFCLDJCQUFLQyxJQUFMLENBQVUsa0JBQVYsRUFBOEJELENBQTlCO0FBQ0gsaUJBRkQ7QUFHSDs7QUFFRCxtQkFBTyxJQUFQO0FBQ0g7OzsrQkFFTTtBQUNILGlCQUFLckIsU0FBTCxDQUFlZSxPQUFmLEdBQXlCLEtBQXpCO0FBQ0EsZ0JBQU1KLFFBQVEsS0FBS1gsU0FBTCxDQUFlVyxLQUE3QjtBQUNBQSxrQkFBTUMsS0FBTixDQUFZVyxLQUFaO0FBQ0FaLGtCQUFNQyxLQUFOLENBQVlZLFdBQVosR0FBMEIsQ0FBMUI7QUFDQSxpQkFBS3ZCLGtCQUFMOztBQUVBLG1CQUFPLElBQVA7QUFDSDs7O2dDQUVPO0FBQ0osaUJBQUtELFNBQUwsQ0FBZWUsT0FBZixHQUF5QixLQUF6QjtBQUNBLGdCQUFNSixRQUFRLEtBQUtYLFNBQUwsQ0FBZVcsS0FBN0I7QUFDQUEsa0JBQU1DLEtBQU4sQ0FBWVcsS0FBWjtBQUNBZCxvQkFBUUMsR0FBUixDQUFZLFFBQVo7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOzs7K0JBRU07QUFDSCxpQkFBS1YsU0FBTCxDQUFlVyxLQUFmLENBQXFCYixLQUFyQixHQUE2QixJQUE3QjtBQUNBLGlCQUFLQSxLQUFMLEdBQWEsSUFBYjs7QUFFQSxtQkFBTyxJQUFQO0FBQ0g7OztpQ0FFUTtBQUNMLGlCQUFLRSxTQUFMLENBQWVXLEtBQWYsQ0FBcUJiLEtBQXJCLEdBQTZCLEtBQTdCO0FBQ0EsaUJBQUtBLEtBQUwsR0FBYSxLQUFiOztBQUVBLG1CQUFPLElBQVA7QUFDSDs7O21DQUVVO0FBQ1AsZ0JBQUcsS0FBS1UsU0FBUixFQUFtQjtBQUNmLHFCQUFLaUIsSUFBTDtBQUNIOztBQUVELGlCQUFLMUIsaUJBQUwsSUFBMEIsQ0FBMUI7QUFDQSxpQkFBS2UsSUFBTDs7QUFFQSxtQkFBTyxJQUFQO0FBQ0g7OzttQ0FFVTtBQUNQLGdCQUFHLEtBQUtOLFNBQVIsRUFBbUI7QUFDZixxQkFBS2lCLElBQUw7QUFDSDs7QUFFRCxpQkFBSzFCLGlCQUFMLElBQTBCLENBQTFCO0FBQ0EsaUJBQUtlLElBQUw7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOztBQUVEOzs7OytCQUNPWSxLLEVBQU87QUFDVixnQkFBR0EsUUFBUSxDQUFSLElBQWFBLFFBQVEsQ0FBeEIsRUFBMkI7QUFDdkIsc0JBQU1DLE1BQU0scUNBQU4sQ0FBTjtBQUNIOztBQUVELGdCQUFNZixRQUFRLEtBQUtaLFNBQUwsQ0FBZVcsS0FBZixDQUFxQkMsS0FBbkM7QUFDQSxnQkFBRyxDQUFDZ0IsTUFBTWhCLE1BQU1pQixRQUFaLENBQUosRUFBMkI7QUFDdkIsb0JBQU1DLFVBQVVsQixNQUFNaUIsUUFBTixHQUFpQkgsS0FBakM7QUFDQWQsc0JBQU1ZLFdBQU4sR0FBb0JNLE9BQXBCO0FBQ0g7O0FBRUQsbUJBQU8sSUFBUDtBQUNIOzs7b0NBRVc7QUFDUixnQkFBRyxLQUFLdEIsU0FBUixFQUFtQjtBQUNmLHVCQUFPLElBQVA7QUFDSDs7QUFFRCxpQkFBS1IsU0FBTCxDQUFlVyxLQUFmLEdBQXVCLEtBQUtkLFFBQUwsQ0FBY2tDLFFBQWQsQ0FBdUIsS0FBS2hDLGlCQUE1QixDQUF2Qjs7QUFFQSxtQkFBTyxJQUFQO0FBQ0g7Ozs2Q0FFb0I7QUFDakIsaUJBQUtDLFNBQUwsR0FBaUI7QUFDYlcsdUJBQU8sSUFETTtBQUVicUIsd0JBQVEsSUFGSztBQUdiakIseUJBQVM7QUFFYjs7QUFMaUIsYUFBakIsQ0FPQSxPQUFPLElBQVA7QUFDSDs7O3lDQUVnQjtBQUNiLGdCQUFHLEtBQUtQLFNBQVIsRUFBbUI7QUFDZkMsd0JBQVFDLEdBQVIsQ0FBWSxtQkFBWjtBQUNBLHVCQUFPLElBQVA7QUFDSDs7QUFFRCxnQkFBTXVCLFdBQVcsS0FBS2pDLFNBQXRCO0FBQ0EsZ0JBQU1XLFFBQVEsS0FBS1gsU0FBTCxDQUFlVyxLQUE3Qjs7QUFFQXNCLHFCQUFTQyxTQUFULEdBQXFCLEtBQUsvQixJQUFMLENBQVVxQixXQUEvQjtBQUNBUyxxQkFBU0QsTUFBVCxHQUFrQixLQUFLN0IsSUFBTCxDQUFVZ0Msd0JBQVYsQ0FBbUN4QixNQUFNQyxLQUF6QyxDQUFsQjtBQUNBcUIscUJBQVNELE1BQVQsQ0FBZ0JJLE9BQWhCLENBQXdCLEtBQUtoQyxLQUE3Qjs7QUFFQUssb0JBQVFDLEdBQVIsZUFBd0J1QixTQUFTdEIsS0FBVCxDQUFlMEIsR0FBdkM7QUFDQUoscUJBQVNsQixPQUFULEdBQW1CLElBQW5CO0FBQ0FKLGtCQUFNQyxLQUFOLENBQVlFLElBQVo7O0FBRUE7QUFDQUgsa0JBQU0yQixHQUFOLENBQVUsU0FBVixFQUFxQixLQUFLcEIsY0FBTCxDQUFvQkMsSUFBcEIsQ0FBeUIsSUFBekIsQ0FBckI7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOzs7K0NBRXNCO0FBQ25CLGlCQUFLaEIsSUFBTCxHQUFZLEtBQUtvQyxPQUFPQyxZQUFQLElBQXVCRCxPQUFPRSxrQkFBbkMsR0FBWjtBQUNBLGlCQUFLQyxLQUFMLEdBQWEsS0FBS3ZDLElBQUwsQ0FBVXdDLFdBQXZCO0FBQ0EsaUJBQUt2QyxLQUFMLEdBQWEsS0FBS0QsSUFBTCxDQUFVeUMsVUFBVixFQUFiOztBQUVBO0FBQ0EsaUJBQUt4QyxLQUFMLENBQVdnQyxPQUFYLENBQW1CLEtBQUtNLEtBQXhCOztBQUVBLG1CQUFPLElBQVA7QUFDSDs7OzRCQXBMZTtBQUNaLG1CQUFPLEtBQUsxQyxTQUFMLENBQWVlLE9BQXRCO0FBQ0g7Ozs0QkFFWTtBQUNULG1CQUFPLEtBQUtYLEtBQUwsQ0FBV0UsSUFBWCxDQUFnQkMsS0FBdkI7QUFDSCxTOzBCQUVVQSxLLEVBQU87QUFDZCxnQkFBR0EsUUFBUSxDQUFSLElBQWFBLFFBQVEsQ0FBeEIsRUFBMkI7QUFDdkIsc0JBQU1vQixNQUFNLHFDQUFOLENBQU47QUFDSDtBQUNELGdCQUFHcEIsVUFBVSxDQUFiLEVBQWdCO0FBQ1oscUJBQUtzQyxJQUFMO0FBQ0gsYUFGRCxNQUVPLElBQUcsS0FBSy9DLEtBQVIsRUFBZTtBQUNsQixxQkFBS2dELE1BQUw7QUFDSDtBQUNELGlCQUFLMUMsS0FBTCxDQUFXRSxJQUFYLENBQWdCQyxLQUFoQixHQUF3QkEsS0FBeEI7QUFDSDs7Ozs7O2tCQXBDZ0JiLFciLCJmaWxlIjoiQXVkaW9QbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFBsYXlsaXN0IGZyb20gJy4vUGxheWxpc3QnO1xuaW1wb3J0IFRyYWNrIGZyb20gJy4vVHJhY2snO1xuaW1wb3J0IEV2ZW50RW1taXRlciBmcm9tICcuL3V0aWxzL0V2ZW50RW1taXRlcic7XG5cbmNvbnN0IFBMQVlJTkdfVElNRSA9IDU7IC8vZm9yIHRlc3RcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXVkaW9QbGF5ZXIgZXh0ZW5kcyBFdmVudEVtbWl0ZXIge1xuICAgIGNvbnN0cnVjdG9yKHRyYWNrcz1bXSwgcGFyYW1zID0ge30pIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLnBsYXlsaXN0ID0gbmV3IFBsYXlsaXN0KHRyYWNrcyk7XG4gICAgICAgIHRoaXMubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jdXJyZW50VHJhY2tJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuX3BsYXliYWNrID0ge31cbiAgICAgICAgdGhpcy5fcmVzZXRQbGF5YmFja0luZm8oKTtcbiAgICAgICAgdGhpcy5fc2V0VHJhY2soKTtcblxuICAgICAgICAvLyBpbml0IEF1ZGlvIEFQSSBOb2Rlc1xuICAgICAgICB0aGlzLl9jdHggPSBudWxsO1xuICAgICAgICB0aGlzLl9nYWluID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY3JlYXRlQXVkaW9BcGlOb2RlcygpO1xuICAgICAgICB0aGlzLl9nYWluLmdhaW4udmFsdWUgPSAwLjE7XG4gICAgfVxuXG4gICAgZ2V0IGlzUGxheWluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BsYXliYWNrLnBsYXlpbmc7XG4gICAgfVxuICAgIFxuICAgIGdldCB2b2x1bWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nYWluLmdhaW4udmFsdWU7XG4gICAgfVxuXG4gICAgc2V0IHZvbHVtZSh2YWx1ZSkge1xuICAgICAgICBpZih2YWx1ZSA+IDEgJiYgdmFsdWUgPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignVm9sdW1lIG11c3QgYmUgaW4gcmFuZ2UgZnJvbSAwIHRvIDEnKTtcbiAgICAgICAgfVxuICAgICAgICBpZih2YWx1ZSA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5tdXRlKCk7XG4gICAgICAgIH0gZWxzZSBpZih0aGlzLm11dGVkKSB7XG4gICAgICAgICAgICB0aGlzLnVubXV0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2dhaW4uZ2Fpbi52YWx1ZSA9IHZhbHVlOyBcbiAgICB9XG5cbiAgICBwbGF5KCkge1xuICAgICAgICBpZih0aGlzLmlzUGxheWluZykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coYFBsYXlpbmcgdHJhY2sgaWQ9JHt0aGlzLmN1cnJlbnRUcmFja0luZGV4fWApO1xuXG5cbiAgICAgICAgaWYoIXRoaXMuX3BsYXliYWNrLnRyYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRUcmFjaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHJhY2sgPSB0aGlzLl9wbGF5YmFjay50cmFjaztcbiAgICAgICAgaWYodHJhY2suYXVkaW8gJiYgdHJhY2suaXNCdWZmZXJlZCgpKSB7XG4gICAgICAgICAgICB0cmFjay5hdWRpby5wbGF5KCk7XG4gICAgICAgICAgICB0aGlzLl9wbGF5YmFjay5wbGF5aW5nID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyYWNrLmxvYWQoKTtcbiAgICAgICAgICAgIC8vU3Vic2NyaWJlXG4gICAgICAgICAgICB0cmFjay5vbignY2FucGxheScsIHRoaXMuX3N0YXJ0UGxheWJhY2suYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0cmFjay5vbignZW5kZWQnLCB0aGlzLnBsYXlOZXh0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdHJhY2sub24oJ3Byb2dyZXNzJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3RyYWNrOnByb2dyZXNzJywgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRyYWNrLm9uKCdsb2FkZWRkYXRhJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3RyYWNrOmxvYWRlZGRhdGEnLCBlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdHJhY2sub24oJ2xvYWRlZG1ldGFkYXRhJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3RyYWNrOmxvYWRlZG1ldGFkYXRhJywgZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRyYWNrLm9uKCd0aW1ldXBkYXRlJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3RyYWNrOnRpbWV1cGRhdGUnLCBlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc3RvcCgpIHtcbiAgICAgICAgdGhpcy5fcGxheWJhY2sucGxheWluZyA9IGZhbHNlO1xuICAgICAgICBjb25zdCB0cmFjayA9IHRoaXMuX3BsYXliYWNrLnRyYWNrO1xuICAgICAgICB0cmFjay5hdWRpby5wYXVzZSgpO1xuICAgICAgICB0cmFjay5hdWRpby5jdXJyZW50VGltZSA9IDA7XG4gICAgICAgIHRoaXMuX3Jlc2V0UGxheWJhY2tJbmZvKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcGF1c2UoKSB7XG4gICAgICAgIHRoaXMuX3BsYXliYWNrLnBsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgdHJhY2sgPSB0aGlzLl9wbGF5YmFjay50cmFjaztcbiAgICAgICAgdHJhY2suYXVkaW8ucGF1c2UoKTtcbiAgICAgICAgY29uc29sZS5sb2coJ1BBVVNFRCcpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG11dGUoKSB7XG4gICAgICAgIHRoaXMuX3BsYXliYWNrLnRyYWNrLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tdXRlZCA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdW5tdXRlKCkge1xuICAgICAgICB0aGlzLl9wbGF5YmFjay50cmFjay5tdXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLm11dGVkID0gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcGxheU5leHQoKSB7XG4gICAgICAgIGlmKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3VycmVudFRyYWNrSW5kZXggKz0gMTtcbiAgICAgICAgdGhpcy5wbGF5KCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcGxheVByZXYoKSB7XG4gICAgICAgIGlmKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3VycmVudFRyYWNrSW5kZXggLT0gMTtcbiAgICAgICAgdGhpcy5wbGF5KCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8g0L/QtdGA0LXQvNC+0YLQutCwXG4gICAgcmV3aW5kKHJhdGlvKSB7XG4gICAgICAgIGlmKHJhdGlvID4gMSAmJiByYXRpbyA8IDApIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdWb2x1bWUgbXVzdCBiZSBpbiByYW5nZSBmcm9tIDAgdG8gMScpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXVkaW8gPSB0aGlzLl9wbGF5YmFjay50cmFjay5hdWRpbztcbiAgICAgICAgaWYoIWlzTmFOKGF1ZGlvLmR1cmF0aW9uKSkge1xuICAgICAgICAgICAgY29uc3QgbmV3VGltZSA9IGF1ZGlvLmR1cmF0aW9uICogcmF0aW87XG4gICAgICAgICAgICBhdWRpby5jdXJyZW50VGltZSA9IG5ld1RpbWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfc2V0VHJhY2soKSB7XG4gICAgICAgIGlmKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3BsYXliYWNrLnRyYWNrID0gdGhpcy5wbGF5bGlzdC5nZXRUcmFjayh0aGlzLmN1cnJlbnRUcmFja0luZGV4KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfcmVzZXRQbGF5YmFja0luZm8oKSB7XG4gICAgICAgIHRoaXMuX3BsYXliYWNrID0ge1xuICAgICAgICAgICAgdHJhY2s6IG51bGwsXG4gICAgICAgICAgICBzb3VyY2U6IG51bGwsXG4gICAgICAgICAgICBwbGF5aW5nOiBmYWxzZSxcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZygnUkVTRVQgUExBWUJBQ0snKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfc3RhcnRQbGF5YmFjaygpIHtcbiAgICAgICAgaWYodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBbHJlYWR5IHBsYXlpbmchMScpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwbGF5YmFjayA9IHRoaXMuX3BsYXliYWNrO1xuICAgICAgICBjb25zdCB0cmFjayA9IHRoaXMuX3BsYXliYWNrLnRyYWNrO1xuICAgICAgICBcbiAgICAgICAgcGxheWJhY2suc3RhcnRUaW1lID0gdGhpcy5fY3R4LmN1cnJlbnRUaW1lO1xuICAgICAgICBwbGF5YmFjay5zb3VyY2UgPSB0aGlzLl9jdHguY3JlYXRlTWVkaWFFbGVtZW50U291cmNlKHRyYWNrLmF1ZGlvKTtcbiAgICAgICAgcGxheWJhY2suc291cmNlLmNvbm5lY3QodGhpcy5fZ2Fpbik7XG5cbiAgICAgICAgY29uc29sZS5sb2coYExvYWRlZCAtICR7cGxheWJhY2sudHJhY2suc3JjfWApO1xuICAgICAgICBwbGF5YmFjay5wbGF5aW5nID0gdHJ1ZTtcbiAgICAgICAgdHJhY2suYXVkaW8ucGxheSgpO1xuXG4gICAgICAgIC8vVW5zdWJzY3JpYmUgYmVjYXVzZSBjaGFuZ2luZyBjdXJyZW50IHRpbWUgdHJpZ2dlcmluZyAnY2FucGxheScgZXZlbnRcbiAgICAgICAgdHJhY2sub2ZmKCdjYW5wbGF5JywgdGhpcy5fc3RhcnRQbGF5YmFjay5iaW5kKHRoaXMpKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBfY3JlYXRlQXVkaW9BcGlOb2RlcygpIHtcbiAgICAgICAgdGhpcy5fY3R4ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKCk7XG4gICAgICAgIHRoaXMuX2Rlc3QgPSB0aGlzLl9jdHguZGVzdGluYXRpb247XG4gICAgICAgIHRoaXMuX2dhaW4gPSB0aGlzLl9jdHguY3JlYXRlR2FpbigpO1xuXG4gICAgICAgIC8vIENvbm5lY3QgTm9kZXNcbiAgICAgICAgdGhpcy5fZ2Fpbi5jb25uZWN0KHRoaXMuX2Rlc3QpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiJdfQ==
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
        _this._bind();
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
        key: '_bind',
        value: function _bind() {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRyYWNrLmpzIl0sIm5hbWVzIjpbIlRyYWNrIiwic3JjIiwibmFtZSIsIl9zcmMiLCJfbmFtZSIsIl9idWZmZXIiLCJfYXVkaW8iLCJBdWRpbyIsIl9iaW5kIiwiYnVmZmVyZWQiLCJsZW5ndGgiLCJjcm9zc09yaWdpbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiZW1pdCIsInZhbHVlIiwibXV0ZWQiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7SUFFcUJBLEs7OztBQUNqQixtQkFBWUMsR0FBWixFQUEwQjtBQUFBLFlBQVRDLElBQVMsdUVBQUosRUFBSTs7QUFBQTs7QUFBQTs7QUFHdEIsY0FBS0MsSUFBTCxHQUFZRixHQUFaO0FBQ0EsY0FBS0csS0FBTCxHQUFhRixJQUFiO0FBQ0EsY0FBS0csT0FBTCxHQUFlLElBQWY7QUFDQSxjQUFLQyxNQUFMLEdBQWMsSUFBSUMsS0FBSixFQUFkO0FBQ0EsY0FBS0MsS0FBTDtBQVBzQjtBQVF6Qjs7OztxQ0FrQlk7QUFDVCxtQkFBTyxLQUFLRixNQUFMLENBQVlHLFFBQVosQ0FBcUJDLE1BQXJCLEdBQThCLENBQXJDO0FBQ0g7OzsrQkFFTTtBQUNILGlCQUFLSixNQUFMLENBQVlLLFdBQVosR0FBMEIsV0FBMUI7QUFDQSxpQkFBS0wsTUFBTCxDQUFZTCxHQUFaLEdBQWtCLEtBQUtFLElBQXZCOztBQUVBLG1CQUFPLElBQVA7QUFDSDs7O2dDQUVPO0FBQUE7O0FBQ0osaUJBQUtHLE1BQUwsQ0FBWU0sZ0JBQVosQ0FBNkIsU0FBN0IsRUFBd0MsVUFBQ0MsQ0FBRCxFQUFPO0FBQzNDLHVCQUFLQyxJQUFMLENBQVUsU0FBVixFQUFxQkQsQ0FBckI7QUFDSCxhQUZEO0FBR0EsaUJBQUtQLE1BQUwsQ0FBWU0sZ0JBQVosQ0FBNkIsT0FBN0IsRUFBc0MsWUFBTTtBQUN4Qyx1QkFBS0UsSUFBTCxDQUFVLE9BQVY7QUFDSCxhQUZEO0FBR0EsaUJBQUtSLE1BQUwsQ0FBWU0sZ0JBQVosQ0FBNkIsVUFBN0IsRUFBeUMsVUFBQ0MsQ0FBRCxFQUFPO0FBQzVDLHVCQUFLQyxJQUFMLENBQVUsVUFBVixFQUFzQkQsQ0FBdEI7QUFDSCxhQUZEO0FBR0EsaUJBQUtQLE1BQUwsQ0FBWU0sZ0JBQVosQ0FBNkIsWUFBN0IsRUFBMkMsVUFBQ0MsQ0FBRCxFQUFPO0FBQzlDLHVCQUFLQyxJQUFMLENBQVUsWUFBVixFQUF3QkQsQ0FBeEI7QUFDSCxhQUZEO0FBR0EsaUJBQUtQLE1BQUwsQ0FBWU0sZ0JBQVosQ0FBNkIsZ0JBQTdCLEVBQStDLFVBQUNDLENBQUQsRUFBTztBQUNsRCx1QkFBS0MsSUFBTCxDQUFVLGdCQUFWLEVBQTRCRCxDQUE1QjtBQUNILGFBRkQ7QUFHQSxpQkFBS1AsTUFBTCxDQUFZTSxnQkFBWixDQUE2QixZQUE3QixFQUEyQyxVQUFDQyxDQUFELEVBQU87QUFDOUMsdUJBQUtDLElBQUwsQ0FBVSxZQUFWLEVBQXdCRCxDQUF4QjtBQUNILGFBRkQ7QUFHSDs7OzRCQTlDUztBQUNOLG1CQUFPLEtBQUtWLElBQVo7QUFDSDs7OzRCQUVVO0FBQ1AsbUJBQU8sS0FBS0MsS0FBWjtBQUNIOzs7NEJBRVc7QUFDUixtQkFBTyxLQUFLRSxNQUFaO0FBQ0g7OzswQkFFU1MsSyxFQUFPO0FBQ2IsaUJBQUtULE1BQUwsQ0FBWVUsS0FBWixHQUFvQixDQUFDLENBQUNELEtBQXRCO0FBQ0g7Ozs7OztrQkF6QmdCZixLO0FBMERwQiIsImZpbGUiOiJUcmFjay5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgRXZlbnRFbW1pdGVyIGZyb20gJy4vdXRpbHMvRXZlbnRFbW1pdGVyLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhY2sgZXh0ZW5kcyBFdmVudEVtbWl0ZXJ7XG4gICAgY29uc3RydWN0b3Ioc3JjLCBuYW1lPScnKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5fc3JjID0gc3JjO1xuICAgICAgICB0aGlzLl9uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5fYnVmZmVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5fYXVkaW8gPSBuZXcgQXVkaW8oKTtcbiAgICAgICAgdGhpcy5fYmluZCgpO1xuICAgIH1cblxuICAgIGdldCBzcmMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zcmM7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgIH1cblxuICAgIGdldCBhdWRpbygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F1ZGlvO1xuICAgIH1cblxuICAgIHNldCBtdXRlZCh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9hdWRpby5tdXRlZCA9ICEhdmFsdWU7XG4gICAgfVxuXG4gICAgaXNCdWZmZXJlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F1ZGlvLmJ1ZmZlcmVkLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgbG9hZCgpIHtcbiAgICAgICAgdGhpcy5fYXVkaW8uY3Jvc3NPcmlnaW4gPSBcImFub255bW91c1wiO1xuICAgICAgICB0aGlzLl9hdWRpby5zcmMgPSB0aGlzLl9zcmM7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX2JpbmQoKSB7XG4gICAgICAgIHRoaXMuX2F1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2NhbnBsYXknLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdjYW5wbGF5JywgZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9hdWRpby5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnZW5kZWQnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX2F1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgncHJvZ3Jlc3MnLCBlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX2F1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlZGRhdGEnLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdsb2FkZWRkYXRhJywgZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9hdWRpby5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRtZXRhZGF0YScsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2xvYWRlZG1ldGFkYXRhJywgZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9hdWRpby5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgndGltZXVwZGF0ZScsIGUpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIl19
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

var progressBar = document.querySelector('.progress__bar');
var progressBuffer = document.querySelector('.progress__buffer');
var progressLine = document.querySelector('.progress__line');

var player = new _AudioPlayer2.default(tracks);
setVolume(player.volume);
// player.playlist.addTrack(['./../media/System_Of_A_Down_-_Aerials.mp3']);
// player.playlist.addTrackList(tracks);

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

function drawProgress(value) {
    var validValue = value > 1 ? 1 : value < 0 ? 0 : value;
    progressLine.style.width = validValue * 100 + '%';
}

// Volume settings
var updateVolume = function updateVolume(e) {
    var ratio = (e.clientX - volumeSliderNode.offsetLeft) / volumeSliderNode.offsetWidth;
    setVolume(ratio);
};

var volumeSlider = new _Slider2.default(volumeSliderNode, updateVolume);

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

// Progress settings
var updateProgress = function updateProgress(e) {
    var ratio = (e.clientX - progressBar.offsetLeft) / progressBar.offsetWidth;
    drawProgress(ratio);
    player.rewind(ratio);
};
var progressSlider = new _Slider2.default(progressBar, updateProgress);

var updateBuffer = function updateBuffer(e) {
    var audio = e.target;
    var buffered = audio.buffered;
    var buffRatio = buffered.length ? buffered.end(buffered.length - 1) / audio.duration * 100 : 0;

    progressBuffer.style.width = buffRatio + '%';
};

player.on('track:progress', updateBuffer);
player.on('track:loadeddata', updateBuffer);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfZDgyMzNlNjcuanMiXSwibmFtZXMiOlsidHJhY2tzIiwicGxheWVyTm9kZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwbGF5QnRuIiwicXVlcnlTZWxlY3RvciIsInBsYXlOZXh0QnRuIiwicGxheVByZXZCdG4iLCJ2b2x1bWVCdG4iLCJ2b2x1bWVTbGlkZXJOb2RlIiwidm9sdW1lU2xpZGVyRmlsbGVkIiwicHJvZ3Jlc3NCYXIiLCJwcm9ncmVzc0J1ZmZlciIsInByb2dyZXNzTGluZSIsInBsYXllciIsInNldFZvbHVtZSIsInZvbHVtZSIsInZhbHVlIiwiaWNvbiIsImNoaWxkcmVuIiwidmFsaWRWYWx1ZSIsImNsYXNzTGlzdCIsInJlbW92ZSIsImFkZCIsInN0eWxlIiwid2lkdGgiLCJkcmF3UHJvZ3Jlc3MiLCJ1cGRhdGVWb2x1bWUiLCJlIiwicmF0aW8iLCJjbGllbnRYIiwib2Zmc2V0TGVmdCIsIm9mZnNldFdpZHRoIiwidm9sdW1lU2xpZGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm11dGVkIiwidW5tdXRlIiwibXV0ZSIsIm5ld1ZhbHVlIiwiTWF0aCIsInNpZ24iLCJ3aGVlbERlbHRhWSIsInVwZGF0ZVByb2dyZXNzIiwicmV3aW5kIiwicHJvZ3Jlc3NTbGlkZXIiLCJ1cGRhdGVCdWZmZXIiLCJhdWRpbyIsInRhcmdldCIsImJ1ZmZlcmVkIiwiYnVmZlJhdGlvIiwibGVuZ3RoIiwiZW5kIiwiZHVyYXRpb24iLCJvbiIsInBsYXllZFJhdGlvIiwiY3VycmVudFRpbWUiLCJpc1BsYXlpbmciLCJwbGF5IiwicGF1c2UiLCJwbGF5TmV4dCIsInBsYXlQcmV2Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxTQUFTLENBQ1gsMk5BRFcsRUFFWCw2QkFGVyxFQUdYLGdDQUhXLEVBSVgsK0JBSlcsRUFLWCx1QkFMVyxFQU1YLGdDQU5XLENBQWY7O0FBU0EsSUFBTUMsYUFB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Q0FBVSxrQkFBVixFQUE4QlIsWUFBOUI7QUFDQS9CLE9BQU91QyxFQUFQLENBQVUsa0JBQVYsRUFBOEIsVUFBQ3pCLENBQUQsRUFBTztBQUNqQyxRQUFNa0IsUUFBUWxCLEVBQUVtQixNQUFoQjtBQUNBLFFBQU1PLGNBQWNSLE1BQU1TLFdBQU4sR0FBb0JULE1BQU1NLFFBQTlDO0FBQ0ExQixpQkFBYTRCLFdBQWI7QUFDSCxDQUpEOztBQU9BO0FBQ0FsRCxRQUFROEIsZ0JBQVIsQ0FBeUIsT0FBekIsRUFBa0MsWUFBTTtBQUNwQyxRQUFHLENBQUNwQixPQUFPMEMsU0FBWCxFQUFzQjtBQUNsQnBELGdCQUFRaUIsU0FBUixDQUFrQkUsR0FBbEIsQ0FBc0IsNEJBQXRCO0FBQ0FULGVBQU8yQyxJQUFQO0FBQ0gsS0FIRCxNQUdPO0FBQ0hyRCxnQkFBUWlCLFNBQVIsQ0FBa0JDLE1BQWxCLENBQXlCLDRCQUF6QjtBQUNBUixlQUFPNEMsS0FBUDtBQUNIO0FBQ0osQ0FSRDs7QUFVQXBELFlBQVk0QixnQkFBWixDQUE2QixPQUE3QixFQUFzQyxVQUFDTixDQUFELEVBQU87QUFDekN4QixZQUFRaUIsU0FBUixDQUFrQkUsR0FBbEIsQ0FBc0IsNEJBQXRCO0FBQ0FULFdBQU82QyxRQUFQO0FBQ0gsQ0FIRDs7QUFLQXBELFlBQVkyQixnQkFBWixDQUE2QixPQUE3QixFQUFzQyxVQUFDTixDQUFELEVBQU87QUFDekN4QixZQUFRaUIsU0FBUixDQUFrQkUsR0FBbEIsQ0FBc0IsNEJBQXRCO0FBQ0FULFdBQU84QyxRQUFQO0FBQ0gsQ0FIRCIsImZpbGUiOiJmYWtlX2Q4MjMzZTY3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEF1ZGlvUGxheWVyIGZyb20gJy4vQXVkaW9QbGF5ZXInO1xuaW1wb3J0IFBsYXlsaXN0IGZyb20gJy4vUGxheWxpc3QnO1xuaW1wb3J0IERPTUJ1aWRsZXIgZnJvbSAnLi91dGlscy9ET01CdWlsZGVyJztcbmltcG9ydCBTbGlkZXIgZnJvbSAnLi91dGlscy9TbGlkZXIuanMnO1xuXG5jb25zdCB0cmFja3MgPSBbXG4gICAgXCJodHRwczovL3BzdjQudXNlcmFwaS5jb20vYzgxMzQyNi91MzcxNzQ1NDQ5L2F1ZGlvcy85YzEzMTIxOTJhMWYubXAzP2V4dHJhPVZKYUJQa1Q5Y0FucTVwbTNBd25iYzdYQzBZWlltejUtVlF1Y2VHRVJfUDZjV01MNUx3eDhQOWhfdWNwUGM5WUxmc2dDRi1YLUJaNmpiVzEyMTUxTVpTbkhoc2tubkMwOXZQMXJWRlkwQ1dqZC1VQVdMd29PYUR5Ri1jZ0JVWnJQQmg0LWtHamVZTTQzLW1BXCIsXG4gICAgJy4vLi4vbWVkaWEvMDIgLSBOZWVkbGVzLm1wMycsXG4gICAgJy4vLi4vbWVkaWEvMDMgLSBEZWVyIERhbmNlLm1wMycsXG4gICAgJy4vLi4vbWVkaWEvMDQgLSBKZXQgUGlsb3QubXAzJyxcbiAgICAnLi8uLi9tZWRpYS8wNSAtIFgubXAzJyxcbiAgICAnLi8uLi9tZWRpYS8wNiAtIENob3AgU3VleSEubXAzJyxcbl1cblxuY29uc3QgcGxheWVyTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheWVyXCIpO1xuY29uc3QgcGxheUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9wbGF5Jyk7XG5jb25zdCBwbGF5TmV4dEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9uZXh0Jyk7XG5jb25zdCBwbGF5UHJldkJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHNfX2J0bl9wcmV2Jyk7XG5cbmNvbnN0IHZvbHVtZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52b2x1bWVfX2J0bicpO1xuY29uc3Qgdm9sdW1lU2xpZGVyTm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52b2x1bWVfX3NsaWRlcicpO1xuY29uc3Qgdm9sdW1lU2xpZGVyRmlsbGVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZvbHVtZV9fc2xpZGVyIC5zbGlkZXJfX2ZpbGxlZCcpO1xuXG5jb25zdCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmVzc19fYmFyJyk7XG5jb25zdCBwcm9ncmVzc0J1ZmZlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmVzc19fYnVmZmVyJyk7XG5jb25zdCBwcm9ncmVzc0xpbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvZ3Jlc3NfX2xpbmUnKTtcblxuY29uc3QgcGxheWVyID0gbmV3IEF1ZGlvUGxheWVyKHRyYWNrcyk7XG5zZXRWb2x1bWUocGxheWVyLnZvbHVtZSk7XG4vLyBwbGF5ZXIucGxheWxpc3QuYWRkVHJhY2soWycuLy4uL21lZGlhL1N5c3RlbV9PZl9BX0Rvd25fLV9BZXJpYWxzLm1wMyddKTtcbi8vIHBsYXllci5wbGF5bGlzdC5hZGRUcmFja0xpc3QodHJhY2tzKTtcblxuZnVuY3Rpb24gc2V0Vm9sdW1lKHZhbHVlKSB7XG4gICAgY29uc3QgaWNvbiA9IHZvbHVtZUJ0bi5jaGlsZHJlblswXTtcbiAgICBjb25zdCB2YWxpZFZhbHVlID0gdmFsdWUgPiAxID8gMSA6ICh2YWx1ZSA8IDAgPyAwIDogdmFsdWUpO1xuICAgIGlmKHZhbGlkVmFsdWUgPT09IDApIHtcbiAgICAgICAgaWNvbi5jbGFzc0xpc3QucmVtb3ZlKCd2b2x1bWVfX2ljb25faGFsZicpO1xuICAgICAgICBpY29uLmNsYXNzTGlzdC5hZGQoJ3ZvbHVtZV9faWNvbl9tdXRlJyk7XG4gICAgfVxuICAgIGlmKHZhbGlkVmFsdWUgPiAwICYmIHZhbGlkVmFsdWUgPD0gMC41KSB7XG4gICAgICAgIGljb24uY2xhc3NMaXN0LnJlbW92ZSgndm9sdW1lX19pY29uX211dGUnKTtcbiAgICAgICAgaWNvbi5jbGFzc0xpc3QuYWRkKCd2b2x1bWVfX2ljb25faGFsZicpO1xuICAgIH1cbiAgICBpZih2YWxpZFZhbHVlID4gMC41KSB7XG4gICAgICAgIGljb24uY2xhc3NMaXN0LnJlbW92ZSgndm9sdW1lX19pY29uX211dGUnKTtcbiAgICAgICAgaWNvbi5jbGFzc0xpc3QucmVtb3ZlKCd2b2x1bWVfX2ljb25faGFsZicpO1xuICAgIH1cbiAgICB2b2x1bWVTbGlkZXJGaWxsZWQuc3R5bGUud2lkdGggPSBgJHt2YWxpZFZhbHVlICogMTAwfSVgO1xuICAgIHBsYXllci52b2x1bWUgPSB2YWxpZFZhbHVlO1xufVxuXG5mdW5jdGlvbiBkcmF3UHJvZ3Jlc3ModmFsdWUpIHtcbiAgICBjb25zdCB2YWxpZFZhbHVlID0gdmFsdWUgPiAxID8gMSA6ICh2YWx1ZSA8IDAgPyAwIDogdmFsdWUpO1xuICAgIHByb2dyZXNzTGluZS5zdHlsZS53aWR0aCA9IGAke3ZhbGlkVmFsdWUgKiAxMDB9JWA7XG59XG5cbi8vIFZvbHVtZSBzZXR0aW5nc1xuY29uc3QgdXBkYXRlVm9sdW1lID0gKGUpID0+IHtcbiAgICBsZXQgcmF0aW8gPSAoZS5jbGllbnRYIC0gdm9sdW1lU2xpZGVyTm9kZS5vZmZzZXRMZWZ0KSAvIHZvbHVtZVNsaWRlck5vZGUub2Zmc2V0V2lkdGg7XG4gICAgc2V0Vm9sdW1lKHJhdGlvKTtcbn1cblxuY29uc3Qgdm9sdW1lU2xpZGVyID0gbmV3IFNsaWRlcih2b2x1bWVTbGlkZXJOb2RlLCB1cGRhdGVWb2x1bWUpO1xuXG52b2x1bWVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgY29uc3QgaWNvbiA9IHZvbHVtZUJ0bi5jaGlsZHJlblswXTtcbiAgICBpZihwbGF5ZXIubXV0ZWQpIHtcbiAgICAgICAgcGxheWVyLnVubXV0ZSgpO1xuICAgICAgICBpY29uLmNsYXNzTGlzdC5yZW1vdmUoJ3ZvbHVtZV9faWNvbl9tdXRlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcGxheWVyLm11dGUoKTtcbiAgICAgICAgaWNvbi5jbGFzc0xpc3QuYWRkKCd2b2x1bWVfX2ljb25fbXV0ZScpO1xuICAgIH1cbn0pO1xuXG4vLyDQvtCx0YDQsNCx0L7RgtGH0LjQuiBNb3VzZVNjcm9sbCBldmVudCfQsCDQtNC70Y8g0YPQv9GA0LDQstC70LXQvdC40Y8g0LPRgNC+0LzQutC+0YHRgtGM0Y5cbnZvbHVtZUJ0bi5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIChlKSA9PiB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBwbGF5ZXIudm9sdW1lICsgTWF0aC5zaWduKGUud2hlZWxEZWx0YVkpICogMC4wNTtcbiAgICBzZXRWb2x1bWUobmV3VmFsdWUpO1xufSk7XG5cbnZvbHVtZVNsaWRlck5vZGUuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCAoZSkgPT4ge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gcGxheWVyLnZvbHVtZSArIE1hdGguc2lnbihlLndoZWVsRGVsdGFZKSAqIDAuMDU7XG4gICAgc2V0Vm9sdW1lKG5ld1ZhbHVlKTtcbn0pO1xuXG4vLyBQcm9ncmVzcyBzZXR0aW5nc1xuY29uc3QgdXBkYXRlUHJvZ3Jlc3MgPSAoZSkgPT4ge1xuICAgIGxldCByYXRpbyA9IChlLmNsaWVudFggLSBwcm9ncmVzc0Jhci5vZmZzZXRMZWZ0KSAvIHByb2dyZXNzQmFyLm9mZnNldFdpZHRoO1xuICAgIGRyYXdQcm9ncmVzcyhyYXRpbyk7XG4gICAgcGxheWVyLnJld2luZChyYXRpbyk7XG59XG5jb25zdCBwcm9ncmVzc1NsaWRlciA9IG5ldyBTbGlkZXIocHJvZ3Jlc3NCYXIsIHVwZGF0ZVByb2dyZXNzKTtcblxuXG5jb25zdCB1cGRhdGVCdWZmZXIgPSAoZSkgPT4ge1xuICAgIGNvbnN0IGF1ZGlvID0gZS50YXJnZXQ7XG4gICAgY29uc3QgYnVmZmVyZWQgPSBhdWRpby5idWZmZXJlZDtcbiAgICBjb25zdCBidWZmUmF0aW8gPSBidWZmZXJlZC5sZW5ndGggPyBidWZmZXJlZC5lbmQoYnVmZmVyZWQubGVuZ3RoIC0gMSkgLyBhdWRpby5kdXJhdGlvbiAqIDEwMCA6IDA7XG4gICAgXG4gICAgcHJvZ3Jlc3NCdWZmZXIuc3R5bGUud2lkdGggPSBgJHtidWZmUmF0aW99JWA7XG59XG5cbnBsYXllci5vbigndHJhY2s6cHJvZ3Jlc3MnLCB1cGRhdGVCdWZmZXIpO1xucGxheWVyLm9uKCd0cmFjazpsb2FkZWRkYXRhJywgdXBkYXRlQnVmZmVyKTtcbnBsYXllci5vbigndHJhY2s6dGltZXVwZGF0ZScsIChlKSA9PiB7XG4gICAgY29uc3QgYXVkaW8gPSBlLnRhcmdldDtcbiAgICBjb25zdCBwbGF5ZWRSYXRpbyA9IGF1ZGlvLmN1cnJlbnRUaW1lIC8gYXVkaW8uZHVyYXRpb247XG4gICAgZHJhd1Byb2dyZXNzKHBsYXllZFJhdGlvKTtcbn0pO1xuXG5cbi8vIFBsYXllciBjb250cm9scyBzZXR0aW5nc1xucGxheUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBpZighcGxheWVyLmlzUGxheWluZykge1xuICAgICAgICBwbGF5QnRuLmNsYXNzTGlzdC5hZGQoJ3BsYXllci1jb250cm9sc19fYnRuX3BhdXNlJyk7XG4gICAgICAgIHBsYXllci5wbGF5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcGxheUJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdwbGF5ZXItY29udHJvbHNfX2J0bl9wYXVzZScpO1xuICAgICAgICBwbGF5ZXIucGF1c2UoKTtcbiAgICB9XG59KTtcblxucGxheU5leHRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIHBsYXlCdG4uY2xhc3NMaXN0LmFkZCgncGxheWVyLWNvbnRyb2xzX19idG5fcGF1c2UnKTtcbiAgICBwbGF5ZXIucGxheU5leHQoKTtcbn0pO1xuXG5wbGF5UHJldkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgcGxheUJ0bi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXItY29udHJvbHNfX2J0bl9wYXVzZScpO1xuICAgIHBsYXllci5wbGF5UHJldigpO1xufSk7XG4iXX0=
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