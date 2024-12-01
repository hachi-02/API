const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const sanpham=new Schema({
    id:{type:ObjectId},
    tensp:{type:String},
    gia:{type:Number},
    size:{type:ObjectId,ref:'size'}
});
sanpham.pre('findOne', function(next) {
    this.populate('size'); // Sử dụng populate để lấy thông tin size
    next();
});
module.exports=mongoose.models.sanpham||mongoose.model('sanpham',sanpham);
