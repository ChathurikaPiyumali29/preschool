import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true,
    },

    ageGroup: {
        type: String,
        required: true,
    },

    capacity: {
        type: Number,
        required: true,
    },

    teacher: {
        type: String,
    },

    schedule: {
        type: String,
    },
});


export default mongoose.model("Class", classSchema);