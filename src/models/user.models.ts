export interface User {
  id: number;
  nome: string;
  email: string;
  senha: string; // IMPORTANTE: vai guardar senha encriptada depos de service
  telefone: string;
  createdAt: Date;
}

const users: User[] = [];
let nextId = 1;

export const UserModel = {
  getAll: (): User[] => users,

  getById: (id: number): User | undefined => users.find(u => u.id === id),

  getByEmail: (email: string): User | undefined =>
      users.find(u => u.email === email),

  create: (data: Omit<User, "id" | "createdAt">): User => {
      const newUser: User = {
          id: nextId++,
          createdAt: new Date(),
          ...data,
      };
      users.push(newUser);
      return newUser;
  },

  update: (
      id: number,
      data: Partial<Omit<User, "id" | "createdAt">>
  ): User | undefined => {
      const index = users.findIndex(u => u.id === id);
      if (index === -1) return undefined;

      users[index] = { ...users[index], ...data } as User;
      return users[index];
  },

  delete: (id: number): boolean => {
      const index = users.findIndex(u => u.id === id);
      if (index === -1) return false;

      users.splice(index, 1);
      return true;
  },
};