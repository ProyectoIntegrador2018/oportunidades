const RFP = require("../models/RFP");
let rfpController = {};

rfpController.createrfp = (rawRFP) => {
  return new Promise((resolve, reject) => {
     const rfp = new RFP(rawRFP);
     rfp
        .save()
        .then(() => {
           resolve(rfp);
        })
        .catch((error) => {
           reject(error);
        });
  });
};

module.exports = rfpController;
