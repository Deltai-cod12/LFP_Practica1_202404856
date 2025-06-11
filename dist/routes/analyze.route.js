"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyze_controller_1 = require("../controllers/analyze.controller");
const analyzeRouter = (0, express_1.Router)();
analyzeRouter.get('/', analyze_controller_1.home);
analyzeRouter.post('/analyze', analyze_controller_1.analyze);
analyzeRouter.get('/error-report', analyze_controller_1.errorReport);
exports.default = analyzeRouter;
