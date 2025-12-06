const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api/auth';

describe('Register (REST API)', () => {
    
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

    beforeAll(async () => {
        try {
            await axios.post(`${API_BASE_URL}/register`, DUPLICATE_USER);
        } catch (e) {
           
        }
    });

    test('1. Positiivinen testi: Uuden käyttäjän rekisteröinti (vahva salasana) palauttaa 201 Created', async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, RANDOM_USER);
            
            expect(response.status).toBe(201);
            
          
            expect(response.data).toHaveProperty('msg', 'User created');
            expect(response.data).toHaveProperty('user');

        } catch (error) {
            const msg = error.response ? JSON.stringify(error.response.data) : error.message;
            throw new Error(`Rekisteröinti epäonnistui: ${msg}`);
        }
    });

    test('2. Negatiivinen testi: Liian heikko salasana palauttaa 400', async () => {
        const WEAK_USER = {
            username: 'weakUser',
            password: 'weak'
        };

        try {
            await axios.post(`${API_BASE_URL}/register`, WEAK_USER);
            throw new Error('Rekisteröinnin olisi pitänyt epäonnistua heikolla salasanalla.');
        } catch (error) {
            if (error.response) {
                expect(error.response.status).toBe(400);
                expect(error.response.data.msg).toMatch(/password/i);
            } else {
                throw error;
            }
        }
    });

    test('3. Negatiivinen testi: Varattu sähköposti palauttaa 400', async () => {
        try {
            await axios.post(`${API_BASE_URL}/register`, DUPLICATE_USER);
            
            throw new Error('Rekisteröinnin olisi pitänyt epäonnistua, mutta se onnistui.');
        } catch (error) {
            if (error.response) {
                expect(error.response.status).toBe(400);
                expect(error.response.data.msg).toBe('Email is already in use.');
            } else {
                throw new Error('Odottamaton virhe: ' + error.message);
            }
        }
    });
});