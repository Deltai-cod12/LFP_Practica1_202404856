import { Request, Response } from 'express';
import { LexicalAnalyzer } from '../Analyzer/LexicalAnalyzer'; // Ajusta si está en otro path

export const home = (_req: Request, res: Response) => {
    res.render('pages/index', {
        tokens: [],
        errors: [],
        codigo: '',
        contador: 0
    });
};

export const analyze = (req: Request, res: Response) => {
    const input = req.body.txtArea || '';

    const lexicalAnalyzer = new LexicalAnalyzer();
    const tokenList = lexicalAnalyzer.scanner(input);
    const errorList = lexicalAnalyzer.getErrorList();

    const tokensToSend = tokenList.map(token => ({
        fila: token.getRow(),
        columna: token.getColumn(),
        lexema: token.getLexeme(),
        token: token.getTypeTokenString()
    }));

    res.render('pages/index', {
        tokens: tokensToSend,
        errors: errorList,
        codigo: input,
        contador: tokensToSend.length
    });
};
