## UserService
**URL Vercel:** 

*    https://user-service-gamma.vercel.app/
    
## 👤 Rotas de Usuário (CRUD)
**Base URL:** `/users`

*   **Listar todos os usuários**
    *   `GET /users/`

*   **Buscar usuário por ID**
    *   `GET /users/:id`

*   **Atualizar dados do usuário**
    *   `PUT /users/:id`
    ```json
    {
        "nome": "Exemplo Atualizado",
        "email": "exemplo@exemplo.com",
        "telefone": "5542999999999",
        "imagem": "fadsflhadlsficfjklhjals..."
    }
    ```

*   **Deletar usuário**
    *   `DELETE /users/:id`

---

## 🔐 Rotas de Autenticação
**Base URL:** `/auth`

### Registro e Login Tradicional

*   **Registrar novo usuário Owner**
    *   `POST /auth/register/owner`
    ```json
    {
        "nome": "Exemplo",
        "senha": "Exemplosenh@2025",
        "email": "exemplo@exemplo.com",
        "data_nascimento": "yyyy-mm-dd",
        "cpf_usuario": "111.111.111-11"
    }
    ```

*   **Registrar novo usuário Employee**
    *   `POST /auth/register/employee`
    ```json
    {
        "nome": "Exemplo",
        "senha": "Exemplosenh@2025",
        "email": "exemplo@exemplo.com",
        "data_nascimento": "yyyy-mm-dd",
        "cpf": "111.111.111-11"
    }
    ```

*   **Registrar novo usuário Client**
    *   `POST /auth/register/client`
    ```json
    {
        "nome": "Exemplo",
        "senha": "Exemplosenh@2025",
        "email": "exemplo@exemplo.com",
        "data_nascimento": "yyyy-mm-dd",
        "cpf": "111.111.111-11"
    }
    ```

*   **Login (Senha)**
    *   `POST /auth/login`
    ```json
    {
        "email": "exemplo@exemplo.com",
        "password": "Exemplosenh@2025"
    }
    ```

*   **Atualizar Senha (Logado)**
    *   `PUT /auth/:id`
    ```json
    {
        "senha": "NovaSenha@2025"
    }
    ```

### Magic Link (Login sem senha)

*   **Solicitar Magic Link**
    *   `POST /auth/request-magic-link`
    *   *Headers:* `Origin: https://seu-frontend.com` (ou enviar `redirectUrl` no body)
    ```json
    {
        "email": "exemplo@exemplo.com"
    }
    ```

*   **Autenticar com Magic Link**
    *   `POST /auth/authenticate-magic-link`
    ```json
    {
        "token": "TOKEN_JWT_RECEBIDO_NO_EMAIL"
    }
    ```

### Recuperação de Senha (Esqueci a senha)

*   **Solicitar Redefinição de Senha**
    *   `POST /auth/forgot-password`
    *   *Headers:* `Origin: https://seu-frontend.com` (ou enviar `redirectUrl` no body)
    ```json
    {
        "email": "exemplo@exemplo.com"
    }
    ```

*   **Redefinir Senha**
    *   `POST /auth/reset-password`
    ```json
    {
        "token": "TOKEN_RECEBIDO_NO_EMAIL",
        "newPassword": "NovaSenhaSegura@123"
    }
    ```

*   **Solicitar Logout**
    *   `POST /auth/logout/:id`

---

## 📧 Rotas de Confirmação de E-mail
**Base URL:** `/email-confirmation`

*   **Solicitar novo link de confirmação**
    *   `POST /email-confirmation/request-confirmation-link`
    ```json
    {
        "email": "exemplo@exemplo.com"
    }
    ```

*   **Confirmar E-mail**
    *   `GET /email-confirmation/confirm-email?token=YOUR_TOKEN`

---

## 📚 Outras Rotas

*   **Documentação Swagger**
    *   `GET /swagger.json`

*   **Health Check**
    *   `GET /health`

### 💻 Base 64

*   **Codificar**
    *   const originalString = "Olá, Mundo! 😊";
        const buffer = Buffer.from(originalString, 'utf-8');
        const encodedString = buffer.toString('base64');
        console.log("Codificado:", encodedString); // Ex: T2zDoSwgTXVuZG8hIMKp

*   **Decodificar**
    *   const decodedBuffer = Buffer.from(encodedString, 'base64');
        const decodedString = decodedBuffer.toString('utf-8');
        console.log("Decodificado:", decodedString); // Ex: Olá, Mundo! 😊

*   **Usos**
    *   Foi feito a codificação no backend
    *   Falta a decodificação no front para a imagem.