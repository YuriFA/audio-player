import AudioPlayer from './AudioPlayer';
import RangeSlider from './utils/RangeSlider';
import { roundedRect, validateInRange, calcPolarCoords } from './utils';

const playBtn = document.querySelector('.player-controls__btn_play');
const playNextBtn = document.querySelector('.player-controls__btn_next');
const playPrevBtn = document.querySelector('.player-controls__btn_prev');

const volumeBtn = document.querySelector('.volume__btn');
const volumeSliderNode = document.querySelector('.volume__slider');

const progressBar = document.querySelector('.progress__bar');

const equalizerBtn = document.querySelector('.player-controls__btn_equalizer');
const equalizerPopup = document.querySelector('.equalizer-popup');
const equalizerBands = document.querySelectorAll('.equalizer-band__slider');

const visualizerCanvas = document.querySelector('#visualizer');
visualizerCanvas.width = document.body.clientWidth;


const showFreqBtn = document.querySelector('.show_frequency');

const tracks = [
  'https://singles2017.s3.amazonaws.com/uploads/file1496417854957.mp3',
  'http://freshly-ground.com/data/audio/mpc/20090207%20-%20Loverman.mp3',
  './assets/media/Alex_Cohen_-_Good_Old_Times.mp3',
  './assets/media/RogerThat_-_Beautiful_Wonderful_Life.mp3',
  './assets/media/RogerThat_-_Lucky_Day.mp3',
  './assets/media/Roller_Genoa_-_Build_My_Gallows_High.mp3',
];

const player = new AudioPlayer(tracks, { equalizer: true, analyser: true });
player.volume = 0.5;


showFreqBtn.addEventListener('click', (event) => {
  const freq = player.analyser.updateData().bTimeData.slice();
  console.log(freq);
});

// Volume settings
const setVolume = (value) => {
  const icon = volumeBtn.children[0];
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

const volumeSlider = new RangeSlider(volumeSliderNode, {
  value: player.volume,
  onchange: setVolume,
  onmove: setVolume,
});

volumeBtn.addEventListener('click', (event) => {
  event.preventDefault();
  const icon = volumeBtn.children[0];
  if (player.muted) {
    player.unmute();
    icon.classList.remove('volume__icon_mute');
  } else {
    player.mute();
    icon.classList.add('volume__icon_mute');
  }
});

// MouseScroll event handler to control the volume
const onwheelUpdateVolume = (event) => {
  event.preventDefault();
  const newValue = player.volume + (Math.sign(event.wheelDeltaY) * 0.05);
  volumeSlider.setValue(newValue);
  setVolume(newValue);
};

volumeBtn.addEventListener('wheel', onwheelUpdateVolume);
volumeSliderNode.addEventListener('wheel', onwheelUpdateVolume);

// Progress settings
const progressSlider = new RangeSlider(progressBar, {
  handle: false,
  buffer: true,
  onchange: (value) => {
    player.rewind(value);
  },
});

const updateBuffer = (event) => {
  const audio = event.target;
  const buffered = audio.buffered;
  const buffRatio = buffered.length ? buffered.end(buffered.length - 1) / audio.duration : 0;

  progressSlider.setBuffer(buffRatio);
};

player.on('track:progress', updateBuffer);
player.on('track:loadeddata', updateBuffer);
player.on('track:canplaythrough', updateBuffer);
player.on('track:timeupdate', (event) => {
  const audio = event.target;
  const ratio = audio.currentTime / audio.duration;
  progressSlider.setValue(ratio);
});


// Player controls settings
playBtn.addEventListener('click', () => {
  if (!player.isPlaying) {
    playBtn.classList.add('player-controls__btn_pause');
    player.play();
    visualize();
  } else {
    playBtn.classList.remove('player-controls__btn_pause');
    player.pause();
  }
});

playNextBtn.addEventListener('click', () => {
  playBtn.classList.add('player-controls__btn_pause');
  player.playNext();
});

playPrevBtn.addEventListener('click', () => {
  playBtn.classList.add('player-controls__btn_pause');
  player.playPrev();
});

// Equalizer settings
equalizerBtn.addEventListener('click', (event) => {
  event.preventDefault();
  equalizerPopup.classList.toggle('equalizer-popup__open');
});

equalizerBands.forEach((band, i) => {
  const filterValue = player.equalizer.getFilterGain(i);
  const bandSlider = new RangeSlider(band, {
    vertical: true,
    min: -12,
    max: 12,
    value: filterValue,
    onchange: (value) => {
      player.equalizer.changeFilterGain(i, value);
    },
    onmove: (value) => {
      player.equalizer.changeFilterGain(i, value);
    },
  });
});

// Visualize
const ctx = visualizerCanvas.getContext('2d');

ctx.beginPath();
ctx.strokeStyle = '#FF0000';
ctx.lineWidth = 0.5;

// const r = 100;
// const centerX = 200;
// const centerY = 200;

// ctx.moveTo(centerX, centerY);

// for (let i = 0; i < 360; i += 1) {
//   const radAngle = (i * Math.PI) / 180;
//   const position = calcPolarCoords(r + 10, radAngle);
//   if (i === 60) {
//     ctx.strokeStyle = '#00FF00';
//     ctx.lineTo(centerX + position.x, centerY + position.y);
//     ctx.strokeStyle = '#FF0000';
//   } else {
//     ctx.lineTo(centerX + position.x, centerY + position.y);
//   }
// }

// (function myLoop(i) {
//   setTimeout(function () {
//     const radAngle = (i * Math.PI) / 180;
//     const position = calcPolarCoords(r + 10, radAngle);
//     if (i === 60) {
//       ctx.strokeStyle = '#00FF00';
//       ctx.lineTo(centerX + position.x, centerY + position.y);
//       ctx.strokeStyle = '#FF0000';
//     } else {
//       ctx.lineTo(centerX + position.x, centerY + position.y);
//     }
//     console.log(i);

//     ctx.stroke();
//     if (--i) {
//       myLoop(i);
//     }
//   }, 10);
// })(360);

ctx.stroke();

ctx.strokeStyle = '#FFFFFF';
ctx.fillStyle = '#FFFFFF';
ctx.lineJoin = 'round';
const { width, height } = visualizerCanvas;
const columnWidth = 1;
const marginWidth = 1;
const sectionWidth = columnWidth + marginWidth;
const columnRadius = 3;

const yAxisOffset = 100;
const yAxisStart = height - yAxisOffset;
const sideOffset = 200;
const scale = 1;
const mirrorScale = 0.5;

const columnCount = width / sectionWidth;

const visualize = () => {
  const analyser = player.analyser;
  // const length = analyser.analyser.frequencyBinCount;
  // const fftSize = analyser.analyser.fftSize;
  const {
    fftSize,
    minDecibels: minDb,
    maxDecibels: maxDb,
    frequencyBinCount: length,
  } = analyser.analyser;

  const r = 200;
  const centerX = (width / 2) - r;
  const centerY = 300;

  const step = 360 / (length - 1);

  let animationId;
  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const frequencyData = analyser.updateData().fFrequencyData;

    ctx.beginPath();
    // ctx.moveTo(0, yAxisStart);
    // for (let i = 0; i < length; i += 1) {
    //   ctx.lineTo(
    //     (i / length) * width,
    //     yAxisStart - frequencyData[i]);
    // }
    let startPosition;
    for (let i = 0; i < length; i += 1) {
      const angle = 360 - (i * step);
      const radAngle = (angle * Math.PI) / 180;
      const position = calcPolarCoords(r + frequencyData[i], radAngle);
      if (i === 0) {
        startPosition = position;
      }
      // ctx.fillRect(centerX + position.x, centerY + position.y, 2, 2);
      ctx.lineTo(centerX + position.x, centerY + position.y);
    }

    ctx.lineTo(centerX + startPosition.x, centerY + startPosition.y)
    ctx.fill();
    ctx.stroke();

    if (!player.isPlaying) {
      cancelAnimationFrame(animationId);
    }
    animationId = requestAnimationFrame(draw);
  };
  if (!animationId) {
    animationId = requestAnimationFrame(draw);
  }
};
