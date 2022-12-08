import { Typography } from '@mui/material';
import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';



function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ draggedTo, setDraggedTo ] = useState(0);
    const { song, index } = props;
    const [selected, setSelect] = useState(false);

    function handleDragStart(event) {
        event.dataTransfer.setData("song", index);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let targetIndex = index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveSongTransaction(sourceIndex, targetIndex);
    }
    function handleRemoveSong(event) {
        console.log("remove initiated");
        store.showRemoveSongModal(index, song);
    }
    function handleClick(event) {
        // DOUBLE CLICK IS FOR SONG EDITING
        if (event.detail === 2) {
            store.showEditSongModal(index, song);
        }
    }

    function handleEdit(event) {
        if(!store.currentList.published) {
            console.log(store.currentList.name); 
            store.showEditSongModal(index, song);
        }
    }

    function selectSong() {
        let select = !selected;
      setSelect(select);
        
    }



    let selectClass = "unselected-song-card";
    if (selected) {
        selectClass = "selected-song-card";
    }
    else 
        selectClass = "unselected-song-card";

    let discard = "";
    if(!store.currentList.published){
        discard = 
        <IconButton id = {"remove-song-" + index} onClick={handleRemoveSong} aria-label='remove-song' 
        sx={{float: 'right', transform: 'translate(0em ,-0.5em) scale(1)'}}>
        <DeleteIcon style={{ fontSize: '20pt', color: 'Blue' }} />
        </IconButton>
    }

    let cardClass = "list-card unselected-list-card";
    return (
        <div
            key={index}
            id={'song-card-' + index}
            className={selectClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            //onClick={selectSong}
            onDoubleClick = {handleEdit}
            onDrop={handleDrop}
            draggable="true"
            //onClick={handleClick}
        >
            <Box> 
            <Typography sx={{color:"Blue"}}> 
                {index + 1}.
                {song.title} by {song.artist}
                {discard}
            </Typography>
            </Box>
        </div>
    );
}

export default SongCard;