var express = require('express');
var router = express.Router();

var sanpham = require("../model/sanpham");
router.get("/all", async function (req, res) {
    try {
        var list = await sanpham.find().populate('size');
        res.status(200).json({ status: true, message: "Thành công", sanpham: list });
    } catch (error) {
        res.status(400).json({ status: false, message: "Có lỗi" });
    }
});