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
          <!DOCTYPE html>
          <html lang="pt-BR">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Redefinição de Senha</title>
              <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fff; }
                  .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee; margin-bottom: 20px; }
                  .header img { max-width: 150px; height: auto; }
                  .header h1 { color: #333; font-size: 24px; margin-top: 10px; }
                  .button { display: inline-block; background-color: #007bff; color: #ffffff !important; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
                  .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #777; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <!-- Use a publicly hosted image URL for your logo -->
                      <img src="../src/assets/LogoLonga-500x500.png" alt="DescomplicAI Logo">
                      <h1>Descomplic<span style="color: #007bff;">AI</span></h1>
                  </div>
                  <p>Olá,</p>
                  <p>Você solicitou uma redefinição de senha ou um login mágico para sua conta.</p>
                  <p>Clique no link abaixo para continuar:</p>
                  <p><a href="${resetUrl}" class="button">${resetUrl}</a></p>
                  <p>Este link é válido por 15 minutos.</p>
                  <p>Se você não solicitou isso, por favor, ignore este e-mail.</p>
                  <div class="footer">
                      <p>&copy; ${new Date().getFullYear()} DescomplicAI. Todos os direitos reservados.</p>
                  </div>
              </div>
          </body>
          </html>
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
          <!DOCTYPE html>
          <html lang="pt-BR">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Confirmação de E-mail</title>
              <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fff; }
                  .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee; margin-bottom: 20px; }
                  .header img { max-width: 150px; height: auto; }
                  .header h1 { color: #333; font-size: 24px; margin-top: 10px; }
                  .button { display: inline-block; background-color: #007bff; color: #ffffff !important; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
                  .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #777; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <!-- Use a publicly hosted image URL for your logo -->
                      <img src="../src/assets/LogoLonga-500x500.png" alt="DescomplicAI Logo">
                      <h1>Descomplic<span style="color: #007bff;">AI</span></h1>
                  </div>
                  <p>Olá,</p>
                  <p>Obrigado por se registrar! Por favor, clique no link abaixo para confirmar seu endereço de e-mail:</p>
                  <p><a href="${confirmationLink}" class="button">${confirmationLink}</a></p>
                  <p>Este link é válido por 24 horas.</p>
                  <p>Se você não criou esta conta, por favor, ignore este e-mail.</p>
                  <div class="footer">
                      <p>&copy; ${new Date().getFullYear()} DescomplicAI. Todos os direitos reservados.</p>
                  </div>
              </div>
          </body>
          </html>
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
