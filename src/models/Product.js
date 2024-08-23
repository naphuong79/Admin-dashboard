const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        description_summary: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        sale_price: {
            type: Number,
            default: 0,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        imageCollection: {
            type: Array,
            required: true,
        },
        imageMain: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            unique: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            required: true,
            default: "active",
        }

    },
    { timestamps: true },
);

productSchema.pre("save", function (next) {
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

productSchema.pre("update", function (next) {
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

module.exports = mongoose.model("Product", productSchema);
