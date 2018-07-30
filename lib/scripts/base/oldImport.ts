import { IBaseGetAddressScript, IBaseScript } from "../../interfaces/script";

export abstract class OldScript implements IBaseScript, IBaseGetAddressScript {
    public abstract getAddress(): PromiseLike<string[]>;
    public abstract catchNotes(addr: string): PromiseLike<any[]>;
}
