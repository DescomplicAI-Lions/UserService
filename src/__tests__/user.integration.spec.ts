import request from "supertest";
import app from "../app";
import { database } from '../database/database';

jest.mock('../database/database', () => ({
    database: {
        query: jest.fn().mockResolvedValue({
            status: true,
            data: 
            [
                {
                    id: 1,
                    artista: "Korn",
                },
                {
                    id: 2,
                    artista: "Eminem",
                }
            ],
        })
    }
}));

describe('GET /users', () => {
    it('Mostrar todos os usuários salvos no banco de dados', async () => {
        const response = await request(app).get('/users/');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    })
})

describe('GET /users/:id', () => {
    it('Mostrar o usuário salvo no banco de dados', async () => {
        const response = await request(app).get('/users/1');
        expect(response.status).toBe(200);
    })
})

describe('GET /users/:id', () => {
    it('Falhar em mostrar o usuário por não encontrar o id', async () => {
        (database.query as jest.Mock).mockResolvedValueOnce({
            status: true,
            data: [] 
        });

        const response = await request(app).get('/users/100');
        expect(response.status).toBe(404);
    })
})

describe('PUT /users/:id', () => {
    it('Atualizar os dados de um usuário', async () => {
        const updatedUser = {
            "artista": "Papa Roach"
        };

        const response = await request(app)
            .put('/users/2')
            .send(updatedUser);



        expect(response.status).toBe(200);
    })
})

describe('PUT /users/:id', () => {
    it('Falhar em atualizar os dados de um usuário por não encontrar o id', async () => {
        (database.query as jest.Mock).mockResolvedValueOnce({
            status: true,
            data: [] 
        });

        const updatedUser = {
            "artista": "Papa Roach"
        };

        const response = await request(app)
            .put('/users/789789')
            .send(updatedUser);



        expect(response.status).toBe(404);
    })
})

describe('DELETE /users/:id', () => {
    it('Deletar o usuário', async () => {

        const response = await request(app).delete('/users/1');
        expect(response.status).toBe(204);
    })
})

describe('POST /auth/register/owner', () => {
    it('Registrar novo usuário Owner', async () => {
        (database.query as jest.Mock).mockResolvedValueOnce({
            status: true,
            data: [] 
        });

        const user = {
            "nome": "Exemplo",
            "senha": "Exemplosenh@2025",
            "email": "exemplo@exemplo.com",
            "data_nascimento": "1999-2-22",
            "cpf_usuario": "111.111.111-11"
        };

        const response = await request(app)
            .post('/auth/register/owner')
            .send(user);
        expect(response.status).toBe(201);
    })
})

