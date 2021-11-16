export interface UniqueeOptions {
    length?: number;
    characters?: string;
    allocate?: number;
}
export default class Uniquee {
    private readonly length;
    private readonly characters;
    private readonly allocate;
    private readonly pool;
    private pointer;
    private readonly numberOfCharacters;
    constructor(options?: UniqueeOptions);
    private random;
    create(): string;
}
