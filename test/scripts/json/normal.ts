import { address } from "../server";

export const getAddress = () => {
    return Promise.resolve([ `http://127.0.0.1:${address.port}/json/normal` ]);
};
