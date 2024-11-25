const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const trash=new Schema({
    masp:{type:ObjectId},
    tensp:{style:String},
    gia:{Style:Number},
    soluong:{style:Number}
});
module.exports=mongoose.models.trash||mongoose.model('trash',trash);
