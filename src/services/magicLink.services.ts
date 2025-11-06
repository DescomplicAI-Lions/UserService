import { UserModel } from '../models/user.models'; 
import { User } from '../interfaces/user.interface';
import { AppError } from '../errors/AppError';
import { sign, verify } from 'jsonwebtoken'; 
import { EmailService } from './email.services';
import { config } from '../config/env';

export class MagicLinkService {
  constructor(
    private emailService: EmailService
  ) {}

  async initiateMagicLinkLogin(email: string): Promise<string> {
    const user: User | undefined = await UserModel.getByEmail(email);

    if (!user) {
      console.warn(`[${(global as any).cid || 'no-cid'}] Tentativa de magic link login para email não existente: ${email}`);
      return 'Se uma conta com aquele email existe, um magic link foi enviado.';
    }

    if (!config.app_jwt) {
      throw new AppError('JWT_SECRET_NOT_CONFIGURED', 'JWT secret is not configured', 500);
    }

    const magicLinkToken = sign({ userId: user.id, type: 'magic_link' }, config.app_jwt, { expiresIn: '15m' });

    const temporaryLoginExpires = new Date(Date.now() + 15 * 60 * 1000); 

    await UserModel.update(user.id, {
      temp_login_token: magicLinkToken,
      temp_login_expire: temporaryLoginExpires,
    });

    if (!process.env.FRONTEND_URL) {
      throw new AppError('FRONTEND_URL_NOT_CONFIGURED', 'Frontend URL is not configured', 500);
    }

    const magicLinkUrl = `${process.env.FRONTEND_URL}/magic-login?token=${magicLinkToken}`;
    console.log(`[${(global as any).cid || 'no-cid'}] [DEBUG] Magic link for ${email}: ${magicLinkUrl}`); // For testing/debugging
    await this.emailService.sendPasswordResetEmail(user.email, magicLinkUrl);

    return 'Se uma conta com aquele email existe, um magic link foi enviado.';
  }

  async authenticateMagicLink(magicLinkToken: string): Promise<string> {
    let payload: { userId: number; type: string; exp: number; iat: number };
    try {
      if (!config.app_jwt) {
        throw new AppError('JWT_SECRET_NOT_CONFIGURED', 'JWT secret is not configured', 500);
      }
      payload = verify(magicLinkToken, config.app_jwt) as any; 
      if (payload.type !== 'magic_link') {
        throw new AppError('INVALID_TOKEN_TYPE', 'Invalid token type for magic link', 401);
      }
    } catch (error) {
      console.error(`[${(global as any).cid || 'no-cid'}] Magic link token verification failed:`, error);
      throw new AppError('INVALID_OR_EXPIRED_TOKEN', 'Magic login link está inválido ou expirado', 401);
    }

    const user: User | undefined = await UserModel.findByTemporaryLoginToken(magicLinkToken);

    if (!user) {
      throw new AppError('INVALID_OR_EXPIRED_TOKEN', 'Magic login link está inválido ou expirado', 401);
    }

    await UserModel.clearTemporaryLoginToken(user.id);

    if (!config.app_jwt) {
      throw new AppError('JWT_SECRET_NOT_CONFIGURED', 'JWT secret is not configured', 500);
    }
    const sessionJwt = sign({ userId: user.id, email: user.email }, config.app_jwt, { expiresIn: '1h' });

    return sessionJwt;
  }
}