const File = require('../Models/fileModel');

// Show upload + list page
exports.showSharePage = async (req, res) => {
  try {
    const files = await File.find();
    res.render('share', { files });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading page.');
  }
};

// Handle file upload
exports.uploadFile = async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;

    const file = new File({
      name: originalname,
      data: buffer,
      contentType: mimetype,
    });

    await file.save();
    res.redirect('/files/share');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading the file.');
  }
};

// List all files (as JSON)
exports.listFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving files.');
  }
};

// Download file by ID
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).send('File not found');

    res.contentType(file.contentType);
    res.send(file.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving file.');
  }
};
