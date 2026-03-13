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
        const { userId } = req.params;
        const authUserId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
            success: false,
            message: 'Login to get your journal entries.'
            });
        };

        // Authrization
        if (authUserId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden'
            });
        }

        const response = await Journal.find({ userId });
        if (response.length === 0) {
            return res.status(200).json({
            success: true,
            message: 'You have no journal entry yet!',
            response: []
        })
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully fetched journal entries',
            response
        })
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