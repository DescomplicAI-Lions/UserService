import { UserModel } from '../models/user.models';
import { User } from '../interfaces/user.interface';
import { AppError } from '../errors/AppError';
import { sign, verify } from 'jsonwebtoken';
import { EmailService } from './email.services';
import { config } from '../config/env';

export class EmailConfirmationService {
  constructor(
    private emailService: EmailService
  ) {}

  async initiateEmailConfirmation(email: string): Promise<string> {
    const user: User | undefined = await UserModel.getByEmail(email);

    if (!user) {
      console.warn(`[${(global as any).cid || 'no-cid'}] Tentativa de confirmação de email para email não existente: ${email}`);
      return 'Se uma conta com aquele email existe, um link de confirmação foi enviado.';
    }

    if (user.is_verified) {
      return 'Este email já foi verificado.';
    }

    if (!config.app_jwt) {
      throw new AppError('JWT_SECRET_NOT_CONFIGURED', 'JWT secret is not configured', 500);
    }

    const confirmationToken = sign(
      { userId: user.id, type: 'email_confirmation' },
      config.app_jwt,
      { expiresIn: '24h' }
    );

    const confirmationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await UserModel.update(user.id, {
      confirmation_token: confirmationToken,
      confirmation_token_expires: confirmationExpires,
    });

    if (!process.env.FRONTEND_URL) {
      throw new AppError('FRONTEND_URL_NOT_CONFIGURED', 'Frontend URL is not configured', 500);
    }

    const confirmationLinkUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${confirmationToken}`;
    console.log(`[${(global as any).cid || 'no-cid'}] [DEBUG] Email confirmation link for ${email}: ${confirmationLinkUrl}`);

    await this.emailService.sendEmailConfirmation(user.email, confirmationLinkUrl);

    return 'Se uma conta com aquele email existe, um link de confirmação foi enviado.';
  }

  async confirmEmail(confirmationToken: string): Promise<User> {
    let payload: { userId: number; type: string; exp: number; iat: number };
    try {
      if (!config.app_jwt) {
        throw new AppError('JWT_SECRET_NOT_CONFIGURED', 'JWT secret is not configured', 500);
      }
      payload = verify(confirmationToken, config.app_jwt) as any;

      if (payload.type !== 'email_confirmation') {
        throw new AppError('INVALID_TOKEN_TYPE', 'Invalid token type for email confirmation', 401);
      }
    } catch (error) {
      console.error(`[${(global as any).cid || 'no-cid'}] Email confirmation token verification failed:`, error);
      throw new AppError('INVALID_OR_EXPIRED_TOKEN', 'Link de confirmação de email está inválido ou expirado', 401);
    }

    const user: User | undefined = await UserModel.findByConfirmationToken(confirmationToken);

    if (!user) {
      throw new AppError('INVALID_OR_EXPIRED_TOKEN', 'Link de confirmação de email está inválido ou expirado', 401);
    }

    if (user.is_verified) {
        await UserModel.clearConfirmationToken(user.id); 
        return user; 
    }

    await UserModel.update(user.id, {
      is_verified: true,
      confirmation_token: null,
      confirmation_token_expires: null,
    });

    const updatedUser: User | undefined = await UserModel.getById(user.id);
    if (!updatedUser) {
        throw new AppError('USER_NOT_FOUND', 'User not found after confirmation', 500);
    }
    return updatedUser;
  }
}