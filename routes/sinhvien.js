var express = require('express');
var router = express.Router();

var sinhvien=require("../model/sinhvien");

//lấy ds tất cả
router.get("/all",async function (req,res)
{
    var list=await sinhvien.find();
    res.json(list);
});

//http://localhost:3000/sinhvien/monhoc?mon=CNTT
//lấy ds sinh viên khoa CNTT
router.get("/monhoc", async function (req, res) {
  const { mon } = req.query; // Lấy môn học từ query parameter
  try {
      const list = await sinhvien.find({ mon: mon }); // Tìm sinh viên theo môn học
      res.json(list);
  } catch (err) {
      res.status(500).json({ error: "Lỗi server" });
  }
});



//http://localhost:3000/sinhvien/diem?min=6.5&max=8.5
//lấy toàn bộ sv điểm từ 6.5-->8.5
router.get("/diem", async function (req, res) {
  const { min, max } = req.query;  
  const minDiem = parseFloat(min); 
  const maxDiem = parseFloat(max); 

  try {
      const list = await sinhvien.find({
          diemtb: { $gte: minDiem, $lte: maxDiem }
      });
      res.json(list);
  } catch (err) {
      res.status(500).json({ error: "Lỗi server" });
  }
});


//tìm kiếm thoong tin theo mssv
router.get("/thongtin/:id",async function(req,res)
{
  var list= await sinhvien.findById(req.params.id);
  res.json(list);
});

//thêm 1 sv mới
router.post("/add",async function(req,res) {
    try {
      const {hoten,diemtb,mon,tuoi}=req.body;
      const newItem={hoten,diemtb,mon,tuoi};
      await sinhvien.create(newItem);
      res.status(200).json({status:true,message:"thêm thành công"});
    } catch (error) {
      res.status(400).json({status:false,message:"có lỗi xảy ra"});
    }
    
});

//thay đổi thông thông tin
router.put("/edit",async function(req,res) {
    try {
      const {id,hoten,diemtb,mon,tuoi}=req.body;
      //tìm sp chỉnh sửa
      const findSV=await sinhvien.findById(id);
      if(findSV)
      {
        findSV.hoten=hoten?hoten:findSV.hoten;
        findSV.diemtb=diemtb?diemtb:findSV.diemtb;
        findSV.mon=mon?mon:findSV.mon;
        findSV.tuoi=tuoi?tuoi:findSV.tuoi;
        await findSV.save();
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

  //xóa 1 sinh viên
  router.delete("/delete/:id",async function(req,res)
{
    try {
        const{id}=req.params;
        await sinhvien.findByIdAndDelete(id);
        res.status(200).json({status:true,message:"thành công"});
    } catch (e) {
        res.status(400).json({status:false,message:"kh thành công"});
    }
});

//Lấy danh sách các sinh viên thuộc BM CNTT và có DTB từ 9.0
router.get("/MONVDIEM",async function(req,res)
{ 
  try{
    const {mon,diemtb}=req.query;
    var list= await sinhvien.find( { $and: [{ mon:mon }, { diemtb: { $gte: parseFloat(diemtb) } }] });
    res.json(list);
  }
  catch(error)
  {
    res.status(400).json({status:false,message:"kh thành công"}); 
  }
});


//Lấy ra danh sách các sinh viên có độ tuổi từ 18 đến 20 thuộc CNTT có điểm trung bình từ 6.5
router.get("/CNTT&T&DTB", async function (req, res) {
  try {
    const list = await sinhvien.find({
      mon: "CNTT",
      diemtb: { $gte: 6.5 },
      tuoi: { $gte: 18, $lte: 20 },
    });
    res.json(list);
  } catch (error) {
    res.status(500).send("Lỗi server");
  }
});

//diem tb tăng dần
router.get("/tangdan", async function (req, res) {
  try {
    const list = await sinhvien.find().sort({ diemtb: 1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ status: false, message: "Lỗi server" });
  }
});

// Tìm sinh viên có điểm trung bình cao nhất thuộc BM CNTT
router.get("/diemtbcaonhat", async function (req, res) {
  try {
    const { mon, limit } = req.query; // Lấy tham số từ query
    const limitNumber = parseInt(limit);
    const list = await sinhvien
      .find(mon ? { mon } : {})
      .sort({ diemtb: -1 })
      .limit(limitNumber);
    res.json(list);
  } catch (error) {
    res.status(500).json({ status: false, message: "Lỗi server" });
  }
});


module.exports = router;