import { Card, CardContent, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext, useState } from 'react';
import YouTube from 'react-youtube';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import GlobalStoreContext from '../store';

export default function YoutubePlayer() {
        // THIS EXAMPLE DEMONSTRATES HOW TO DYNAMICALLY MAKE A
    // YOUTUBE PLAYER AND EMBED IT IN YOUR SITE. IT ALSO
    // DEMONSTRATES HOW TO IMPLEMENT A PLAYLIST THAT MOVES
    // FROM ONE SONG TO THE NEXT
    const { store } = useContext(GlobalStoreContext);
    const [playing, setPlaying] = useState(false);


    // THIS WILL STORE OUR YOUTUBE PLAYER
    let player;
    let PLAYER_NAME = 'youtube_player';

    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST
    let playlist = [];

    if(store.currentList) {
        let songs = store.currentList.songs;
        if (songs) {
            for(let i = 0; i < songs.length; i++) {
                playlist[i] = songs[i].youTubeId;
            }
        }
    }

    // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST
    let currentSong = store.currentSongIndex;

    // DYNAMICALLY LOAD THE YOUTUBE API FOR USE
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // THE onYouTubeIframeAPIReady FUNCTION IS GLOBAL AND GETS CALLED
    // WHEN WHEN THE YOUTUBE API HAS BEEN LOADED AS A RESULT OF
    // OUR DYNAMICALLY LOADING INTO OUR PAGE'S SCRIPT
    function onYouTubeIframeAPIReady() {
    // START OUR PLAYLIST AT THE BEGINNING
        currentSong = 0;
    }
    // NOW MAKE OUR PLAYER WITH OUR DESIRED PROPERTIES
    let playerOptions = {
        height: '390',
        width: '800',
        playerVars: {
            autoplay: 0,
        },
    };
    let playlistName = store.currentList ? store.currentList.name : ""
    let currentSongIndex = store.currentSongIndex !== -1 ? store.currentSongIndex : ""
    let title = ''
    let artist = ''
    if(store.currentSong) {
        title = store.currentSong.title
        artist = store.currentSong.artist
    }
    

    // THIS EVENT HANDLER GETS CALLED ONCE THE PLAYER IS CREATED
    function onPlayerReady(event) {
        event.target.playVideo();
    }

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        let song = playlist[currentSong];
        player.loadVideoById(song);
        player.playVideo();
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        currentSong++;
        currentSong = currentSong % playlist.length;
        store.setCurrentSong(playlist[currentSong], currentSong);
    }

    function decSong() {
        currentSong--;
        currentSong = currentSong % playlist.length;
        store.setCurrentSong(playlist[currentSong], currentSong);
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerReady(event) {
        loadAndPlayCurrentSong(event.target);
        event.target.playVideo();
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        let player = event.target;
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


    return (
        <Box display='flex' flexDirection='column' sx={{bgColor: 'blue', alignItems: 'center', justifyContent: 'center'}}>
            <YouTube 
                videoId={playlist[currentSong]}
                opts={playerOptions}
                onReady={onPlayerReady}
                onStateChange={onPlayerStateChange}
                />
            <Card sx={{width: '100%',bgcolor: '#8000F00F'}}>
                <CardContent>
                    <Typography component="div" variant="h6" sx={{color: 'black', fontWeight: 1000, userSelect: 'none'}}>
                        Now Playing
                    </Typography>
                    <Typography component="div" variant='p' sx={{color: 'black', fontWeight: 700, userSelect: 'none'}}>
                        Playlist: {playlistName}
                    </Typography>
                    <Typography component="div" variant='p' sx={{color: 'black', fontWeight: 700, userSelect: 'none'}}>
                        Song #: {currentSongIndex}
                    </Typography>
                    <Typography component="div" variant='p' sx={{color: 'black', fontWeight: 700, userSelect: 'none'}}>
                        Title: {title} </Typography>
                    <Typography component="div" variant='p' sx={{color: 'black', fontWeight: 700, userSelect: 'none'}}>
                        Artist: {artist}</Typography>
                </CardContent>
                <Box sx={{pb: 1}}>
                    <IconButton onClick={decSong}>
                        <SkipPreviousIcon fontSize='large' sx={{color: 'black'}}></SkipPreviousIcon>
                    </IconButton>
                    <IconButton onClick={onPlayerStateChange}>
                        <PauseIcon fontSize='large' sx={{color: 'black'}}></PauseIcon>
                    </IconButton>
                    <IconButton onClick={onPlayerReady}>
                        <PlayArrowIcon fontSize='large' sx={{color: 'black'}}></PlayArrowIcon>
                    </IconButton>
                    <IconButton onClick={incSong}>
                        <SkipNextIcon fontSize='large' sx={{color: 'black'}}></SkipNextIcon>
                    </IconButton>
                </Box>
            </Card>
        </Box>
    )

}