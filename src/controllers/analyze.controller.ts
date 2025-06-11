import { Request, Response } from 'express';
import { LexicalAnalyzer } from '../Analyzer/LexicalAnalyzer'; 
import { Token } from '../Analyzer/Token'; 
import { PokemonParser, Jugador } from '../Analyzer/PokemonParser';

let lastLexicalErrors: { fila: number; columna: number; lexema: string; token: string }[] = [];

export const home = (_req: Request, res: Response) => {
    res.render('pages/index', {
        tokens: [],
        errors: [],
        codigo: '',
        contador: 0,
        player: null 
    });
};

export const analyze = (req: Request, res: Response) => {
    const input = req.body.txtArea || '';

    // Analizador léxico
    const lexicalAnalyzer = new LexicalAnalyzer();
    const tokenList = lexicalAnalyzer.scanner(input);
    const rawErrorList = lexicalAnalyzer.getErrorList();

    // Mapear errores léxicos para la vista
    lastLexicalErrors = rawErrorList.map((errorToken: Token) => ({
        fila: errorToken.getRow(),
        columna: errorToken.getColumn(),
        lexema: errorToken.getLexeme(),
        token: errorToken.getTypeTokenString()
    }));

    // Mapear tokens para la vista
    const tokensToSend = tokenList.map(token => ({
        fila: token.getRow(),
        columna: token.getColumn(),
        lexema: token.getLexeme(),
        token: token.getTypeTokenString()
    }));

    let player: Jugador | null = null;

    // Solo parsear si NO hay errores léxicos
    console.log(lastLexicalErrors)
    if (lastLexicalErrors.length === 0) {
        try {
            const parser = new PokemonParser(tokenList);
            player = parser.parse(); // Devuelve Jugador | null
        } catch (e) {
            console.error('Error al parsear:', e);
        }
    }
    console.log(player)
    // Renderizar la vista con tokens, errores, código y jugador parseado
    res.render('pages/index', {
        tokens: tokensToSend,
        errors: rawErrorList,
        codigo: input,
        contador: tokensToSend.length,
        player 
    });
};

export const errorReport = (_req: Request, res: Response) => {
    res.render('pages/errores', {
        erroresLexicos: lastLexicalErrors 
    });
};
