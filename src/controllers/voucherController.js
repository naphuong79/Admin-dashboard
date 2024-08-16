const Voucher = require('../models/Voucher');
const slugify = require("slugify");

const voucherController = {
    getAllVouchers: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1; // Trang mặc định là 1 nếu không có query 'page'
            const limit = parseInt(req.query.limit) || 10; // Giới hạn mặc định là 10 nếu không có query 'limit'
    
            let query = {}; // Điều kiện tìm kiếm mặc định
            const skip = (page - 1) * limit;
    
            const vouchers = await Voucher.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();

            const totalVouchers = await Voucher.countDocuments(query);
    
            const totalPages = Math.ceil(totalVouchers / limit);
    
            res.status(200).json({
                status: "success",
                message: "Get all vouchers successfully",
                data: vouchers,
                page,
                totalPages,
                pageSize: limit,
                totalVouchers
            });
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    getVoucher: async (req, res) => {
        try {
            const voucher = await Voucher.findById(req.params.id);
            res.status(200).json(voucher);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    createVoucher: async (req, res) => {
        try {
            const voucher = await Voucher.create(req.body);
            res.status(200).json(voucher);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    updateVoucher: async (req, res) => {
        try {
            const voucher = await Voucher.findOneAndUpdate(
                { _id: req.params.id }, // điều kiện tìm kiếm
                { $set: { ...req.body, slug: slugify(req.body.name, { lower: true, locale: "vi" }) } }, // dữ liệu cập nhật, bao gồm cả slug
                { new: true } // trả về bản ghi đã được cập nhật
            );
            if (voucher) {
                res.status(200).json('The order has been added to the voucher');
            } else {
                res.status(404).json('Voucher not found');
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    }
    ,
    deleteVoucher: async (req, res) => {
        try {
            await Voucher.findByIdAndDelete(req.params.id);
            res.status(200).json('Voucher has been deleted...');
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    getAllvoucherController: async (req, res) => {
        try {
            const vouchers = await Voucher.find();
            res.status(200).json({
                status: "success",
                message: "Get all vouchers successfully",
                data: vouchers
            });
        } catch (err) {
            return res.status(500).json(err);
        }
    }
};


module.exports = voucherController;