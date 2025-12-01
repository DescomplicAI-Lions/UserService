import { Router } from 'express';
import { MagicLinkController } from '../controllers/magicLink.controllers';

const magicLinkRoutes = Router();
const magicLinkController = new MagicLinkController();

magicLinkRoutes.post('/request-magic-link', magicLinkController.requestMagicLink.bind(magicLinkController));
magicLinkRoutes.post('/authenticate-magic-link', magicLinkController.authenticateMagicLink.bind(magicLinkController));
magicLinkRoutes.post('/forgot-password', magicLinkController.requestForgotPassword.bind(magicLinkController));
magicLinkRoutes.post('/reset-password', magicLinkController.resetPassword.bind(magicLinkController));

export { 
    magicLinkRoutes 
};