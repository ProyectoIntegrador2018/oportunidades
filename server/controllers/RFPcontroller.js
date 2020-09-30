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

rfpController.deleterfp = (req, res) => {
  const _id = req.params.id
  RFP.findByIdAndDelete(_id).then(function(rfp)){
    if (!rfp) {
      return res.status(404).send({})
    }
    return res.send(rfp)
  }).catch(function(error) {
    res.status(505).send({ error })
  })
};

rfpController.updaterfp = (req, res) => {
  const _id = req.params.id
  const updates = Object.keys(req.body)

  RFP.findByIdAndUpdate(_id, req.body ).then(function(rfp) {
    if (!rfp) {
      return res.status(404).send({})
    }
    return res.send(rfp)
  }).catch(function(error) {
    res.status(500).send(error)
  })
};



module.exports = rfpController;
