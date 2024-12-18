var express = require('express');
var router = express.Router();

var sanpham = require("../model/sanpham");
const JWT = require('jsonwebtoken');
const config = require("../ultil/tokenConfig");


//1.Lấy tất cả sp
router.get("/all", async function (req, res) {
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(401).json({ status: false, message: "có lỗi" + err });
        } else {
          var list = await sanpham.find();
          res.status(200).json({ status: true, message: "Thành công", sanpham: list });
        }
      });
    } else {
      res.status(401).json({ status: false, message: "kh xác thực" + err });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "Có lỗi", error: error.message });
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
          const newItem = { tensp, gia, size };
          const saveSP = await sanpham.create(newItem);
          res.status(200).json({ status: true, message: "thêm thành công", sanpham: saveSP });
        }
      });
    } else {
      res.status(401).json({ status: false, message: "không xác thực" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: false, message: "Có lỗi xảy ra", error: error.message });
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

//4.Tìm kiếm sản phẩm (sanpham/tensp?tensp=?)
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
          const thongTinSP = await sanpham.findOne({ tensp: tensp });
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

//7.Chỉnh sửa  (sanpham/id)
router.put("/edit/:id", async function (req, res) {
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(401).json({ status: false, message: "có lỗi" + err });
        } else {
          const { tensp, gia, size } = req.body;
          //lấy id param
          const productId = req.params.id;
          console.log("productId:", productId);
          //tìm sp chỉnh sửa
          const findSP = await sanpham.findById(productId);
          console.log("findSP:", findSP);

          if (findSP) {
            findSP.tensp = tensp ? tensp : findSP.tensp;
            findSP.gia = gia ? gia : findSP.gia;
            findSP.size = size ? size : findSP.size;
            await findSP.save();
            res.status(200).json({ status: true, message: "sửa thành công", sanpham: findSP });
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

//8. Tìm sp theo size (sanpham/size?size=M)
router.get("/size", async function (req, res) {
  const { size } = req.query;
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(401).json({ status: false, message: "có lỗi" + err });
        } else {
          const list = await sanpham.find({ size: size });
          res.json(list);
        }
      });
    } else {
      res.status(401).json({ status: false, message: "kh xác thực" + err });
    }
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

//9. Tìm sản phẩm theo id
router.get("/thongtin/:id", async function (req, res) {
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(401).json({ status: false, message: "có lỗi" + err });
        } else {
          var list = await sanpham.findById(req.params.id);
          res.json(list);
        }
      });
    } else {
      res.status(401).json({ status: false, message: "kh xác thực" + err });
    }
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
});



module.exports = router;