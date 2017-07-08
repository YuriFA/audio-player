import AudioPlayer from './AudioPlayer';
import Playlist from './Playlist';
import DOMBuidler from './utils/DOMBuilder';
import Slider from './utils/Slider.js';

const tracks = [
    "https://psv4.userapi.com/c813426/u371745449/audios/9c1312192a1f.mp3?extra=VJaBPkT9cAnq5pm3Awnbc7XC0YZYmz5-VQuceGER_P6cWML5Lwx8P9h_ucpPc9YLfsgCF-X-BZ6jbW12151MZSnHhsknnC09vP1rVFY0CWjd-UAWLwoOaDyF-cgBUZrPBh4-kGjeYM43-mA",
    './../media/02 - Needles.mp3',
    './../media/03 - Deer Dance.mp3',
    './../media/04 - Jet Pilot.mp3',
    './../media/05 - X.mp3',
    './../media/06 - Chop Suey!.mp3',
]

const playerNode = document.getElementById("player");
const playBtn = document.querySelector('.player-controls__btn_play');
const playNextBtn = document.querySelector('.player-controls__btn_next');
const playPrevBtn = document.querySelector('.player-controls__btn_prev');

const volumeBtn = document.querySelector('.volume__btn');
const volumeSliderNode = document.querySelector('.volume__slider');
const volumeSliderFilled = document.querySelector('.volume__slider .slider__filled');

const progressBuffer = document.querySelector('.progress__buffer');
const progressLine = document.querySelector('.progress__line');

function setVolume(value) {
    const icon = volumeBtn.children[0];
    const validValue = value > 1 ? 1 : (value < 0 ? 0 : value);
    if(validValue === 0) {
        icon.classList.remove('volume__icon_half');
        icon.classList.add('volume__icon_mute');
    }
    if(validValue > 0 && validValue <= 0.5) {
        icon.classList.remove('volume__icon_mute');
        icon.classList.add('volume__icon_half');
    }
    if(validValue > 0.5) {
        icon.classList.remove('volume__icon_mute');
        icon.classList.remove('volume__icon_half');
    }
    volumeSliderFilled.style.width = `${validValue * 100}%`;
    player.volume = validValue;
}

const player = new AudioPlayer(tracks);
setVolume(player.volume);
// player.playlist.addTrack(['./../media/System_Of_A_Down_-_Aerials.mp3']);
// player.playlist.addTrackList(tracks);


function updateBuffer(e) {
    const audio = e.target;
    const buffered = audio.buffered;
    const buffRatio = buffered.length ? buffered.end(buffered.length - 1) / audio.duration * 100 : 0;
    
    progressBuffer.style.width = `${buffRatio}%`;
}

player.on('track:progress', updateBuffer);
player.on('track:loadeddata', updateBuffer);
player.on('track:timeupdate', (e) => {
    const audio = e.target;
    const playedRatio = audio.currentTime / audio.duration * 100;
    progressLine.style.width = `${playedRatio}%`;
});

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

// Volume settings
// let volumeDraggable = false;
const updateVolume = (e) => {
    let ratio = (e.clientX - volumeSliderNode.offsetLeft) / volumeSliderNode.offsetWidth;
    setVolume(ratio);
}

const volumeSlider = new Slider(volumeSliderNode, updateVolume);

// volumeSliderNode.addEventListener('mousedown', (e) => {
//     if(e.which === 1) { //left mouse button
//         volumeDraggable = true;
//         updateVolume(e);
//     }
// });

// document.addEventListener('mousemove', (e) => {
//     if(volumeDraggable) {
//         updateVolume(e);
//     }
// });

// document.addEventListener('mouseup', (e) => {
//     if(volumeDraggable) {
//         volumeDraggable = false;
//         updateVolume(e);
//     }
// });

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
    const newValue = player.volume + Math.sign(e.wheelDeltaY) * 0.05;
    setVolume(newValue);
});

volumeSliderNode.addEventListener('wheel', (e) => {
    const newValue = player.volume + Math.sign(e.wheelDeltaY) * 0.05;
    setVolume(newValue);
});
