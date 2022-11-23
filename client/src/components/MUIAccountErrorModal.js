import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AuthContext from '../auth'
import { Button } from '@mui/material';
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography';

export default function MUIAccountErrorModal() {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 200,
        bgcolor: 'background.paper',
        boxShadow: 100,
        p: 4,
    };
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    let name = "";
    if (store.listMarkedForDeletion) {
        name = store.listMarkedForDeletion.name;
    }
    
    function handleCloseModal(event) {
        auth.closeModal();
    }
    let modalClass = "modal";
    if (auth.error === true) {
        modalClass += " is-visible";
    }

    let errMsg = "";
    if (auth.errMessage !== null) {
        errMsg = auth.errMessage;
    }


    return (
        <Modal
            open={auth.error !== false}
        >
            <Box sx={style}>
            
                <Typography variant='h4'>Account Error</Typography> 

                <Alert severity="error">Error: {errMsg}</Alert>
                <Button 
                sx={{float: "right", mt: 2}}
                onClick={() => {
                    handleCloseModal();
                  }}
                > 
                        Confirm
                        </Button>
    
            </Box>
        </Modal>
    );
}