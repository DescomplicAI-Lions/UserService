import { Router } from 'express';
import { MagicLinkController } from '../controllers/magicLink.controllers';

const router = Router();
const magicLinkController = new MagicLinkController();

router.post('/request-magic-link', magicLinkController.requestMagicLink);

router.post('/authenticate-magic-link', magicLinkController.authenticateMagicLink);

export default router;