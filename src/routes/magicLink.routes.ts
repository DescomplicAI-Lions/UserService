import { Router } from 'express';
import { MagicLinkController } from '../controllers/magicLink.controllers';

const magicLinkRoutes = Router();
const magicLinkController = new MagicLinkController();

magicLinkRoutes.post('/request-magic-link', magicLinkController.requestMagicLink);

magicLinkRoutes.post('/authenticate-magic-link', magicLinkController.authenticateMagicLink);

export { 
    magicLinkRoutes
}