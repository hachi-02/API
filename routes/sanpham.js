var express = require('express');
var router = express.Router();

var sanpham = require("../model/sanpham");

//1.Lấy tất cả sp
router.get("/all", async function (req, res) {
    try {
        var list = await sanpham.find().populate('size');
        res.status(200).json({ status: true, message: "Thành công", sanpham: list });
    } catch (error) {
        res.status(400).json({ status: false, message: "Có lỗi" });
    }
});


//2.Thêm sản phẩm
router.post("/add",async function(req,res) {
    try {
      const {tensp,gia,size}=req.body;
      const newItem={tensp,gia,size};
      const saveSP=await sanpham.create(newItem);
      const finalSP = await sanpham.findById(saveSP.id).populate('size');
      res.status(200).json({status:true,message:"thêm thành công",sanpham:finalSP});
    } catch (error) {
      res.status(400).json({status:false,message:"có lỗi xảy ra"});
    }
    
});

//3.Xóa sản phẩm
router.delete("/delete/:id",async function(req,res)
{
    try {
        const{id}=req.params;
        await sanpham.findByIdAndDelete(id);
        res.status(200).json({status:true,message:"thành công"});
    } catch (e) {
        res.status(400).json({status:false,message:"kh thành công"});
    }
});

//
router.get("/thongtin/tensp",async function(req,res)
{
    //lấy tên sp từ query
    const { tensp } = req.query;
    const sanpham = await sanpham.findOne({ tensp: tensp });
    if (!sanpham) {
        return res.status(404).json({ status: false, message: "Sản phẩm không tìm thấy" });
    }
  res.json(sanpham);
});

module.exports = router;