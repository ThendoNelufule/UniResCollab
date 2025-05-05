const request = require('supertest');
const app = require('../server');  // Replace with the path to your Express app
const middleware = require('../middleware/authMiddleware');

jest.mock('../middleware/authMiddleware', () => ({
    ensureAuthenticated: (req, res, next) => next(),
    ensureResearcher: (req, res, next) => next()
}));

// Example of a route that uses these middlewares
describe('GET /create', () => {
    it('should return the create project page if authenticated and a researcher', async () => {
        // Mocking the middleware behavior
        app.get('/researcher/projects/create', middleware.ensureAuthenticated, middleware.ensureResearcher, (req, res) => {
            res.status(200).send('Create Project Page');
        });

        // Sending a request to the route and checking the response
        const response = await request(app).get('/researcher/projects/create');
        expect(response.status).toBe(200);
        expect(response.text).toContain("Launch New Research Project");
    });

    
});
