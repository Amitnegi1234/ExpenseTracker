const suggestCategory=require('../utils/ai')

const getSuggestedCategory = async (req, res) => {
    try {
        const { description } = req.body;
        if (!description || !description.trim()) {
            return res.status(400).json({
                message: "Description is required"
            });
        }
        const category = await suggestCategory(description);
        return res.status(200).json({
            category: category
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "AI category suggestion failed"
        });
    }
};

module.exports.getSuggestedCategory = getSuggestedCategory;