
import request from 'supertest';
import app from '../index.js'; 
import cookieParser from 'cookie-parser'; 


describe('Logout Controller (ESM & Supertest)', () => {
    
    it('1. Pitäisi palauttaa 200 ja nollata "token"-evästeen vanhentuneeksi', async () => {
        const response = await request(app)
            .post('/api/auth/logout')
            .expect(200); 

        expect(response.body).toEqual({ message: 'Uloskirjautuminen onnistui' });

        const setCookieHeaders = response.headers['set-cookie'];
        expect(setCookieHeaders).toBeDefined();

        const tokenCookie = setCookieHeaders.find(cookie => cookie.startsWith('token='));
        
        expect(tokenCookie).toBeDefined();

        expect(tokenCookie).toMatch(/^token=; /); 

        expect(tokenCookie).toMatch(/Expires=Thu, 01 Jan 1970 00:00:00 GMT/i);

        expect(tokenCookie).toMatch(/HttpOnly/i);
        expect(tokenCookie).toMatch(/SameSite=Strict/i);
    });

    it('2. Palauttaa 200, vaikka käyttäjä ei olisi kirjautunut sisään (idempotentti)', async () => {
        const response = await request(app)
            .post('/api/auth/logout')
            .expect(200);

        expect(response.body.message).toBe('Uloskirjautuminen onnistui');
    });
});