# UserService
    • Resource: User     
    • Propósito: Gerenciar contas de clientes e perfis de usuário.


    ◦ GET /users => SUB ISSUE
        ▪ Descrição: Recupera uma lista paginada e filtrável de todos os usuários.
        ▪ Router: Define a rota GET /users, mapeia para UserController.listUsers.
        ▪ Controller: UserController.listUsers
            • Analisa e valida os query parameters (ex: page, limit, status, email_like).
            • Chama UserService.findAllUsers(filters, pagination).
            • Formata a lista de objetos User em uma resposta JSON, incluindo metadados de paginação.
        ▪ Model/Service: UserService
            • Constrói uma PostgreSQL SELECT query na tabela users.
            • Aplica cláusulas WHERE com base nos filtros (ex: WHERE status = 'active', WHERE email LIKE '%example%').
            • Aplica ORDER BY para ordenação e LIMIT/OFFSET para paginação.
            • Usa um ORM (ex: Sequelize, TypeORM, SQLAlchemy) ou direct SQL client para executar a query e mapear os resultados para objetos User model.
            • PostgreSQL Note: Garanta que existam indexes em colunas frequentemente consultadas como status, email, created_at.
    ◦ POST /users => SUB ISSUE
        ▪ Descrição: Cria uma nova conta de usuário.
        ▪ Router: Define a rota POST /users, mapeia para UserController.createUser.
        ▪ Controller: UserController.createUser
            • Valida o request body (ex: formato do email, força da password, campos obrigatórios).
            • Chama UserService.createUser(userData).
            • Retorna 201 Created com o objeto user recém-criado (excluindo dados sensíveis como password hash).
        ▪ Model/Service: UserService
            • Executa a lógica de negócio (ex: hash password, gera unique ID).
            • Executa uma PostgreSQL INSERT query na tabela users.
            • Lida com potenciais violações de UNIQUE constraint (ex: email duplicado) lançando um specific error que o Controller pode capturar e retornar 409 Conflict.
            • PostgreSQL Note: A coluna email deve ter uma UNIQUE constraint. id deve ser uma PRIMARY KEY (ex: UUID ou SERIAL).
    ◦ GET /users/:id => SUB ISSUE
        ▪ Descrição: Recupera detalhes de um único usuário pelo seu unique ID.
        ▪ Router: Define a rota GET /users/:id, mapeia para UserController.getUserById.
        ▪ Controller: UserController.getUserById
            • Extrai e valida o id do URL path.
            • Chama UserService.findUserById(id).
            • Se o usuário não for encontrado, retorna 404 Not Found. Caso contrário, retorna 200 OK com o objeto user.
        ▪ Model/Service: UserService
            • Executa uma PostgreSQL SELECT query na tabela users com uma cláusula WHERE id = :id.
            • Retorna um único objeto User model ou null/undefined.
            • PostgreSQL Note: A coluna id é tipicamente a PRIMARY KEY, garantindo buscas rápidas.
    ◦ PUT /users/:id => SUB ISSUE
        ▪ Descrição: Atualiza as informações de um usuário existente, substituindo todo o user resource.
        ▪ Router: Define a rota PUT /users/:id, mapeia para UserController.updateUser.
        ▪ Controller: UserController.updateUser
            • Extrai e valida o id do URL path.
            • Valida o request body (todos os campos são necessários para uma substituição completa).
            • Chama UserService.updateUser(id, updatedUserData).
            • Se o usuário não for encontrado, retorna 404 Not Found. Caso contrário, retorna 200 OK com o objeto user atualizado.
        ▪ Model/Service: UserService
            • Executa uma PostgreSQL UPDATE query na tabela users com uma cláusula WHERE id = :id.
            • Lida com potenciais violações de UNIQUE constraint se o email for atualizado para um já existente.
            • PostgreSQL Note: Considere usar uma coluna version ou updated_at timestamp para optimistic locking para prevenir lost updates em cenários concorrentes.
    ◦ DELETE /users/:id => SUB ISSUE
        ▪ Descrição: Remove uma conta de usuário.
        ▪ Router: Define a rota DELETE /users/:id, mapeia para UserController.deleteUser.
        ▪ Controller: UserController.deleteUser
            • Extrai e valida o id do URL path.
            • Chama UserService.deleteUser(id).
            • Se o usuário não for encontrado, retorna 404 Not Found. Em caso de exclusão bem-sucedida, retorna 204 No Content.
        ▪ Model/Service: UserService
            • Executa uma PostgreSQL DELETE query da tabela users com uma cláusula WHERE id = :id.
            • PostgreSQL Note: Recomenda-se fortemente implementar soft deletes (ex: definir uma coluna is_active boolean ou deleted_at timestamp) em vez de hard deletes para preservar a integridade dos dados, trilhas de auditoria e simplificar a recuperação. Se for realizar hard delete, garanta que as ON DELETE foreign key constraints sejam tratadas (ex: RESTRICT, SET NULL, CASCADE - CASCADE deve ser usado com extrema cautela).

teste recuperação:
    POST /auth/request-magic-link:

    http://localhost:3000/auth/request-magic-link.

    Body: {"email": "test@example.com"}

POST /auth/authenticate-magic-link:

    http://localhost:3000/auth/authenticate-magic-link.

    Body: {"token": "TOKEN_GERADO"}