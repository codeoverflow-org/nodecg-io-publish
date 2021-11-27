/**
 * Result is a return type for functions which might return a value
 * or might fail and return a string which describes the error.
 * Intended for functions which are called from a GUI and should provide a error message if one occurs.
 *
 * The result is represented by the {@link Failure} and {@link Success} types.
 *
 * @typeParam T the return type of the function on success.
 */
export declare type Result<T> = Failure | Success<T>;
/**
 * Function has failed and has returned a string describing the error.
 * Should be created by calling {@link error}.
 */
export declare type Failure = {
    failed: true;
    errorMessage: string;
};
/**
 * Function has succeeded and has returned its result.
 * Should be created by calling {@link success} or {@link emptySuccess}.
 */
export declare type Success<T> = {
    failed: false;
    result: T;
};
/**
 * Indicates that the function has failed and has produced some error.
 *
 * @param errorMessage a precise description of the error.
 */
export declare function error(errorMessage: string): Failure;
/**
 * Indicates that the function has succeeded and has produced a return value.
 *
 * @param result the value that the function wants to return.
 */
export declare function success<T>(result: T): Success<T>;
/**
 * Indicates that a void function has executed successfully but wants to return void/nothing.
 */
export declare function emptySuccess(): Success<void>;
//# sourceMappingURL=result.d.ts.map