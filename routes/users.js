var express = require('express');
var router = express.Router();

var usermodel = require("../model/usermodel");
var product = require("../model/product");
var upload = require("../ultil/uploadConfig");
var sendMail = require("../ultil/mailConfig");
const JWT = require('jsonwebtoken');
const config = require("../ultil/tokenConfig");

router.get("/all", async function (req, res) {
  try {

    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(401).json({ status: false, message: "có lỗi" + err });
        } else {
          //xử lý chức năng tương ứng với API
          var list = await product.find().populate('category');
          res.status(200).json({ status: true, message: "thành công", product: list });

        }
      });
    } else {
      res.status(401).json({ status: false, message: "kh xác thực" + err });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "có lỗi" });
  }

});


router.get("/all", async function (req, res) {
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(401).json({ status: false, message: "có lỗi" + err });
        } else {
          // Lấy danh sách sản phẩm và populate category
          var list = await product.find().populate('category');
          
          // Kiểm tra nếu có dữ liệu và trả về với trường 'product'
          res.status(200).json({ 
            status: true, 
            message: "thành công", 
            product: list  // Trả về danh sách sản phẩm trong trường 'product'
          });
        }
      });
    } else {
      res.status(401).json({ status: false, message: "kh xác thực" });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "có lỗi" });
  }
});

router.get("/all1", async function (req, res) {
 
          // Lấy danh sách sản phẩm và populate category
          var list = await product.find().populate('category');
          
          // Kiểm tra nếu có dữ liệu và trả về với trường 'product'
          res.status(200).json({ 
            status: true, 
            message: "thành công", 
            product: list  // Trả về danh sách sản phẩm trong trường 'product'
          });
     
});



router.get("/gia", async function (req, res) {
  const token = req.header("Authorization").split(' ')[1];
  if (token) {
    JWT.verify(token, config.SECRETKEY, async function (err, id) {
      if (err) {
        res.status(401).json({ status: false, message: "có lỗi" + err });
      } else {
        var list = await product.find({ gia: { $gte: 50000, $lte: 200000 } });
        res.json(list);
      }
    });
  } else {
    res.status(401).json({ status: false, message: "kh xác thực" + err });
  }
});

router.get("/slvagia", async function (req, res) {
  const token = req.header("Authorization").split(' ')[1];
  if (token) {
    JWT.verify(token, config.SECRETKEY, async function (err, id) {
      if (err) {
        res.status(401).json({ status: false, message: "có lỗi" + err });
      } else {
        var list = await product.find({ $or: [{ soluong: { $lt: 10 } }, { gia: { $gt: 200000 } }] });
        res.json(list);
      }
    });
  } else {
    res.status(401).json({ status: false, message: "kh xác thực" + err });
  }
});


router.get("/chitiet/:id", async function (req, res) {
  const token = req.header("Authorization").split(' ')[1];
  if (token) {
    JWT.verify(token, config.SECRETKEY, async function (err, id) {
      if (err) {
        res.status(401).json({ status: false, message: "có lỗi" + err });
      } else {
        var list = await product.findById(req.params.id);
        res.json(list);
      }
    });
  } else {
    res.status(401).json({ status: false, message: "kh xác thực" + err });
  }
});
module.exports = router;


//thêm 1 sp
router.post("/add", async function (req, res) {
  try {
    const token = req.header("Authorization").split(' ')[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(401).json({ status: false, message: "có lỗi" + err });
        } else {
          const { tensp, gia, soluong } = req.body;
          const newItem = { tensp, gia, soluong };
          await product.create(newItem);
          res.status(200).json({ status: true, message: "thêm thành công" });
        }
      });
    } else {
      res.status(401).json({ status: false, message: "kh xác thực" + err });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "có lỗi xảy ra" });
  }

});

//chỉnh sữa
router.put("/edit/:id", async function (req, res) {
  try {
    const { id, tensp, gia, soluong } = req.body;
    //tìm sp chỉnh sửa
    const findProduct = await product.findById(id);
    if (findProduct) {
      findProduct.tensp = tensp ? tensp : findProduct.tensp;
      findProduct.gia = gia ? gia : findProduct.gia;
      findProduct.soluong = soluong ? soluong : findProduct.soluong;
      await findProduct.save();
      res.status(200).json({ status: true, message: "sửa thành công" });
    }
    else {
      res.status(400).json({ status: false, message: "chưa tìm thấy sp" });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "có lỗi xảy ra" });
  }

})
//upload file
router.post('/upload', [upload.single('image')],
  async (req, res, next) => {
    try {
      const { file } = req;
      if (!file) {
        return res.json({ status: 0, link: "" });
      } else {
        const url = `http://localhost:3000/images/${file.filename}`;
        return res.json({ status: 1, url: url });
      }
    } catch (error) {
      console.log('Upload image error: ', error);
      return res.json({ status: 0, link: "" });
    }
  });


//email
router.post("/send-mail", async function (req, res, next) {
  try {
    const { to, subject, content } = req.body;

    const mailOptions = {
      from: "trí dũng <dungntps40706@gmail.com>",
      to: to,
      subject: subject,
      html: content
    };
    await sendMail.transporter.sendMail(mailOptions);
    res.json({ status: 1, message: "Gửi mail thành công" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.json({ status: 0, message: "Gửi mail thất bại", error: err.message });
  }
});

router.post("/login", async function (req, res) {
  try {
    const { username, password } = req.body;
    const checkuser = await usermodel.findOne({ username: username, password: password });
    if (checkuser == null) {
      res.status(200).json({ status: true, message: "Tài khoản mk chưa chính xác" });
    }
    else {
      const token = JWT.sign({ username: username }, config.SECRETKEY, { expiresIn: '90s' });
      const refeshToken = JWT.sign({ username: username }, config.SECRETKEY, { expiresIn: '1d' });
      res.status(200).json({ status: true, message: "Đăng nhập thành công", token: token, refeshToken: refeshToken });
    }
  } catch (e) {
    res.status(400).json({ status: false, message: "có lỗi xảy ra" });
  }
});