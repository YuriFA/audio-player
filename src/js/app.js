import AudioPlayer from './AudioPlayer';
import Playlist from './Playlist';
import DOMBuidler from './utils/DOMBuilder';
import RangeSlider from './utils/RangeSlider';

const playerNode = document.getElementById("player");
const playBtn = document.querySelector('.player-controls__btn_play');
const playNextBtn = document.querySelector('.player-controls__btn_next');
const playPrevBtn = document.querySelector('.player-controls__btn_prev');

const volumeBtn = document.querySelector('.volume__btn');
const volumeSliderNode = document.querySelector('.volume__slider');
const volumeSliderFilled = document.querySelector('.volume__slider .slider-horiz__filled');

const progressBar = document.querySelector('.progress__bar');
const progressBuffer = document.querySelector('.progress__buffer');
const progressLine = document.querySelector('.progress__line');

const equalizerBands = document.querySelectorAll('.equalizer-band__slider');

const tracks = [
    'http://freshly-ground.com/data/audio/mpc/20090207%20-%20Loverman.mp3',
    // './../media/02 - Needles.mp3',
    // './../media/03 - Deer Dance.mp3',
    // './../media/04 - Jet Pilot.mp3',
    // './../media/05 - X.mp3',
    // './../media/06 - Chop Suey!.mp3',
];

const player = new AudioPlayer(tracks);
player.volume = 0.1;
setVolume(player.volume);

function setVolume(value) {
    const icon = volumeBtn.children[0];
    if(value === 0) {
        icon.classList.remove('volume__icon_half');
        icon.classList.add('volume__icon_mute');
    }
    if(value > 0 && value <= 0.5) {
        icon.classList.remove('volume__icon_mute');
        icon.classList.add('volume__icon_half');
    }
    if(value > 0.5) {
        icon.classList.remove('volume__icon_mute');
        icon.classList.remove('volume__icon_half');
    }
    volumeSliderFilled.style.width = `${value * 100}%`;
    player.volume = value;
}

function drawProgress(value) {
    progressLine.style.width = `${value * 100}%`;
}

// Volume settings
const updateVolume = (e) => {
    let ratio = (e.clientX - volumeSliderNode.offsetLeft) / volumeSliderNode.offsetWidth;
    setVolume(ratio);
}

const volumeSlider = new RangeSlider(volumeSliderNode, {
    value: player.volume,
    onchange: setVolume
});

volumeBtn.addEventListener('click', () => {
    const icon = volumeBtn.children[0];
    if(player.muted) {
        player.unmute();
        icon.classList.remove('volume__icon_mute');
    } else {
        player.mute();
        icon.classList.add('volume__icon_mute');
    }
});

// обработчик MouseScroll event'а для управления громкостью
volumeBtn.addEventListener('wheel', (e) => {
    e.preventDefault();
    const newValue = player.volume + Math.sign(e.wheelDeltaY) * 0.05;
    setVolume(newValue);
});

volumeSliderNode.addEventListener('wheel', (e) => {
    e.preventDefault();
    const newValue = player.volume + Math.sign(e.wheelDeltaY) * 0.05;
    setVolume(newValue);
});

// Progress settings
const setProgress = (ratio) => {
    drawProgress(ratio);
    player.rewind(ratio);
}
const progressSlider = new RangeSlider(progressBar, {
    onchange: setProgress
});


const updateBuffer = (e) => {
    const audio = e.target;
    const buffered = audio.buffered;
    const buffRatio = buffered.length ? buffered.end(buffered.length - 1) / audio.duration : 0;
    
    progressBuffer.style.width = `${buffRatio * 100}%`;
}

player.on('track:progress', updateBuffer);
player.on('track:loadeddata', updateBuffer);
player.on('track:canplaythrough', updateBuffer);
player.on('track:timeupdate', (e) => {
    const audio = e.target;
    const playedRatio = audio.currentTime / audio.duration;
    drawProgress(playedRatio);
});


// Player controls settings
playBtn.addEventListener('click', () => {
    if(!player.isPlaying) {
        playBtn.classList.add('player-controls__btn_pause');
        player.play();
    } else {
        playBtn.classList.remove('player-controls__btn_pause');
        player.pause();
    }
});

playNextBtn.addEventListener('click', (e) => {
    playBtn.classList.add('player-controls__btn_pause');
    player.playNext();
});

playPrevBtn.addEventListener('click', (e) => {
    playBtn.classList.add('player-controls__btn_pause');
    player.playPrev();
});

//Equalizer settings
equalizerBands.forEach((band, i) => {
    const bandFilled = band.querySelector('.slider-vert__filled');
    const filterValue = player.getEqualizerFilterGain(i);
    const bandSlider = new RangeSlider(band, {
        vertical: true,
        min: -12,
        max: 12,
        value: filterValue,
        onchange: (ratio) => {
            const gain = (ratio - 0.5) * 24;
            console.log(gain);
            bandFilled.style.height = `${ratio * 100}%`;
            player.changeEqualizerFilterGain(i, gain);
        }
    });
});
