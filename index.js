var express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const http = require('http')
const multer = require('multer');
const cloudinary = require('cloudinary');
const bodyParser = require('body-parser');
const ModelPredictor = require('./src/ModelPredictor');

cloudinary.config({
	cloud_name: `skincancer-images`,
	api_key: `924457936635755`,
	api_secret: `Mg-BzJ-VtBQ7JcIjsoCng5mditc`
});

var app = express();
var port = process.env.PORT || 4000;
var predictor = null;

// enable CORS
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// serving static files
app.use('/static', express.static('static'));
app.use('/uploads', express.static('uploads'));
app.use('/templates', express.static('templates'));
// limit size
var maxSize = 4 * 1024 * 1024;

// handle storage using multer
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads');
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now().toString()}-${file.originalname}`);
	},
});
var upload = multer({
	storage: storage,
	fileFilter: function (req, file, callback) {
		var ext = path.extname(file.originalname);
		if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
			return callback(new Error('Only images are allowed'))
		}
		callback(null, true)
	},
	limits: {
		fileSize: maxSize,
	}
});

// request handlers
app.get('/', (req, res) => {
	// res.send('Testing Server...');
	res.sendFile(`${__dirname}/templates/index.html`);
});

// handle single file upload
app.post('/predict', upload.single('imageFile'), async (req, res, next) => {
	const file = req.file;
	if (!file) {
		return res.status(400).send({ message: 'Please upload a file.' });
	}
	// const predictor = await ModelPredictor.create();
	const prediction = await predictor.runPrediction(file.path);

	try {
		await cloudinary.v2.uploader.upload(file.path,
			{
				folder: `SkinCancer_DataSet/${prediction['prediction']}/`,
				use_filename: true,
			}
		);	
	} catch (error) {
		
	}
	
	fs.unlink(file.path, (err) => {
		if (err) {
		  console.error(err)
		  return
		}
	  })
	console.log(prediction)
	return res.send(prediction);
});

// handle single file upload
app.post('/predictions', upload.single('imageFile'), async (req, res, next) => {
	const file = req.file;
	if (!file) {
		return res.status(400).send({ message: 'Please upload a file.' });
	}
	// const predictor = await ModelPredictor.create();
	const prediction = await predictor.runPredictions(file.path);

	try {
		await cloudinary.v2.uploader.upload(file.path,
			{
				folder: `SkinCancer_DataSet/${prediction['prediction']}/`,
				use_filename: true,
			}
		);	
	} catch (error) {
		
	}
	
	fs.unlink(file.path, (err) => {
		if (err) {
		  console.error(err)
		  return
		}
	  })
	console.log(prediction)
	return res.send(prediction);
});

app.listen(port, async () => {
	predictor = await ModelPredictor.create();
	console.log('Server started on: ' + port);
	console.log('http://127.0.0.1:' + port + '/');
});