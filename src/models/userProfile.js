const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profiles',
    },
    following: {
        type: Boolean,
        required: true,
        default: false
    }
});


module.exports = mongoose.model('userProfiles', userProfileSchema);