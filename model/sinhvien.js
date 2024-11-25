const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=Schema.ObjectId;
const sinhvien=new Schema(
    {
        massv:{type:ObjectId},
        hoten:{type:String},
        diemtb:{type:Number},
        mon:{type:String},
        tuoi:{type:Number}
    }
);
module.exports=mongoose.models.sinhvien||mongoose.model('sinhvien',sinhvien);