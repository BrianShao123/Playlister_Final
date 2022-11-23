import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { List, Typography } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import SongCard from './SongCard.js'
import React, { useEffect } from 'react'
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
    const { idNamePair, selected } = props;
    const [expanded, setExpanded] = React.useState('panel1');

    const Accordion = styled((props) => (
        <MuiAccordion disableGutters elevation={0} square {...props} />
      ))(({ theme }) => ({
        border: `1px solid ${theme.palette.divider}`,
        '&:not(:last-child)': {
          borderBottom: 0,
        },
        '&:before': {
          display: 'none',
        },
      }));
      
      const AccordionSummary = styled((props) => (
        <MuiAccordionSummary
          expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
          {...props}
        />
      ))(({ theme }) => ({
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
        flexDirection: 'row-reverse',
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
          transform: 'rotate(90deg)',
        },
        '& .MuiAccordionSummary-content': {
          marginLeft: theme.spacing(1),
        },
      }));
    
      
      const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
        padding: theme.spacing(2),
        borderTop: '1px solid rgba(0, 0, 0, .125)',
      }));
    
      const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
      };
    




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

    function handleToggleEdit(event) {
        event.stopPropagation();

    }

    function openCurrentList(event) {
        console.log("event is " + event);
        event.stopPropagation();
        let id = event.target.id;
        console.log("Id found is " + id);
        store.setCurrentList(id);
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

    function doNothing() {

    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }
    let songCard = "";
    if(store.currentList) {
        songCard = 
        <Box style = {{maxHeight: 530}}>
        <List 
            id="playlist-cards" 
            sx={{ width: '100%', bgcolor: 'background.paper'}}
        >
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
         </List> 
         </Box>
         //console.log("Song card is " + songCard)
    }

    let cardElement =
    <List
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1, backgroundColor: 'white',
            '&:hover': {
              backgroundColor: '#eeeedd',
              opacity: [0.9, 0.8, 0.7],  } }}
            style={{height: '15%', 
                    width: '97.5%',
                    fontSize: '20pt',
                    borderRadius: 20,
                    }}
    > 
    <Accordion id = {"list-" + idNamePair._id} expanded={expanded ===  `panel${idNamePair._id}`} onChange={handleChange(`panel${idNamePair._id}`)} onClick = {openCurrentList} sx={{ display: { xs: 'none', 
                sm: 'block',
                backgroundColor: '#12345',
                '&:hover': {
                  backgroundColor: 'white',
                  opacity: [0.9, 0.8, 0.7],  }, borderRadius: 25 } }}     >
                <AccordionSummary aria-controls={"panel" + idNamePair._id + "-content"} id={idNamePair._id} onClick = {doNothing} 
                sx={{  backgroundColor: 'white', borderRadius: 20, height: '5vw'}}>
        <ListItem sx={{ width: '39vw'}}>
            <Box sx={{ p: 1, flexGrow: 1}}>{idNamePair.name}</Box>
            <Box sx={{ p: 1}}>
                <IconButton onClick={openCurrentList} aria-label='edit'>
                    <ThumbUpOffAltIcon style={{fontSize:'24pt'}} />
                </IconButton>
                <Typography align="center"> 123</Typography>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='delete'>
                    <ThumbDownOffAltIcon style={{fontSize:'24pt'}} />
                </IconButton>
                <Typography align="center"> 123</Typography>
            </Box>
            <Box sx={{ p: 1 }}>
            <IconButton onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='expand'>
                   <ExpandMoreIcon/>
                </IconButton>
            </Box>
            
        </ListItem>
        </AccordionSummary>
                    <AccordionDetails sx={{ height: '10vw', overflow: 'scroll' }}>
                    
                    {songCard}
                    
                    </AccordionDetails>
                    </Accordion>
        
    </List>
    
    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;