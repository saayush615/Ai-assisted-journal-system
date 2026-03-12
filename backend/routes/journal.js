import express from 'express';
import { 
    handleJournalEntry, 
    handleGetJournalEntry, 
    handleEmotionAnalysis, 
    handleUserInsights 
} from '../controllers/journal.js'

const router = express.Router();

router.post('/analyze', handleEmotionAnalysis);
router.get('/insights/:userId', handleUserInsights);
router.post('/', handleJournalEntry);
router.get('/:userId', handleGetJournalEntry);

export default router;