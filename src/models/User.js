const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        avatar: {
            type: String,
            default:
                "https://t4.ftcdn.net/jpg/03/46/93/61/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM.jpg",
        },
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
            minlength: 8,
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            required: true,
            default: "user",
        }
    },
    { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
