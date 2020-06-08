const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true },
    isLive: { type: Boolean, required: true, default: false }
})

const User = mongoose.model('User', UserSchema);
module.exports = User;