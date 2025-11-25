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
    temp_login_token?: string;
    temp_login_expire?: Date;
    is_verified: boolean;
    confirmation_token?: string | null;
    confirmation_token_expires?: Date | null;
    born_date: Date;
    cpf: string;
}

export type CreateUserDTO = Omit<User, "id" | "creation_data" | "profile_image" | "type_user" | "status" | "temp_login_token" | "temp_login_expire" | "is_verified" | "confirmation_token" | "confirmation_token_expires"> & {
    profile_image?: string;
    type_user?: string;
    status?: string;
    is_verified?: boolean; 
};

export type UpdateUserDTO = Partial<Omit<User, "id" | "creation_data" | "born_date" | "cpf">>;