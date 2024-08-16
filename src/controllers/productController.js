const Product = require("../models/Product");
const slugify = require("slugify");

const productController = {
    getAllProducts: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1; // Trang mặc định là 1 nếu không có query 'page'
            const limit = parseInt(req.query.limit) || 10; // Giới hạn mặc định là 10 nếu không có query 'limit'
    
            let query = {}; // Điều kiện tìm kiếm mặc định
            if (req.query.category) {
                query.category = req.query.category;
            }

            if (req.query.name) {
                query.name = { $regex: req.query.name, $options: "i" };
            }
    
            const skip = (page - 1) * limit;
    
            const products = await Product.find(query)
                .populate("category")
                // .populate("brand")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
    
            const totalProducts = await Product.countDocuments(query);
    
            const totalPages = Math.ceil(totalProducts / limit);
    
            res.status(200).json({
                status: "success",
                message: "Get all products successfully",
                data: products,
                page,
                totalPages,
                pageSize: limit,
                totalProducts
            });
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    getProductBySlug: async (req, res) => {
        try {
            const product = await Product.findOne({ slug: req.params.slug })
                .populate("category")
                // .populate("brand")
                .exec();
            res.status(200).json({
                status: "success",
                message: "Get product by slug successfully",
                data: product,
            });
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    getProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id)
                .populate("category")
                // .populate("brand")
                .exec();
            res.status(200).json({
                status: "success",
                message: "Get product by id successfully",
                data: product,
            });
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    createProduct: async (req, res) => {
        try {
            const product = await Product.create(req.body);
            res.status(200).json({
                status: "success",
                message: "Product has been created",
                data: product,
            });
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    updateProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (product) {
                // Tạo slug từ req.body.name
                const slug = slugify(req.body.name, { lower: true });
    
                // Cập nhật dữ liệu sản phẩm
                await product.updateOne({ $set: { ...req.body, slug: slug } });
    
                // Đáp ứng với thông báo thành công và dữ liệu sản phẩm đã được cập nhật
                res.status(200).json({
                    status: "success",
                    message: "Product has been updated",
                    data: product,
                });
            } else {
                res.status(404).json("Product not found");
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    }
    ,
    deleteProduct: async (req, res) => {
        try {
            await Product.findByIdAndDelete(req.params.id);
            res.status(200).json("Product has been deleted...");
        } catch (err) {
            return res.status(500).json(err);
        }
    },
};

module.exports = productController;
