
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { GlobalStoreContext } from '../store'
import YouTube from 'react-youtube';
import React, {useState, useContext} from 'react'
import { Typography } from '@mui/material';

function YouTubePlayer(props) {
    const { store } = useContext(GlobalStoreContext);
    const [holdPlayer, setPlayer] = useState(null);
    const [current, setCurrent] = useState(0);
    //const [status] = useStatus(null);

    let playlist =  [];
    let currentSong = 0;
    let playerWindow = 
    <Box sx = {{width: '20vw', transform: 'translate(12em ,10em) scale(1)'}}> 
        <Typography> 
            Start Playing
        </Typography>
    </Box>;

    

    // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST

    const playerOptions = {
        //flex: 1,
        height: '340',
        width: '615',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
            play: 1,
            stop: 2,
            skipF: 3,
            skipB: 4
        },
    };

    


    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        let song = playlist[currentSong];
        player.loadVideoById(song);
        player.playVideo();
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        currentSong = current + 1;
        console.log("current is " + currentSong)
        let size = store.getPlaylistSize();
        //console.log("size is " + size);
        currentSong = currentSong%size;
        //console.log("current is " + currentSong)
        setCurrent(currentSong);
    }

    function decSong() {
        currentSong = current -1 ;
        let size = store.getPlaylistSize();
        if(currentSong == -1)
            currentSong = size -1;
        //currentSong = currentSong%size;
        //console.log("current" + currentSong);
        setCurrent(currentSong);
    }

    function onPlayerReady(event) {
        loadAndPlayCurrentSong(event.target);
        event.target.stopVideo();
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        let player = event.target;
        
        setPlayer(player);
        console.log(event.target);
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
    }


    
    function handleSkipBackward() {
        decSong();
        loadAndPlayCurrentSong(holdPlayer);
        //handleStop();
        store.loadIdNamePairs();
    }

    function handleStop() {
        holdPlayer.stopVideo();
    }

    function handlePlay(){ 
        holdPlayer.playVideo();
    }

    function handleSkipForward() {
        incSong();
        loadAndPlayCurrentSong(holdPlayer);
        store.loadIdNamePairs();
    }
    
    if(store.currentList && store.currentList.songs.length >=   1) 
    {
        //console.log("song length is " + store.getPlaylistSize())
        //console.log(current);
        for(let i = 0; i < store.getPlaylistSize(); i++)
        {
            //console.log("RUNRUN")
            //console.log(i)
            playlist[i] = store.currentList.songs[i].youTubeId;
        }
        //console.log(playlist)
        playerWindow = 
        <Box> 
            <YouTube
            videoId={playlist[currentSong]}
            opts={playerOptions}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange} />
            <Typography  variant = 'h5' sx ={{transform: 'translate(16vw ,0em) scale(1)', width: '50%', fontWeight: 'bold'}}> Now Playing</Typography>
            <Typography sx ={{fontWeight: 'bold'}}> Playlist: {store.currentList.name} </Typography>
            <Typography sx ={{fontWeight: 'bold'}}> Song #: {current+1} </Typography>
            <Typography sx ={{fontWeight: 'bold'}}> Song Title: {store.currentList.songs[current].title} </Typography>
            <Typography sx ={{fontWeight: 'bold'}}> Song Artist: {store.currentList.songs[current].artist} </Typography>
        </Box>;
    }


    return (
    <Box>
        
            {playerWindow}
        <div id="player-controller">
        <Box sx ={{borderColor: 'black', borderWidth: '2px', borderStyle: 'solid', borderRadius: 5}}>
        <IconButton onClick={handleSkipBackward} aria-label='backward'
            sx = {{display: { backgroundColor: '#12345',
            '&:hover': {
                backgroundColor: 'gray',
                color: 'white'},  borderRadius: 25 }}}>
        <SkipPreviousIcon style={{fontSize:'20pt', color: 'blue'}} />
        </IconButton>
        <IconButton onClick={handleStop} aria-label='stop'
            sx = {{display: {  backgroundColor: '#12345',
            '&:hover': {
                backgroundColor: 'gray',
                color: 'white'},  borderRadius: 25 }}}>
        <StopIcon style={{fontSize:'20pt', color: 'blue'}} />
        </IconButton>
        <IconButton onClick={handlePlay} aria-label='play'
            sx = {{display: {  backgroundColor: '#12345',
            '&:hover': {
                backgroundColor: 'gray',
                color: 'white'},  borderRadius: 25 }}}>
        <PlayArrowIcon style={{fontSize:'20pt', color: 'blue'}} />
        </IconButton>
        <IconButton onClick={handleSkipForward} aria-label='forward'
            sx = {{display: {  backgroundColor: '#12345',
            '&:hover': {
                backgroundColor: 'gray',
                color: 'white'},  borderRadius: 25 }}}>
        <SkipNextIcon style={{fontSize:'20pt', color: 'blue'}} />
        </IconButton>
        </Box>
        </div>
    </Box>
    );
  }
  
  export default YouTubePlayer;