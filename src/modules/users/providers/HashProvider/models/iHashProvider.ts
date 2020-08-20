export default interface IHashProvider {
    generateHash( payload: string ): Promise<string>;
    compareHash( paylod: string, hashed: string ): Promise<boolean>;
}