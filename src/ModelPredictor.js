const fs = require('fs');
const Jimp = require('jimp');
const tf = require('@tensorflow/tfjs-node');
const { Console } = require('console');

class ModelPredictor {
  constructor() {
    this.model = null;
    this.labels = [`Benign`, `Malignant`]
    this.modelPath = `file://${__dirname}/../model_x/model.json`;
  }

  initialize = async () => {
    this.model = await tf.loadLayersModel(this.modelPath);
    console.log("Load model successfully!");
  };

  static create = async () => {
    const model_ = new ModelPredictor();
    await model_.initialize();
    return model_;
  };

  toPixelData = async imgPath => {
    // Convert image to array of normalized pixel values
    const pixeldata = [];
    const image = await Jimp.read(imgPath);
    await image
      .resize(224, 224)
      .scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        pixeldata.push(image.bitmap.data[idx + 2] / 255);
        pixeldata.push(image.bitmap.data[idx + 1] / 255);
        pixeldata.push(image.bitmap.data[idx + 0] / 255);
      });
    return tf.tensor4d(pixeldata, [1, image.bitmap.width, image.bitmap.height, 3]);
  };

  runPrediction = async imgPath => {
    return this.toPixelData(imgPath).then(imageTensor => {
      // Show data Tensor
      // console.log(imageTensor.print())
      const prediction = this.model.predict(imageTensor);
      const scores = prediction.arraySync()[0];
      const maxScore = prediction.max().arraySync();
      const maxScoreIndex = scores.indexOf(maxScore);
      const labelScores = {};
      scores.forEach((s, i) => {
        labelScores[this.labels[i]] = parseFloat(s.toFixed(4));
      });
      return {
        // "success": true,
        // "prediction": `${this.labels[maxScoreIndex]} (${parseFloat((maxScore * 100).toFixed(2))}%)`,
        // "scores": labelScores,
        "prediction": `${this.labels[maxScoreIndex]}`
      };
    });
  };
}

module.exports = ModelPredictor