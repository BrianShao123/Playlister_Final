
const Playlist = require('../models/playlist-model')
const User = require('../models/user-model');
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    const playlist = new Playlist(body);
    console.log("playlist: " + playlist.toString());
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }

    User.findOne({ _id: req.userId }, (err, user) => {
        if(err)
        {
            console.log("User not found")
        }
        console.log("user found: " + JSON.stringify(user));
        let name = playlist.name; 
        //console.log("NAME IS S S S S S " + name); 
        console.log("FOUND");
        async function addToAcc(user) {
            
        
        let found = await Playlist.findOne({
            name: name,
            ownerEmail: user.email
        })
        i = 0
        //console.log(user.email + " " + name);
        //console.log("FOUND IS " + JSON.stringify(found));
        while(found) {
            name = `${playlist.name} (${++i})`;
            //console.log(name);
            //console.log(user.email);
            found = await Playlist.findOne({
                name: name,
                ownerEmail: user.email
            })
        }
        playlist.name = name;
    
        user.playlists.push(playlist._id);
        user
            .save()
            .then(() => {
                console.log("PLAYLIST IS " + playlist)
                playlist
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            playlist: playlist
                        })
                    })
                    .catch(error => {
                        return res.status(400).json({
                            errorMessage: 'Playlist Not Created!'
                        })
                    })
            });
            }
            addToAcc(user);
        })
        
}

deletePlaylist = async (req, res) => {
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    Playlist.findById({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            
            User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    let temp = "";
                    for(let i = 0; i < user.playlists.length; i ++)
                    {
                        if(user.playlists[i] == req.params.id)
                        {
                            temp = user.playlists
                            temp.splice(i, 1);
                            break; 
                        }
                        
                    }
                    console.log("temp is " + temp);
                    user.playlists = temp;
                    user
                    .save();
                    
                    Playlist.findOneAndDelete({ _id: req.params.id }, () => {
                        return res.status(200).json({success: true});
                    }).catch(err => console.log(err))
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ 
                        errorMessage: "authentication error",
                    });
                }
            });
        }
        asyncFindUser(playlist);
    })
}
getPlaylistById = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    await Playlist.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        console.log("Found list: " + JSON.stringify(list));
        return res.status(200).json({ success: true, playlist: list})
        // DOES THIS LIST BELONG TO THIS USER?
        //async function asyncFindUser(list) {
            //await User.findOne({ email: list.ownerEmail }, (err, user) => {
                //console.log("user._id: " + user._id);
                //console.log("req.userId: " + req.userId);
                //if (user._id == req.userId) {
                    //console.log("correct user!");
                    //return res.status(200).json({ success: true, playlist: list })
                //}
                //else {
                    //console.log("incorrect user!");
                    //return res.status(400).json({ success: false, description: "authentication error" });
                //}
            //});
        //}
        //asyncFindUser(list);
    }).catch(err => console.log(err))
}
  

getPlaylistPairs = async (req, res) => {
    console.log("getPlaylistPairs");
    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList(email) {
            console.log("find all Playlists owned by " + email);
            await Playlist.find({ ownerEmail: email }, (err, playlists) => {
                console.log("found Playlists: " + JSON.stringify(playlists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!playlists) {
                    console.log("!playlists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Playlists not found' })
                }
                else {
                    console.log("Send the Playlist pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in playlists) {
                        let list = playlists[key];
                        let pair = {
                            userName: list.userName,
                            _id: list._id,
                            name: list.name,
                            published: list.published,
                            likes: list.likes,
                            dislikes: list.dislikes,
                            publishDate: list.publishDate
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(user.email);
    }).catch(err => console.log(err))
}
getPlaylists = async (req, res) => {
    await Playlist.find({published: true}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        let pairs = [];
                    for (let key in playlists) {
                        let list = playlists[key];
                        let pair = {
                            userName: list.userName,
                            _id: list._id,
                            name: list.name,
                            published: list.published,
                            likes: list.likes,
                            dislikes: list.dislikes,
                            publishDate: list.publishDate
                        };
                        pairs.push(pair);
                    }
        return res.status(200).json({ success: true, idNamePairs: pairs })
    }).catch(err => console.log(err))
}
updatePlaylist = async (req, res) => {
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                //if (user._id == req.userId) {
                    console.log("correct user!");
                    console.log("req.body.name: " + req.body.name);
                    list.publishDate = body.playlist.publishDate;
                    list.published = body.playlist.published;
                    list.name = body.playlist.name;
                    list.songs = body.playlist.songs;
                    list.comments = body.playlist.comments;
                    list
                        .save()
                        .then(() => {
                            console.log("SUCCESS!!!");
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                message: 'Playlist updated!',
                            })
                        })
                        .catch(error => {
                            console.log("FAILURE: " + JSON.stringify(error));
                            return res.status(404).json({
                                error,
                                message: 'Playlist not updated!',
                            })
                        })
                //}
                //else {
                    //console.log("incorrect user!");
                    //return res.status(400).json({ success: false, description: "authentication error" });
                //}
            });
        }
        asyncFindUser(playlist);
    })
}
module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist,
    
}