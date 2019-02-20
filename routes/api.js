import { Router } from 'express';
import { UserController, JsonController } from '../controllers';
import multer from 'multer';

const router = new Router();

var upload = multer({ dest: 'public/uploads' });

router.get('/me', UserController.me);
router.post('/upload-json', upload.single('json'), JsonController.createXLS);

export default router;