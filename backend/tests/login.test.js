import request from 'supertest';
import app from '../index.js'; 

const API_PREFIX = '/api/auth'; 

describe('Login Controller (ESM & Supertest)', () => { 
    
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
        const response = await request(app)
            .post(`${API_PREFIX}/register`)
            .send(TEST_USER);

        if (response.status === 201) {
            console.log('Testikäyttäjä luotu login-testiä varten.');
        } else if (response.status === 400) {
            console.log('Varoitus hiljennetty: Testikäyttäjä oli jo tietokannassa (status 400).');
        } else {
            console.error(
                `Kriittinen virhe alustuksessa: Odotettu 201/400, saatu ${response.status}.`, 
                response.body
            );
            throw new Error(`Testialustus epäonnistui odottamattomasti, status: ${response.status}`); 
        }
    });

    test('1. Positiivinen testi: Kirjautuminen oikeilla tunnuksilla palauttaa 200 ja tokenin', async () => {
        const response = await request(app)
            .post(`${API_PREFIX}/login`)
            .send(VALID_CREDENTIALS)
            .expect(200); 

        expect(response.body).toHaveProperty('token');
        expect(typeof response.body.token).toBe('string');
            
    });

    test('2. Negatiivinen testi: Väärä salasana palauttaa 401 Unauthorized', async () => {
        const response = await request(app)
            .post(`${API_PREFIX}/login`)
            .send(INVALID_CREDENTIALS)
            .expect(401);
        
        expect(response.body.msg).toBe('Incorrect email or password');
    });
});