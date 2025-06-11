import { Token } from "./Token";
import { Type } from "./Token";

export interface Pokemon {
    nombre: string;
    tipo: string;
    salud: number;
    ataque: number;
    defensa: number;
}

export interface Jugador {
    nombre: string;
    pokemones: Pokemon[];
}

export class PokemonParser {
    private tokens: Token[];
    private playerData: Jugador = {
        nombre: "",
        pokemones: []
    };

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    public parse(): Jugador | null {
        for (let i = 0; i < this.tokens.length; i++) {
            const token = this.tokens[i];

            // Detectar la cabecera: Jugador: "Jugador1" {
            console.log(token)
            if (
                token.getType() === Type.RESERVED_WORD &&
                token.getLexeme().toLowerCase() === "jugador" &&
                this.tokens[i + 1]?.getType() === Type.COLON &&
                this.tokens[i + 2]?.getType() === Type.STRING &&
                this.tokens[i + 3]?.getType() === Type.BRACE_OPEN
            ) {
                const nombreToken = this.tokens[i + 2];
                this.playerData.nombre = this.cleanString(nombreToken.getLexeme());
                console.log(this.playerData.nombre)
                i += 3; // Avanzamos después del {
                continue;
            }

            // Detectar bloque de un Pokémon
            if (
                token.getType() === Type.STRING &&
                this.tokens[i + 1]?.getType() === Type.BRACKET_OPEN &&
                this.tokens[i + 2]?.getType() === Type.RESERVED_WORD &&
                this.tokens[i + 3]?.getType() === Type.BRACKET_CLOSE &&
                this.tokens[i + 4]?.getType() === Type.ASSIGN &&
                this.tokens[i + 5]?.getType() === Type.PAR_OPEN
            ) {
                const nombrePokemon = this.cleanString(token.getLexeme());
                const tipo = this.tokens[i + 2].getLexeme().toLowerCase();

                const stats: any = {
                    salud: null,
                    ataque: null,
                    defensa: null
                };

                i += 6; // Avanzamos al interior del bloque de stats

                while (i < this.tokens.length) {
                    if (
                        this.tokens[i]?.getType() === Type.BRACKET_OPEN &&
                        this.tokens[i + 1]?.getType() === Type.RESERVED_WORD &&
                        this.tokens[i + 2]?.getType() === Type.BRACKET_CLOSE &&
                        this.tokens[i + 3]?.getType() === Type.EQUAL &&
                        this.tokens[i + 4]?.getType() === Type.NUMBER &&
                        this.tokens[i + 5]?.getType() === Type.SEMICOLON
                    ) {
                        const nombreStat = this.tokens[i + 1].getLexeme().toLowerCase();
                        const valorStat = parseInt(this.tokens[i + 4].getLexeme());

                        if (["salud", "ataque", "defensa"].includes(nombreStat)) {
                            stats[nombreStat] = valorStat;
                        }

                        i += 6;
                    } else if (this.tokens[i]?.getType() === Type.PAR_CLOSE) {
                        // Fin del bloque del Pokémon
                        i++;
                        break;
                    } else {
                        console.warn(" Estructura inesperada dentro del bloque del Pokémon:", this.tokens[i]);
                        break;
                    }
                }

                // Verificación mínima de stats
                if (stats.salud !== null && stats.ataque !== null && stats.defensa !== null) {
                    this.playerData.pokemones.push({
                        nombre: nombrePokemon,
                        tipo,
                        salud: stats.salud,
                        ataque: stats.ataque,
                        defensa: stats.defensa
                    });
                } else {
                    console.warn(`Pokémon "${nombrePokemon}" con stats incompletos.`);
                }

                continue;
            }
        }

        // Validación final
        if (this.playerData.nombre && this.playerData.pokemones.length > 0) {
            return this.playerData;
        } else {
            return null;
        }
    }

    private cleanString(cadena: string): string {
        return cadena.replace(/^"|"$/g, "");
    }
}
