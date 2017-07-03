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

var AudioPlayer = function (_EventEmmiter) {
    _inherits(AudioPlayer, _EventEmmiter);

    // TODO: Create simple audio player with Web Audio API
    function AudioPlayer(node, playlist) {
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, AudioPlayer);

        var _this = _possibleConstructorReturn(this, (AudioPlayer.__proto__ || Object.getPrototypeOf(AudioPlayer)).call(this));

        _this.playlist = playlist || new _Playlist2.default();
        _this.currentTrackIndex = 0;
        _this._playback = {
            track: null,
            source: null,
            xhr: null,
            buffer: null,
            playing: false
            // init Audio API Nodes
        };_this._ctx = null;
        _this._gain = null;
        _this._createAudioApiNodes();
        return _this;
    }

    _createClass(AudioPlayer, [{
        key: 'play',
        value: function play() {
            this.on('track:load', this._startPlayback);
            this._loadTrack(this.playlist.tracks[this.currentTrackIndex]);
        }
    }, {
        key: 'stop',
        value: function stop() {}
    }, {
        key: 'pause',
        value: function pause() {}
    }, {
        key: '_loadTrack',
        value: function _loadTrack(track) {
            var _this2 = this;

            var src = track.src;
            // делаем XMLHttpRequest (AJAX) на сервер

            var xhr = new XMLHttpRequest();
            this._playback.xhr = xhr;
            this._playback.track = track;

            xhr.open('GET', src, true);
            xhr.responseType = 'arraybuffer'; // важно
            xhr.addEventListener('load', function (e) {
                // декодируем бинарный ответ
                _this2._ctx.decodeAudioData(xhr.response, function (decodedArrayBuffer) {
                    // получаем декодированный буфер
                    _this2._playback.buffer = decodedArrayBuffer;
                    _this2.emit('track:load');
                }, function (e) {
                    console.log('Error decoding file', e);
                });
            });
            xhr.send();

            return this;
        }
    }, {
        key: '_startPlayback',
        value: function _startPlayback() {
            var playback = this._playback;

            playback.source = this._ctx.createBufferSource();
            playback.source.connect(this._gain);
            playback.source.buffer = playback.buffer;

            playback.source.start(0);
            playback.playing = true;
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
    }]);

    return AudioPlayer;
}(_EventEmmiter3.default);

exports.default = AudioPlayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvUGxheWVyLmpzIl0sIm5hbWVzIjpbIkF1ZGlvUGxheWVyIiwibm9kZSIsInBsYXlsaXN0IiwicGFyYW1zIiwiY3VycmVudFRyYWNrSW5kZXgiLCJfcGxheWJhY2siLCJ0cmFjayIsInNvdXJjZSIsInhociIsImJ1ZmZlciIsInBsYXlpbmciLCJfY3R4IiwiX2dhaW4iLCJfY3JlYXRlQXVkaW9BcGlOb2RlcyIsIm9uIiwiX3N0YXJ0UGxheWJhY2siLCJfbG9hZFRyYWNrIiwidHJhY2tzIiwic3JjIiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwicmVzcG9uc2VUeXBlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJkZWNvZGVBdWRpb0RhdGEiLCJyZXNwb25zZSIsImRlY29kZWRBcnJheUJ1ZmZlciIsImVtaXQiLCJjb25zb2xlIiwibG9nIiwic2VuZCIsInBsYXliYWNrIiwiY3JlYXRlQnVmZmVyU291cmNlIiwiY29ubmVjdCIsInN0YXJ0Iiwid2luZG93IiwiQXVkaW9Db250ZXh0Iiwid2Via2l0QXVkaW9Db250ZXh0IiwiX2Rlc3QiLCJkZXN0aW5hdGlvbiIsImNyZWF0ZUdhaW4iXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVxQkEsVzs7O0FBQ2pCO0FBQ0EseUJBQVlDLElBQVosRUFBa0JDLFFBQWxCLEVBQXlDO0FBQUEsWUFBYkMsTUFBYSx1RUFBSixFQUFJOztBQUFBOztBQUFBOztBQUdyQyxjQUFLRCxRQUFMLEdBQWdCQSxZQUFZLHdCQUE1QjtBQUNBLGNBQUtFLGlCQUFMLEdBQXlCLENBQXpCO0FBQ0EsY0FBS0MsU0FBTCxHQUFpQjtBQUNiQyxtQkFBTyxJQURNO0FBRWJDLG9CQUFRLElBRks7QUFHYkMsaUJBQUssSUFIUTtBQUliQyxvQkFBUSxJQUpLO0FBS2JDLHFCQUFTO0FBRWI7QUFQaUIsU0FBakIsQ0FRQSxNQUFLQyxJQUFMLEdBQVksSUFBWjtBQUNBLGNBQUtDLEtBQUwsR0FBYSxJQUFiO0FBQ0EsY0FBS0Msb0JBQUw7QUFmcUM7QUFnQnhDOzs7OytCQUVNO0FBQ0gsaUJBQUtDLEVBQUwsQ0FBUSxZQUFSLEVBQXNCLEtBQUtDLGNBQTNCO0FBQ0EsaUJBQUtDLFVBQUwsQ0FBZ0IsS0FBS2QsUUFBTCxDQUFjZSxNQUFkLENBQXFCLEtBQUtiLGlCQUExQixDQUFoQjtBQUNIOzs7K0JBRU0sQ0FBRTs7O2dDQUVELENBQUU7OzttQ0FFQ0UsSyxFQUFPO0FBQUE7O0FBQUEsZ0JBQ1JZLEdBRFEsR0FDQVosS0FEQSxDQUNSWSxHQURRO0FBRWQ7O0FBQ0EsZ0JBQUlWLE1BQU0sSUFBSVcsY0FBSixFQUFWO0FBQ0EsaUJBQUtkLFNBQUwsQ0FBZUcsR0FBZixHQUFxQkEsR0FBckI7QUFDQSxpQkFBS0gsU0FBTCxDQUFlQyxLQUFmLEdBQXVCQSxLQUF2Qjs7QUFFQUUsZ0JBQUlZLElBQUosQ0FBUyxLQUFULEVBQWdCRixHQUFoQixFQUFxQixJQUFyQjtBQUNBVixnQkFBSWEsWUFBSixHQUFtQixhQUFuQixDQVJjLENBUW9CO0FBQ2xDYixnQkFBSWMsZ0JBQUosQ0FBcUIsTUFBckIsRUFBNkIsVUFBQ0MsQ0FBRCxFQUFPO0FBQ2hDO0FBQ0EsdUJBQUtaLElBQUwsQ0FBVWEsZUFBVixDQUEwQmhCLElBQUlpQixRQUE5QixFQUNJLFVBQUNDLGtCQUFELEVBQXdCO0FBQ3BCO0FBQ0EsMkJBQUtyQixTQUFMLENBQWVJLE1BQWYsR0FBd0JpQixrQkFBeEI7QUFDQSwyQkFBS0MsSUFBTCxDQUFVLFlBQVY7QUFDSCxpQkFMTCxFQUtPLFVBQUNKLENBQUQsRUFBTztBQUNOSyw0QkFBUUMsR0FBUixDQUFZLHFCQUFaLEVBQW1DTixDQUFuQztBQUNILGlCQVBMO0FBU0gsYUFYRDtBQVlBZixnQkFBSXNCLElBQUo7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOzs7eUNBRWdCO0FBQ2IsZ0JBQU1DLFdBQVcsS0FBSzFCLFNBQXRCOztBQUVBMEIscUJBQVN4QixNQUFULEdBQWtCLEtBQUtJLElBQUwsQ0FBVXFCLGtCQUFWLEVBQWxCO0FBQ0FELHFCQUFTeEIsTUFBVCxDQUFnQjBCLE9BQWhCLENBQXdCLEtBQUtyQixLQUE3QjtBQUNBbUIscUJBQVN4QixNQUFULENBQWdCRSxNQUFoQixHQUF5QnNCLFNBQVN0QixNQUFsQzs7QUFFQXNCLHFCQUFTeEIsTUFBVCxDQUFnQjJCLEtBQWhCLENBQXNCLENBQXRCO0FBQ0FILHFCQUFTckIsT0FBVCxHQUFtQixJQUFuQjtBQUNIOzs7K0NBRXNCO0FBQ25CLGlCQUFLQyxJQUFMLEdBQVksS0FBS3dCLE9BQU9DLFlBQVAsSUFBdUJELE9BQU9FLGtCQUFuQyxHQUFaO0FBQ0EsaUJBQUtDLEtBQUwsR0FBYSxLQUFLM0IsSUFBTCxDQUFVNEIsV0FBdkI7QUFDQSxpQkFBSzNCLEtBQUwsR0FBYSxLQUFLRCxJQUFMLENBQVU2QixVQUFWLEVBQWI7O0FBRUE7QUFDQSxpQkFBSzVCLEtBQUwsQ0FBV3FCLE9BQVgsQ0FBbUIsS0FBS0ssS0FBeEI7O0FBRUEsbUJBQU8sSUFBUDtBQUNIOzs7Ozs7a0JBM0VnQnRDLFciLCJmaWxlIjoiQXVkaW9QbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbmltcG9ydCBQbGF5bGlzdCBmcm9tICcuL1BsYXlsaXN0JztcbmltcG9ydCBFdmVudEVtbWl0ZXIgZnJvbSAnLi91dGlscy9FdmVudEVtbWl0ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdWRpb1BsYXllciBleHRlbmRzIEV2ZW50RW1taXRlciB7XG4gICAgLy8gVE9ETzogQ3JlYXRlIHNpbXBsZSBhdWRpbyBwbGF5ZXIgd2l0aCBXZWIgQXVkaW8gQVBJXG4gICAgY29uc3RydWN0b3Iobm9kZSwgcGxheWxpc3QsIHBhcmFtcyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5wbGF5bGlzdCA9IHBsYXlsaXN0IHx8IG5ldyBQbGF5bGlzdCgpO1xuICAgICAgICB0aGlzLmN1cnJlbnRUcmFja0luZGV4ID0gMDtcbiAgICAgICAgdGhpcy5fcGxheWJhY2sgPSB7XG4gICAgICAgICAgICB0cmFjazogbnVsbCxcbiAgICAgICAgICAgIHNvdXJjZTogbnVsbCxcbiAgICAgICAgICAgIHhocjogbnVsbCxcbiAgICAgICAgICAgIGJ1ZmZlcjogbnVsbCxcbiAgICAgICAgICAgIHBsYXlpbmc6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgLy8gaW5pdCBBdWRpbyBBUEkgTm9kZXNcbiAgICAgICAgdGhpcy5fY3R4ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZ2FpbiA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NyZWF0ZUF1ZGlvQXBpTm9kZXMoKTtcbiAgICB9XG5cbiAgICBwbGF5KCkge1xuICAgICAgICB0aGlzLm9uKCd0cmFjazpsb2FkJywgdGhpcy5fc3RhcnRQbGF5YmFjayk7XG4gICAgICAgIHRoaXMuX2xvYWRUcmFjayh0aGlzLnBsYXlsaXN0LnRyYWNrc1t0aGlzLmN1cnJlbnRUcmFja0luZGV4XSk7XG4gICAgfVxuXG4gICAgc3RvcCgpIHt9XG5cbiAgICBwYXVzZSgpIHt9XG5cbiAgICBfbG9hZFRyYWNrKHRyYWNrKSB7XG4gICAgICAgIGxldCB7IHNyYyB9ID0gdHJhY2s7XG4gICAgICAgIC8vINC00LXQu9Cw0LXQvCBYTUxIdHRwUmVxdWVzdCAoQUpBWCkg0L3QsCDRgdC10YDQstC10YBcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB0aGlzLl9wbGF5YmFjay54aHIgPSB4aHI7XG4gICAgICAgIHRoaXMuX3BsYXliYWNrLnRyYWNrID0gdHJhY2s7XG5cbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHNyYywgdHJ1ZSk7XG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInOyAvLyDQstCw0LbQvdC+XG4gICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGUpID0+IHtcbiAgICAgICAgICAgIC8vINC00LXQutC+0LTQuNGA0YPQtdC8INCx0LjQvdCw0YDQvdGL0Lkg0L7RgtCy0LXRglxuICAgICAgICAgICAgdGhpcy5fY3R4LmRlY29kZUF1ZGlvRGF0YSh4aHIucmVzcG9uc2UsXG4gICAgICAgICAgICAgICAgKGRlY29kZWRBcnJheUJ1ZmZlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyDQv9C+0LvRg9GH0LDQtdC8INC00LXQutC+0LTQuNGA0L7QstCw0L3QvdGL0Lkg0LHRg9GE0LXRgFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wbGF5YmFjay5idWZmZXIgPSBkZWNvZGVkQXJyYXlCdWZmZXI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgndHJhY2s6bG9hZCcpO1xuICAgICAgICAgICAgICAgIH0sIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBkZWNvZGluZyBmaWxlJywgZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHhoci5zZW5kKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgX3N0YXJ0UGxheWJhY2soKSB7XG4gICAgICAgIGNvbnN0IHBsYXliYWNrID0gdGhpcy5fcGxheWJhY2s7XG5cbiAgICAgICAgcGxheWJhY2suc291cmNlID0gdGhpcy5fY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgICBwbGF5YmFjay5zb3VyY2UuY29ubmVjdCh0aGlzLl9nYWluKTtcbiAgICAgICAgcGxheWJhY2suc291cmNlLmJ1ZmZlciA9IHBsYXliYWNrLmJ1ZmZlcjtcblxuICAgICAgICBwbGF5YmFjay5zb3VyY2Uuc3RhcnQoMCk7XG4gICAgICAgIHBsYXliYWNrLnBsYXlpbmcgPSB0cnVlO1xuICAgIH1cblxuICAgIF9jcmVhdGVBdWRpb0FwaU5vZGVzKCkge1xuICAgICAgICB0aGlzLl9jdHggPSBuZXcgKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCkoKTtcbiAgICAgICAgdGhpcy5fZGVzdCA9IHRoaXMuX2N0eC5kZXN0aW5hdGlvbjtcbiAgICAgICAgdGhpcy5fZ2FpbiA9IHRoaXMuX2N0eC5jcmVhdGVHYWluKCk7XG5cbiAgICAgICAgLy8gQ29ubmVjdCBOb2Rlc1xuICAgICAgICB0aGlzLl9nYWluLmNvbm5lY3QodGhpcy5fZGVzdCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIl19
},{"./Playlist":2,"./utils/EventEmmiter":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Track = require("./Track");

var _Track2 = _interopRequireDefault(_Track);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Playlist = function () {
    function Playlist(tracks) {
        _classCallCheck(this, Playlist);

        this._tracks = [];
    }

    _createClass(Playlist, [{
        key: "addTrack",
        value: function addTrack(src, name) {
            var track = new _Track2.default(src, name);
            this.tracks.push(track);

            return this;
        }
    }, {
        key: "tracks",
        get: function get() {
            return this._tracks;
        }
    }]);

    return Playlist;
}();

exports.default = Playlist;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYXlsaXN0LmpzIl0sIm5hbWVzIjpbIlBsYXlsaXN0IiwidHJhY2tzIiwiX3RyYWNrcyIsInNyYyIsIm5hbWUiLCJ0cmFjayIsInB1c2giXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQUVBOzs7Ozs7OztJQUVxQkEsUTtBQUNqQixzQkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUNoQixhQUFLQyxPQUFMLEdBQWUsRUFBZjtBQUNIOzs7O2lDQU1RQyxHLEVBQUtDLEksRUFBTTtBQUNoQixnQkFBTUMsUUFBUSxvQkFBVUYsR0FBVixFQUFlQyxJQUFmLENBQWQ7QUFDQSxpQkFBS0gsTUFBTCxDQUFZSyxJQUFaLENBQWlCRCxLQUFqQjs7QUFFQSxtQkFBTyxJQUFQO0FBQ0g7Ozs0QkFUWTtBQUNULG1CQUFPLEtBQUtILE9BQVo7QUFDSDs7Ozs7O2tCQVBnQkYsUSIsImZpbGUiOiJQbGF5bGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgVHJhY2sgZnJvbSAnLi9UcmFjayc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXlsaXN0IHtcbiAgICBjb25zdHJ1Y3Rvcih0cmFja3MpIHtcbiAgICAgICAgdGhpcy5fdHJhY2tzID0gW107XG4gICAgfVxuXG4gICAgZ2V0IHRyYWNrcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYWNrcztcbiAgICB9XG5cbiAgICBhZGRUcmFjayhzcmMsIG5hbWUpIHtcbiAgICAgICAgY29uc3QgdHJhY2sgPSBuZXcgVHJhY2soc3JjLCBuYW1lKTtcbiAgICAgICAgdGhpcy50cmFja3MucHVzaCh0cmFjayk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufSJdfQ==
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var playerNode = document.getElementById("player");

var player = new _AudioPlayer2.default();
player.playlist.addTrack(['./../media/System_Of_A_Down_-_Aerials.mp3']);
player.play();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfYzdlNmU5ZmMuanMiXSwibmFtZXMiOlsicGxheWVyTm9kZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJwbGF5ZXIiLCJwbGF5bGlzdCIsImFkZFRyYWNrIiwicGxheSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxhQUFhQyxTQUFTQyxjQUFULENBQXdCLFFBQXhCLENBQW5COztBQUVBLElBQU1DLFNBQVMsMkJBQWY7QUFDQUEsT0FBT0MsUUFBUCxDQUFnQkMsUUFBaEIsQ0FBeUIsQ0FBQywyQ0FBRCxDQUF6QjtBQUNBRixPQUFPRyxJQUFQIiwiZmlsZSI6ImZha2VfYzdlNmU5ZmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXVkaW9QbGF5ZXIgZnJvbSAnLi9BdWRpb1BsYXllcic7XG5pbXBvcnQgUGxheWxpc3QgZnJvbSAnLi9QbGF5bGlzdCc7XG5cbmNvbnN0IHBsYXllck5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXllclwiKTtcblxuY29uc3QgcGxheWVyID0gbmV3IEF1ZGlvUGxheWVyKCk7XG5wbGF5ZXIucGxheWxpc3QuYWRkVHJhY2soWycuLy4uL21lZGlhL1N5c3RlbV9PZl9BX0Rvd25fLV9BZXJpYWxzLm1wMyddKTtcbnBsYXllci5wbGF5KCk7Il19
},{"./AudioPlayer":1,"./Playlist":2}],5:[function(require,module,exports){
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