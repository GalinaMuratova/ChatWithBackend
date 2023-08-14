import express from "express";
const chatMessagesRouter = express.Router();

chatMessagesRouter.get('/', (req, res) => {
    res.send('ok');
});

chatMessagesRouter.post('/', (req, res) => {
    res.send('Post');
});

export default chatMessagesRouter;