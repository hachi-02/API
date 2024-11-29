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

//4.Tìm kiếm sản phẩm
router.get("/thongtin/tensp",async function(req,res)
{
    try {
        //lấy tên sp từ query
        const { tensp } = req.query;
    const thongTinSP = await sanpham.findOne({ tensp: tensp }).populate('size');
    if (!thongTinSP) {
        return res.status(404).json({ status: false, message: "Sản phẩm không tìm thấy" });
    }
  res.json({sanpham:thongTinSP});
    } catch (error) {
        res.status(400).json({status:false,message:"kh thành công"});
    }
    
    
});

//5.Giá tăng dần
router.get("/giatang", async function (req, res) {
    try {
      const list = await sanpham.find().sort({ gia: 1 });
      res.json(list);
    } catch (error) {
      res.status(500).json({ status: false, message: "Lỗi server" });
    }
  });

//6.Giá giảm dần
router.get("/giagiam", async function (req, res) {
    try {
      const list = await sanpham.find().sort({ gia: -1 });
      res.json(list);
    } catch (error) {
      res.status(500).json({ status: false, message: "Lỗi server" });
    }
  });

  router.put("/edit",async function(req,res) {
    try {
      const {id,tensp,gia,size}=req.body;
      //tìm sp chỉnh sửa
      const findSP=await sanpham.findById(id);

      if(findSP)
      {
        findSP.tensp=tensp?tensp:findSP.tensp;
        findSP.gia=gia?gia:findSP.gia;
        findSP.size=size?size:findSP.size;
        await findSP.save();
        res.status(200).json({status:true,message:"sửa thành công"});
      }
      else
      {
        res.status(400).json({status:false,message:"chưa tìm thấy sp"});
      }
    } catch (error) {
      res.status(400).json({status:false,message:"có lỗi xảy ra"});
    }
     
  });

  //tìm kiếm thoong tin theo mssv
router.get("/thongtin/:id",async function(req,res)
{
    try {
        var list= await sanpham.findById(req.params.id);
        res.json(list);
    } catch (error) {
        res.status(400).json({status:false,message:"null"});
    }
 
 
});



module.exports = router;