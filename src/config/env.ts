import dotenv from "dotenv";

console.log('NODE_ENV', process.env.NODE_ENV);

dotenv.config({
    path: process.env.NODE_ENV != "" && process.env.NODE_ENV != undefined ? `.env.${process.env.NODE_ENV}` : ".env"
});

export const config = {
    app_name: process.env.APP_ENV,
    app_port: process.env.PORT_ENV,
    app_jwt: process.env.JWT_SECRET,

    db_host: process.env.DB_HOST,
    db_port: process.env.DB_PORT,
    db_database: process.env.DB_DATABASE,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,

    api_mail: process.env.API_MAIL,

    api_cpf_validator: process.env.API_CPF_VALIDATOR,
    api_h_cpf_validator: process.env.API_H_CPF_VALIDATOR,
    api_token_cpf: process.env.API_TOKEN_CPF,
    api_h_token_cpf: process.env.API_H_TOKEN_CPF
};
