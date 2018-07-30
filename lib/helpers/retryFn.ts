type IRetryFn<T = any> = () => PromiseLike<T>;

export const retryCount = 5;

export const retryFnAsync = <T>(fn: IRetryFn<T>, count = retryCount) => {
    return retryRunAsync(fn, count);
};

const retryRunAsync = async <T>(fn: IRetryFn<T>, retry, index = 0): Promise<T> => {
    try {
        return await fn();
    } catch (error) {
        index++;
        if (index === retry) {
            throw error;
        } else {
            return retryRunAsync(fn, retry, index);
        }
    }
};
