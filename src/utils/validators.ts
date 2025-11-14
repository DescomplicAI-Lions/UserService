// --- 1. Validação de NOME COMPLETO ---
// (mín 3, máx 100, permite letras, espaços, acentos, hífen, apóstrofo)
export function validateName(name: string): {
   isValid: boolean;
   message: string;
} {
   if (!name || name.length < 3) {
      return {
         isValid: false,
         message: "Nome deve ter no mínimo 3 caracteres.",
      };
   }
   if (name.length > 100) {
      return {
         isValid: false,
         message: "Nome deve ter no máximo 100 caracteres.",
      };
   }

   // Regex: Permite letras (com acento), espaços, hífen e apóstrofo.
   // Bloqueia números e caracteres especiais (!@#$ etc.)
   const nameRegex = /^[A-Za-z\u00C0-\u017F'\- ]+$/;
   if (!nameRegex.test(name)) {
      // Usa a mensagem de erro do card
      return {
         isValid: false,
         message: "Caractere inválido não permitido no nome.",
      };
   }

   // Bloqueia mais de um apóstrofo (regra do card)
   if ((name.match(/'/g) || []).length > 1) {
      return {
         isValid: false,
         message: "Nome não pode conter mais de um apóstrofo.",
      };
   }

   return { isValid: true, message: "Nome válido." };
}

// --- 2. Validação de EMAIL ---
// (mín 6, máx 100, formato de email)
export function validateEmail(email: string): {
   isValid: boolean;
   message: string;
} {
   if (!email || email.length < 6) {
      return {
         isValid: false,
         message: "Email deve ter no mínimo 6 caracteres.",
      };
   }
   if (email.length > 100) {
      return {
         isValid: false,
         message: "Email deve ter no máximo 100 caracteres.",
      };
   }

   // Regex: Versão simples e garantida (algo@algo.algo)
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email)) {
      // Usa a mensagem de erro do card
      return {
         isValid: false,
         message: "Email inválido - verifique o formato.",
      };
   }

   return { isValid: true, message: "Email válido." };
}

// --- 3. Validação de SENHA ---
// (mín 8, máx 64, 1 maiúscula, 1 minúscula, 1 número, 1 especial)
export function validatePassword(password: string): {
   isValid: boolean;
   message: string;
} {
   if (!password || password.length < 8) {
      return {
         isValid: false,
         message: "Senha deve ter no mínimo 8 caracteres.",
      };
   }
   if (password.length > 64) {
      return {
         isValid: false,
         message: "Senha deve ter no máximo 64 caracteres.",
      };
   }

   // Regex: Checa todas as regras
   const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{}|;:,.<>?-])[A-Za-z\d!@#$%^&*()_+=[\]{}|;:,.<>?-]{8,64}$/;

   if (!passwordRegex.test(password)) {
      return {
         isValid: false,
         message: "Senha muito fraca - inclua maiúsculas, números e símbolos.",
      };
   }

   return { isValid: true, message: "Senha forte." };
}
