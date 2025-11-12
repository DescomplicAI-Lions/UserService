import axios from "axios";
import { config } from "../config/env";

class EmailService {
  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
    console.log(`[EmailService] Sending password reset email to: ${to}`);
    console.log(`[EmailService] Reset URL: ${resetUrl}`);

    try {
      const response = await axios.post(`${config.api_mail}/send-reset-email`, {
        to,
        resetUrl
      });

      console.log(`[EmailService] Email de redefinição enviado com sucesso para ${to}.`);
      console.log(`[EmailService] Resposta do serviço:`, response.data);
    } catch (error: any) {
      console.error(`[EmailService] Erro ao enviar e-mail de redefinição:`, error.message);
      throw new Error("Falha ao enviar o e-mail de redefinição de senha.");
    }
  }

  async sendEmailConfirmation(to: string, confirmationLink: string): Promise<void> {
    console.log(`[EmailService] Sending email confirmation to: ${to}`);
    console.log(`[EmailService] Confirmation Link: ${confirmationLink}`);

    try {
      const response = await axios.post(`${config.api_mail}/send-confirmation-email`, {
        to,
        confirmationLink 
      });

      console.log(`[EmailService] Email de confirmação enviado com sucesso para ${to}.`);
      console.log(`[EmailService] Resposta do serviço:`, response.data);
    } catch (error: any) {
      console.error(`[EmailService] Erro ao enviar e-mail de confirmação:`, error.message);
      throw new Error("Falha ao enviar o e-mail de confirmação.");
    }
  }
  // --- END NEW METHOD ---
}

export { EmailService };