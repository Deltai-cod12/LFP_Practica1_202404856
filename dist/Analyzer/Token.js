"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = exports.Token = void 0;
var Type;
(function (Type) {
    Type[Type["UNKNOW"] = 0] = "UNKNOW";
    Type[Type["PAR_OPEN"] = 1] = "PAR_OPEN";
    Type[Type["PAR_CLOSE"] = 2] = "PAR_CLOSE";
    Type[Type["SEMICOLON"] = 3] = "SEMICOLON";
    Type[Type["EQUAL"] = 4] = "EQUAL";
    Type[Type["COLON"] = 5] = "COLON";
    Type[Type["ASSIGN"] = 6] = "ASSIGN";
    Type[Type["BRACKET_OPEN"] = 7] = "BRACKET_OPEN";
    Type[Type["BRACKET_CLOSE"] = 8] = "BRACKET_CLOSE";
    Type[Type["BRACE_OPEN"] = 9] = "BRACE_OPEN";
    Type[Type["BRACE_CLOSE"] = 10] = "BRACE_CLOSE";
    Type[Type["NUMBER"] = 11] = "NUMBER";
    Type[Type["STRING"] = 12] = "STRING";
    Type[Type["RESERVED_WORD"] = 13] = "RESERVED_WORD";
})(Type || (exports.Type = Type = {}));
class Token {
    constructor(typeToken, lexeme, row, column) {
        this.typeToken = typeToken;
        this.typeTokenString = Type[typeToken];
        this.lexeme = lexeme;
        this.row = row;
        this.column = column;
    }
    getRow() {
        return this.row;
    }
    getColumn() {
        return this.column;
    }
    getLexeme() {
        return this.lexeme;
    }
    getType() {
        return this.typeToken;
    }
    getTypeTokenString() {
        return this.typeTokenString;
    }
}
exports.Token = Token;
