import mongoose from "mongoose";

const parentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,   
    },

    phone: {
        type: String,
        required: true,
    },

    address: {
        type: String,
    },

    relationship: {
        type: String,
        enum: ["Father", "Mother", "Guardian"],
        required: true,
    },
});


export default mongoose.model("Parent", parentSchema);