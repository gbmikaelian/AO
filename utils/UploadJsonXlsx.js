import fs from 'fs';
import xlsx from 'node-xlsx';

export default class UploadJsonXlsx {
    constructor () {
        this.concatArray = [];
        this.stringKey = '';
    }

    toXLSX (json) {
        let array = [];
        let temp = [];
        for (let key in json) {
            let value = json[key];
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                temp.push(() => {
                    this.stringKey += `${key}.`;
                    this.toXLSX(value);
                });
            } else {
                if (typeof value === 'boolean') {
                    value = value.toString();
                } else if (['homePhone', 'workPhone', 'mobilePhone'].includes(key)) {
                    value = `+374${value.substr(-8)}`;
                }
                array = [...array, [this.camelToUnderscore(this.stringKey + key), value]];
            }
        }
        this.concatArray = [...this.concatArray, ...array];

        temp.forEach(f => f());
        temp = [];
        return this.concatArray;
    }

    parse (object) {
        var result = {};
        var temp = {};
        var keys;

        for (var property in object) {
            keys = this.underscoreToCamel(property).split('.');
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
    }

    jsonToXLSX (jsonData) {
        const json = JSON.parse(jsonData);
        this.concatArray = [];
        this.stringKey = '';
        return this.toXLSX(json);
    }

    xlsxToJSON (file) {
        const jsonBuffer = xlsx.parse(fs.readFileSync(file.path));
        let obj = {};
        jsonBuffer.forEach(({ data }) => {
            data.forEach(([key, value]) => {
                obj[key] = value;
            });
        });

        return this.parse(obj);
    }

    camelToUnderscore (key) {
        return key.replace(/([A-Z])/g, '_$1').toLowerCase();
    };

    underscoreToCamel (s) {
        return s.replace(/([-_][a-z])/ig, ($1) => {
          return $1.toUpperCase()
            .replace('-', '')
            .replace('_', '');
        });
    };
}