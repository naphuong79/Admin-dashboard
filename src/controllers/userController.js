const User = require('../models/User');

const userController = {
    getAllUsers: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1; // Trang mặc định là 1 nếu không có query 'page'
            const limit = parseInt(req.query.limit) || 10; // Giới hạn mặc định là 10 nếu không có query 'limit'
    
            let query = {}; // Điều kiện tìm kiếm mặc định

            if(req.query.role) {
                query.role = req.query.role;
            }

            if(req.query.email) {
                query.email = { $regex: req.query.email, $options: "i" };
            }
    
            const skip = (page - 1) * limit;
    
            const users = await User.find(query)
                .populate('role')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
    
            const totalUsers = await User.countDocuments(query);
    
            const totalPages = Math.ceil(totalUsers / limit);
    
            res.status(200).json({
                status: "success",
                message: "Get all users successfully",
                data: users,
                page,
                totalPages,
                pageSize: limit,
                totalUsers
            });
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id).populate('role');
            res.status(200).json(user);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    createUser: async (req, res) => {
        try {
            const user = await User.create(req.body);
            res.status(200).json(user);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    updateUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (user) {
                await user.updateOne({ $set: req.body });
                res.status(200).json('The order has been added to the user');
            } else {
                res.status(404).json('User not found');
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    updateUserRole: async (req, res) => {
        const { id } = req.params;
        const { role } = req.body;
        const user = await User.findById(id);
        if (user) {
            user.role = role;
            await user.save();
            res.status(200).json({
                status: "success",
                message: "Update user role successfully",
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }
    },
    deleteUser: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({
                status: "success",
                message: "Delete user successfully",
            });
        } catch (err) {
            return res.status(500).json(err);
        }
    }


};

module.exports = userController;