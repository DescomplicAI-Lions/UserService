import axios from "axios";
import { config } from "../config/env";

class EmailService {
  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
    console.log(`[EmailService] Sending password reset email to: ${to}`);
    console.log(`[EmailService] Reset URL: ${resetUrl}`);

    try {
      const response = await axios.post(`${config.api_mail}/`, {
        to,
        subject: "Redefinição de Senha ou Login Mágico", 
        html: `
          <p>Olá,</p>
          <p>Você solicitou uma redefinição de senha ou um login mágico para sua conta.</p>
          <p>Clique no link abaixo para continuar:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>Este link é válido por 15 minutos.</p>
          <p>Se você não solicitou isso, por favor, ignore este e-mail.</p>
        `,
        text: `Olá,\nVocê solicitou uma redefinição de senha ou um login mágico para sua conta.\nClique no link abaixo para continuar: ${resetUrl}\nEste link é válido por 15 minutos.\nSe você não solicitou isso, por favor, ignore este e-mail.`,
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
      const response = await axios.post(`${config.api_mail}/`, {
        to,
        subject: "Confirmação de E-mail para Sua Conta",
        html: `
          <p>Olá,</p>
          <p>Obrigado por se registrar! Por favor, clique no link abaixo para confirmar seu endereço de e-mail:</p>
          <p><a href="${confirmationLink}">${confirmationLink}</a></p>
          <p>Este link é válido por 24 horas.</p>
          <p>Se você não criou esta conta, por favor, ignore este e-mail.</p>
        `,
        text: `Olá,\nObrigado por se registrar! Por favor, clique no link abaixo para confirmar seu endereço de e-mail: ${confirmationLink}\nEste link é válido por 24 horas.\nSe você não criou esta conta, por favor, ignore este e-mail.`,
      });

      console.log(`[EmailService] Email de confirmação enviado com sucesso para ${to}.`);
      console.log(`[EmailService] Resposta do serviço:`, response.data);
    } catch (error: any) {
      console.error(`[EmailService] Erro ao enviar e-mail de confirmação:`, error.message);
      throw new Error("Falha ao enviar o e-mail de confirmação.");
    }
  }
}

export { EmailService };
