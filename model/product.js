const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const product=new Schema({
    id:{type:ObjectId},
    tensp:{type:String},
    gia:{type:Number},
    soluong:{type:Number},
    category:{type:ObjectId,ref:'category'}
});
module.exports=mongoose.models.product||mongoose.model('product',product);
