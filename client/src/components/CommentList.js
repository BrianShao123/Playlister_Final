import React, {useState, useContext} from 'react'
import Box from '@mui/material/Box';

import {TextField, Typography} from '@mui/material';
import { GlobalStoreContext } from '../store'
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';


function CommentList() {
    const { store } = useContext(GlobalStoreContext);
    const [comment, setComment] = useState("");

    let commentCard = "";
    let inputBar = "";

    function handleSendComment() {
        let send = comment;
        if(comment != "")
            store.addComment(send);
        setComment("");
    }

  

    function handleCommentUpdate(event) {
        setComment(event.target.value);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter" && comment) {
            let send = comment;
            if(comment != "")
                store.addComment(send);
            setComment("");
          }
    }


    if(store.currentList){
        commentCard = 
            <Box container style = {{
                //width: '100%',
                display: 'flex',
                flexDirection:'column',
                backgroundColor: 'white', 
                height: '31.25vw', 
                overflow: 'scroll', 
                }}>

                {
                    store.currentList.comments.map((comment) => (
                        <Box container sx ={{
                            backgroundColor: 'lightBlue', 
                            m: 1,
                            p: 1,
                            borderRadius: 2, 
                            marginTop: 2, 
                            display: 'flex',
                           }}>
                            <Box> 
                                <Typography component="div" variant="h7" sx={{paddingBottom: 1, color: 'blue'}}>
                                    {comment.username} :
                                </Typography>

                                <Typography component="div" sx={{display:'flex', wordBreak: 'break-word'}}>
                                <Box >
                                    {comment.comment}
                                </Box>
                                </Typography>
                                </Box>
                        </Box>
                    ))  
                }
            </Box>;
        inputBar = 
            <div id="comment-bar"> 
                <TextField 
                    id="outlined-basic" 
                    label="Post Comment" 
                    variant="outlined" 
                    //InputProps={{ startAdornment: <SearchIcon/> }}
                    sx={{ backgroundColor: 'white', width: '35vw' }}
                    onChange ={handleCommentUpdate}
                    onKeyPress={handleKeyPress}
                    value = {comment}
                />
                <Button 
                    id = {"send-comment-" + 2}
                    onClick={handleSendComment} 
                    aria-label='send'
                    variant="contained">
                    
                    <SendIcon sx={{ fontSize: 40 }}/>
                </Button>
            </div>
        }

    return (
        <Box> 
            {commentCard}
            {inputBar}
        </Box>


    );
}

export default CommentList;