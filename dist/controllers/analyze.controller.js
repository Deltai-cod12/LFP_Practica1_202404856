"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorReport = exports.analyze = exports.home = void 0;
const LexicalAnalyzer_1 = require("../Analyzer/LexicalAnalyzer");
const PokemonParser_1 = require("../Analyzer/PokemonParser");
let lastLexicalErrors = [];
const home = (_req, res) => {
    res.render('pages/index', {
        tokens: [],
        errors: [],
        codigo: '',
        contador: 0,
        player: null
    });
};
exports.home = home;
const analyze = (req, res) => {
    const input = req.body.txtArea || '';
    const lexicalAnalyzer = new LexicalAnalyzer_1.LexicalAnalyzer();
    const tokenList = lexicalAnalyzer.scanner(input);
    const rawErrorList = lexicalAnalyzer.getErrorList();
    lastLexicalErrors = rawErrorList.map((errorToken) => ({
        fila: errorToken.getRow(),
        columna: errorToken.getColumn(),
        lexema: errorToken.getLexeme(),
        token: errorToken.getTypeTokenString()
    }));
    const tokensToSend = tokenList.map(token => ({
        fila: token.getRow(),
        columna: token.getColumn(),
        lexema: token.getLexeme(),
        token: token.getTypeTokenString()
    }));
    let player = null;
    // Solo parsear si NO hay errores
    if (lastLexicalErrors.length === 0) {
        try {
            const parser = new PokemonParser_1.PokemonParser(tokenList);
            const parsedData = parser.parse();
            if (parser.validateParsedData(parsedData)) {
                player = parsedData;
            }
        }
        catch (e) {
            console.error('Error al parsear:', e);
        }
    }
    // 👇 Log para ver si se encontró un jugador válido
    console.log('Jugador parseado:', player);
    res.render('pages/index', {
        tokens: tokensToSend,
        errors: rawErrorList,
        codigo: input,
        contador: tokensToSend.length,
        player
    });
};
exports.analyze = analyze;
const errorReport = (_req, res) => {
    res.render('pages/errores', {
        erroresLexicos: lastLexicalErrors
    });
};
exports.errorReport = errorReport;
