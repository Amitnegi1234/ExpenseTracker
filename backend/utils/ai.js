const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function suggestCategory(description) {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `
            You are an expense categorization assistant.
            Categorize this expense description:
            "${description}"

            You can choose ONLY from these categories:
            cricket, football, movie, other.

            Rules:
            - Cricket-related expenses: cricket
            - Football-related expenses: football
            - Movie-related expenses: movie
            - Everything else: other

            Return ONLY the category name in lowercase.
        `
    });

    const category = response.text.trim().toLowerCase();

    const allowedCategories = ["cricket", "football", "movie", "other"];

    if (!allowedCategories.includes(category)) {
        return "other";
    }

    return category;
}

module.exports = suggestCategory;
