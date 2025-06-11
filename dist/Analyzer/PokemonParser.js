"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonParser = void 0;
const Token_1 = require("./Token");
class PokemonParser {
    constructor(tokens) {
        this.tokens = tokens;
        this.playerData = null;
        this.currentPokemon = null;
        this.currentStat = null;
    }
    parse() {
        var _a, _b;
        this.playerData = { nombre: "", pokemons: [] };
        for (let i = 0; i < this.tokens.length; i++) {
            const token = this.tokens[i];
            console.log(`Token[${i}]:`, token.getLexeme(), token.getType());
            // ... resto del código ...
            if (token.getType() === Token_1.Type.RESERVED_WORD && token.getLexeme() === "Jugador" &&
                ((_a = this.tokens[i + 1]) === null || _a === void 0 ? void 0 : _a.getType()) === Token_1.Type.COLON) {
                const nameToken = this.tokens[i + 2];
                if ((nameToken === null || nameToken === void 0 ? void 0 : nameToken.getType()) === Token_1.Type.STRING) {
                    this.playerData.nombre = this.cleanString(nameToken.getLexeme());
                    console.log("Jugador detectado:", this.playerData.nombre);
                    i += 2;
                }
            }
            // Más logs en otras secciones clave
            if (token.getType() === Token_1.Type.STRING && ((_b = this.tokens[i + 1]) === null || _b === void 0 ? void 0 : _b.getType()) === Token_1.Type.BRACKET_OPEN) {
                console.log("Inicio de Pokémon detectado en token:", token.getLexeme());
            }
            if (token.getType() === Token_1.Type.BRACE_CLOSE && this.currentPokemon) {
                console.log("Pokémon finalizado:", this.currentPokemon);
            }
        }
        if (!this.playerData)
            throw new Error("No se encontraron datos del jugador");
        console.log("Datos parseados:", this.playerData);
        return this.playerData;
    }
    cleanString(str) {
        // Elimina comillas y espacios innecesarios
        return str.replace(/^"+|"+$/g, '').trim();
    }
    // Método para validar los datos parseados
    validateParsedData(data) {
        if (!data.nombre)
            return false;
        if (!data.pokemons || data.pokemons.length === 0)
            return false;
        for (const pokemon of data.pokemons) {
            if (!pokemon.nombre || !pokemon.tipo)
                return false;
            if (isNaN(pokemon.stats.salud) || isNaN(pokemon.stats.ataque) || isNaN(pokemon.stats.defensa)) {
                return false;
            }
        }
        return true;
    }
}
exports.PokemonParser = PokemonParser;
