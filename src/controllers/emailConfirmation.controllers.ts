import { Request, Response, NextFunction } from 'express';
import { EmailConfirmationService } from '../services/emailConfirmation.services';
import { AppError } from '../errors/AppError';
import { EmailService } from '../services/email.services'; 
const emailService = new EmailService();
const emailConfirmationService = new EmailConfirmationService(emailService);

export class EmailConfirmationController {
  async requestEmailConfirmationLink(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      if (!email) {
        throw new AppError('MISSING_EMAIL', 'Email is required to request an email confirmation link.', 400); // Added status code
      }

      const message = await emailConfirmationService.initiateEmailConfirmation(email);

      return res.status(200).json({ msg: message, cid: req.headers.cid });
    } catch (error) {
      next(error);
    }
  }

  async confirmEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.query; 

      if (!token || typeof token !== 'string') { 
        throw new AppError('MISSING_TOKEN', 'Email confirmation token is required.', 400);
      }

      const confirmedUser = await emailConfirmationService.confirmEmail(token);

      return res.status(200).json({
        msg: 'Email confirmed successfully.',
        userId: confirmedUser.id,
        email: confirmedUser.email,
        cid: req.headers.cid
      });

    } catch (error) {
      next(error); 
    }
  }
}