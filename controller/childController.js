import Child from "../Model/childModel.js";

// CREATE CHILD
export const create = async (req, res) => {
    try {
        const { firstName, lastName, dateOfBirth, parentId, classId } = req.body;

        // Check duplicate child
        const childExist = await Child.findOne({
            firstName,
            lastName,
            dateOfBirth,
            parentId,
        });

        if (childExist) {
            return res.status(400).json({
                message: "Child is already registered.",
            });
        }

        // Create child
        const savedChild = await Child.create(req.body);

        res.status(201).json(savedChild);

    } catch (error) {
        console.log("CREATE ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

// FETCH ALL CHILDREN
export const fetch = async (req, res) => {
    try {
        const children = await Child.find()
            .populate("parentId", "name email phone")
            .populate("classId", "className ageGroup teacher");

        res.status(200).json({
            count: children.length,
            data: children,
        });

    } catch (error) {
        console.log("FETCH ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

// FETCH CHILD BY ID
export const fetchById = async (req, res) => {
    try {
        const id = req.params.id;

        const child = await Child.findById(id)
            .populate("parentId", "name email phone")
            .populate("classId", "className ageGroup teacher");

        if (!child) {
            return res.status(404).json({
                message: "Child not found.",
            });
        }

        res.status(200).json(child);

    } catch (error) {
        console.log("FETCH BY ID ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

// UPDATE CHILD
export const update = async (req, res) => {
    try {
        const id = req.params.id;

        const updatedChild = await Child.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedChild) {
            return res.status(404).json({
                message: "Child not found.",
            });
        }

        res.status(200).json(updatedChild);

    } catch (error) {
        console.log("UPDATE ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

// DELETE CHILD
export const deleteChild = async (req, res) => {
    try {
        const id = req.params.id;

        const deletedChild = await Child.findByIdAndDelete(id);

        if (!deletedChild) {
            return res.status(404).json({
                message: "Child not found.",
            });
        }

        res.status(200).json({
            message: "Child registration deleted successfully.",
        });

    } catch (error) {
        console.log("DELETE ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};