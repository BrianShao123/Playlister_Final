import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SongCard from './SongCard.js'
import React, { useEffect } from 'react'
import EditToolbar from './EditToolbar'
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Button from '@mui/material/Button';
import PublishIcon from '@mui/icons-material/Publish';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';

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
  const { idNamePair } = props;


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
    store.clearTransactions();
    if (!store.currentList || store.currentList._id != idNamePair._id) {
      let id = event.target.id;
      id = ("" + id).substring("expand-".length);
      store.setCurrentList(id);
    }
    if (store.currentList && store.currentList._id == idNamePair._id)
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
    if(!idNamePair.published) {
    let newActive = !editActive;
    if (newActive) {
      let id = event.target.id;
      id = ("" + id).substring("expand-".length);
      store.setIsListNameEditActive(id);
    }
    setEditActive(newActive);
  }
  else
    console.log("Playlist is published. Can't Change Name")
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

  function handleCloneList(event) {
    event.stopPropagation();
    let id = event.target.id;
    id = ("" + id).substring("clone-list-".length);
    console.log(id); 
    store.markListForDuplicate(id);
  }

  function handleKeyPress(event) {
    if (event.code === "Enter" && text) {
      let id = event.target.id.substring("list-".length);
      store.changeListName(id, text);
      //store.loadIdNamePairs();
      toggleEdit();
    }
    else if (event.code == 'Enter' && !text) {
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

  let cardStatus = false;
  if (store.isListNameEditActive) {
    cardStatus = true;
  }


  function handleLike(event) {
    event.stopPropagation();
    let id = event.target.id.substring("like-".length);
    console.log("ID SENT I S " + event.target.id);
    let found = false;
    for(let i = 0; i < idNamePair.likedBy.length; i++) {
      console.log(idNamePair.likedBy);
      console.log(idNamePair.likedBy[i].userName)
      if(idNamePair.likedBy[i].username == store.getUserName())
      {
        found = true;
        store.decrementLikes(id);
        break;
      }
    }

    if(!found) 
      store.incrementLikesAndDecrementDislikes(id);
  }

  function handleDislike(event) {
    event.stopPropagation();
    let id = event.target.id.substring("dislike-".length);
    console.log(event.target.id);
    let found = false;
    for(let i = 0; i < idNamePair.dislikedBy.length; i++) {
      console.log(idNamePair.dislikedBy);
      console.log(idNamePair.dislikedBy[i].userName)
      if(idNamePair.dislikedBy[i].username == store.getUserName())
      {
        found = true;
        store.decrementDislikes(id);
        break;
      }
    }

    if(!found) 
      store.incrementDislikesAndDecrementLikes(id);
  }

  function handleSelectCard(event) {
    event.stopPropagation();
    let id = event.target.id.substring("list-card-".length);
    console.log(event.target.id);
    store.setCurrentPlayingList(id);
    selectClass = "selected-list-card";
  }

  
  let isLiked = "";
  let isDisliked = ""; 
  let likedOn = "";
  let likedOff = "";
  let dislikedOn = "";
  let dislikedOff = ""; 

  if(idNamePair.published) {
  for(let i = 0; i < idNamePair.likedBy.length; i++) {
    console.log(idNamePair.likedBy);
    console.log(idNamePair.likedBy[i].userName)
    if(idNamePair.likedBy[i].username == store.getUserName())
    {
        isLiked = true;
        isDisliked = false; 
    }
  }

  for(let i = 0; i < idNamePair.dislikedBy.length; i++) {
    if(idNamePair.dislikedBy[i].username == store.getUserName())
    {
        isDisliked = true;
        isLiked = false; 
    }
  }

  likedOn = 
  <IconButton id = {"like-"+idNamePair._id} onClick={handleLike} aria-label='thumbsup'
      sx={{
        display: {
          xs: 'none', sm: 'block', backgroundColor: '#12345',
          '&:hover': {
            backgroundColor: 'gray',
            color: 'white'
          }, borderRadius: 10
        }
      }}>
      <ThumbUpAltIcon style={{ fontSize: '20pt', color: 'blue' }} />
    </IconButton>;


  likedOff = 
  <IconButton id = {"like-"+idNamePair._id} onClick={handleLike} aria-label='thumbsup'
  sx={{
    display: {
      xs: 'none', sm: 'block', backgroundColor: '#12345',
      '&:hover': {
        backgroundColor: 'gray',
        color: 'white'
      }, borderRadius: 10
    }
  }}>
  <ThumbUpOffAltIcon style={{ fontSize: '20pt', color: 'blue' }} />
  </IconButton>;

  dislikedOn = 
  <IconButton id = {"dislike-"+idNamePair._id} onClick={handleDislike} aria-label='thumbsdown'
      sx={{
        display: {
          xs: 'none', sm: 'block', backgroundColor: '#12345',
          '&:hover': {
            backgroundColor: 'gray',
            color: 'white'
          }, borderRadius: 10
        }
      }}>
      <ThumbDownAltIcon style={{ fontSize: '20pt', color: 'blue' }} />
    </IconButton>;

  dislikedOff = 
  <IconButton id = {"dislike-"+idNamePair._id} onClick={handleDislike} aria-label='thumbsdown'
    sx={{
      display: {
        xs: 'none', sm: 'block', backgroundColor: '#12345',
        '&:hover': {
          backgroundColor: 'gray',
          color: 'white'
        }, borderRadius: 10
      }
    }}>
    <ThumbDownOffAltIcon style={{ fontSize: '20pt', color: 'blue' }} />
  </IconButton>;

  }
  let thumbsUp = "";
  let thumbsDown = "";
  let numLikes = "";
  let numDislikes = "";
  let editToolbar = "";
  let buttonSet = "";
  let publishDate = "";
  let listens = "";
  //console.log(idNamePair.published);
  if (idNamePair.published && store.getUserName() != "GuestJoefpNhX925k4") {
    thumbsUp =
      <IconButton id = {"like-"+idNamePair._id} onClick={handleLike} aria-label='thumbsup'
        sx={{
          display: {
            xs: 'none', sm: 'block', backgroundColor: '#12345',
            '&:hover': {
              backgroundColor: 'gray',
              color: 'white'
            }, borderRadius: 10
          }
        }}>
        <ThumbUpOffAltIcon style={{ fontSize: '20pt', color: 'blue' }} />
      </IconButton>;
    thumbsDown =
      <IconButton id = {"dislike-"+idNamePair._id} onClick={handleDislike} aria-label='thumbsdown'
        sx={{
          display: {
            xs: 'none', sm: 'block', backgroundColor: '#12345',
            '&:hover': {
              backgroundColor: 'gray',
              color: 'white'
            }, borderRadius: 10
          }
        }}>
        <ThumbDownOffAltIcon style={{ fontSize: '20pt', color: 'blue' }} />
      </IconButton>;
    console.log("LIST CARD LISTENS " + idNamePair.listens);
    numLikes = idNamePair.likes;
    numDislikes = idNamePair.dislikes;
    publishDate = "Published: " + idNamePair.publishDate;
    listens = "Listens: " + idNamePair.listens;
  }
  else if (idNamePair.published && store.getUserName() == "GuestJoefpNhX925k4") {
      thumbsUp =
      <IconButton aria-label='thumbsup' disabled
        sx={{
          display: {
            xs: 'none', sm: 'block', backgroundColor: '#12345',
            '&:hover': {
              backgroundColor: 'gray',
              color: 'white'
            }, borderRadius: 10
          }
        }}>
        <ThumbUpOffAltIcon style={{ fontSize: '20pt', color: 'blue' }} />
      </IconButton>
    thumbsDown =
      <IconButton aria-label='thumbsdown' disabled
        sx={{
          display: {
            xs: 'none', sm: 'block', backgroundColor: '#12345',
            '&:hover': {
              backgroundColor: 'gray',
              color: 'white'
            }, borderRadius: 10
          }
        }}>
        <ThumbDownOffAltIcon style={{ fontSize: '20pt', color: 'blue' }} />
      </IconButton>
    //console.log("LIST CARD LISTENS " + idNamePair.listens);
    numLikes = idNamePair.likes;
    numDislikes = idNamePair.dislikes;
    publishDate = "Published: " + idNamePair.publishDate;
    listens = "Listens: " + idNamePair.listens;
  }


  if (store.currentList) {
    //console.log(idNamePair.userName + " " + store.getUserName())
    if (store.currentList._id === idNamePair._id && !idNamePair.published ) {
      editToolbar =
        <EditToolbar />;
      buttonSet =
        <Box>
          <Button id={"delete-list-" + idNamePair._id}
            onClick={handleDeleteList} aria-label='delete'
            variant="contained">
            <DeleteIcon />
          </Button>
          <Button id={"publish-list-" + idNamePair._id}
            onClick={handlePublishList} aria-label='publish'
            variant="contained">
            <PublishIcon />
          </Button>
          <Button
            id={"clone-list-" + idNamePair._id}
            onClick={handleCloneList}
            variant="contained">
            <ContentCopyIcon />
          </Button>
        </Box>;
    }
    else if(store.currentList._id === idNamePair._id && idNamePair.published && (store.getUserName() == idNamePair.userName))
    {
      {buttonSet =
        <Box> 
        <Button id={"delete-list-" + idNamePair._id}
            onClick={handleDeleteList} aria-label='delete'
            variant="contained">
            <DeleteIcon />
          </Button>
        <Button
              id={"clone-list-" + idNamePair._id}
              onClick={handleCloneList}
              variant="contained">
              <ContentCopyIcon />
            </Button>
        </Box>
      }
    }
    else if (store.currentList._id === idNamePair._id && idNamePair.published && store.getUserName() != "GuestJoefpNhX925k4")
    {buttonSet =
      <Button
            id={"clone-list-" + idNamePair._id}
            onClick={handleCloneList}
            variant="contained">
            <ContentCopyIcon />
          </Button>
    }
  }
  let decision = false;


  //console.log("at render list is " + store.currentList._id);
  let songCard = "";
  if (store.currentList) {
    console.log("list is " + store.currentList._id);
    console.log("idNamePair is " + idNamePair._id);
    if (store.currentList._id === idNamePair._id) {

      selectClass = "selected-list-card";
      decision = true;
      songCard =
        <Box style={{ width: '90%', backgroundColor: 'white', height: '20vw', overflow: 'scroll', transform: 'translate(1.5em ,1em) scale(1)' }}>

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
  if (!editActive) {
    cardName = idNamePair.name;
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
        inputProps={{ style: { fontSize: 15 } }}
        InputLabelProps={{ style: { fontSize: 18 } }}
        autoFocus
        sx={{ backgroundColor: 'white', width: '30vw', transform: 'translate(0em ,-0.5em) scale(1)' }}
      />
  }
  

  let cardElement =
    <Grid container rowSpacing={1}
      id = {"list-card-" + idNamePair._id}
      className={selectClass}
      //onClick = {handleSelectCard}
      sx={{
        backgroundColor: 'red', borderRadius: 5, width: '95%',
        transform: 'translate(0em ,-1em) scale(1)', display: 'flex', border: 1, marginTop: 2
      }}
    >
      <Grid item xs={8} sx={{ transform: 'translate(1em ,0.5em) scale(1)' }}
        id={"expand-" + idNamePair._id}
        onDoubleClick={toggleEdit}>{cardName} </Grid>

      <Grid item xs={2} sx={{ transform: 'translate(1em ,0em) scale(1)' }}>
        {isLiked ? likedOn: likedOff}
      </Grid>
      <Grid item xs={2} sx={{ transform: 'translate(1em ,0em) scale(1)' }}>
        {isDisliked ? dislikedOn: dislikedOff}
      </Grid>

      <Grid item xs={8} sx={{ transform: 'translate(1em ,0.5em) scale(1)' }}>By: {idNamePair.userName} </Grid>
      <Grid item xs={1} sx={{ transform: 'translate(1.5em ,-0.55em) scale(1)' }}>{numLikes} </Grid>
      <Grid item xs={1} sx={{ transform: 'translate(4.5em ,-0.55em) scale(1)' }}>{numDislikes} </Grid>

      <Grid item xs={12} >{songCard} </Grid>

      <Grid item xs={4} sx={{ transform: 'translate(1.5em ,0.8em) scale(1)' }}>{buttonSet} </Grid>
      <Grid item xs={4} sx={{ transform: 'translate(9.4em ,0.8em) scale(1)' }}>{editToolbar} </Grid>

      <Grid item xs={8} sx={{ transform: 'translate(1em ,0.5em) scale(1)' }}>{publishDate}</Grid>
      <Grid item xs={2} sx={{ transform: 'translate(-2em ,0.5em) scale(1)' }}>{listens} </Grid>
      <Grid item xs={1} sx={{ transform: 'translate(2em , 0.4em) scale(1)' }}>
        <IconButton id={"expand-" + idNamePair._id}
          onClick={toggleOpen}
          aria-label='expand'
          sx={{
            color: 'yellow', display: {
              xs: 'none', sm: 'block', backgroundColor: '#12345',
              '&:hover': {
                backgroundColor: 'gray', opacity: [0.1, 0.1, 0.1],
                color: 'white'
              }, borderRadius: 10
            }
          }}
        >
          {(decision) ? <ExpandLessIcon /> : <ExpandMoreIcon />}

        </IconButton>
      </Grid>
    </Grid>




  return (
    cardElement
  );
}

export default ListCard;