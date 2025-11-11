# UserService
URL 

    https://user-service-gamma.vercel.app/
    
Rotas Crud

    GET ALL /users/
    GET /users/:id
    POST /users/
    PUT /users/:id
    DELETE /users/:id

Rotas documentação

    GET /swagger.json
    GET /health

Rotas recuperação

    POST /auth/request-magic-link:
        Body: {"email": "test@example.com"}


    POST /auth/authenticate-magic-link:
        Body: {"token": "TOKEN_GERADO"}
