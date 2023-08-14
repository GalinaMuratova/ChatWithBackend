export interface Message {
    id: string,
    datetime: string,
    author: string,
    message: string
}

export interface MessageMutation {
    author: string,
    message: string
}