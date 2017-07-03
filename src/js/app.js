import AudioPlayer from './AudioPlayer';
import Playlist from './Playlist';

const playerNode = document.getElementById("player");

const player = new AudioPlayer();
player.playlist.addTrack(['./../media/System_Of_A_Down_-_Aerials.mp3']);
player.play();