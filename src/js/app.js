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

const tracks = [
  'http://freshly-ground.com/data/audio/mpc/20090207%20-%20Loverman.mp3',
  './../media/02 - Needles.mp3',
  './../media/03 - Deer Dance.mp3',
  './../media/04 - Jet Pilot.mp3',
  './../media/05 - X.mp3',
  './../media/06 - Chop Suey!.mp3',
];

const player = new AudioPlayer(tracks, { equalizer: true, analyser: false });
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
