import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Grid} from '@mui/material';

import SongCard from './SongCard.js'
import React, { useEffect } from 'react'
import EditToolbar from './EditToolbar'
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/

function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair} = props;
    const [expand, setExpand] = useState(false);
    const [selected, setSelect] = useState(false);


    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    let editToolbar = "";
    let buttonSet = "";
    if(expand) {
      editToolbar = <EditToolbar />;
      
    }
    

    function toggleOpen(event) {
        event.stopPropagation();
        let newState = !expand;
        console.log("expand state is " + expand);
        setSelect(newState);
        if(newState) {
          let id = event.target.id;
          id = ("" + id).substring("expand-".length);
          store.setCurrentList(id);
          
        }
        setExpand(newState);
      }

    function openCurrentList(event) {
        console.log("event is " + event);
        event.stopPropagation();
        let id = event.target.id;
        id = ("" + id).substring("expand-".length);
        console.log("Id found is " + id);
        store.setCurrentList(id);
    }

    function toggleEdit(event) {
        let newActive = !editActive;
        if (newActive) {
            let id = event.target.id;
            id = ("" + id).substring("expand-".length);
            store.setIsListNameEditActive(id);
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter" && text) {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
        else if(event.code == 'Enter' && !text)
        {
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        console.log("event setText is " + event.target.value);
        setText(event.target.value);
    }

    console.log("card is " + selected);
    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    

    let songCard = "";
    if(expand && store.currentList) {
        songCard = 
        <Box style = {{width: '90%', backgroundColor: 'white', height: '20vw', overflow: 'scroll', transform: 'translate(1.5em ,1em) scale(1)'}}>

            {
                store.currentList.songs.map((song, index) => (
                    <SongCard
                        id={'playlist-song-' + (index)}
                        key={'playlist-song-' + (index)}
                        index={index}
                        song={song}
                    />
                ))  
            }
          </Box>
         //console.log("Song card is " + songCard)
    }
    let cardName = "";
    if(!editActive) 
    {
      cardName =  idNamePair.name;
    }
    if (editActive) {
      cardName =
          <TextField
              margin="normal"
              required
              //fullWidth
              id={"list-" + idNamePair._id}
              label="Playlist Name"
              name="name"
              autoComplete="Playlist Name"
              className='list-card'
              onKeyPress={handleKeyPress}
              onChange={handleUpdateText}
              defaultValue={idNamePair.name}
              inputProps={{style: {fontSize: 15}}}
              InputLabelProps={{style: {fontSize: 18}}}
              autoFocus
              sx={{ backgroundColor: 'white', width: '30vw', transform: 'translate(0em ,-0.5em) scale(1)'}}
          />
  }


    let cardElement =
        <Grid container rowSpacing={1}
        className = {selectClass}
        sx={{backgroundColor: 'red', borderRadius: 5, width: '95%' ,
        transform: 'translate(0em ,-1em) scale(1)', flex: 1, border: 1, marginTop: 2}}
        > 
            <Grid item xs={8} sx={{transform: 'translate(1em ,0.5em) scale(1)'}}  
            id = {"expand-" + idNamePair._id}
            onDoubleClick = {toggleEdit}>{ cardName} </Grid>
            <Grid item xs={2} sx={{transform: 'translate(1em ,0em) scale(1)'}}> 
            <IconButton onClick={openCurrentList} aria-label='edit'
                        sx = {{display: { xs: 'none', sm: 'block',  backgroundColor: '#12345',
                        '&:hover': {
                          backgroundColor: 'gray',
                          color: 'white'},  borderRadius: 10 }}}>
                    <ThumbUpOffAltIcon style={{fontSize:'20pt', color: 'blue'}} />
                </IconButton>
            </Grid> 
            <Grid item xs={2} sx={{transform: 'translate(1em ,0em) scale(1)'}}> 
            <IconButton onClick={openCurrentList} aria-label='edit'
                        sx = {{display: { xs: 'none', sm: 'block',  backgroundColor: '#12345',
                        '&:hover': {
                          backgroundColor: 'gray',
                          color: 'white'},  borderRadius: 10 }}}>
                    <ThumbDownOffAltIcon style={{fontSize:'20pt', color: 'blue'}} />
                </IconButton>
            </Grid>
            <Grid item xs={8} sx={{transform: 'translate(1em ,0.5em) scale(1)'}}>By: {idNamePair.user} </Grid>
            <Grid item xs={2} sx={{transform: 'translate(1.5em ,-0.55em) scale(1)'}}>{1} </Grid>
            <Grid item xs={2} sx={{transform: 'translate(1.5em ,-0.55em) scale(1)'}}>{1} </Grid>
            
            {songCard} 
            <Box sx={{ flexGrow: 1 }}>{buttonSet}</Box>
            <Grid item xs={12} sx={{transform: 'translate(0em ,0.5em) scale(1)'}}> {editToolbar} </Grid>
            <Grid item xs={8} sx={{transform: 'translate(1em ,0.5em) scale(1)'}}>Published: {idNamePair.date} </Grid>
            <Grid item xs={2} sx={{transform: 'translate(-2em ,0.5em) scale(1)'}}>{'Listens:' + 10000} </Grid>
            <Grid item xs={2} sx={{transform: 'translate(1em , 0em) scale(1)'}}> 
            <IconButton id = {"expand-" + idNamePair._id} 
                        onClick={toggleOpen} 
                        aria-label='expand'
                        sx = {{color: 'yellow', display: { xs: 'none', sm: 'block',  backgroundColor: '#12345',
                        '&:hover': {
                          backgroundColor: 'gray', opacity: [0.1, 0.1, 0.1],
                          color: 'white'},  borderRadius: 10 }}}
                        >
                      {expand ? <ExpandLessIcon /> : <ExpandMoreIcon/>}
                    
                </IconButton>
            </Grid>   
            
        </Grid>

   
    
    
    return (
        cardElement
    );
}

export default ListCard;