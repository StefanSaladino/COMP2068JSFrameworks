//initialize.env
require("dotenv").config();

//global config obj containing app lvl variables
//client secrets, API keys, db connection strings, etc
const globals = {
    ConnectionString: {
        MongoDB: process.env.CONNECTION_STRING_MONGODB,
    },
    "github":{
            "clientID": "Ov23lirLbSQE7yoVk7iT",
            "clientSecret": process.env.GH_CLIENT_SECRET,
            "callbackUrl": "http://placefinder.onrender.com/github/callback"
        }  
}

//export config obj
module.exports = globals;