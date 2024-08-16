const mongoose = require('mongoose');
const slugify = require("slugify");

const voucherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: null,
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

voucherSchema.pre("save", function (next) {
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

voucherSchema.pre("update", function (next) {
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

module.exports = mongoose.model('Voucher', voucherSchema);