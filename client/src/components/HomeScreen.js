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
import { Grid } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom'
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
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/


    const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [value, setValue] = React.useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
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

    const handleSortMenuOpen = (event) => {
        //store.closeCurrentList();
        setAnchorEl(event.currentTarget);
    };

    const handleSortMenuClose = () => {
        setAnchorEl(null);
    };
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
          <MenuItem onClick={handleSortMenuClose}>Name (A-Z)</MenuItem>
          <MenuItem onClick={handleSortMenuClose}>Publish Dates (Newest)</MenuItem>
          <MenuItem onClick={handleSortMenuClose}>Listens (High-Low)</MenuItem>
          <MenuItem onClick={handleSortMenuClose}>Likes (High-Low)</MenuItem>
          <MenuItem onClick={handleSortMenuClose}>Dislike (High-Low)</MenuItem>
      </Menu>
    );

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
                        //selected={false}
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
    return (
      <Box> 
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
                        <Tab label="Player" sx={{bgcolor:'background.paper'}} {...a11yProps(0)}/>
                        <Tab label="Comment" sx={{bgcolor:'background.paper'}} {...a11yProps(1)}/>
                    </Tabs>
                      <TabPanel value={value} index={0}>
                        Item One
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        Item Two
                      </TabPanel>
                    </Box>
                }
            </div>
            {modalJSX}
            {sortMenu}
            </Box>
        )
}

export default HomeScreen;