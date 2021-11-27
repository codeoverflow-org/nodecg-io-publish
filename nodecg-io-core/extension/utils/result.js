"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptySuccess = exports.success = exports.error = void 0;
/**
 * Indicates that the function has failed and has produced some error.
 *
 * @param errorMessage a precise description of the error.
 */
function error(errorMessage) {
    return {
        failed: true,
        errorMessage: errorMessage,
    };
}
exports.error = error;
/**
 * Indicates that the function has succeeded and has produced a return value.
 *
 * @param result the value that the function wants to return.
 */
function success(result) {
    return {
        failed: false,
        result: result,
    };
}
exports.success = success;
/**
 * Indicates that a void function has executed successfully but wants to return void/nothing.
 */
function emptySuccess() {
    return success(undefined);
}
exports.emptySuccess = emptySuccess;
//# sourceMappingURL=result.js.map