(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _dom = require('./utils/dom');

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioPlayer = function AudioPlayer(node) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, AudioPlayer);

    console.log(_dom2.default.createElement('div', { class: 'qwe' }));
};

exports.default = AudioPlayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvUGxheWVyLmpzIl0sIm5hbWVzIjpbIkF1ZGlvUGxheWVyIiwibm9kZSIsInBhcmFtcyIsImNvbnNvbGUiLCJsb2ciLCJjcmVhdGVFbGVtZW50IiwiY2xhc3MiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUFFQTs7Ozs7Ozs7SUFFcUJBLFcsR0FDakIscUJBQVlDLElBQVosRUFBK0I7QUFBQSxRQUFiQyxNQUFhLHVFQUFKLEVBQUk7O0FBQUE7O0FBQzNCQyxZQUFRQyxHQUFSLENBQVksY0FBV0MsYUFBWCxDQUF5QixLQUF6QixFQUFnQyxFQUFDQyxPQUFNLEtBQVAsRUFBaEMsQ0FBWjtBQUNILEM7O2tCQUhnQk4sVyIsImZpbGUiOiJBdWRpb1BsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IERPTUJ1aWxkZXIgZnJvbSAnLi91dGlscy9kb20nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXVkaW9QbGF5ZXIge1xyXG4gICAgY29uc3RydWN0b3Iobm9kZSwgcGFyYW1zID0ge30pIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhET01CdWlsZGVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtjbGFzczoncXdlJ30pKTtcclxuICAgIH1cclxufVxyXG4iXX0=
},{"./utils/dom":3}],2:[function(require,module,exports){
'use strict';

var _dom = require('./utils/dom');

var _dom2 = _interopRequireDefault(_dom);

var _AudioPlayer = require('./AudioPlayer');

var _AudioPlayer2 = _interopRequireDefault(_AudioPlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var divq = _dom2.default.createElement('div', { class: 'xyi', id: 'qwe' });
console.log(divq);

var player = new _AudioPlayer2.default('qwe');
// const gainControl = document.querySelector('#gain_level');
// const audioElement = document.querySelector('body > audio');

// const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// const source = audioCtx.createMediaElementSource(audioElement);
// // const analyser = audioCtx.createAnalyser();
// // analyser.fftSize = 2048;

// // const bufferLength = analyser.fftSize;
// // let dataArray = new Uint8Array(bufferLength);
// // analyser.getByteTimeDomainData(dataArray);

// audioElement.addEventListener('canplay', () => {
//     // source.connect(analyser);
//     // analyser.connect(audioCtx.destination);

//     const gainNode = audioCtx.createGain();
//     gainNode.gain.value = 0.4;
//     source.connect(gainNode);
//     gainNode.connect(audioCtx.destination);


//     gainControl.addEventListener('change', (e) => {
//         gainNode.gain.value = e.target.value;
//     });

//     audioElement.play(0);
// });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZha2VfNjEwMGEzNS5qcyJdLCJuYW1lcyI6WyJkaXZxIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzIiwiaWQiLCJjb25zb2xlIiwibG9nIiwicGxheWVyIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLE9BQU8sY0FBV0MsYUFBWCxDQUF5QixLQUF6QixFQUFnQyxFQUFDQyxPQUFPLEtBQVIsRUFBZUMsSUFBSSxLQUFuQixFQUFoQyxDQUFiO0FBQ0FDLFFBQVFDLEdBQVIsQ0FBWUwsSUFBWjs7QUFFQSxJQUFNTSxTQUFTLDBCQUFnQixLQUFoQixDQUFmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSIsImZpbGUiOiJmYWtlXzYxMDBhMzUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRE9NQnVpbGRlciBmcm9tICcuL3V0aWxzL2RvbSc7XHJcbmltcG9ydCBBdWRpb1BsYXllciBmcm9tICcuL0F1ZGlvUGxheWVyJztcclxuXHJcbmNvbnN0IGRpdnEgPSBET01CdWlsZGVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtjbGFzczogJ3h5aScsIGlkOiAncXdlJ30pO1xyXG5jb25zb2xlLmxvZyhkaXZxKTtcclxuXHJcbmNvbnN0IHBsYXllciA9IG5ldyBBdWRpb1BsYXllcigncXdlJyk7XHJcbi8vIGNvbnN0IGdhaW5Db250cm9sID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dhaW5fbGV2ZWwnKTtcclxuLy8gY29uc3QgYXVkaW9FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keSA+IGF1ZGlvJyk7XHJcblxyXG4vLyBjb25zdCBhdWRpb0N0eCA9IG5ldyAod2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0KSgpO1xyXG4vLyBjb25zdCBzb3VyY2UgPSBhdWRpb0N0eC5jcmVhdGVNZWRpYUVsZW1lbnRTb3VyY2UoYXVkaW9FbGVtZW50KTtcclxuLy8gLy8gY29uc3QgYW5hbHlzZXIgPSBhdWRpb0N0eC5jcmVhdGVBbmFseXNlcigpO1xyXG4vLyAvLyBhbmFseXNlci5mZnRTaXplID0gMjA0ODtcclxuXHJcbi8vIC8vIGNvbnN0IGJ1ZmZlckxlbmd0aCA9IGFuYWx5c2VyLmZmdFNpemU7XHJcbi8vIC8vIGxldCBkYXRhQXJyYXkgPSBuZXcgVWludDhBcnJheShidWZmZXJMZW5ndGgpO1xyXG4vLyAvLyBhbmFseXNlci5nZXRCeXRlVGltZURvbWFpbkRhdGEoZGF0YUFycmF5KTtcclxuXHJcbi8vIGF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjYW5wbGF5JywgKCkgPT4ge1xyXG4vLyAgICAgLy8gc291cmNlLmNvbm5lY3QoYW5hbHlzZXIpO1xyXG4vLyAgICAgLy8gYW5hbHlzZXIuY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbik7XHJcblxyXG4vLyAgICAgY29uc3QgZ2Fpbk5vZGUgPSBhdWRpb0N0eC5jcmVhdGVHYWluKCk7XHJcbi8vICAgICBnYWluTm9kZS5nYWluLnZhbHVlID0gMC40O1xyXG4vLyAgICAgc291cmNlLmNvbm5lY3QoZ2Fpbk5vZGUpO1xyXG4vLyAgICAgZ2Fpbk5vZGUuY29ubmVjdChhdWRpb0N0eC5kZXN0aW5hdGlvbik7XHJcblxyXG4gICAgXHJcbi8vICAgICBnYWluQ29udHJvbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xyXG4vLyAgICAgICAgIGdhaW5Ob2RlLmdhaW4udmFsdWUgPSBlLnRhcmdldC52YWx1ZTtcclxuLy8gICAgIH0pO1xyXG5cclxuLy8gICAgIGF1ZGlvRWxlbWVudC5wbGF5KDApO1xyXG4vLyB9KTtcclxuXHJcblxyXG4iXX0=
},{"./AudioPlayer":1,"./utils/dom":3}],3:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvbS5qcyJdLCJuYW1lcyI6WyJET01CdWlsZGVyIiwiRXJyb3IiLCJ0YWdOYW1lIiwiYXR0cnMiLCJjYWxsYmFjayIsImVsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJfaW5zZXJ0QXR0cmlidXRlcyIsInByb3AiLCJoYXNPd25Qcm9wZXJ0eSIsInNldEF0dHJpYnV0ZSJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7SUFFcUJBLFU7QUFDakIsMEJBQWM7QUFBQTs7QUFDVixjQUFNLElBQUlDLEtBQUosQ0FBVSx3REFBVixDQUFOO0FBQ0g7Ozs7c0NBRW9CQyxPLEVBQW9DO0FBQUEsZ0JBQTNCQyxLQUEyQix1RUFBckIsSUFBcUI7QUFBQSxnQkFBZkMsUUFBZSx1RUFBTixJQUFNOztBQUNyRCxnQkFBTUMsVUFBVUMsU0FBU0MsYUFBVCxNQUEwQkwsT0FBMUIsQ0FBaEI7O0FBRUEsZ0JBQUlDLEtBQUosRUFBVztBQUNQSCwyQkFBV1EsaUJBQVgsQ0FBNkJILE9BQTdCLEVBQXNDRixLQUF0QztBQUNIOztBQUVELGdCQUFJQyxRQUFKLEVBQWM7QUFDVkEseUJBQVNDLE9BQVQ7QUFDSDs7QUFFRCxtQkFBT0EsT0FBUDtBQUNIOzs7MENBRXdCQSxPLEVBQVNGLEssRUFBTztBQUNyQyxpQkFBSyxJQUFJTSxJQUFULElBQWlCTixLQUFqQixFQUF3QjtBQUNwQixvQkFBSUEsTUFBTU8sY0FBTixDQUFxQkQsSUFBckIsQ0FBSixFQUFnQztBQUM1QkosNEJBQVFNLFlBQVIsQ0FBcUJGLElBQXJCLEVBQTJCTixNQUFNTSxJQUFOLENBQTNCO0FBQ0g7QUFDSjtBQUNKOzs7Ozs7a0JBekJnQlQsVSIsImZpbGUiOiJkb20uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERPTUJ1aWxkZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIGlzIHN0YXRpYyBjbGFzcy4gQ3JlYXRpbmcgaW5zdGFuY2VzIGlzIGZvcmJpZGRlbi4nKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY3JlYXRlRWxlbWVudCh0YWdOYW1lLCBhdHRycz1udWxsLCBjYWxsYmFjaz1udWxsKSB7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYCR7dGFnTmFtZX1gKTtcclxuXHJcbiAgICAgICAgaWYgKGF0dHJzKSB7XHJcbiAgICAgICAgICAgIERPTUJ1aWxkZXIuX2luc2VydEF0dHJpYnV0ZXMoZWxlbWVudCwgYXR0cnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgX2luc2VydEF0dHJpYnV0ZXMoZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICBmb3IgKHZhciBwcm9wIGluIGF0dHJzKSB7XHJcbiAgICAgICAgICAgIGlmIChhdHRycy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUocHJvcCwgYXR0cnNbcHJvcF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==
},{}]},{},[2])