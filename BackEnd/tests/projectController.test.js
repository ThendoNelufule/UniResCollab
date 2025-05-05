const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('../Routes/projectRouter');
const Project = require('../Models/project');

// Mock the Project model
jest.mock('../models/Project');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// --- Middleware override to fake authentication ---
app.use((req, res, next) => {
  req.isAuthenticated = () => true; // simulate authenticated session
  req.user = { _id: 'fakeUserId' };  // simulate logged-in user
  next();
});

// Inject the real router after middleware
app.use('/projects', router);

// Tests
describe('Project Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /projects/create - success', async () => {
    const mockSave = jest.fn();
    Project.mockImplementation(() => ({
      save: mockSave,
    }));

    const response = await request(app)
  .post('/projects/create')
  .send({
    title: 'Valid Project Title',
    domain: 'Information Technology',
    abstract: 'This is a valid abstract with more than 10 characters.',
    startDate: '2025-06-01',
    endDate: '2025-12-31',
    methodology: ['experimental'],
    pi: 'Dr. Jane Doe',
    institution: 'Test University',
    visibility: 'public',
    ethics: 'Standard protocols followed',
    dataPolicy: 'Open access',
    collaborators: ['user123', 'user456'],
  });



    // Log the response for debugging
    console.log(response.body); // Helps understand why it's failing

    // Check for status code 201
    expect(response.statusCode).toBe(201);
    expect(mockSave).toHaveBeenCalled();
    expect(response.body.project).toBeDefined();
  });
});
