import Quote from "../models/Quote.js";

// POST /api/quotes — public, anyone can submit
export const submitQuote = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const quote = new Quote({ name, email, phone, message });
        await quote.save();
        res.status(201).json({ message: "Quote submitted successfully!", quote });
    } catch (err) {
        console.error("❌ submitQuote error:", err);
        res.status(500).json({ message: "Failed to submit quote." });
    }
};

// GET /api/quotes — admin only
export const getAllQuotes = async (req, res) => {
    try {
        const quotes = await Quote.find().sort({ createdAt: -1 });
        res.status(200).json(quotes);
    } catch (err) {
        console.error("❌ getAllQuotes error:", err);
        res.status(500).json({ message: "Failed to fetch quotes." });
    }
};

// PATCH /api/quotes/:id — admin: update status + optional note
export const updateQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNote } = req.body;

        const quote = await Quote.findById(id);
        if (!quote) return res.status(404).json({ message: "Quote not found." });

        if (status) quote.status = status;
        if (adminNote !== undefined) quote.adminNote = adminNote;

        await quote.save();
        res.status(200).json({ message: "Quote updated.", quote });
    } catch (err) {
        console.error("❌ updateQuote error:", err);
        res.status(500).json({ message: "Failed to update quote." });
    }
};

// DELETE /api/quotes/:id — admin
export const deleteQuote = async (req, res) => {
    try {
        const { id } = req.params;
        await Quote.findByIdAndDelete(id);
        res.status(200).json({ message: "Quote deleted." });
    } catch (err) {
        console.error("❌ deleteQuote error:", err);
        res.status(500).json({ message: "Failed to delete quote." });
    }
};