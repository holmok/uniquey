export interface UniqueyOptions {
    length?: number;
    characters?: string;
    allocate?: number;
}
export default class Uniquey {
    private readonly length;
    private readonly characters;
    private readonly allocate;
    private readonly pool;
    private pointer;
    private readonly numberOfCharacters;
    constructor(options?: UniqueyOptions);
    private random;
    create(): string;
}
