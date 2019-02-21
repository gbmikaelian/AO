import fs from 'fs';
import xlsx from 'node-xlsx';

const camelToUnderscore = (key) => {
    return key.replace(/([A-Z])/g, '_$1').toLowerCase();
};

const underscoreToCamel = (s) => {
    return s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  };

let concatArray = [];
let stringKey = '';

const toXLSX = (json) => {
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
};

const parse = (object) => {
    var result = {};
    var temp = {};
    var keys;

    for (var property in object) {
        keys = underscoreToCamel(property).split('.');
        temp = result;

        for (var i = 0; i < keys.length - 1; i++) {
            if (typeof temp[keys[i]] === 'undefined') {
                temp[keys[i]] = {};
            }
            temp = temp[keys[i]];
        };

        temp[keys[i]] = object[property];
    }

    return result;
};

export default class {
    static jsonToXLSX (jsonData) {
        const json = JSON.parse(jsonData);
        concatArray = [];
        stringKey = '';
        return toXLSX(json);
    }

    static xlsxToJSON (file) {
        const jsonBuffer = xlsx.parse(fs.readFileSync(file.path));
        let obj = {};
        jsonBuffer.forEach(({ data }) => {
            data.forEach(([key, value]) => {
                obj[key] = value;
            });
        });

        return parse(obj);
    }
}