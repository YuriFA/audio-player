import AudioPlayer from './AudioPlayer';
import RangeSlider from './utils/RangeSlider';

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

const tracks = [
  'http://freshly-ground.com/data/audio/mpc/20090207%20-%20Loverman.mp3',
  './../media/Alex_Cohen_-_Good_Old_Times.mp3',
  './../media/RogerThat_-_Beautiful_Wonderful_Life.mp3',
  './../media/RogerThat_-_Lucky_Day.mp3',
  './../media/Roller_Genoa_-_Build_My_Gallows_High.mp3',
];

const player = new AudioPlayer(tracks, { equalizer: true, analyser: true });
player.volume = 0.5;

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
const canvasContext = visualizerCanvas.getContext('2d');
const { width, height } = visualizerCanvas;
const columnWidth = 15;
const marginWidth = 5;
const sectionWidth = columnWidth + marginWidth;
const columnCount = width / sectionWidth;

// console.log(analyser.bFrequencyData);

const visualize = () => {
  const analyser = player.analyser;
  let animationId;
  const draw = () => {
    canvasContext.clearRect(0, 0, width, height);
    analyser.updateData();
    const frequencyData = analyser.bFrequencyData;
    const step = Math.round(frequencyData.length / columnCount);

    for (let i = 0; i < columnCount; i += 1) {
      const frequencyValue = frequencyData[i * step];
      canvasContext.fillRect(
        (i * sectionWidth),
        (height - frequencyValue),
        columnWidth,
        frequencyValue);
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

