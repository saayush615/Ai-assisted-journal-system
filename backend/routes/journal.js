import express from 'express';
import { 
    handleJournalEntry, 
    handleGetJournalEntry, 
    handleEmotionAnalysis, 
    handleUserInsights 
} from '../controllers/journal.js'
import { AuthenticatedUserOnly, AuthorOnly } from '../middleware/authorization.js';

const router = express.Router();

router.post('/analyze', handleEmotionAnalysis);
router.get('/insights/:userId', AuthenticatedUserOnly, AuthorOnly, handleUserInsights);
router.post('/', AuthenticatedUserOnly, handleJournalEntry);
router.get('/:userId', AuthenticatedUserOnly, AuthorOnly, handleGetJournalEntry);

export default router;