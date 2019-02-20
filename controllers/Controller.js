function camelToUnderscore (key) {
    return key.replace(/([A-Z])/g, '_$1').toLowerCase();
}

let concatArray = [];
let stringKey = '';

function toXLSX (json) {
    let array = [];
    let temp = [];
    for (let key in json) {
        let value = json[key];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            temp.push(() => {
                stringKey += `${key}.`;
                toXLSX(value);
            });
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

    temp.forEach(f => f());
    temp = [];
    return concatArray;
}

export default class {
    static jsonToXLSX (jsonData) {
        const json = JSON.parse(jsonData);
        concatArray = [];
        stringKey = '';
        return toXLSX(json);
    }

    static xlsxToJSON (file) {
        // to do
        return file;
    }
}