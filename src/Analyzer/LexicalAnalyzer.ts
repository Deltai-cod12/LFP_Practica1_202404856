import { Token, Type } from "./Token";

class LexicalAnalyzer {

    private row: number;
    private column: number;
    private auxChar: string;
    private state: number;
    private tokenList: Token[];
    private errorList: Token[];

    constructor() {
        this.row = 1;
        this.column = 1;
        this.auxChar = '';
        this.state = 0;
        this.tokenList = [];
        this.errorList = [];
    }

    scanner(input: string) {
    input += '#';
    let char: string;
    for (let i: number = 0; i < input.length; i++) {
        char = input[i];

        switch(this.state) {
            case 0:
                switch(char) {
                    case '(':
                        this.state = 1;
                        this.addCharacter(char);
                        break;
                    case ')':
                        this.state = 2;
                        this.addCharacter(char);
                        break;
                    case ';':
                        this.state = 3;
                        this.addCharacter(char);
                        break;
                    case '=':
                        this.state = 4;
                        this.addCharacter(char);
                        break;
                    case '"':
                        this.state = 5;
                        this.addCharacter(char);
                        break;
                    case ':':
                        this.state = 7;
                        this.addCharacter(char);
                        break;
                    case '[': // BRACKET_OPEN
                        this.state = 9;
                        this.addCharacter(char);
                        break;
                    case ']': // BRACKET_CLOSE
                        this.state = 10;
                        this.addCharacter(char);
                        break;
                    case '{': // BRACE_OPEN
                        this.state = 11;
                        this.addCharacter(char);
                        break;
                    case '}': // BRACE_CLOSE
                        this.state = 12;
                        this.addCharacter(char);
                        break;
                    case 'J':
                        this.state = 100; this.addCharacter(char); break; // Jugador
                    case 'a':
                        this.state = 110; this.addCharacter(char); break; // agua
                    case 'd':
                        this.state = 120; this.addCharacter(char); break; // dragon
                    case 'f':
                        this.state = 130; this.addCharacter(char); break; // fuego
                    case 'n':
                        this.state = 140; this.addCharacter(char); break; // normal
                    case 'p':
                        this.state = 150; this.addCharacter(char); break; // planta o psiquico
                        break;
                    case 's':
                        this.state = 170; this.addCharacter(char); break; // salud
                    case ' ':
                        this.column++;
                        break;
                    case '\n':
                        console.log("Entro al salto de line")
                    case '\r':
                        this.row++;
                        this.column = 1;
                        break;
                    case '\t':
                        this.column += 4;
                        break;
                    default:
                        if (/\d/.test(char)) {
                            this.state = 6;
                            this.addCharacter(char);
                        } else if (char == '#' && i == input.length - 1) {
                            console.log("Analyze Finished");
                        } else {
                            this.addError(Type.UNKNOW, char, this.row, this.column);
                            this.column++;
                        }
                        break;
                }
                break;

            // Símbolos simples
            case 1:
                this.addToken(Type.PAR_OPEN, this.auxChar, this.row, this.column - this.auxChar.length);
                this.clean(); i--; break;
            case 2:
                this.addToken(Type.PAR_CLOSE, this.auxChar, this.row, this.column - this.auxChar.length);
                this.clean(); i--; break;
            case 3:
                this.addToken(Type.SEMICOLON, this.auxChar, this.row, this.column - this.auxChar.length);
                this.clean(); i--; break;
            case 4:
                this.addToken(Type.EQUAL, this.auxChar, this.row, this.column - this.auxChar.length);
                this.clean(); i--; break;
            case 9:
                this.addToken(Type.BRACKET_OPEN, this.auxChar, this.row, this.column - this.auxChar.length);
                this.clean(); i--; break;
            case 10:
                this.addToken(Type.BRACKET_CLOSE, this.auxChar, this.row, this.column - this.auxChar.length);
                this.clean(); i--; break;
            case 11:
                this.addToken(Type.BRACE_OPEN, this.auxChar, this.row, this.column - this.auxChar.length);
                this.clean(); i--; break;
            case 12:
                this.addToken(Type.BRACE_CLOSE, this.auxChar, this.row, this.column - this.auxChar.length);
                this.clean(); i--; break;

            // Cadena de texto
            case 5: // **ESTADO PARA LEER STRING (dentro de las comillas)**
                if (char === '"') {
                    this.addCharacter(char); // Incluir la comilla de cierre en el lexema
                    this.addToken(Type.STRING, this.auxChar, this.row, this.column - this.auxChar.length + 1);
                    this.clean();
                } else if (char === '\n') {
                    console.log("Entro al salto de linea dentro del texto")
                    this.addError(Type.UNKNOW, char, this.row, this.column);
                    this.clean(); // Limpiar el buffer de la cadena en error
                } else if (char === '\r') {
                    // Ignorar retorno de carro en Windows dentro de la cadena
                    this.addCharacter(char);
                    this.column++;
                } else {
                    this.addCharacter(char);
                    this.column++;
                }
                break;
            case 6:
                if (/\d/.test(char)) {
                    this.addCharacter(char);
                } else {
                    this.addToken(Type.NUMBER, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.clean(); i--;
                }
                break;

            // Doble punto
            case 7:
                if (char == '=') {
                    this.state = 8;
                    this.addCharacter(char);
                } else {
                    this.addToken(Type.COLON, this.auxChar, this.row, this.column - this.auxChar.length);
                    this.clean(); i--;
                }
                break;
            case 8:
                this.addToken(Type.ASSIGN, this.auxChar, this.row, this.column - this.auxChar.length);
                this.clean(); i--; break;

            
            // Palabras reservadas

            // Jugador
            case 100: if (char == 'u') { this.addCharacter(char); this.state = 101; } else { this.lexError(i); } break;
            case 101: if (char == 'g') { this.addCharacter(char); this.state = 102; } else { this.lexError(i); } break;
            case 102: if (char == 'a') { this.addCharacter(char); this.state = 103; } else { this.lexError(i); } break;
            case 103: if (char == 'd') { this.addCharacter(char); this.state = 104; } else { this.lexError(i); } break;
            case 104: if (char == 'o') { this.addCharacter(char); this.state = 105; } else { this.lexError(i); } break;
            case 105: if (char == 'r') { this.addCharacter(char); this.state = 106; } else { this.lexError(i); } break;
            case 106: this.addToken(Type.RESERVED_WORD, this.auxChar, this.row, this.column - this.auxChar.length); this.clean(); i--; break;

            // agua
            // Palabras que comienzan con 'a'
            case 110:
            if (char == 'g') { this.addCharacter(char); this.state = 111; } // agua
            else if (char == 't') { this.addCharacter(char); this.state = 181; } // ataque
            else { this.lexError(i); }
            break;
            case 111: if (char == 'u') { this.addCharacter(char); this.state = 112; } else { this.lexError(i); } break;
            case 112: if (char == 'a') { this.addCharacter(char); this.state = 113; } else { this.lexError(i); } break;
            case 113: this.addToken(Type.RESERVED_WORD, this.auxChar, this.row, this.column - this.auxChar.length); this.clean(); i--; break;

            // dragon
            case 120:
                if (char == 'r') {
                    this.addCharacter(char);
                    this.state = 121; // dragon
                } else if (char == 'e') {
                    this.addCharacter(char);
                    this.state = 190; // defensa
                } else {
                    this.lexError(i);
                }
                break;

            case 121: if (char == 'a') { this.addCharacter(char); this.state = 122; } else { this.lexError(i); } break;
            case 122: if (char == 'g') { this.addCharacter(char); this.state = 123; } else { this.lexError(i); } break;
            case 123: if (char == 'o') { this.addCharacter(char); this.state = 124; } else { this.lexError(i); } break;
            case 124: if (char == 'n') { this.addCharacter(char); this.state = 125; } else { this.lexError(i); } break;
            case 125: this.addToken(Type.RESERVED_WORD, this.auxChar, this.row, this.column - this.auxChar.length); this.clean(); i--; break;

            // fuego
            case 130: if (char == 'u') { this.addCharacter(char); this.state = 131; } else { this.lexError(i); } break;
            case 131: if (char == 'e') { this.addCharacter(char); this.state = 132; } else { this.lexError(i); } break;
            case 132: if (char == 'g') { this.addCharacter(char); this.state = 133; } else { this.lexError(i); } break;
            case 133: if (char == 'o') { this.addCharacter(char); this.state = 134; } else { this.lexError(i); } break;
            case 134: this.addToken(Type.RESERVED_WORD, this.auxChar, this.row, this.column - this.auxChar.length); this.clean(); i--; break;

            // normal
            case 140: if (char == 'o') { this.addCharacter(char); this.state = 141; } else { this.lexError(i); } break;
            case 141: if (char == 'r') { this.addCharacter(char); this.state = 142; } else { this.lexError(i); } break;
            case 142: if (char == 'm') { this.addCharacter(char); this.state = 143; } else { this.lexError(i); } break;
            case 143: if (char == 'a') { this.addCharacter(char); this.state = 144; } else { this.lexError(i); } break;
            case 144: if (char == 'l') { this.addCharacter(char); this.state = 145; } else { this.lexError(i); } break;
            case 145: this.addToken(Type.RESERVED_WORD, this.auxChar, this.row, this.column - this.auxChar.length); this.clean(); i--; break;

            // planta
            case 150: if (char == 'l') { this.addCharacter(char); this.state = 151; }
            else if (char == 's') { this.addCharacter(char); this.state = 160; }
            else { this.lexError(i); } break;
            case 151: if (char == 'a') { this.addCharacter(char); this.state = 152; } else { this.lexError(i); } break;
            case 152: if (char == 'n') { this.addCharacter(char); this.state = 153; } else { this.lexError(i); } break;
            case 153: if (char == 't') { this.addCharacter(char); this.state = 154; } else { this.lexError(i); } break;
            case 154: if (char == 'a') { this.addCharacter(char); this.state = 155; } else { this.lexError(i); } break;
            case 155: this.addToken(Type.RESERVED_WORD, this.auxChar, this.row, this.column - this.auxChar.length); this.clean(); i--; break;

            // psiquico
            case 160: if (char == 'i') { this.addCharacter(char); this.state = 161; } else { this.lexError(i); } break;
            case 161: if (char == 'q') { this.addCharacter(char); this.state = 162; } else { this.lexError(i); } break;
            case 162: if (char == 'u') { this.addCharacter(char); this.state = 163; } else { this.lexError(i); } break;
            case 163: if (char == 'i') { this.addCharacter(char); this.state = 164; } else { this.lexError(i); } break;
            case 164: if (char == 'c') { this.addCharacter(char); this.state = 165; } else { this.lexError(i); } break;
            case 165: if (char == 'o') { this.addCharacter(char); this.state = 166; } else { this.lexError(i); } break;
            case 166: this.addToken(Type.RESERVED_WORD, this.auxChar, this.row, this.column - this.auxChar.length); this.clean(); i--; break;

            // salud
            case 170: if (char == 'a') { this.addCharacter(char); this.state = 171; } else { this.lexError(i); } break;
            case 171: if (char == 'l') { this.addCharacter(char); this.state = 172; } else { this.lexError(i); } break;
            case 172: if (char == 'u') { this.addCharacter(char); this.state = 173; } else { this.lexError(i); } break;
            case 173: if (char == 'd') { this.addCharacter(char); this.state = 174; } else { this.lexError(i); } break;
            case 174: this.addToken(Type.RESERVED_WORD, this.auxChar, this.row, this.column - this.auxChar.length); this.clean(); i--; break;

            // ataque
            case 181: if (char == 'a') { this.addCharacter(char); this.state = 182; } else { this.lexError(i); } break;
            case 182: if (char == 'q') { this.addCharacter(char); this.state = 183; } else { this.lexError(i); } break;
            case 183: if (char == 'u') { this.addCharacter(char); this.state = 184; } else { this.lexError(i); } break;
            case 184: if (char == 'e') { this.addCharacter(char); this.state = 185; } else { this.lexError(i); } break;
            case 185: this.addToken(Type.RESERVED_WORD, this.auxChar, this.row, this.column - this.auxChar.length); this.clean(); i--; break;

            // defensa
            case 190: if (char == 'f') { this.addCharacter(char); this.state = 191; } else { this.lexError(i); } break;
            case 191: if (char == 'e') { this.addCharacter(char); this.state = 192; } else { this.lexError(i); } break;
            case 192: if (char == 'n') { this.addCharacter(char); this.state = 193; } else { this.lexError(i); } break;
            case 193: if (char == 's') { this.addCharacter(char); this.state = 194; } else { this.lexError(i); } break;
            case 194: if (char == 'a') { this.addCharacter(char); this.state = 195; } else { this.lexError(i); } break;
            case 195:
                this.addToken(Type.RESERVED_WORD, this.auxChar, this.row, this.column - this.auxChar.length);
                this.clean(); i--;
                break;
        }
    }
            return this.tokenList;
}

    private lexError(i: number) {
        this.addError(Type.UNKNOW, this.auxChar, this.row, this.column - this.auxChar.length);
        this.clean();
    }

    private addCharacter(char: string) {
        this.auxChar += char;
        this.column++;
    }

    private clean() {
        this.state = 0;
        this.auxChar = '';
    }

    private addToken(type: Type, lexeme: string, row: number, column: number) {
        this.tokenList.push(new Token(type, lexeme, row, column));
    }

    private addError(type: Type, lexeme: string, row: number, column: number) {
        this.errorList.push(new Token(type, lexeme, row, column));
    }

    getErrorList() {
        return this.errorList;
    }
}

export { LexicalAnalyzer };