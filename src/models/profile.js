const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
    },
    bio: {
        type: String,
        required: true,
        default: 'This is your bio'
    },
    image: {
        type: String,
        required: true,
        default: 'https://api.realworld.io/images/smiley-cyrus.jpeg'
    }
});


module.exports = mongoose.model('Profiles', profileSchema);