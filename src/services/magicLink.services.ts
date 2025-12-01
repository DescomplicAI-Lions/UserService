import { UserModel } from '../models/user.models'; 
import { User } from '../interfaces/user.interface';
import { AppError } from '../errors/AppError';
import { sign, verify } from 'jsonwebtoken'; 
import { EmailService } from './email.services';
import { config } from '../config/env';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.services'; 

export class MagicLinkService {
  constructor(
    private emailService: EmailService
  ) {}

  // frontendUrl deve ser usada
  async initiateMagicLinkLogin(email: string, frontendUrl: string): Promise<string> {
    const user: User | undefined = await UserModel.getByEmail(email);

    if (!user) {
      console.warn(`[${(global as any).cid || 'no-cid'}] Magic link attempt for non-existent email: ${email}`);
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

    const cleanBaseUrl = frontendUrl.replace(/\/$/, '');
    const magicLinkUrl = `${cleanBaseUrl}/magic-login?token=${magicLinkToken}`;
    
    console.log(`[${(global as any).cid || 'no-cid'}] [DEBUG] Magic link for ${email}: ${magicLinkUrl}`); 
    
    await this.emailService.sendPasswordResetEmail(user.email, magicLinkUrl); 

    return 'Se uma conta com aquele email existe, um magic link foi enviado.';
  }

  async authenticateMagicLink(magicLinkToken: string): Promise<string> {
    let payload: { userId: number; type: string };
    try {
      if (!config.app_jwt) throw new AppError('JWT_SECRET_NOT_CONFIGURED', 'JWT secret is not configured', 500);
      
      payload = verify(magicLinkToken, config.app_jwt) as any; 
      
      if (payload.type !== 'magic_link') {
        throw new AppError('INVALID_TOKEN_TYPE', 'Invalid token type for magic link', 401);
      }
    } catch (error) {
      console.error(`[${(global as any).cid || 'no-cid'}] Magic link verification failed:`, error);
      throw new AppError('INVALID_OR_EXPIRED_TOKEN', 'Magic login link está inválido ou expirado', 401);
    }

    const user: User | undefined = await UserModel.findByTemporaryLoginToken(magicLinkToken);
    if (!user) {
      throw new AppError('INVALID_OR_EXPIRED_TOKEN', 'Magic login link está inválido ou expirado', 401);
    }

    await UserModel.clearTemporaryLoginToken(user.id);

    const sessionJwt = sign({ userId: user.id, email: user.email }, config.app_jwt, { expiresIn: '1h' });
    return sessionJwt;
  }

  async requestPasswordReset(email: string, frontendUrl: string): Promise<string> {
    const user: User | undefined = await UserModel.getByEmail(email);

    if (!user) {
      console.warn(`[${(global as any).cid || 'no-cid'}] Password reset attempt for non-existent email: ${email}`);
      return 'Se uma conta com aquele email existe, um link de recuperação foi enviado.';
    }

    if (!config.app_jwt) {
      throw new AppError('JWT_SECRET_NOT_CONFIGURED', 'JWT secret is not configured', 500);
    }

    const resetToken = sign({ userId: user.id, type: 'password_reset' }, config.app_jwt, { expiresIn: '1h' });
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); 

    await UserModel.update(user.id, {
      temp_login_token: resetToken,
      temp_login_expire: resetExpires,
    });

    const cleanBaseUrl = frontendUrl.replace(/\/$/, '');
    // Verificar rota do front, seguir mesma estrutura
    const resetLink = `${cleanBaseUrl}/reset-password?token=${resetToken}`;
    
    console.log(`[${(global as any).cid || 'no-cid'}] [DEBUG] Reset link for ${email}: ${resetLink}`);

    await this.emailService.sendPasswordResetEmail(user.email, resetLink);

    return 'Se uma conta com aquele email existe, um link de recuperação foi enviado.';
  }

  async resetPassword(token: string, newPassword: string): Promise<string> {
    let payload: { userId: number; type: string };

    try {
      if (!config.app_jwt) throw new AppError('JWT_SECRET_NOT_CONFIGURED', 'JWT secret is not configured', 500);
      
      payload = verify(token, config.app_jwt) as any;

      if (payload.type !== 'password_reset') {
        throw new AppError('INVALID_TOKEN_TYPE', 'Invalid token type for password reset', 401);
      }
    } catch (error) {
      throw new AppError('INVALID_OR_EXPIRED_TOKEN', 'Link de recuperação inválido ou expirado', 401);
    }

    const user: User | undefined = await UserModel.findByTemporaryLoginToken(token);
    if (!user) {
      throw new AppError('INVALID_OR_EXPIRED_TOKEN', 'Link de recuperação inválido ou expirado', 401);
    }

    await UserService.updatePasswordUser(user.id, { senha: newPassword });

    await UserModel.update(user.id, {
      temp_login_token: null,
      temp_login_expire: null
    });

    return 'Senha redefinida com sucesso.';
  }
}