import AudioPlayer from './AudioPlayer';
import Playlist from './Playlist';
import DOMBuidler from './utils/DOMBuilder'

const tracks = [
    './../media/01 - Prison Song.mp3',
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


const player = new AudioPlayer();
// player.playlist.addTrack(['./../media/System_Of_A_Down_-_Aerials.mp3']);
player.playlist.addTrackList(tracks);

playBtn.addEventListener('click', () => {
    if(!player.isPlaying) {
        player.play();
    } else {
        player.pause();
    }
});

playNextBtn.addEventListener('click', () => {
    player.playNext();
});

playPrevBtn.addEventListener('click', () => {
    player.playPrev();
});