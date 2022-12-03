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

export default function MUIPublishModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if (store.listMarkedForPublication) {
        name = store.listMarkedForPublication.name;
    }
    function handlePublishList(event) {
        store.publishMarkedList();
    }
    function handleCloseModal(event) {
        store.unmarkListForPublication();
    }

    let modalClass = "modal";
    if (store.isPublishListModalOpen()) {
        modalClass += " is-visible";
    }

    return (
        <Modal
            open={store.listMarkedForPublication !== null}
        >
            <Box>
        <div
            id="publish-list-modal"
            className={modalClass}
            data-animation="slideInOutLeft">
            <div
                id='publish-list-root'
                className="modal-root">
                <div
                    id="publish-list-modal-header"
                    className="modal-north">Publish Playlist?
                </div>

                <div className="modal-center">
                    <header className="dialog-header">
                        Publish the {name} Playlist?
                    </header>
                </div>
                <div
                    id="publish-list-modal-bottom"
                    className="modal-south">
                        <div id="modal-button">
                        <button
                            id="dialog-yes-button"
                            className="modal-button"
                            onClick={handlePublishList}
                        >Confirm</button>
                        <button
                            id="modal-button"
                            className="modal-button"
                            onClick={handleCloseModal}
                        >Cancel</button>
                    </div>
                </div>

            </div>
        </div>
            </Box>
        </Modal>
    );
}