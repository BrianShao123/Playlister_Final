const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userReactionSchema = new Schema(
    {
        like: {type: String},
        user: {type: String},
        playlist: {type: String}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Reaction', userReactionSchema)
