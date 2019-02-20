function camelToUnderscore (key) {
    return key.replace(/([A-Z])/g, '_$1').toLowerCase();
}

let concatArray = [];
let stringKey = '';

function toXLSX (json) {
    let array = [];
    // let keyString = '';
    for (let key in json) {
        let value = json[key];

        if (typeof json[key] === 'object' && json[key] !== null && !Array.isArray(value)) {
            stringKey += `${key}.`;
            toXLSX(json[key]);
        } else {
            if (typeof value === 'boolean') {
                value = value.toString();
            } else if (['homePhone', 'workPhone', 'mobilePhone'].includes(key)) {
                value = `+374${value.substr(-8)}`;
            }
            array = [...array, [camelToUnderscore(stringKey + key), value]];
        }
    }
    concatArray = [...concatArray, ...array];

    return concatArray;
}

export default class {
    static jsonToXLSX (json) {
        concatArray = [];
        stringKey = '';
        return toXLSX(json);
    }
}