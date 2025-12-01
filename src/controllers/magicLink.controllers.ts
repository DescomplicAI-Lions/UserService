import { Request, Response, NextFunction } from 'express';
import { MagicLinkService } from '../services/magicLink.services';
import { AppError } from '../errors/AppError';
import { EmailService } from '../services/email.services';

const emailService = new EmailService();
const magicLinkService = new MagicLinkService(emailService);

export class MagicLinkController {
  
  // Ajuda de como pegar a url
  // prioridade: body.redirectUrl > headers.origin > throw Error
  private getFrontendUrl(req: Request): string {
    const url = req.body.redirectUrl || req.headers.origin;
    
    if (!url) {
      throw new AppError(
        'MISSING_ORIGIN', 
        'Could not determine frontend URL. Please send "redirectUrl" in body or ensure "Origin" header is present.'
      );
    }
    return url;
  }

  async requestMagicLink(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) throw new AppError('MISSING_EMAIL', 'Email is required.');

      const frontendUrl = this.getFrontendUrl(req);
      const message = await magicLinkService.initiateMagicLinkLogin(email, frontendUrl);

      return res.status(200).json({ msg: message, cid: req.headers.cid });
    } catch (error) {
      next(error);
    }
  }

  async authenticateMagicLink(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body; 
      if (!token) throw new AppError('MISSING_TOKEN', 'Token is required.');

      const sessionJwt = await magicLinkService.authenticateMagicLink(token);

      return res.status(200).json({ 
        token: sessionJwt, 
        msg: 'Successfully logged in with magic link.', 
        cid: req.headers.cid 
      });
    } catch (error) {
      next(error);
    }
  }

  //  POST /auth/forgot-password
  //  Body: { "email": "user@example.com", "redirectUrl": "https://myapp.com" (opcional) } 
  async requestForgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) throw new AppError('MISSING_EMAIL', 'Email is required.');

      const frontendUrl = this.getFrontendUrl(req);
      
      const message = await magicLinkService.requestPasswordReset(email, frontendUrl);

      return res.status(200).json({ msg: message, cid: req.headers.cid });
    } catch (error) {
      next(error);
    }
  }


  // POST /auth/reset-password
  // Body: { "token": "jwt_token_here", "newPassword": "securePassword123" }
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;

      if (!token) throw new AppError('MISSING_TOKEN', 'Reset token is required.');
      if (!newPassword) throw new AppError('MISSING_PASSWORD', 'New password is required.');

      const message = await magicLinkService.resetPassword(token, newPassword);

      return res.status(200).json({ msg: message, cid: req.headers.cid });
    } catch (error) {
      next(error);
    }
  }
}