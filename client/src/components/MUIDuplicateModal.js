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

export default function MUIDuplicateModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if (store.listMarkedForDuplicate) {
        name = store.listMarkedForDuplicate.name;
    }
    function handleDuplicateList(event) {
        store.duplicateMarkedList();
    }
    function handleCloseModal(event) {
        store.unmarkListForDuplicate();
    }

    let modalClass = "modal";
    if (store.isDuplicateListModalOpen()) {
        modalClass += " is-visible";
    }

    return (
        <Modal
            open={store.listMarkedForDuplicate !== null}
        >
            <Box>
        <div
            id="duplicate-list-modal"
            className={modalClass}
            data-animation="slideInOutLeft">
            <div
                id='duplicate-list-root'
                className="modal-root">
                <div
                    id="duplicate-list-modal-header"
                    className="modal-north">Duplicate Playlist?
                </div>

                <div className="modal-center">
                    <header className="dialog-header">
                        Duplicate the {name} Playlist?
                    </header>
                </div>
                <div
                    id="duplicate-list-modal-bottom"
                    className="modal-south">
                        <div id="modal-button">
                        <button
                            id="dialog-yes-button"
                            className="modal-button"
                            onClick={handleDuplicateList}
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