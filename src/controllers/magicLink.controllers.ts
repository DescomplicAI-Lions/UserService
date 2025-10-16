import { Request, Response, NextFunction } from 'express';
import { MagicLinkService } from '../services/magicLink.services';
import { AppError } from '../errors/AppError';
import { EmailService } from '../services/email.services';

const emailService = new EmailService();

const magicLinkService = new MagicLinkService(emailService);

export class MagicLinkController {
  async requestMagicLink(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      if (!email) {
        throw new AppError('MISSING_EMAIL', 'Email is required to request a magic link.');
      }

      const message = await magicLinkService.initiateMagicLinkLogin(email);

      return res.status(200).json({ msg: message, cid: req.headers.cid });
    } catch (error) {
      next(error);
    }
  }

  async authenticateMagicLink(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body; 

      if (!token) {
        throw new AppError('MISSING_TOKEN', 'Magic link token is required for authentication.');
      }

      const sessionJwt = await magicLinkService.authenticateMagicLink(token);

      return res.status(200).json({ token: sessionJwt, msg: 'Successfully logged in with magic link.', cid: req.headers.cid });
    } catch (error) {
      next(error);
    }
  }
}