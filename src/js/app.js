import DOMBuilder from './utils/dom';
import AudioPlayer from './AudioPlayer';

const divq = DOMBuilder.createElement('div', {class: 'xyi', id: 'qwe'});
console.log(divq);

const player = new AudioPlayer('qwe');
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


