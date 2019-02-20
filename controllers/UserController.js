import Controller from './Controller';

export default class extends Controller {
    static async me (req, res) {
        try {
            return res.json({ success: true, user: req.user });
        } catch (e) {
            console.log(e);
            return res.json({ success: false, error: e.message });
        }
    }
}