import Parent from "../Model/parentModel.js";

// Create
export const create = async (req, res) => {
    try {
        const parentData = new Parent(req.body);
        const { email } = parentData;

        const parentExist = await Parent.findOne({ email });

        if (parentExist) {
            return res.status(400).json({ message: "Parent already exists." });
        }

        const savedParent = await parentData.save();
        res.status(201).json(savedParent);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Fetch All
export const fetch = async (req, res) => {
    try {
        const parents = await Parent.find();

        res.status(200).json({
            count: parents.length,
            data: parents,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Fetch One by ID
export const fetchById = async (req, res) => {
    try {
        const id = req.params.id;
        const parent = await Parent.findById(id);

        if (!parent) {
            return res.status(404).json({ message: "Parent not found." });
        }

        res.status(200).json(parent);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Update
export const update = async (req, res) => {
    try {
        const id = req.params.id;
        const parentExist = await Parent.findOne({ _id: id });

        if (!parentExist) {
            return res.status(404).json({ message: "Parent not found." });
        }

        const updatedParent = await Parent.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedParent);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// Delete
export const deleteParent = async (req, res) => {
    try {
        const id = req.params.id;
        const parentExist = await Parent.findOne({ _id: id });

        if (!parentExist) {
            return res.status(404).json({ message: "Parent not found." });
        }

        await Parent.findByIdAndDelete(id);
        res.status(200).json({ message: "Parent deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};
