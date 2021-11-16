"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
function validateAndDefaultOptions(options) {
    var _a, _b, _c;
    var length = options.length, characters = options.characters, allocate = options.allocate;
    if (length != null && length < 1) {
        throw new Error('Length option must be greater than 0');
    }
    if (allocate != null && allocate < 1) {
        throw new Error('Allocate option must be greater than 0');
    }
    if (allocate != null && length != null && length > allocate) {
        throw new Error('Length option must be less than or equal to allocate option');
    }
    if (characters != null) {
        if (characters.length < 2) {
            throw new Error('Characters option must be at least 2 character long');
        }
        if (characters.length > 256) {
            throw new Error('Characters option must be less than 256 characters');
        }
        var charSet = new Set(characters.split(''));
        if (charSet.size !== characters.length) {
            throw new Error('Characters option must have unique characters');
        }
    }
    return {
        length: (_a = options.length) !== null && _a !== void 0 ? _a : 8,
        characters: (_b = options.characters) !== null && _b !== void 0 ? _b : '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
        allocate: (_c = options.allocate) !== null && _c !== void 0 ? _c : 256
    };
}
var Uniquey = (function () {
    function Uniquey(options) {
        if (options === void 0) { options = {}; }
        var validOptions = validateAndDefaultOptions(options);
        this.length = validOptions.length;
        this.characters = validOptions.characters.split('');
        this.allocate = validOptions.allocate;
        this.pool = new Uint8Array(this.allocate);
        this.pointer = this.pool.length;
        this.numberOfCharacters = this.characters.length;
    }
    Uniquey.prototype.random = function () {
        if (this.pointer > this.pool.length - this.length) {
            crypto_1.default.randomFillSync(this.pool);
            this.pointer = 0;
        }
        return this.pool.slice(this.pointer, (this.pointer += this.length));
    };
    Uniquey.prototype.create = function () {
        var _this = this;
        var indexer = this.random().map(function (x) { return x % _this.numberOfCharacters; }).values();
        var output = '';
        for (var i = indexer.next().value; i != null; i = indexer.next().value) {
            output = "" + output + this.characters[i];
        }
        return output;
    };
    return Uniquey;
}());
exports.default = Uniquey;
