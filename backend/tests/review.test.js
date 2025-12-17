import request from 'supertest';
import app from '../index.js';

import db from '../config/db.js'; 
import reviewModel from '../models/reviewModel.js'; 

const API_PREFIX = '/api/reviews';
const AUTH_API_PREFIX = '/api/auth';
const TEST_TMDB_ID = '603692'; 

const TEST_USER = {
    username: 'reviewTester',
    email: 'reviewtest@example.com',
    password: 'TestPassword1'
};

const TEST_REVIEW = {
    tmdb_movie_id: TEST_TMDB_ID,
    rating: 5,
    title: 'Paras koskaan!',
    content: 'Tämä oli mahtava kokemus, täydet pisteet.'
};

let userToken = '';
let testUserId = null;
let initialReviewId = null;

describe('Review Controller (Arvostelutestit)', () => {

    beforeAll(async () => {
        const regResponse = await request(app)
            .post(`${AUTH_API_PREFIX}/register`)
            .send(TEST_USER);

        if (regResponse.body && regResponse.body.userId) {
            testUserId = regResponse.body.userId;
        }
        
        const loginResponse = await request(app)
            .post(`${AUTH_API_PREFIX}/login`)
            .send({ email: TEST_USER.email, password: TEST_USER.password })
            .expect(200);

        userToken = loginResponse.body.token;

        if (userToken) {
            const addReviewResponse = await request(app)
                .post(API_PREFIX)
                .set('Authorization', `Bearer ${userToken}`)
                .send(TEST_REVIEW)
                .expect(201);
            
            initialReviewId = addReviewResponse.body.rating_id;
            if (addReviewResponse.body && addReviewResponse.body.user_id) {
                 testUserId = addReviewResponse.body.user_id;
            }
            console.log(`Alustava arvostelu luotu ID:llä: ${initialReviewId}`);
        }
    });

    afterAll(async () => {
        if (initialReviewId && testUserId) {
            try {
                await reviewModel.deleteReview(initialReviewId, testUserId);
            } catch (error) {
                 console.warn('Virhe alustavan arvostelun poistossa (voitiin poistaa testissä):', error.message);
            }
        }
        
    });
    

    describe('GET /api/reviews (Hae käyttäjän omat arvostelut)', () => {
        
        test('1. Positiivinen: Omat arvostelut palauttaa 200 ja listan', async () => {
            const response = await request(app)
                .get(API_PREFIX)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            const foundReview = response.body.find(r => r.rating_id === initialReviewId);
            expect(foundReview).toBeDefined();
            expect(String(foundReview.tmdb_movie_id)).toBe(TEST_TMDB_ID);
        });

        test('2. Negatiivinen: Ilman tokenia palauttaa 401 Unauthorized', async () => {
            await request(app)
                .get(API_PREFIX)
                .expect(401);
        });
    });

    describe('GET /api/reviews/movie/:tmdb_movie_id (Hae elokuvan arvostelut)', () => {
        
        test('3. Positiivinen: Elokuvan arvostelut palauttaa 200 ja listan', async () => {
            const response = await request(app)
                .get(`${API_PREFIX}/movie/${TEST_TMDB_ID}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            const foundReview = response.body.find(r => String(r.tmdb_movie_id) === TEST_TMDB_ID);
            expect(foundReview).toBeDefined();
            expect(foundReview.rating_id).toBe(initialReviewId);
            expect(foundReview.email).toBe(TEST_USER.email);
        });

        test('4. Negatiivinen: Arvostelut elokuvalle, jolla ei ole arvosteluja, palauttaa tyhjän listan', async () => {
            const NON_EXISTENT_TMDB_ID = '999999999';
            const response = await request(app)
                .get(`${API_PREFIX}/movie/${NON_EXISTENT_TMDB_ID}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });
});