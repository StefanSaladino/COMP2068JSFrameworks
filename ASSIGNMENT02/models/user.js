//user.js model

const mongoose = require('mongoose');
// Take the out of the box functionality from the plm package to extend the user model
const plm = require('passport-local-mongoose');

const dataSchemaObj = {
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, 
        ref: 'Restaurant' }]
}
const mongooseSchema = new mongoose.Schema(dataSchemaObj);
// Use passport-local-mongoose to indicate this is a special authentication model
// plugin() adds plm functionality to our model
// i.e. hashing/salting password, and handling authentication attempts
mongooseSchema.plugin(plm);
// export the enhanced model
module.exports = new mongoose.model('User', mongooseSchema);