var amqp = require("amqplib/callback_api");

const TO_SERVER = "TO_SERVER";
const TO_CLIENT = "TO_CLIENT";

function initConsumer() {
  return getMiddleWareConnection().then(connection => {
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }
      channel.consume(TO_CLIENT, function(msg) {
        console.log(msg.content.toString());
      });
    });
  });
}

function getMiddleWareConnection() {
  return new Promise((resolve, reject) => {
    amqp.connect("amqp://localhost", function(error0, connection) {
      if (error0) {
        reject(error0);
      }
      resolve(connection);
    });
  });
}

function produceMessageToMiddleWare(connection, message) {
  return new Promise((resolve, reject) => {
    connection.createChannel(function(error1, channel) {
      if (error1) {
        reject(error1);
      }
      channel.assertQueue(TO_SERVER, {
        durable: false
      });
      channel.sendToQueue(TO_SERVER, Buffer.from(message));
      console.log(" [x] Sent " + message);
      resolve(connection);
    });
  });
}

module.exports = {
  getMiddleWareConnection: getMiddleWareConnection,
  produceMessageToMiddleWare: produceMessageToMiddleWare,
  initConsumer: initConsumer
};
