export function isEmptyObject(param) {
    return Object.keys(param).length === 0 && param.constructor === Object;
}

export function isEmptyArray(param) {

    return Array.isArray(param) && !param.length
}

export function isEmpty(param) {
    return typeof param === "undefined" || param === null;
}

export function isEmptyStr(param) {
    return isEmpty(param) || param === "";
}