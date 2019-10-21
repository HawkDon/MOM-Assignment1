var amqp = require("amqplib/callback_api");
var express = require("express");
var router = express.Router();
var {
  getMiddleWareConnection,
  produceMessageToMiddleWare,
  initConsumer
} = require("../middleware/rabbitmq");

initConsumer();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", {
    title: "Type something to send it to the rabbitmq middleware server"
  });
});

router.post("/", function(req, res) {
  getMiddleWareConnection().then(connection =>
    produceMessageToMiddleWare(connection, req.body.message)
  );
});

module.exports = router;
