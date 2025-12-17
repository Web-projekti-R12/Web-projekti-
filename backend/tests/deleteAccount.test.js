import request from 'supertest';
import app from '../index.js';

const AUTH_URL = '/api/auth';
const PROFILE_URL = '/api/profile';

describe('Profile Controller - Delete Account', () => {
    let userToken;
    const testUser = {
        username: `delete_me_${Date.now()}`,
        email: `delete_${Date.now()}@example.com`,
        password: 'TestPassword123'
    };

    beforeAll(async () => {
        await request(app)
            .post(`${AUTH_URL}/register`)
            .send(testUser);

        const loginRes = await request(app)
            .post(`${AUTH_URL}/login`)
            .send({
                email: testUser.email,
                password: testUser.password
            });
        
        userToken = loginRes.body.token;
    });

    test('1. Negatiivinen testi: Poisto epäonnistuu ilman tokenia (401)', async () => {
        await request(app)
            .delete(PROFILE_URL)
            .expect(401);
    });

    test('2. Positiivinen testi: Kirjautunut käyttäjä voi poistaa oman tilinsä (204)', async () => {
        await request(app)
            .delete(PROFILE_URL)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(204);
    });

    test('3. Varmistus: Poistettu käyttäjä ei voi enää kirjautua sisään (401/400)', async () => {
        const response = await request(app)
            .post(`${AUTH_URL}/login`)
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(response.status).toBeGreaterThanOrEqual(400);
    });
});