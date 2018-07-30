export interface IYamlObject {
    base?: boolean;
    extends?: string;
    extends_file?: string;
    name: string;
    skip: boolean;
    nickname: string;
    homepage?: string;
    expiredAt: number;
    address?: string[];
    address_script?: string;
    address_funcion: () => PromiseLike<string[]>;
    catch?: string[];
    catch_script?: string;
    catch_options?: {
        type?: "html" | "json";
        hash_element?: string;
    };
    catch_funcion: (address: string, elePromise?: PromiseLike<Cheerio>) => PromiseLike<any[]>;
}
