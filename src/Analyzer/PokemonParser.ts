import { Token } from "./Token";
import { Type } from "./Token";

export interface Pokemon {
    nombre: string;
    tipo: string;
    salud: number;
    ataque: number;
    defensa: number;
    ivs?: number;
    sprite?: string;
}


export interface Jugador {
    nombre: string;
    pokemones: Pokemon[];
}

export class PokemonParser {
    private tokens: Token[];
    private jugadores: Jugador[] = [];
    private jugadorActual: Jugador | null = null;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    public parse(): Jugador[] {
        let i = 0;
        while (i < this.tokens.length) {
            const token = this.tokens[i];

            // Detectar cabecera del jugador
            if (
                token.getType() === Type.RESERVED_WORD &&
                token.getLexeme().toLowerCase() === "jugador" &&
                this.tokens[i + 1]?.getType() === Type.COLON &&
                this.tokens[i + 2]?.getType() === Type.STRING &&
                this.tokens[i + 3]?.getType() === Type.BRACE_OPEN
            ) {
                // Si ya hay un jugador actual, agregarlo a la lista antes de crear uno nuevo
                if (this.jugadorActual) {
                    this.jugadores.push(this.jugadorActual);
                }

                const nombreToken = this.tokens[i + 2];
                this.jugadorActual = {
                    nombre: this.cleanString(nombreToken.getLexeme()),
                    pokemones: []
                };
                i += 4; // Saltar hasta el {
                continue;
            }

            // Detectar definición de Pokémon (solo si hay jugador actual)
            if (
                this.jugadorActual &&
                token.getType() === Type.STRING &&
                this.tokens[i + 1]?.getType() === Type.BRACKET_OPEN &&
                this.tokens[i + 2]?.getType() === Type.RESERVED_WORD &&
                this.tokens[i + 3]?.getType() === Type.BRACKET_CLOSE &&
                this.tokens[i + 4]?.getType() === Type.ASSIGN &&
                this.tokens[i + 5]?.getType() === Type.PAR_OPEN
            ) {
                const nombrePokemon = this.cleanString(token.getLexeme());
                const tipo = this.tokens[i + 2].getLexeme().toLowerCase();

                const stats: Record<string, number | null> = {
                    salud: null,
                    ataque: null,
                    defensa: null
                };

                i += 6; // Posicionarse dentro del bloque de estadísticas

                // Leer las estadísticas
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
                        continue;
                    }

                    if (this.tokens[i]?.getType() === Type.PAR_CLOSE) {
                        i++; // Salir del bloque del Pokémon
                        break;
                    }

                    console.warn("Estructura inesperada dentro del bloque del Pokémon:", this.tokens[i]);
                    break;
                }

                // Verificar que los stats estén completos antes de agregar
                if (stats.salud !== null && stats.ataque !== null && stats.defensa !== null) {
                    this.jugadorActual.pokemones.push({
                        nombre: nombrePokemon,
                        tipo,
                        salud: stats.salud,
                        ataque: stats.ataque,
                        defensa: stats.defensa
                    });
                } else {
                    console.warn(`Pokémon "${nombrePokemon}" con estadísticas incompletas. No será agregado.`);
                }

                continue;
            }

            i++; // Incrementar manualmente
        }

        // Agregar el último jugador encontrado si existe
        if (this.jugadorActual) {
            this.jugadores.push(this.jugadorActual);
            this.jugadorActual = null;
        }

        return this.jugadores;
    }

    private cleanString(cadena: string): string {
        return cadena.replace(/^"|"$/g, "");
    }

    // Calcuo de los IVS

    public calcularIVs(pokemones: Pokemon[]): (Pokemon & { iv: number })[] {
        return pokemones.map(pokemon => {
            const iv = ((pokemon.salud + pokemon.ataque + pokemon.defensa) / 45) * 100;
            return { ...pokemon, iv };
        });
    }

    //Los 6 mejores pokemons por IVS
    public seleccionarMejoresSeis(pokemones: (Pokemon & { iv: number })[]): (Pokemon & { iv: number })[] {
        const mejoresPorTipo = new Map<string, (Pokemon & { iv: number })>();

        for (const pkm of pokemones) {
            const tipo = pkm.tipo.toLowerCase();
            if (!mejoresPorTipo.has(tipo)) {
                mejoresPorTipo.set(tipo, pkm);
            } else {
                const existente = mejoresPorTipo.get(tipo)!;
                if (pkm.iv > existente.iv) {
                    mejoresPorTipo.set(tipo, pkm);
                }
            }
        }

        // Ordenar por IV descendente 
        return Array.from(mejoresPorTipo.values())
            .sort((a, b) => b.iv - a.iv)
            .slice(0, 6);
    }
}
