import React, {useState, useContext} from 'react'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Grid, TextField} from '@mui/material';
import { GlobalStoreContext } from '../store'
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';


function CommentList() {
    const { store } = useContext(GlobalStoreContext);
    const [comment, setComment] = useState("");

    let commentCard = "";


    function handleSendComment() {
        let send = comment;
        
    }

    function handleCommentUpdate(event) {
        setComment(event.target.value);
    }


    if(store.currentList){
        commentCard = 
            <Grid container style = {{
                width: '100%', 
                backgroundColor: 'white', 
                height: '25vw', 
                overflow: 'scroll', 
                }}>

                {
                    store.currentList.comments.map((comment) => (
                        <Box>
                            <Grid item xs={12}>
                                {store.currentList.name}
                            </Grid>
                            <Grid> 
                                {comment}
                            </Grid>
                        </Box>
                    ))  
                }
            </Grid>
        }

    return (
        <Box> 
            {commentCard}
            <div id="comment-bar"> 
                <TextField 
                    id="outlined-basic" 
                    label="Post Comment" 
                    variant="outlined" 
                    //InputProps={{ startAdornment: <SearchIcon/> }}
                    sx={{ backgroundColor: 'white', width: '35vw' }}
                    onChange ={handleCommentUpdate}
                />
                <Button 
                    id = {"send-comment-" + 2}
                    onClick={handleSendComment} 
                    aria-label='send'
                    variant="contained">
                    
                    <SendIcon sx={{ fontSize: 40 }}/>
                </Button>
            </div>
        </Box>


    );
}

export default CommentList;