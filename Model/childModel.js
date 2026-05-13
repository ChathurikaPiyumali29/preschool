import mongoose from "mongoose";

const childSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    dateOfBirth: {
        type: String,
        required: true,
    },

    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"],
    },

    medicalNotes: {
        type: String,
    },

    enrollmentDate: {
        type: String,
    },

    status: {
        type: String,
        enum: ["Pending", "Active", "Inactive"],
        default: "Pending",
    },

    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parent",  
        required: true,
    },

    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",    
    },
});

export default mongoose.model("Child", childSchema);