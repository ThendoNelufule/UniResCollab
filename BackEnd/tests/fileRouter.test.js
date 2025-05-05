
const request = require('supertest');
const express = require('express');
const multer = require('multer');
const fileRouter = require('../Routes/fileRouters');
const fileController = require('../Controllers/toolsController');

// Mock the fileController methods
jest.mock('../Controllers/toolsController', () => ({
  showSharePage: jest.fn((req, res) => res.status(200).send('Share Page')),
  uploadFile: jest.fn((req, res) => res.status(200).send('File uploaded')),
  listFiles: jest.fn((req, res) => res.status(200).send('List of files')),
  downloadFile: jest.fn((req, res) => res.status(200).send('File downloaded')),
}));

// Create the Express app for testing
const app = express();
app.use('/files', fileRouter);

describe('File Router', () => {
  it('should show share page on GET /files/share', async () => {
    const response = await request(app).get('/files/share');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Share Page');
    expect(fileController.showSharePage).toHaveBeenCalled();
  });

  it('should upload a file on POST /files/upload', async () => {
    const response = await request(app)
      .post('/files/upload')
      .attach('pdf', Buffer.from('test file content'), 'test.pdf'); // Simulate file upload

    expect(response.status).toBe(200);
    expect(response.text).toBe('File uploaded');
    expect(fileController.uploadFile).toHaveBeenCalled();
  });

  it('should list files on GET /files', async () => {
    const response = await request(app).get('/files/Allfiles');
    expect(response.status).toBe(200);
    expect(response.text).toBe('List of files');
    expect(fileController.listFiles).toHaveBeenCalled();
  });

  it('should download a file on GET /files/files/:id', async () => {
    const response = await request(app).get('/files/files/12345'); // Assuming a mock file ID
    expect(response.status).toBe(200);
    expect(response.text).toBe('File downloaded');
    expect(fileController.downloadFile).toHaveBeenCalled();
  });
});
