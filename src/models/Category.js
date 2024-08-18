const mongoose = require('mongoose');
const slugify = require("slugify");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: null,
    },
    slug: {
        type: String,
        unique: true,
    },
}, {timestamps: true});

categorySchema.pre("save", function (next) {
    this.slug = slugify(this.name, {
        replacement: "-", // Thay thế khoảng trắng bằng ký tự thay thế, mặc định là "-"
        remove: undefined, // Loại bỏ các ký tự khớp với regex, mặc định là `undefined`
        lower: true, // Chuyển đổi thành chữ thường, mặc định là `false`
        strict: false, // Loại bỏ các ký tự đặc biệt ngoại trừ ký tự thay thế, mặc định là `false`
        locale: "vi", // Mã ngôn ngữ của địa phương cần sử dụng
        trim: true, // Loại bỏ khoảng trắng dẫn đầu và cuối ký tự thay thế, mặc định là `true`
    });
    next();
});

categorySchema.pre("update", function (next) {
    this.slug = slugify(this.name, {
      replacement: "-", // Thay thế khoảng trắng bằng ký tự thay thế, mặc định là "-"
      remove: undefined, // Loại bỏ các ký tự khớp với regex, mặc định là `undefined`
      lower: true, // Chuyển đổi thành chữ thường, mặc định là `false`
      strict: false, // Loại bỏ các ký tự đặc biệt ngoại trừ ký tự thay thế, mặc định là `false`
      locale: "vi", // Mã ngôn ngữ của địa phương cần sử dụng
      trim: true, // Loại bỏ khoảng trắng dẫn đầu và cuối ký tự thay thế, mặc định là `true`
    });
    next();
});

module.exports = mongoose.model('Category', categorySchema);