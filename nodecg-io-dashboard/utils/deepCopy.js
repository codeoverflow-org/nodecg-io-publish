// There is no way we can get this function to pass the linter due to dynamic typing.
/* eslint-disable */
/**
 * Creates a deep copy of a object.
 * @param obj the copy of which a deep copy should be created.
 */
export function objectDeepCopy(obj) {
    if (typeof obj === "object") {
        const copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr))
                copy[attr] = objectDeepCopy(obj[attr]);
        }
        return copy;
    }
    else {
        return obj;
    }
}
//# sourceMappingURL=deepCopy.js.map