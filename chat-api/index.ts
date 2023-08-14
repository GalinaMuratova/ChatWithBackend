import express from "express";
import chatMessagesRouter from "./routers/chat-messages";

const app = express();
const port = 8000;
app.use(express.json());
app.use('/messages', chatMessagesRouter);

app.listen(port, () => {
    console.log('Server started on ' + port + 'port');
});