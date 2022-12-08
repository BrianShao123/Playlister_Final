import React, { useContext, useEffect, useState } from 'react'
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
import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';

import SongCard from './SongCard.js'
import { useHistory } from 'react-router-dom'
import Box from '@mui/material/Box';
import MUIRemoveSongModal from './MUIRemoveSongModal';
import PropTypes from 'prop-types';
import MUIEditSongModal from './MUIEditSongModal';
import SortIcon from '@mui/icons-material/Sort';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import CommentList from './CommentList';
import YouTubePlayer from './YouTubePlayer';
import MUIPublishModal from './MUIPublishModal';
import MUIDuplicateModal from './MUIDuplicateModal';
import MUIChangeListNameErrorModal from './MUIChangeListNameErrorModal';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/


    const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [value, setValue] = React.useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchRequest, setSearchRequest] = useState("");
    const isMenuOpen = Boolean(anchorEl);
    store.history = useHistory();
    
    function TabPanel(props) {
      const { children, value, index, ...other } = props;
      return (
        <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
        >
          {value === index && (
            <Box sx={{ p: 3 }}>
              <Typography>{children}</Typography>
            </Box>
          )}
        </div>
      );
    
    }
    
    TabPanel.propTypes = {
      children: PropTypes.node,
      index: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
    };
    
    function a11yProps(index) {
      return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
      };
    }

    useEffect(() => {
      
      if(store.getUserName() != "GuestJoefpNhX925k4")
        store.setViewHome();
      else
      
        store.setViewAll();
    }, []);

    let video = "block";
    let comments = "none";
    
    if(value == 0) {
      video = 'block'
      comments = 'none'
    }

    if(value == 1)
    {
      video = 'none'
      comments = 'block'
    }

    function changeToHome() {
      store.setViewHome()
      console.log("View is " + store.currentView);
      //console.log("modal is " + store.currentModal);
    }

    function changeToAll() {
      store.setViewAll()
      console.log(store.currentView);
    }

    function changeToUsers() {
      store.setViewUsers()
      console.log(store.currentView)
    }


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

    const handleSortMenuOpen = (event) => {
        //store.closeCurrentList();
        setAnchorEl(event.currentTarget);
    };

    const handleSortMenuClose = () => {
        setAnchorEl(null);
    };

    function handleSearchUpdate(event) {
      setSearchRequest(event.target.value);
  }

  function handleKeyPress(event) {
      if (event.code === "Enter" && searchRequest) {
          let send = searchRequest;
          if(send != "")
              store.searchQuery(send);
          setSearchRequest("");
        }
  }


    const sortMenuId = 'sort-menu';
    const sortMenu = (
      <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
          }}
          id={sortMenuId}
          keepMounted
          transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
          }}
          open={isMenuOpen}
          onClose={handleSortMenuClose}
      >
          <MenuItem onClick={handleAlphabetSort}>Name (A-Z)</MenuItem>
          <MenuItem onClick={handlePublicationSort}>Publish Dates (Newest)</MenuItem>
          <MenuItem onClick={handleListenSort}>Listens (High-Low)</MenuItem>
          <MenuItem onClick={handleLikeSort}>Likes (High-Low)</MenuItem>
          <MenuItem onClick={handleDislikeSort}>Dislike (High-Low)</MenuItem>
      </Menu>
    );

    function handleAlphabetSort() {
      store.sortAlphabetically();
      handleSortMenuClose();
    }

    function handlePublicationSort() {
      store.sortByPublicationDate();
      handleSortMenuClose();
    }

    function handleListenSort() {
      store.sortByListens();
      handleSortMenuClose();
    }

    function handleLikeSort() {
      store.sortByLikes();
      handleSortMenuClose();
    }

    function handleDislikeSort() {
      store.sortByDislikes();
      handleSortMenuClose();
    }

    let guestCheck = 1;
    let addList = "";
    let homeSelect = 0;
    let allSelect = 0;
    let usersSelect = 0;
    if(store.currentView == "HOME") 
    {
      homeSelect = 1;
      addList = 
      <Box> 
        <Fab 
          color="primary" 
          aria-label="add"
          id="add-list-button"
          onClick={handleCreateNewList}
          sx ={{transform: 'translate(2em ,0.5em) scale(1)'}}
        >
            <AddIcon />
        </Fab>
        <Typography variant="h2" sx={{ width: '30vw', fontSize: '8vh'}}>
          Your Lists
        </Typography>
      </Box>
    }
    if(store.currentView == "ALL")
    {
      allSelect = 1;
    }
    if(store.currentView == "USERS")
    {
      usersSelect = 1;
    }
    if(store.getUserName() == "GuestJoefpNhX925k4") {
      guestCheck = 0;
    }

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
                store.idNamePairs.map((pair) => (
                    <ListCard 
                        key={pair._id}
                        idNamePair={pair}
                    />

                ))
                
    }

    let modalJSX = "";
    if(store.songMarkedForDeletion) {
      modalJSX = <MUIRemoveSongModal/>;
    }
    else if(store.editSong) {
      modalJSX = <MUIEditSongModal/>;
    }
    else if(store.currentModal == "DELETE_LIST") {
      modalJSX = <MUIDeleteModal />
    }
    else if(store.currentModal == "PUBLISH_LIST") {
      modalJSX = <MUIPublishModal/>
    }
    else if(store.currentModal == "DUPLICATE_LIST") {
      modalJSX = <MUIDuplicateModal/>
    }
    else if(store.currentModal == "CHANGE_LIST_NAME_ERROR")
    {
      modalJSX = <MUIChangeListNameErrorModal/>
    }
    return (
      <Box> 
            <AppBar position="static" elevation={0} sx={{ height: '10%'}}  style={{ background: '#e6e6e6' }}>
            <Toolbar>
                    
                        <IconButton 
                        id = 'home'
                        style={{ textDecoration: 'none', color: 'black' }}
                        onClick = {changeToHome}
                        disabled={guestCheck === 0}
                        >
                            <HomeIcon sx={{ fontSize: "3vw", border: homeSelect, opacity: guestCheck}} ></HomeIcon>
                        </IconButton>
                        
                        
                        
                        <IconButton 
                        id = 'all' 
                        style={{ textDecoration: 'none', color: 'black' }}
                        onClick = {changeToAll}
                        >
                            <GroupsIcon sx={{ fontSize: "3vw", border: allSelect}}></GroupsIcon>
                        </IconButton>
                        

                        
                        <IconButton 
                        id = 'user' 
                        style={{ textDecoration: 'none', color: 'black' }}
                        onClick = {changeToUsers}
                        >
                            <PersonIcon sx={{ fontSize: "3vw", border: usersSelect }}> </PersonIcon>
                        </IconButton>
                   
                    <div id="search-bar"> 
                    <TextField id="outlined-basic" 
                        label="Search" 
                        variant="outlined" 
                        InputProps={{ startAdornment: <SearchIcon/> }}
                        sx={{ backgroundColor: 'white', width: '30vw' }}
                        onChange ={handleSearchUpdate}
                        onKeyPress={handleKeyPress}
                        value = {searchRequest}
                        />
                    </div>
                    <div id="sort">
                    <IconButton onClick={handleSortMenuOpen} aria-label='sort'
                        sx = {{display: {  backgroundColor: '#12345',
                        '&:hover': {
                          backgroundColor: 'gray',
                          color: 'white'},  borderRadius: 10 }}}>
                    <Typography sx ={{color: 'black'}}> Sort By</Typography>
                    <SortIcon style={{fontSize:'28pt', color: 'black'}} />
                </IconButton>
                    </div>
                </Toolbar>

            </AppBar>
            <div id="list-selector-heading">
              {addList}
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
                
            </div>
            <div id="extension-tab">
                {
                   
                    //youtuber and comments tab
                  <Box sx={{ width: '100%' }}>
                    <Tabs 
                        value={value} 
                        onChange={handleChange}
                        TabIndicatorProps={{
                            style: {
                              backgroundColor: '#9795FE'
                            }
                          }}
                    >
                        <Tab label="Player" sx={{bgcolor:'background.paper'}} {...a11yProps(0)} />
                        <Tab label="Comment" sx={{bgcolor:'background.paper'}} {...a11yProps(1)}/>
                    </Tabs>
                    <Box sx={{display:video}}> 
                        <YouTubePlayer/>
                    </Box>
                    <Box sx = {{display:comments}}>
                      <CommentList/>
                    </Box>
                  </Box>
                }
            </div>
            {modalJSX}
            {sortMenu}
            </Box>
        )
}
////"<YouTubePlayer/>"

export default HomeScreen;