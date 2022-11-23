import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom'
import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';

import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import SongCard from './SongCard.js'
import { useHistory } from 'react-router-dom'
import Box from '@mui/material/Box';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/



    const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [value, setValue] = React.useState(0);
    store.history = useHistory();
    

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);
    
    function handleCreateNewList() {
        store.createNewList();
    }

    function handleLoadSongs(event) {
      event.stopPropagation();
        let id = event.target.id.substring("list-".length);
        store.setCurrentList(id);
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    let songCard = "";
    if(store.currentList) {
        songCard = 
        <Box style = {{maxHeight: 530, overflow: 'auto'}}>
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
         <div id="playlister-statusbar">
            <Typography variant="h4">{'okay'}</Typography>
        </div>          
         {}
         </Box>
    }
    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />

                ))
                
            }
            </List>;
    }
    return (
        <div id="playlist-selector">
            <AppBar position="static" elevation={0} sx={{ height: '10%'}}  style={{ background: '#e6e6e6' }}>
            <Toolbar>
                    <Typography                        
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block',  backgroundColor: '#12345',
                        '&:hover': {
                          backgroundColor: 'white',
                          opacity: [0.9, 0.8, 0.7],  }, borderRadius: 100 } }}                        
                    >
                        <Link style={{ textDecoration: 'none', color: 'black' }} to='/'>
                            <HomeIcon sx={{ fontSize: "120%" }}></HomeIcon>
                        </Link>
                        </Typography>
                        
                        <Typography                        
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block',  backgroundColor: '#12345',
                        '&:hover': {
                          backgroundColor: 'white',
                          opacity: [0.9, 0.8, 0.7],  }, borderRadius: 100 } }}                        
                    >
                        <Link style={{ textDecoration: 'none', color: 'black' }} to='/'>
                            <GroupsIcon sx={{ fontSize: "150%"}}></GroupsIcon>
                        </Link>
                        </Typography>

                        <Typography                        
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block',  backgroundColor: '#12345',
                        '&:hover': {
                          backgroundColor: 'white',
                          opacity: [0.9, 0.8, 0.7],  }, borderRadius: 100 } }}                        
                    >
                        <Link style={{ textDecoration: 'none', color: 'black' }} to='/'>
                            <PersonIcon sx={{ fontSize: "120%" }}> </PersonIcon>
                        </Link>
                    </Typography>
                    <div id="search-bar"> 
                    <TextField id="outlined-basic" 
                        label="Search" 
                        variant="outlined" 
                        InputProps={{ startAdornment: <SearchIcon/> }}
                        sx={{ backgroundColor: 'white', width: '30vw' }}
                        />
                    </div>
                </Toolbar>

            </AppBar>
            <div id="list-selector-heading">
            <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
                <Typography variant="h2" sx={{ width: '20vw', fontSize: '8vh'}}>Your Lists</Typography>
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
                <MUIDeleteModal />
            </div>
            <div id="extension-tab">
                {
                   
                    //youtuber and comments tab
                    <Tabs 
                        value={value} 
                        onChange={handleChange}
                        TabIndicatorProps={{
                            style: {
                              backgroundColor: '#9795FE'
                            }
                          }}
                    >
                        <Tab label="Player" sx={{bgcolor:'background.paper'}}/>
                        <Tab label="Comment" sx={{bgcolor:'background.paper'}}/>
                    </Tabs>
                    
                }
            </div>
        </div>)
}

export default HomeScreen;