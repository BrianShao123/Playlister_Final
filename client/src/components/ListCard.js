import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Grid} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SongCard from './SongCard.js'
import React, { useEffect } from 'react'
import EditToolbar from './EditToolbar'
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Button from '@mui/material/Button';
import PublishIcon from '@mui/icons-material/Publish';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


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
    //const [expand, setExpand] = useState(false);
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


    function toggleOpen(event) {
        event.stopPropagation();
       // let newState = !expand;
        //console.log("expand state is " + expand);
        //console.log("list is " + store.currentList._id);
        //console.log("idNamePair is " + idNamePair._id);
        //console.log(idNamePair._id === store.currentList._id);
        //setSelect(newState);
        //if(newState) {
          if(!store.currentList || store.currentList._id != idNamePair._id) {
            let id = event.target.id;
            id = ("" + id).substring("expand-".length);
            store.setCurrentList(id);
          }
          if(store.currentList && store.currentList._id == idNamePair._id)
          //console.log("RAN")
            store.closeCurrentList();
          
        //}
        //setExpand(newState);
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

    function handleDeleteList(event) {
        event.stopPropagation();
        let id = event.target.id;
        id = ("" + id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handlePublishList(event) {
      event.stopPropagation();
        let id = event.target.id;
        id = ("" + id).substring("publish-list-".length);
        store.markListForPublication(id);
        console.log("marked publish id " + store.listIdMarkedForPublication);
    }

    function handleCloneList() {

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
    //console.log(idNamePair);
    //console.log("card is " + selected);
    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }



    let thumbsUp = "";
    let thumbsDown = "";
    let numLikes = "";
    let numDislikes = "";
    let editToolbar = "";
    let buttonSet = "";
    let publishDate = "";
    if(idNamePair.published) {
      thumbsUp = 
      <IconButton onClick={openCurrentList} aria-label='edit'
          sx = {{display: { xs: 'none', sm: 'block',  backgroundColor: '#12345',
          '&:hover': {
          backgroundColor: 'gray',
          color: 'white'},  borderRadius: 10 }}}>
        <ThumbUpOffAltIcon style={{fontSize:'20pt', color: 'blue'}} />
      </IconButton>
      thumbsDown = 
      <IconButton onClick={openCurrentList} aria-label='edit'
          sx = {{display: { xs: 'none', sm: 'block',  backgroundColor: '#12345',
          '&:hover': {
            backgroundColor: 'gray',
            color: 'white'},  borderRadius: 10 }}}>
        <ThumbDownOffAltIcon style={{fontSize:'20pt', color: 'blue'}} />
      </IconButton>
      numLikes = idNamePair.likes;
      numDislikes = idNamePair.dislikes;
      publishDate = "Published: " + idNamePair.publishDate;
    }
    if(store.currentList) {
      if(store.currentList._id === idNamePair._id) {
        editToolbar = 
          <EditToolbar />;
        buttonSet =
        <Box>
        <Button id = {"delete-list-" + idNamePair._id}
            onClick={handleDeleteList} aria-label='delete'
            variant="contained">
            <DeleteIcon />
        </Button>
        <Button id = {"publish-list-" + idNamePair._id}
          onClick={handlePublishList} aria-label='publish'
          variant="contained">
          <PublishIcon/>
        </Button>
        <Button
          id='clone-list-button'
          onClick={handleCloneList}
          variant="contained">
          <ContentCopyIcon />
        </Button>
        </Box>;

      }

  }
    let decision = false;

  
    //console.log("at render list is " + store.currentList._id);
    let songCard = "";
    if(store.currentList) {
      console.log("list is " + store.currentList._id);
        console.log("idNamePair is " + idNamePair._id);
      if(store.currentList._id === idNamePair._id) {
        
      selectClass = "selected-list-card";
      decision = true;
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
    }
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
              {thumbsUp}
            </Grid> 
            <Grid item xs={2} sx={{transform: 'translate(1em ,0em) scale(1)'}}> 
              {thumbsDown}
            </Grid>

            <Grid item xs={8} sx={{transform: 'translate(1em ,0.5em) scale(1)'}}>By: {idNamePair.userName} </Grid>
            <Grid item xs={2} sx={{transform: 'translate(1.5em ,-0.55em) scale(1)'}}>{numLikes} </Grid>
            <Grid item xs={2} sx={{transform: 'translate(1.5em ,-0.55em) scale(1)'}}>{numDislikes} </Grid>

            <Grid item xs={12} >{songCard} </Grid>

            <Grid item xs={6} sx={{transform: 'translate(1.5em ,0.8em) scale(1)'}}>{buttonSet} </Grid>
            <Grid item xs={6} sx={{transform: 'translate(4.7em ,0.8em) scale(1)'}}>{editToolbar} </Grid>

            <Grid item xs={8} sx={{transform: 'translate(1em ,0.5em) scale(1)'}}>{publishDate}</Grid>
            <Grid item xs={2} sx={{transform: 'translate(-2em ,0.5em) scale(1)'}}>{'Listens:' + 10000} </Grid>
            <Grid item xs={1} sx={{transform: 'translate(2em , 0.4em) scale(1)'}}> 
            <IconButton id = {"expand-" + idNamePair._id} 
                        onClick={toggleOpen} 
                        aria-label='expand'
                        sx = {{color: 'yellow', display: { xs: 'none', sm: 'block',  backgroundColor: '#12345',
                        '&:hover': {
                          backgroundColor: 'gray', opacity: [0.1, 0.1, 0.1],
                          color: 'white'},  borderRadius: 10 }}}
                        >
                      {(decision) ? <ExpandLessIcon /> : <ExpandMoreIcon/>}
                    
                </IconButton>
            </Grid>   
        </Grid>

   
    
    
    return (
        cardElement
    );
}

export default ListCard;