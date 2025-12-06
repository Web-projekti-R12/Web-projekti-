const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api/auth';

describe('Login (REST API)', () => { 
    
    const TEST_USER = {
        username: 'loginTester',
        email: 'logintest@example.com',
        password: 'TestPassword1' 
    };

    const VALID_CREDENTIALS = {
        email: 'logintest@example.com', 
        password: 'TestPassword1'
    };

    const INVALID_CREDENTIALS = {
        email: 'logintest@example.com',
        password: 'WrongPassword123'
    };

    beforeAll(async () => {
        try {
            await axios.post(`${API_BASE_URL}/register`, TEST_USER);
            console.log('Testikäyttäjä luotu login-testiä varten.');
        } catch (error) {
            if (error.response && error.response.status === 400) {
            } else {
                console.error('Varoitus: Testikäyttäjän alustus epäonnistui:', error.message);
            }
        }
    });


    test('1. Positiivinen testi: Kirjautuminen oikeilla tunnuksilla palauttaa 200 ja tokenin', async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, VALID_CREDENTIALS);

            expect(response.status).toBe(200);

            expect(response.data).toHaveProperty('token');
            expect(typeof response.data.token).toBe('string');
            
        } catch (error) {
            const msg = error.response ? JSON.stringify(error.response.data) : error.message;
            throw new Error(`Kirjautuminen epäonnistui oikeilla tunnuksilla: ${msg}`);
        }
    });

    test('2. Negatiivinen testi: Väärä salasana palauttaa 401 Unauthorized', async () => {
        try {
            await axios.post(`${API_BASE_URL}/login`, INVALID_CREDENTIALS);
            
            throw new Error('Väärien tunnistetietojen EI pitänyt onnistua.');

        } catch (error) {
            if (error.response) {
                expect(error.response.status).toBe(401);
                
                expect(error.response.data.msg).toBe('Incorrect email or password');
            } else {
                throw new Error('Odotettiin HTTP-virhettä 401, mutta tapahtui muu virhe: ' + error.message);
            }
        }
    });
});