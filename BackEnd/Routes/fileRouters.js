const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileController = require('../Controllers/toolsController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/share', fileController.showSharePage);
router.post('/upload', upload.single('pdf'), fileController.uploadFile);
router.get('/Allfiles', fileController.listFiles);
router.get('/files/:id', fileController.downloadFile);

module.exports = router;
