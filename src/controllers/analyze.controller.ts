import { Request, Response } from 'express';
import { LexicalAnalyzer } from '../Analyzer/LexicalAnalyzer'; 
import { Token } from '../Analyzer/Token'; 
import { PokemonParser, Jugador } from '../Analyzer/PokemonParser';
import { obtenerSprite } from '../utils/pokeapi'; 

let lastLexicalErrors: { fila: number; columna: number; lexema: string; token: string }[] = [];

export const home = (_req: Request, res: Response) => {
    res.render('pages/index', {
        tokens: [],
        errors: [],
        codigo: '',
        contador: 0,
        jugadores: []  // cambiar player a jugadores (array)
    });
};

export const analyze = async (req: Request, res: Response) => {
    const input = req.body.txtArea || '';

    const lexicalAnalyzer = new LexicalAnalyzer();
    const tokenList = lexicalAnalyzer.scanner(input);
    const rawErrorList = lexicalAnalyzer.getErrorList();

    lastLexicalErrors = rawErrorList.map((errorToken: Token) => ({
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

    let jugadores: Jugador[] = [];

    function calcularIV(pokemon: { salud: number, ataque: number, defensa: number }) {
        return ((pokemon.salud + pokemon.ataque + pokemon.defensa) / 45) * 100;
    }

    if (lastLexicalErrors.length === 0) {
        try {
            const parser = new PokemonParser(tokenList);
            jugadores = parser.parse();

            jugadores = await Promise.all(jugadores.map(async jugador => {
                const pokemonesConIV = await Promise.all(jugador.pokemones.map(async p => ({
                    ...p,
                    iv: calcularIV(p),
                    sprite: await obtenerSprite(p.nombre.toLowerCase()) || ''
                })));

                pokemonesConIV.sort((a, b) => b.iv - a.iv);

                const seleccionados: typeof pokemonesConIV = [];
                const tiposUsados = new Set<string>();

                for (const p of pokemonesConIV) {
                    if (!tiposUsados.has(p.tipo)) {
                        seleccionados.push(p);
                        tiposUsados.add(p.tipo);
                    }
                    if (seleccionados.length === 6) break;
                }

                return {
                    nombre: jugador.nombre,
                    pokemones: seleccionados
                };
            }));

        } catch (e) {
            console.error('Error al parsear:', e);
        }
    }

    console.log(JSON.stringify(jugadores, null, 2));

    res.render('pages/index', {
        tokens: tokensToSend,
        errors: rawErrorList,
        codigo: input,
        contador: tokensToSend.length,
        jugadores
    });
};




export const errorReport = (_req: Request, res: Response) => {
    res.render('pages/errores', {
        erroresLexicos: lastLexicalErrors 
    });
};
