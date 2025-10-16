class EmailService {
    async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
      console.log(`[EmailService] Sending password reset email to: ${to}`);
      console.log(`[EmailService] Reset URL: ${resetUrl}`);
      // HTTP para serviço de envio de email
      console.log(`[EmailService] Email request sent for ${to}.`);
    }
  }

export {
    EmailService
}