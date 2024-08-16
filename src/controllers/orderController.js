const Order = require("../models/Order");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "phuc72583@gmail.com",
        pass: "cidfrgdattkyvjpd",
    },
});

async function sendMail(email) {
    const info = await transporter.sendMail({
        from: "Hobiverse <phuc72583@gmail.com>",
        to: email,
        subject: "Thông báo đặt hàng thành công",
        text: "Chúc mừng bạn đã đặt hàng thành công",
        // html: "<b>Bạn vừa đặt hàng thành công</b>",
    });

    console.log("Message sent: %s", info.messageId);
}

const orderController = {
    getAllOrders: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1; // Trang mặc định là 1 nếu không có query 'page'
            const limit = parseInt(req.query.limit) || 10; // Giới hạn mặc định là 10 nếu không có query 'limit'

            let query = {}; // Điều kiện tìm kiếm mặc định

            if (req.query.code) {
                query.code = { $regex: req.query.code, $options: "i" };
            }

            if (req.query.status) {
                query.status = req.query.status;
            }

            const skip = (page - 1) * limit;

            const orders = await Order.find(query)
                .populate({
                    path: "products.product",
                })
                .populate({
                    path: "user",
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();

            const totalOrders = await Order.countDocuments(query);

            const totalPages = Math.ceil(totalOrders / limit);

            res.status(200).json({
                status: "success",
                message: "Get all orders successfully",
                data: orders,
                page,
                totalPages,
                pageSize: limit,
                totalOrders,
            });
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    getOrderByUser: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1; // Trang mặc định là 1 nếu không có query 'page'
            const limit = parseInt(req.query.limit) || 10; // Giới hạn mặc định là 10 nếu không có query 'limit'

            let query = { user: req.params.id }; // Điều kiện tìm kiếm mặc định

            if (req.query.code) {
                query.code = { $regex: req.query.code, $options: "i" };
            }

            if (req.query.status) {
                query.status = req.query.status;
            }

            const skip = (page - 1) * limit;

            const orders = await Order.find(query)
                .populate({
                    path: "products.product",
                })
                .populate({
                    path: "user",
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();

            const totalOrders = await Order.countDocuments(query);

            const totalPages = Math.ceil(totalOrders / limit);

            res.status(200).json({
                status: "success",
                message: "Get all orders successfully",
                data: orders,
                page,
                totalPages,
                pageSize: limit,
                totalOrders,
            });
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    getOrder: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id)
                .populate({
                    path: "products.product",
                })
                .populate({
                    path: "user",
                })
                .exec();
            res.status(200).json({
                status: "success",
                message: "Get order successfully",
                data: order,
            });
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    createOrder: async (req, res) => {
        try {
            const order = await Order.create(req.body);
            const user = await User.findById(req.body.user);
            // await sendMail(user.email).catch((err) => {
            //     Order.findByIdAndDelete(order._id);
            //     res.status(500).json({
            //         status: "error",
            //         message: "Send email failed",
            //         error: err,
            //     });
            // });
            res.status(200).json(order);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    updateOrder: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            if (order) {
                await order.updateOne({ $set: req.body });
                res.status(200).json("Order has been updated");
            } else {
                res.status(404).json("Order not found");
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    updateStatusOrder: async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        const order = await Order.findById(id);
        if (order) {
            order.status = status;
            await order.save();
            res.status(200).json({
                status: "success",
                message: "Update order status successfully",
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "Order not found",
            });
        }
    },
};

module.exports = orderController;
