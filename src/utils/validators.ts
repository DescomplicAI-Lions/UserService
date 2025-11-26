import axios from "axios";
import { config } from "../config/env";

interface CpfValidationResult {
   isValid: boolean;
   message: string;
}

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

   // Regex: Checa todas as regra
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

// -- VALIDAÇÃO DE CPF --
// FIXME documentado partes que necessitam da API externa
async function validateCpfAPI(cpf: string): Promise<CpfValidationResult> {
   try {
       // 1. Limpa os caracteres do cpf, somente números
       const cleanCpf = cpf.replace(/\D/g, '');

       // 2. Validação básica
       if (cleanCpf.length === 11) {
         return { isValid: true, message: "cpf válido." };
         //   return { isValid: false, message: "cpf inválido (tamanho incorreto)." };
       }

       // 3. Chama a api (get)
      //  const response = await axios.get(`${url}/${cleanCpf}`, {
      //      headers: {
      //          'Authorization': `Bearer ${token}`,
      //          'Accept': 'application/json'
      //      }
      //  });

       // 4. Verifica o sucesso
      //  if (response.status === 200) {
      //      return { isValid: true, message: "cpf válido." };
      //  }

       return { isValid: false, message: "cpf inválido." };

   } catch (error: any) {
       // 5. Lida com erros específicos
       if (error.response) {
           if (error.response.status === 404) {
               return { isValid: false, message: "cpf inválido (não encontrado)." };
           }
           if (error.response.status === 401 || error.response.status === 403) {
               console.error("Serpro Auth Error:", error.message);
               return { isValid: false, message: "erro de autenticação na validação." };
           }
       }
       
       console.error("Validation Error:", error.message);
       return { isValid: false, message: "erro ao validar cpf." };
   }
}

// -- PRODUCTION VALIDATION --
export async function validateCpf(cpf: string): Promise<CpfValidationResult> {
   return await validateCpfAPI(cpf);
}

// // -- HOMOLOGATION VALIDATION --
// export async function validateHCpf(cpf: string): Promise<CpfValidationResult> {
//    return await validateCpfAPI(cpf);
// }

// -- VALIDAÇÃO DE IDADE
export function validateBornDate(birth: Date | string): {
   isValid: boolean;
   message: string;
} {
   const birthDate = new Date(birth);

   if (!birth || isNaN(birthDate.getTime())) { // verifica se os dados estão corretos
      return { isValid: false, message: "Data de nascimento inválida" };
   }

   const today = new Date(); // pegar o dia de hoje
   
   let age = today.getFullYear() - birthDate.getFullYear(); // extrair a idade
   
   const monthDiff = today.getMonth() - birthDate.getMonth(); // verifica se fez 18 no ano atual
   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--; 
   }

   if (age >= 18) {
      return { isValid: true, message: "Sucesso: Usuário é maior de idade" };
   }

   return { isValid: false, message: "Erro: Usuário deve ter pelo menos 18 anos" };
}