import Controller from './Controller';
import xlsx from 'node-xlsx';
import fs from 'fs';

export default class extends Controller {
    static async createXLS (req, res) {
        try {
            const filePath = `public/uploads/${req.file.filename}`;
            let jsonData = fs.readFileSync(filePath);
            jsonData = JSON.parse(jsonData);

            const data = super.jsonToXLSX(jsonData);

            var buffer = xlsx.build([{ name: 'xlsx', data: data }]);
            const xlsxPath = `public/xlsx/${req.file.filename}.xlsx`;

            fs.writeFileSync(xlsxPath, buffer, 'binary');

            fs.unlinkSync(filePath);
            return res.json({ success: true, data: { xlsxPath } });
        } catch (e) {
            console.log(e);
            return res.json({ success: false, error: e.message });
        }
    }
}