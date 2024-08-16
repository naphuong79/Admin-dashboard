const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            unique: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        total: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "paid", "cancelled"],
            default: "pending",
        },
        address: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        note: {
            type: String
        },
    },
    { timestamps: true },
);


orderSchema.pre("save", function (next) {
    this.code = `DH${Math.floor(Math.random() * 1000000)}`;
    next();
});

module.exports = mongoose.model("Order", orderSchema);
