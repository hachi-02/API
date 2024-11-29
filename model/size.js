const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const size=new Schema({
    id:{type:ObjectId},
    size:{type:String}
});
module.exports=mongoose.models.size||mongoose.model('size',size);
