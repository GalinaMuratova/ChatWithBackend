import { promises as fs } from 'fs';
import { randomUUID} from "crypto";
import {Message, MessageMutation} from "./types";

const pathName = './db.json';
let data: Message[] = [];

const fileDb = {
    async init (){
        try {
            const fileContents = await fs.readFile(pathName);
            data = JSON.parse(fileContents.toString());
        } catch (e) {
            console.error(e);
            data = [];
        }
    },
    async getMessages() {
        if (data.length <= 30) {
            return data;
        }
        const end = data.length - 1;
        const begin = end - 29;
        return data.slice(begin, end + 1);
    },
    async sendMessage(item: MessageMutation) {
        const now = new Date();
        const createdAt: string = now.toISOString();
        const message = {
            ...item,
            id: randomUUID(),
            datetime: createdAt,
        }
        data.push(message);
        await this.save();
    },
    async save() {
        await fs.writeFile(pathName, JSON.stringify(data));
    }
};

export default fileDb;