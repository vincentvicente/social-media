const mongoose = require('mongoose');
const UserSchema = require('./user.schema');
const StatusSchema = require('./status.schema');

const User = mongoose.model('User', UserSchema);
const Status = mongoose.model('Status', StatusSchema);

module.exports = { User, Status };
