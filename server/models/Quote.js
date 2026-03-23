import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
        type: String,
        enum: ["New", "In Review", "Quoted", "Closed"],
        default: "New",
    },
    adminNote: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Quote", quoteSchema);