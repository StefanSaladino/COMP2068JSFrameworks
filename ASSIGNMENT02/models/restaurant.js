//data model names are singular
//import mongoose
const mongoose = require("mongoose");
//define data schema object - json
const dataSchemaObject = {
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    status: {
        type: String,
    }
}
//create mongoose schema object
const mongooseSchema = mongoose.Schema(dataSchemaObject);
//create and export mongoose model object
module.exports = mongoose.model("Restaurant", mongooseSchema);