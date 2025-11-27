import request from "supertest";
import app from "../app";
import { describe } from "node:test";

//TODO mensagem
describe('GET /users', () => {
    it('Mostrar todos os usuários salvos no bancode dados', async () => {
        const response = await request(app).get('/users');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('')
    })
})

