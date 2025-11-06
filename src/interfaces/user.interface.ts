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
}

export type CreateUserDTO = Omit<User, "id" | "creation_data" | "profile_image" | "type_user" | "status" | "temp_login_token" | "temp_login_expire"> & {
    profile_image?: string;
    type_user?: string;
    status?: string;
};

export type UpdateUserDTO = Partial<Omit<User, "id" | "creation_data">>;