import { database } from "../database/database";
import { User, CreateUserDTO, UpdateUserDTO } from "../interfaces/user.interface";
import { AppError } from "../errors/AppError";

export const UserModel = {
  async getAll(): Promise<User[]> {
    const result = await database.query<User>(
      `SELECT id, name_user, email, creation_data, profile_image, type_user, status, phone, temp_login_token, temp_login_expire
       FROM descomplicai.user`
    );
    if (!result.status) {
      throw new AppError("Failed to fetch users", "DATABASE_ERROR", 500, result.error);
    }
    return result.data as User[];
  },

  async getById(id: number): Promise<User | undefined> {
    const result = await database.query<User>(
      `SELECT id, name_user, email, creation_data, profile_image, type_user, status, phone, temp_login_token, temp_login_expire
       FROM descomplicai.user WHERE id = $1`,
      [id]
    );
    if (!result.status) {
      throw new AppError("Failed to fetch user by ID", "DATABASE_ERROR", 500, result.error);
    }
    return result.data[0] as User | undefined;
  },

  async getByEmail(email: string): Promise<User | undefined> {
    const result = await database.query<User>(
      `SELECT id, name_user, email, password_user, creation_data, profile_image, type_user, status, phone, temp_login_token, temp_login_expire
       FROM descomplicai.user WHERE email = $1`,
      [email]
    );
    if (!result.status) {
      throw new AppError("Failed to fetch user by email", "DATABASE_ERROR", 500, result.error);
    }
    return result.data[0] as User | undefined;
  },

  async create(data: CreateUserDTO): Promise<User> {
    const { name_user, email, password_user, phone, profile_image, type_user, status } = data;
    const result = await database.query<User>(
      `INSERT INTO descomplicai.user (name_user, email, password_user, phone, profile_image, type_user, status, creation_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING id, name_user, email, creation_data, profile_image, type_user, status, phone`,
      [name_user, email, password_user, phone || null, profile_image || null, type_user || null, status || null]
    );
    if (!result.status || result.data.length === 0) {
      if (result.error && (result.error as any).code === '23505') {
        throw new AppError("Email or username already exists", "DUPLICATE_ENTRY", 409, result.error);
      }
      throw new AppError("Failed to create user", "DATABASE_ERROR", 500, result.error);
    }
    return result.data[0] as User;
  },

  async update(id: number, data: UpdateUserDTO): Promise<User | undefined> {
    const setClauses: string[] = [];
    const values: any[] = [id];
    let paramIndex = 2; // $1 é para id

    if (data.name_user !== undefined) {
      setClauses.push(`name_user = $${paramIndex++}`);
      values.push(data.name_user);
    }
    if (data.email !== undefined) {
      setClauses.push(`email = $${paramIndex++}`);
      values.push(data.email);
    }
    if (data.password_user !== undefined) {
      setClauses.push(`password_user = $${paramIndex++}`);
      values.push(data.password_user);
    }
    if (data.phone !== undefined) {
      setClauses.push(`phone = $${paramIndex++}`);
      values.push(data.phone);
    }
    if (data.profile_image !== undefined) {
      setClauses.push(`profile_image = $${paramIndex++}`);
      values.push(data.profile_image);
    }
    if (data.type_user !== undefined) {
      setClauses.push(`type_user = $${paramIndex++}`);
      values.push(data.type_user);
    }
    if (data.status !== undefined) {
      setClauses.push(`status = $${paramIndex++}`);
      values.push(data.status);
    }
    if (data.temp_login_token !== undefined) {
      setClauses.push(`temp_login_token = $${paramIndex++}`);
      values.push(data.temp_login_token);
    }
    if (data.temp_login_expire !== undefined) {
      setClauses.push(`temp_login_expire = $${paramIndex++}`);
      values.push(data.temp_login_expire);
    }

    if (setClauses.length === 0) {
      return this.getById(id); // sem update, retorna o user atual
    }

    const result = await database.query<User>(
      `UPDATE users SET ${setClauses.join(', ')} WHERE id = $1
       RETURNING id, name_user, email, creation_data, profile_image, type_user, status, phone, temp_login_token, temp_login_expire`,
      values
    );
    if (!result.status || result.data.length === 0) {
      if (result.error && (result.error as any).code === '23505') {
        throw new AppError("Email already exists", "DUPLICATE_ENTRY", 409, result.error);
      }
      throw new AppError("Failed to update user", "DATABASE_ERROR", 500, result.error);
    }
    return result.data[0] as User;
  },

  async delete(id: number): Promise<boolean> {
    const result = await database.query<User>(
      `DELETE FROM descomplicai.user WHERE id = $1 RETURNING id`,
      [id]
    );
    if (!result.status) {
      throw new AppError("Failed to delete user", "DATABASE_ERROR", 500, result.error);
    }
    return result.data.length > 0; // True se uma row foi deletada
  },

  async findByTemporaryLoginToken(token: string): Promise<User | undefined> {
    const result = await database.query<User>(
      `SELECT id, name_user, email, creation_data, profile_image, type_user, status, phone, temp_login_token, temp_login_expire
       FROM descomplicai.user WHERE temp_login_token = $1 AND temp_login_expire > NOW()`,
      [token]
    );
    if (!result.status) {
      throw new AppError("Failed to find user by token", "DATABASE_ERROR", 500, result.error);
    }
    return result.data[0] as User | undefined;
  },

  async clearTemporaryLoginToken(id: number): Promise<void> {
    const result = await database.query(
      `UPDATE users SET temp_login_token = NULL, temp_login_expire = NULL WHERE id = $1`,
      [id]
    );
    if (!result.status) {
      throw new AppError("Failed to clear temporary login token", "DATABASE_ERROR", 500, result.error);
    }
  }
};