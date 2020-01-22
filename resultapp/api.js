const express = require("express");
const redis = require("redis");
const cors = require("cors");


const app = express();
const API_PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.PORT || 6379;
app.use(cors());

app.get('/:pet_type', (request, response) => {
    const { pet_type } = request.params;

    const subscriber = redis.createClient(REDIS_PORT);
    const redis_client = redis.createClient(REDIS_PORT);
    subscriber.on("message", function (channel, message) {
        console.log("Message: " + message + " on channel: " + channel + " is arrive!");
    });

    subscriber.subscribe("VoteRegistered", async (err, data) => {
        if (err) {
            console.log("An error has occurred: ", err);
        }
        await redis_client.get(pet_type, (err, payload) => {
            if (err) {
                console.log("An error has occurred: ", err);
            }
            response.status(200).send(payload);
        });
    });
});

app.listen(API_PORT, () => {
    console.log(`REST Api running on ${API_PORT} port...`);
});