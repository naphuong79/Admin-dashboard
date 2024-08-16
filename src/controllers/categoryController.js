const Category = require('../models/Category');
const slugify = require("slugify");

const categoryController = {
    getAllCategories: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1; // Trang mặc định là 1 nếu không có query 'page'
            const limit = parseInt(req.query.limit) || 10; // Giới hạn mặc định là 10 nếu không có query 'limit'
    
            let query = {}; // Điều kiện tìm kiếm mặc định
    
            const skip = (page - 1) * limit;
    
            const categories = await Category.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
    
            const totalCategories = await Category.countDocuments(query);
    
            const totalPages = Math.ceil(totalCategories / limit);
    
            res.status(200).json({
                status: "success",
                message: "Get all Categories successfully",
                data: categories,
                page,
                totalPages,
                pageSize: limit,
                totalCategories
            });
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    getCategory: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            res.status(200).json(category);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    createCategory: async (req, res) => {
        try {
            const category = await Category.create(req.body);
            res.status(200).json(category);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    updateCategory: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            if (category) {
                // Tạo slug từ req.body.name
                const slug = slugify(req.body.name, { lower: true });
    
                // Cập nhật dữ liệu danh mục
                await category.updateOne({ $set: { ...req.body, slug: slug } });
    
                // Đáp ứng với thông báo thành công
                res.status(200).json('The category has been updated');
            } else {
                res.status(404).json('Category not found');
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    deleteCategory: async (req, res) => {
        try {
            await Category.findByIdAndDelete(req.params.id);
            res.status(200).json('Category has been deleted...');
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    getAllCategoriesController: async (req, res) => {
        try {
            const categories = await Category.find();
            res.status(200).json({
                status: "success",
                message: "Get all Categories successfully",
                data: categories
            });
        } catch (err) {
            return res.status(500).json(err);
        }
    }


};

module.exports = categoryController;