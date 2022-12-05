import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import { Button, Collapse, Divider, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import AuthContext from '../auth';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import WorkspaceScreen from './WorkspaceScreen';
import SongCard from './SongCard';
import EditToolbar from './EditToolbar';
import MUIDeleteModal from './MUIDeleteModal';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const [ listOpen, setListOpen] = useState(false);
    const { idNamePair, selected } = props;

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
            setListOpen(!listOpen);
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    async function handlePublishList(event, id) {

    }

    async function handleDuplicateList(event, id) {
        
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    let userName = auth.user.firstName + ' ' + auth.user.lastName;
    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{borderRadius:"25px", p: "10px", bgcolor: '#8000F00F', marginTop: '15px', display: 'flex', p: 1 }}
            style={{transform:"translate(1%,0%)", width: '98%', fontSize: '48pt' }}
            button
            onClick={(event) => {
                handleLoadList(event, idNamePair._id)
            }}
        >
            <ListItemText 
                    primary={idNamePair.name} 
                    secondary={"By:  " + userName} 
                    primaryTypographyProps={{sx: {p: 1, paddingBottom: 0, flexGrow: 1, fontSize: 40}}}
                    secondaryTypographyProps={{sx: {paddingLeft: 1, color: 'black', fontSize: 20}}}
                />
            <Box sx={{p: 1}}>
                <IconButton onClick={handleToggleEdit} aria-label='edit'>
                <ThumbUpIcon style={{fontSize:'36pt', color: 'white'}}/>
                </IconButton>
            </Box>
            <Box sx={{p: 1}}>
                <Typography>0</Typography>
            </Box>
            <Box sx={{p: 1}}>
                <IconButton onClick={handleToggleEdit} aria-label='edit'>
                                <ThumbDownIcon style={{fontSize:'36pt', color: 'white'}} />
                            </IconButton>
            </Box>
            <Box sx={{p: 1}}>
                <Typography>0</Typography>
            </Box>
            <Box sx={{p: 1}}>
            <ListItemButton 
                onClick={(event) => {
                    handleLoadList(event, idNamePair._id)
                }}
                style={{fontSize:'48pt', color: 'white'}}>
                    {listOpen ? <ExpandLess/> : <ExpandMore/>}
                </ListItemButton>
            </Box>
        </ListItem>

    let buttonList = 
    <Stack direction='row' justifyContent='space-between'>
        <Box display="flex" 
        p={2} m={1} 
        justifyContent='flex-start' 
        alignItems='flex-start'
        >
            <EditToolbar/>
        </Box>
        <Box display="flex" 
        p={2} m={1} 
        justifyContent='flex-end' 
        alignItems='flex-end'
        >
            <Stack direction='row' spacing={2}>
                <Button variant='contained' onClick={(event) => {
                    handlePublishList(event, idNamePair._id)
                }}>Publish</Button>
                <Button variant='contained'
                onClick={(event) => {
                    handleDeleteList(event, idNamePair._id)
                }}
                >Delete</Button>
                <Button variant='contained' onClick={(event) => {
                    handleDuplicateList(event, idNamePair._id)
                }}>Duplicate</Button>
            </Stack>
        </Box>
    </Stack>

    if(store.currentList) {
        return (
            <div>
            {cardElement}
            <Collapse in={listOpen} timeout='auto' unmountOnExit>
                <List 
                    component='div'
                    disablePadding
                    id="playlist-cards"
                    sx={{ width: '100%', pb: 1}}
            >
                    {

                        store.currentList.songs.map((song, index) => (
                            <SongCard
                                id={'playlist-song-' + (index)}
                                key={'playlist-song-' + (index)}
                                index={index}
                                song={song}
                                sx={{bgcolor: 'white'}}
                            />
                        ))  
                    }

                    <Stack direction='row' justifyContent='space-between'>
                        <Typography variant='h6' sx={{pl: 4, color: 'black'}}>Published: </Typography>
                        <Typography variant='h6' sx={{pr: 4, color: 'black'}}>Listens: </Typography>
                    </Stack>
                </List>   
            </Collapse>
        </div>
        )
    }
    return (
        cardElement
    );
}

export default ListCard;