const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const sanpham=new Schema({
    id:{type:ObjectId},
    tensp:{type:String},
    gia:{type:Number},
    size:{type:String}
});
module.exports=mongoose.models.sanpham||mongoose.model('sanpham',sanpham);
