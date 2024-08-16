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
        replacement: "-", // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: false, // strip special characters except replacement, defaults to `false`
        locale: "vi", // language code of the locale to use
        trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });
    next();
});

productSchema.pre("update", function (next) {
    this.slug = slugify(this.name, {
        replacement: "-", // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: false, // strip special characters except replacement, defaults to `false`
        locale: "vi", // language code of the locale to use
        trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });
    next();
});

module.exports = mongoose.model("Product", productSchema);
