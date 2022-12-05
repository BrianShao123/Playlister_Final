import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'



/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    MARK_LIST_FOR_PUBLICATION: "MARK_LIST_FOR_PUBLICATION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    SET_CURRENT_SONG: "SET_CURRENT_SONG",
    SET_HOME: "SET_HOME",
    SET_ALL: "SET_ALL",
    SET_USERS: "SET_USERS",
    SET_ID_NAME_PAIRS: "SET_ID_NAME_PAIRS",
    MARK_LIST_FOR_DUPLICATE: "MARK_LIST_FOR_DUPLICATE"
    
}
const CurrentView = {
    HOME: "HOME",
    ALL: "ALL",
    USERS: "USERS"
}
// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG",
    ACCOUNT_ERROR_MODAL: "ACCOUNT_ERROR_MODAL",
    PUBLISH_LIST: "PUBLISH_LIST",
    DUPLICATE_LIST: "DUPLICATE_LIST"
}

const sort_by = (field, reverse, primer) => {

    const key = primer ?
      function(x) {
        return primer(x[field])
      } :
      function(x) {
        return x[field]
      };
  
    reverse = !reverse ? 1 : -1;
  
    return function(a, b) {
      return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
  }


// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        currentView: CurrentView.HOME,
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        editSong: false,
        listIdMarkedForPublication: null,
        listMarkedForPublication: null,
        currentSongPlayed: 0,
        listIdMarkedForDuplicate: null,
        listMarkedForDuplicate: null

    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    editSong: false,
                    listIdMarkedForPublication: null,
                    listMarkedForPublication: null,
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    editSong: false,
                    listIdMarkedForPublication: null,
                    listMarkedForPublication: null,
                    currentView: store.currentView
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    editSong: false,
                    listIdMarkedForPublication: null,
                    listMarkedForPublication: null,
                    currentView: CurrentView.HOME
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    editSong: false,
                    listIdMarkedForPublication: null,
                    listMarkedForPublication: null,
                    currentView: store.currentView
                });
            }
            case GlobalStoreActionType.SET_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    editSong: false,
                    listIdMarkedForPublication: null,
                    listMarkedForPublication: null,
                    currentView: store.currentView
                });
            }
            case GlobalStoreActionType.SET_HOME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    editSong: false,
                    listIdMarkedForPublication: null,
                    listMarkedForPublication: null,
                    currentView: CurrentView.HOME
                });
            }
            case GlobalStoreActionType.SET_ALL: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    editSong: false,
                    listIdMarkedForPublication: null,
                    listMarkedForPublication: null,
                    currentView: CurrentView.ALL
                });
            }
            case GlobalStoreActionType.SET_USERS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    editSong: false,
                    listIdMarkedForPublication: null,
                    listMarkedForPublication: null,
                    currentView: CurrentView.USERS
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.delete,
                    editSong: false,
                    listIdMarkedForPublication: null,
                    listMarkedForPublication: null,
                    currentView:  store.currentView
                });
            }
            case GlobalStoreActionType.MARK_LIST_FOR_PUBLICATION: {
                return setStore({
                    currentModal : CurrentModal.PUBLISH_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    editSong: false,
                    listMarkedForPublication: payload.publish,
                    listIdMarkedForPublication: payload.id
                });
            }
            case GlobalStoreActionType.MARK_LIST_FOR_DUPLICATE: {
                return setStore({
                    currentModal : CurrentModal.DUPLICATE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    editSong: false,
                    listMarkedForPublication: null,
                    listIdMarkedForPublication: null,
                    listIdMarkedForDuplicate: payload.id,
                    listMarkedForDuplicate: payload.duplicate
                });
            }
            case GlobalStoreActionType.SET_CURRENT_SONG: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    listMarkedForPublication: null,
                    currentSongPlayed: payload.song,
                    currentView:  store.currentView
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    editSong: false,
                    listMarkedForPublication: null,
                    listIdMarkedForPublication: null

                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    editSong: payload.edit
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    songMarkedForDeletion:payload.currentSong
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    songMarkedForDeletion: null,
                    editSong: false,
                    currentView: store.currentView
                });
            }
            
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylist(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                                store.loadIdNamePairs();
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
        //console.log("STORE NAME PAIRS IS " + store.idNamePairs[0].name);
    }

    store.clearTransactions = function() {
        tps.clearAllTransactions();
    }
    
    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        history.push("/");
        //store.loadIdNamePairs();
        tps.clearAllTransactions();
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled";
        console.log(auth.user.userName);
        const response = await api.createPlaylist(auth.user.userName, newListName, [], auth.user.email, false, 0, 0, " ");
        //console.log("createNewList response: " + response);
        if (response.status === 201) {
            //console.log("In conditional")
            //tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );
            store.loadIdNamePairs(); 
            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            //history.push("/");
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    store.getUserName = function () {
        return auth.user.userName;
    }

    store.setCurrentSong = function (num) {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_SONG,
            payload: {song: num}
        })
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
            async function asyncLoadIdNamePairs() {
                const response = await api.getPlaylistPairs();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: pairsArray
                    });
                }
                else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
            }
            asyncLoadIdNamePairs();
    }

    store.setViewHome = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.SET_HOME,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setViewAll = function () {
        async function asyncLoadPublishedListNamePairs() {
            const response = await api.getPlaylists();
            if(response.data.success) {
                console.log("RAN " + response.data.success); 
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.SET_HOME,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
            
        }
        asyncLoadPublishedListNamePairs();
    }

    store.setViewUsers = function () {
        async function asyncLoadUsers() {
            const response = await api.getPlaylists();
            if(response.data.success) {
                console.log("RAN " + response.data.success); 
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.SET_USERS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
            
        }
        asyncLoadUsers();
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist, delete: playlist}
                });
            }
        }
        getListToDelete(id);
    }

    store.markListForDuplicate = function (id) {
        async function getListToDuplicate(id) {
            let response = await api.getPlaylistById(id);
            console.log(response.data.success);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DUPLICATE,
                    payload: {id: id, playlist: playlist, duplicate: playlist}
                });
            }
        }
        getListToDuplicate(id);
    }

    store.duplicateMarkedList = async function () {
        let newListName = store.listMarkedForDuplicate.name;
        console.log(newListName);
        let songs = store.listMarkedForDuplicate.songs;
        console.log(songs)
        //console.log("GOT HERE")
        const response = await api.createPlaylist(auth.user.userName, newListName, songs, auth.user.email, false, 0, 0, " ");
        //console.log("createNewList response: " + response);
        console.log(response.status);
        if (response.status === 201) {
            //console.log("In conditional")
            //tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );
            store.loadIdNamePairs(); 
            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            //history.push("/");
        }
        else {
            console.log("API FAILED TO DUPLICATE A NEW LIST");
        }
    
    }

    store.markListForPublication = function (id) {
        async function getListToPublish(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_PUBLICATION,
                    payload: {id: id, playlist: playlist, publish: playlist}
                });
            }
        }
        getListToPublish(id);
        
    }

    store.publishMarkedList = function () {
        let temp = new Date();
        temp.toDateString();
        store.currentList.publishDate = temp.toDateString();
        console.log("date string is " + temp);
        store.currentList.published = true; 
        async function asyncUpdateListStatus() {
            const response = await api.updatePlaylist(store.currentList._id, store.currentList);
            console.log("current list id" + store.currentList._id);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: {playlist: response.playlist}
                });
                store.loadIdNamePairs();
                console.log("list is published, " + store.currentList.published);
            }

        }
        asyncUpdateListStatus();
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                console.log("ran");
                store.loadIdNamePairs();
                history.push("/");
                
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
    }

    store.unmarkListForDeletion = function() {
        store.hideModals();
    }

    store.unmarkListForPublication = function() {
        store.hideModals();
    }

    store.unmarkListForDuplicate = function() {
        store.hideModals();
    }

    store.sortAlphabetically = function() {
        console.log("ran")
        let temp = store.idNamePairs;
        console.log(temp.sort(sort_by('name', false, (a) =>  a.toUpperCase())));
        console.log(temp);
        storeReducer({
            type: GlobalStoreActionType.SET_ID_NAME_PAIRS,
            payload: temp
        }); 
        //store.loadIdNamePairs();
    }

    store.sortByPublicationDate = function () {
        let temp = store.idNamePairs;
      
        console.log(temp.sort(sort_by('publishDate', true)));
        
        console.log(temp);
        storeReducer({
            type: GlobalStoreActionType.SET_ID_NAME_PAIRS,
            payload: temp
        }); 
    }

    store.sortByListens = function () {
        let temp = store.idNamePairs;
        console.log(temp.sort(sort_by('listens', false)));
        let test = [{name: 4}, {name: 2}]
        console.log(test.sort(sort_by('name', false)));
        storeReducer({
            type: GlobalStoreActionType.SET_ID_NAME_PAIRS,
            payload: temp
        }); 
    }

    store.sortByLikes = function () {
        let temp = store.idNamePairs;
        console.log(temp.sort(sort_by('likes', false)));
        console.log(temp);
        storeReducer({
            type: GlobalStoreActionType.SET_ID_NAME_PAIRS,
            payload: temp
        }); 
    }
    
    store.sortByDislikes = function () {
        let temp = store.idNamePairs;
        console.log(temp.sort(sort_by('disLikes', false)));
        console.log(temp);
        storeReducer({
            type: GlobalStoreActionType.SET_ID_NAME_PAIRS,
            payload: temp
        }); 
    }



    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit, edit: true}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    store.isPublishListModalOpen = () => {
        return store.currentModal === CurrentModal.PUBLISH_LIST;
    }

    store.isDuplicateListModalOpen = () => {
        return store.currentModal === CurrentModal.DUPLICATE_LIST;
    }


    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            console.log("id sent to store is " + id);
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                response = await api.updatePlaylist(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: {
                        playlist: playlist, 

                    }
                    });
                    //history.push("/playlist/" + playlist._id);
                    //console.log(store.currentList.songs); 
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "Unknown", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }

    store.updateList = function() {
        async function asyncUpdateList() {
            const response = await api.updatePlaylist(store.currentList._id, store.currentList);
            console.log("current list id" + store.currentList._id);
            //console.log("pairs " + idNamePairs);
            if (response.data.success) {
                
                console.log("Success");
            }
            
        }
        asyncUpdateList();
    }

    store.addComment = function (message) {
        let temp = {username: store.getUserName(), comment: message};
        let newList = store.currentList;
        newList.comments.splice(store.currentList.comments.length, 0, temp);
        store.updateList();

    }


    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    //store.addNewSong = () => {
        //let playlistSize = store.getPlaylistSize();
        //store.addCreateSongTransaction(
            //playlistSize, "Untitled", "Unknown", "dQw4w9WgXcQ");
    //}
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
        console.log("addCreateSongTransaction");
        console.log(tps.transactions);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }

    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylist(store.currentList._id, store.currentList);
            console.log("current list id" + store.currentList._id);
            //console.log("pairs " + idNamePairs);
            if (response.data.success) {
                //console.log("Reducer Called")
                console.log("🤡")
                store.loadIdNamePairs();
                console.log(store.currentList._id);
            }

            
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function (id) {
        async function setListToEdit(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: playlist
        });
        }
    }
    setListToEdit(id);
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };