var express = require('express');
var router = express.Router();

var sanpham = require("../model/sanpham");
const JWT = require('jsonwebtoken');
const config = require("../ultil/tokenConfig");
const Size = require('../model/size');


//1.Lấy tất cả sp
router.get("/all", async function (req, res) {
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(401).json({ status: false, message: "có lỗi" + err });
        } else {
          var list = await sanpham.find().populate('size');
          res.status(200).json({ status: true, message: "Thành công", sanpham: list });
        }
      });
    } else {
      res.status(401).json({ status: false, message: "kh xác thực" + err });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "Có lỗi", error: error.message  });
  }
});


//2.Thêm sản phẩm
router.post("/add", async function (req, res) {
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(401).json({ status: false, message: "có lỗi" + err });
        } else {
          const { tensp, gia, size } = req.body;
          const sizeObj = await Size.findOne({ size: size });
          const newItem = { tensp, gia, size: sizeObj._id  };
          const saveSP = await sanpham.create(newItem);
          const finalSP = await sanpham.findById(saveSP._id).populate('size');
          console.log('size:', sizeObj);
          res.status(200).json({ status: true, message: "thêm thành công", sanpham: saveSP });
        }
      });
    } else {
      res.status(401).json({ status: false, message: "kh xác thực" + err });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "có lỗi xảy ra" });
  }

});

//3.Xóa sản phẩm
router.delete("/delete/:id", async function (req, res) {
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(401).json({ status: false, message: "có lỗi" + err });
        } else {
          const { id } = req.params;
          await sanpham.findByIdAndDelete(id);
          res.status(200).json({ status: true, message: "thành công" });
        }
      });
    } else {
      res.status(401).json({ status: false, message: "kh xác thực" + err });
    }
  } catch (e) {
    res.status(400).json({ status: false, message: "kh thành công" });
  }
});

//4.Tìm kiếm sản phẩm
router.get("/thongtin/tensp", async function (req, res) {
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(401).json({ status: false, message: "có lỗi" + err });
        } else {
          //lấy tên sp từ query
          const { tensp } = req.query;
          const thongTinSP = await sanpham.findOne({ tensp: tensp }).populate('size');
          if (!thongTinSP) {
            return res.status(404).json({ status: false, message: "Sản phẩm không tìm thấy" });
          }
          res.json({ sanpham: thongTinSP });

        }
      });
    } else {
      res.status(401).json({ status: false, message: "kh xác thực" + err });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "kh thành công" });
  }


});

//5.Giá tăng dần
router.get("/giatang", async function (req, res) {
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(401).json({ status: false, message: "có lỗi" + err });
        } else {
          const list = await sanpham.find().sort({ gia: 1 });
          res.json(list);
        }
      });
    } else {
      res.status(401).json({ status: false, message: "kh xác thực" + err });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Lỗi server" });
  }
});

//6.Giá giảm dần
router.get("/giagiam", async function (req, res) {
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(401).json({ status: false, message: "có lỗi" + err });
        } else {
          const list = await sanpham.find().sort({ gia: -1 });
          res.json(list);
        }
      });
    } else {
      res.status(401).json({ status: false, message: "kh xác thực" + err });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: "Lỗi server" });
  }
});

//7.Chỉnh sửa
router.put("/edit", async function (req, res) {
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(401).json({ status: false, message: "có lỗi" + err });
        } else {
          const { id, tensp, gia, size } = req.body;
          //tìm sp chỉnh sửa
          const findSP = await sanpham.findById(id);

          if (findSP) {
            findSP.tensp = tensp ? tensp : findSP.tensp;
            findSP.gia = gia ? gia : findSP.gia;
            findSP.size = size ? size : findSP.size;
            await findSP.save();
            res.status(200).json({ status: true, message: "sửa thành công" });
          }
          else {
            res.status(400).json({ status: false, message: "chưa tìm thấy sp" });
          }
        }
      });
    } else {
      res.status(401).json({ status: false, message: "kh xác thực" + err });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "có lỗi xảy ra" });
  }

});




module.exports = router;