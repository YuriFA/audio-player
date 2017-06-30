'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _AudioPlayer = require('./AudioPlayer');

var _AudioPlayer2 = _interopRequireDefault(_AudioPlayer);

var _utilsDomJs = require('utils/dom.js');

var _utilsDomJs2 = _interopRequireDefault(_utilsDomJs);

var divq = _utilsDomJs2['default'].createElement('div', { 'class': 'xyi', id: 'qwe' });
console.log(divq);
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
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioPlayer = function AudioPlayer(node) {
    var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, AudioPlayer);
};

exports["default"] = AudioPlayer;
module.exports = exports["default"];
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Equalizer = function Equalizer(params) {
    _classCallCheck(this, Equalizer);
};

exports["default"] = Equalizer;
module.exports = exports["default"];
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DOMBuilder = (function () {
    function DOMBuilder() {
        _classCallCheck(this, DOMBuilder);

        throw new Error('This is static class. Creating instances is forbidden.');
    }

    _createClass(DOMBuilder, null, [{
        key: "createElement",
        value: function createElement(tagName) {
            var attrs = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
            var callback = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

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
})();

exports["default"] = DOMBuilder;
module.exports = exports["default"];
