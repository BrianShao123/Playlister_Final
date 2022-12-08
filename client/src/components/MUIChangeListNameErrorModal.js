import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 200,
    bgcolor: 'background.paper',
    border: '3px solid #000',
    boxShadow: 100,
    p: 4,
};

export default function MUIChangeListNameErrorModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if (store.listMarkedForChangeName) {
        name = store.listMarkedForChangeName.name;
    }
    
    function handleCloseModal(event) {
        store.hideModals();
    }

    let modalClass = "modal";
    if (store.isListNameErrorModalOpen()) {
        modalClass += " is-visible";
    }

    return (
        <Modal
            open={store.listMarkedForChangeName !== null}
        >
            <Box>
        <div
            id="change-list-name-error-modal"
            className={modalClass}
            data-animation="slideInOutLeft">
            <div
                id='error-list-root'
                className="modal-root">
                <div
                    id="error-list-modal-header"
                    className="modal-north">Error
                </div>

                <div className="modal-center">
                    <header className="dialog-header">
                        The playlist {name} does not have a unique name. Please rename.
                    </header>
                </div>
                <div
                    id="error-list-modal-bottom"
                    className="modal-south">
                        <div id="modal-button">
                        <button
                            id="dialog-yes-button"
                            className="modal-button"
                            onClick={handleCloseModal}
                        >Confirm</button>
                    </div>
                </div>

            </div>
        </div>
            </Box>
        </Modal>
    );
}