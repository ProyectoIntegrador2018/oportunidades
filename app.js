require("dotenv").config();
require('events').EventEmitter.defaultMaxListeners = 12;
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const eventScheduler = require("./server/services/EventScheduler");

const port = process.env.PORT || 3001;

const database = process.env.DATABASE || "mongodb://localhost:27017/test-repo";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(database, { useNewUrlParser: true });

const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "connection error:"));
connection.on("open", () => {
  
  eventScheduler.checkForEventStatusUpdate();

  eventScheduler.checkForOldRfps();

  let adminConfig = require("./server/config/adminConfig");

  const userRouter = require("./server/routes/userapi");
  app.use("/user", userRouter);

  const rfpRouter = require("./server/routes/RFPapi");
  app.use("/rfp", rfpRouter);

  const adminRouter = require("./server/routes/adminapi");
  app.use("/admin", adminRouter);

  const participacionRouter = require("./server/routes/participacionapi");
  app.use("/participacion", participacionRouter);

  const eventRouter = require("./server/routes/eventapi");
  app.use("/events", eventRouter);

  const userNotifRouter = require("./server/routes/usuarioNotificacionapi");
  app.use("/notificaciones", userNotifRouter);

  if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get("*", function (req, res) {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
  }

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
});
