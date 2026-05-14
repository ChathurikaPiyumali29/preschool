import Class from "../Model/classModel.js";

// CREATE CLASS
export const create = async (req, res) => {
    try {
        const { className } = req.body;

        const classExist = await Class.findOne({ className });

        if (classExist) {
            return res.status(400).json({
                message: "Class already exists.",
            });
        }

        const savedClass = await Class.create(req.body);

        res.status(201).json(savedClass);

    } catch (error) {
        console.log("CREATE CLASS ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

// FETCH ALL CLASSES
export const fetch = async (req, res) => {
    try {
        const classes = await Class.find();

        res.status(200).json({
            count: classes.length,
            data: classes,
        });

    } catch (error) {
        console.log("FETCH CLASS ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

// FETCH BY ID
export const fetchById = async (req, res) => {
    try {
        const id = req.params.id;

        const classItem = await Class.findById(id);

        if (!classItem) {
            return res.status(404).json({
                message: "Class not found.",
            });
        }

        res.status(200).json(classItem);

    } catch (error) {
        console.log("FETCH BY ID ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

// UPDATE CLASS
export const update = async (req, res) => {
    try {
        const id = req.params.id;

        const updatedClass = await Class.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedClass) {
            return res.status(404).json({
                message: "Class not found.",
            });
        }

        res.status(200).json(updatedClass);

    } catch (error) {
        console.log("UPDATE CLASS ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

// DELETE CLASS
export const deleteClass = async (req, res) => {
    try {
        const id = req.params.id;

        const deletedClass = await Class.findByIdAndDelete(id);

        if (!deletedClass) {
            return res.status(404).json({
                message: "Class not found.",
            });
        }

        res.status(200).json({
            message: "Class deleted successfully.",
        });

    } catch (error) {
        console.log("DELETE CLASS ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};