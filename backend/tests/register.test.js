
import request from 'supertest';
import app from '../index.js'; 

const API_PREFIX = '/api/auth';

describe('Register Controller (ESM & Supertest)', () => {
    
    const RANDOM_USER = {
        username: `user_${Date.now()}`, 
        email: `test_${Date.now()}@example.com`,
        password: 'TestPassword1'
    };

    const DUPLICATE_USER = {
        username: 'existingUser',
        email: 'duplicate@example.com',
        password: 'TestPassword1'
    };
    
    const WEAK_USER = {
        username: 'weakUser',
        email: 'weakuser@example.com',
        password: 'weak' 
    };

    beforeAll(async () => {
        try {
            await request(app)
                .post(`${API_PREFIX}/register`)
                .send(DUPLICATE_USER);
        } catch (error) {
            if (error.status !== 400) {
                 console.error('Varoitus: DUPLICATE_USERin alustus epäonnistui:', error.message);
            }
        }
    });

    test('1. Positiivinen testi: Uuden käyttäjän rekisteröinti (vahva salasana) palauttaa 201 Created', async () => {
        const response = await request(app)
            .post(`${API_PREFIX}/register`)
            .send(RANDOM_USER) 
            .expect(201); 

        expect(response.body).toHaveProperty('msg', 'User created');
        expect(response.body).toHaveProperty('user');
    });

    test('2. Negatiivinen testi: Liian heikko salasana palauttaa 400', async () => {
        const response = await request(app)
            .post(`${API_PREFIX}/register`)
            .send(WEAK_USER)
            .expect(400); 

        expect(response.body.msg).toMatch(/password must be at least 8 characters long/i);
    });

    test('3. Negatiivinen testi: Varattu sähköposti palauttaa 400', async () => {
        const response = await request(app)
            .post(`${API_PREFIX}/register`)
            .send(DUPLICATE_USER)
            .expect(400); 

        expect(response.body.msg).toBe('Email is already in use.');
    });
});