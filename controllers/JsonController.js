import Controller from './Controller';
import xlsx from 'node-xlsx';
import fs from 'fs';

export default class extends Controller {
    static async createXLS (req, res) {
        const filePath = `public/uploads/${req.file.filename}`;
        try {
            const paths = ['public', 'public/xlsx', 'public/uploads'];
            paths.forEach(path => {
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path);
                }
            });

            const [, fileType] = req.file.originalname.split('.');
            if (!['json', 'xlsx'].includes(fileType)) {
                throw new Error('Invalid file format');
            }

            if (fileType === 'json') {
                let jsonData = fs.readFileSync(filePath);
                const data = super.jsonToXLSX(jsonData, filePath);
                var buffer = xlsx.build([{ name: 'xlsx', data: data }]);
                const xlsxPath = `public/xlsx/${req.file.filename}.xlsx`;

                fs.writeFileSync(xlsxPath, buffer, 'binary');
                return res.json({ success: true, data: { xlsxPath } });
            } else if (fileType === 'xlsx') {
                super.xlsxToJSON(req.file);
                return res.json({ success: true, data: { jsonPath: super.xlsxToJSON(req.file) } });
            }
        } catch (e) {
            console.log(e.message);
            return res.json({ success: false, error: e.message });
        }
        fs.unlinkSync(filePath);
    }
}