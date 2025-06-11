enum Type {
    UNKNOW,
    PAR_OPEN,       // (
    PAR_CLOSE,      // )
    SEMICOLON,      // ;
    EQUAL,          // =
    COLON,          // :
    ASSIGN,         // :=
    BRACKET_OPEN,   // [
    BRACKET_CLOSE,  // ]
    BRACE_OPEN,     // {
    BRACE_CLOSE,    // }
    NUMBER,
    STRING,
    RESERVED_WORD,
}

class Token {
    private row: number;
    private column: number;
    private lexeme: string;
    private typeToken: Type;
    private typeTokenString: string;

    constructor(typeToken: Type, lexeme: string, row: number, column: number){
        this.typeToken = typeToken;
        this.typeTokenString = Type[typeToken];
        this.lexeme = lexeme;
        this.row = row;
        this.column = column;
    }

    getRow(): number {
        return this.row;
    }

    getColumn(): number {
        return this.column;
    }

    getLexeme(): string {
        return this.lexeme;
    }

    getType(): Type {
        return this.typeToken;
    }

    getTypeTokenString(): string {
        return this.typeTokenString;
    }
}


export { Token, Type }