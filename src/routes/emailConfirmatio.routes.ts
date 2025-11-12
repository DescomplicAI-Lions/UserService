import { Router } from 'express';
import { EmailConfirmationController } from '../controllers/emailConfirmation.controllers';

const emailConfirmationRoutes = Router();
const emailConfirmationController = new EmailConfirmationController();

emailConfirmationRoutes.post('/request-confirmation-link', emailConfirmationController.requestEmailConfirmationLink);

emailConfirmationRoutes.get('/confirm-email', emailConfirmationController.confirmEmail);

export {
    emailConfirmationRoutes
};