import { Router } from 'express';
import { UserController, JsonController } from '../controllers';
import multer from 'multer';

const router = new Router();

const upload = multer({ dest: 'public/uploads' });
const jsonController = new JsonController();
router.get('/me', UserController.me);
router.post('/upload-json', upload.single('file'), jsonController.createXLS);

export default router;