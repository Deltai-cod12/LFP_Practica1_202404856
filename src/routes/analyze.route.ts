import { Router } from 'express';
import { home, analyze } from '../controllers/analyze.controller';

const analyzeRouter = Router();

analyzeRouter.get('/', home);
analyzeRouter.post('/analyze', analyze);

export default analyzeRouter;

