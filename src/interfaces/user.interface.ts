export interface User {
    id: number;
    name_user: string;
    email: string;
    password_user: string;
    creation_data: Date;
    profile_image?: string;
    type_user?: string;
    status?: string;
    phone?: string;
    temp_login_token?: string | null;
    temp_login_expire?: Date | null;
    is_verified: boolean;
    confirmation_token?: string | null;
    confirmation_token_expires?: Date | null;
    born_date: Date;
    cpf: string;
    refresh_token?: string | null;
    refresh_token_expire?: Date | null;
}

export type CreateUserDTO = Omit<User, "id" | "creation_data" | "profile_image" | "status"  | "temp_login_expire" | "is_verified" | "confirmation_token" | "confirmation_token_expires"> & {
    profile_image?: string;
    status?: string;
    is_verified?: boolean; 
    refresh_token?: string;
    refresh_token_expire?: Date;
};

export type UpdateUserDTO = Partial<Omit<User, "id" | "creation_data" | "born_date" | "cpf" | "type_user" >>;