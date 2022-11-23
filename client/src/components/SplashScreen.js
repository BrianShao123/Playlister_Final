import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export default function SplashScreen() {

    return (
        <div id="splash-screen">
            <Typography variant='h2'>
                Playlister
            </Typography>
            <Typography variant='h4' sx={{fontWeight: 'bold'}} color="common.black">
                Welcome to one of the many applications on the internet that seeks to entertain you!
            </Typography> 
            <Typography variant='h5' sx={{fontStyle: 'italic'}} color="common.black">
                You can enjoy music all the while challenging yourself by navigating what appears to be a janky piece of software :-)
            </Typography> 
            <div id="splash-toolbar">
                <Stack direction="row" spacing={2}>
                    <Link to="/login/">
                    <Button variant="contained" >
                    Login
                </Button >
                    </Link>
                
                    <Link to="/login/">
                    <Button variant="contained" >
                    Continue as Guest
                </Button >
                    </Link>
                </Stack>
                <div id="sign-up">
                <Typography>
                    <Link to='/register/'>Sign up</Link>
                </Typography>
                </div>
                <div id="credits">
                    <Typography>
                        Developed By: Brian Shao
                    </Typography>
                </div>
                </div>
        </div>
    )
}