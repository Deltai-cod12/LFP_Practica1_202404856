import { Router } from 'express';
import { home, analyze, errorReport } from '../controllers/analyze.controller';

const analyzeRouter = Router();

analyzeRouter.get('/', home);
analyzeRouter.post('/analyze', analyze);
analyzeRouter.get('/error-report', errorReport)
export default analyzeRouter;