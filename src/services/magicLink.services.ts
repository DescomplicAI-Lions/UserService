import { UserModel, User } from '../models/user.models'; 
import { AppError } from '../errors/AppError';
import { sign } from 'jsonwebtoken';
import { EmailService } from './email.services'; 
import { config } from '../config/env';


export class MagicLinkService {
  constructor(
    private emailService: EmailService
  ) {}

  async initiateMagicLinkLogin(email: string): Promise<string> {
    const user = UserModel.getByEmail(email);

    if (!user) {
      console.warn(`[${(global as any).cid || 'no-cid'}] Tentativa de magic link login para email não exixtente: ${email}`);
      return 'Se uma conta com aquele email existe, um magic link foi enviado.';
    }

    const magicLinkToken = sign({ userId: user.id, type: 'magic_link' }, config.app_jwt!, { expiresIn: '15m' }); 

    user.temporaryLoginToken = magicLinkToken;
    user.temporaryLoginExpires = new Date(Date.now() + 15 * 60 * 1000); 
    UserModel.update(user.id, user); 

    const magicLinkUrl = `${process.env.FRONTEND_URL}/magic-login?token=${magicLinkToken}`;
    console.log(`[${(global as any).cid || 'no-cid'}] [DEBUG] Magic link for ${email}: ${magicLinkUrl}`); // Para teste
    await this.emailService.sendPasswordResetEmail(user.email, magicLinkUrl); 

    return 'Se uma conta com aquele email existe, um magic link foi enviado.';
  }

  async authenticateMagicLink(magicLinkToken: string): Promise<string> {
    const user = UserModel.findByTemporaryLoginToken(magicLinkToken);

    if (!user) {
      throw new AppError('INVALID_OR_EXPIRED_TOKEN', 'Magic login link está inválido ou expirado');
    }

    UserModel.clearTemporaryLoginToken(user.id);

    const sessionJwt = sign({ userId: user.id, email: user.email }, config.app_jwt!, { expiresIn: '1h' }); 

    return sessionJwt;
  }
}