require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const port = process.env.PORT || 3001;

const database = process.env.DATABASE || "mongodb://localhost:27017/test-repo";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(database, { useNewUrlParser: true });

const userRouter = require("./server/routes/userapi");
app.use("/user", userRouter);

const rfpRouter = require("./server/routes/RFPapi");
app.use("/rfp", rfpRouter);

if (process.env.NODE_ENV === "production") {
   app.use(express.static("client/build"));
   app.get("*", function (req, res) {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
   });
}

app.listen(port, () => {
   console.log(`App listening on port ${port}`);
});
