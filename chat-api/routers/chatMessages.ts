import express from "express";
import fileDb from "../fileDb";
import {MessageMutation} from "../types";
const chatMessagesRouter = express.Router();

chatMessagesRouter.get('/', async (req, res) => {
    if (req.query.datetime) {
        const queryDate = req.query.datetime as string
        const requestedDatetime = new Date(queryDate);

        if (isNaN(requestedDatetime.getDate())) {
            return res.status(400).send({"error": "Invalid datetime format"});
        }

        const messages = await fileDb.getMessages();
        const newMessages = messages.filter((message) => {
            const messageDatetime = new Date(message.datetime);
            return messageDatetime > requestedDatetime;
        });

        if (newMessages.length === 0) {
            return res.send([]);
        }

        res.send(newMessages);
    } else {
        const messages = await fileDb.getMessages();
        res.send(messages);
    }
});

chatMessagesRouter.post('/', async (req, res) => {
    if (!req.body.message || !req.body.author) {
        return res.status(400).send({"error": "Author and message must be present in the request"});
    }
    const message: MessageMutation = {
        message: req.body.message,
        author: req.body.author,
    }

    const savedMessage = await fileDb.sendMessage(message);
    res.send(savedMessage);
});

export default chatMessagesRouter;