const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const size=new Schema({
    size:{type:String}
});
module.exports=mongoose.models.size||mongoose.model('size',size);
