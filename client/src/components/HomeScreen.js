import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal';
import MUIRemoveSongModal from './MUIRemoveSongModal';
import MUIEditSongModal from './MUIEditSongModal';
import { AppBar, Box, Card, CardContent, Container, Divider, Grid, Icon, IconButton, Menu, MenuItem, Tab, Tabs, TextField, Toolbar } from '@mui/material';
import { borderRadius } from '@mui/system';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import SortIcon from '@mui/icons-material/Sort';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import YouTube from 'react-youtube';
import YoutubePlayer from './YoutubePlayer';

import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    useEffect(() => {
        store.loadPlaylists();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{width: '100%', bgcolor: 'background.paper', mb:"20px", maxHeight: 600, overflow: 'auto' }}>
            {
                store.playlists.map((list) => (
                    <ListCard
                    key={list._id}
                    list={list}
                    selected={store.currentList && (list._id === store.currentList._id)}
                    />
                ))
                
            }
            </List>;
    }

    function handleSortMenuOpen(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleSortMenuClose() {
        setAnchorEl(null);
    }

    const sortMenu =
        <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleSortMenuClose}
        >
            <MenuItem onClick={handleSortMenuClose}>Name (A-Z)</MenuItem>
            <MenuItem onClick={handleSortMenuClose}>Publish Date (Newest)</MenuItem>
            <MenuItem onClick={handleSortMenuClose}>Listens (High - Low)</MenuItem>
            <MenuItem onClick={handleSortMenuClose}>Likes (High - Low)</MenuItem>
            <MenuItem onClick={handleSortMenuClose}>Dislikes (High - Low)</MenuItem>
        </Menu>

    return (
        <Grid container>
        <Grid item xs={12} sx={{flexGrow: 1}}>
            <AppBar position='static'>
                <Toolbar>
                    <IconButton>
                        <HomeIcon fontSize='large' sx={{color: 'white'}}></HomeIcon>
                    </IconButton>
                    <IconButton>
                        <GroupIcon fontSize='large' sx={{color: 'white'}}></GroupIcon>
                    </IconButton>
                    <IconButton>
                        <PersonIcon fontSize='large' sx={{color: 'white'}}></PersonIcon>
                    </IconButton>
                    <Box component="div" sx={{paddingLeft: 40, flexGrow: 1}}>
                        <TextField 
                            id="filled-basic" 
                            label="Search" 
                            variant="filled" 
                            size='small'
                            sx={{bgcolor: 'white', borderRadius: 1, width: 500}}/>
                    </Box>
                    <Box fontSize='large'>
                        Sort By
                    <IconButton>
                        <SortIcon fontSize='large' sx={{color: 'white'}} onClick={handleSortMenuOpen}></SortIcon>
                    </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
        </Grid>
        <Grid item xs={6}>
            <Box >
                { listCard }
            </Box>
        </Grid>
        <Grid item xs={6}>
            <Box sx={{backgroundColor: '#8000F00F'}}>
                <Tabs>
                    <Tab label="Player"/>
                    <Tab label="Comments"/>
                </Tabs>
                <YoutubePlayer/>
            </Box>
        </Grid>
        <Grid item xs={12}>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{width: '100%', pt: 1, backgroundColor: 'black'}}>
                            <Fab 
                                color="primary" 
                                aria-label="add"
                                id="add-list-button"
                                onClick={handleCreateNewList}
                            >
                                <AddIcon />
                            </Fab>
                                <Typography variant="h4" color="white">Your Lists</Typography>
                    </Box>
        <div id="list-selector-heading">
                <Typography variant="h4" color="black">Your Lists</Typography>
        </div>
        </Grid>
        { sortMenu }
        <MUIDeleteModal/>
        <MUIRemoveSongModal/>
        <MUIEditSongModal/>
    </Grid>
        )
}

export default HomeScreen;