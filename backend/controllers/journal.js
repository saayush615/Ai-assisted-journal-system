import Journal from "../models/journal.js";

async function handleJournalEntry(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Login before submitting journal'
            });
        };

        const { ambience, text } = req.body;

        if (!['forest', 'ocean', 'mountain'].includes(ambience)) {
            return res.status(400).json({
                success: false,
                message: 'You can only choose the ambience between forest, ocean, mountain options'
            });
        }

        if (!text?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'You must write some text.'
            });
        }

        const response = await Journal.create({
            userId,
            ambience,
            text: text.trim()
        })
        return res.status(201).json({
            success: true,
            message: 'New journal entry created!',
            response
        })
    } catch (error) {
        next(error);
    }
}

async function handleGetJournalEntry(req, res, next) {
    try {
        
    } catch (error) {
        next(error);
    }
}

async function handleEmotionAnalysis(req, res, next) {
    try {
        
    } catch (error) {
        next(error);
    }
}

async function handleUserInsights(req, res, next) {
    try {
        
    } catch (error) {
        next(error);
    }
}

export {
    handleJournalEntry, 
    handleGetJournalEntry, 
    handleEmotionAnalysis, 
    handleUserInsights 
}