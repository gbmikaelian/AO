import Controller from './Controller';
import xlsx from 'node-xlsx';
import fs from 'fs';

export default class extends Controller {
    static async createXLS (req, res) {
        const filePath = `public/uploads/${req.file.filename}`;
        try {
            const paths = ['public', 'public/xlsx', 'public/uploads', 'public/jsons'];
            paths.forEach(path => {
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path);
                }
            });

            let fileType = req.file.originalname.split('.');
            fileType = fileType[fileType.length - 1];

            if (!['json', 'xlsx'].includes(fileType)) {
                throw new Error('Invalid file format');
            }

            if (fileType === 'json') {
                let jsonData = fs.readFileSync(filePath);
                const data = super.jsonToXLSX(jsonData);
                let buffer = xlsx.build([{ name: 'xlsx', data }]);
                const xlsxPath = `public/xlsx/${req.file.filename}.xlsx`;

                fs.writeFileSync(xlsxPath, buffer, 'binary');
                return res.json({ success: true, data: { xlsxPath } });
            } else if (fileType === 'xlsx') {
                let buffer = super.xlsxToJSON(req.file);
                let jsonPath = `public/jsons/${req.file.filename}.json`;
                fs.writeFileSync(jsonPath, JSON.stringify(buffer), 'utf8');
                return res.json({ success: true, data: { jsonPath } });
            }
        } catch (e) {
            console.log(e.message);
            fs.unlinkSync(filePath);
            return res.json({ success: false, error: e.message });
        }
    }
}