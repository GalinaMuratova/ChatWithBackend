import React, {useEffect, useState} from 'react';
import './App.css'
import dayjs from "dayjs";

const App = () => {
    const [author, setAuthor] = useState('');
    const [message, setMessage] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [allInfo, setAllInfo] = useState<{ author: string; message: string; datetime: string; }[]>([]);

    const sendMessage = async (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (author && message) {
            const data = JSON.stringify({
                author: author,
                message: message
            });
            try {
                const response = await fetch('http://127.0.0.1:8000/messages', {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    setAuthor('');
                    setMessage('');
                } else {
                    console.error('Failed to send message');
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    const getMessage = async () => {
        const url = `http://127.0.0.1:8000/messages?datetime=${dateTime}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.length > 0) {
                setAllInfo((prevState) => [...prevState, ...data]);
                setDateTime(data[data.length - 1].datetime);
            }
        } catch (e) {
            console.log(e)
        }
    };

    useEffect(() => {
        const interval = setInterval(getMessage, 3000);
        return () => clearInterval(interval);
    }, [dateTime]);


    return (
        <div className="container">
            <h1 className="main-title">Chat App</h1>
            <div className="content">
                {allInfo.map((msg, index) => (
                    <div key={index} className="block">
                        <div className="card-header">
                            <b>Author : </b> {msg.author}
                            <span className='ms-5'><b>Data : </b>{dayjs(msg.datetime).format('DD.MM.YYYY HH:mm:ss')}</span>
                        </div>
                        <div className="card-body">
                            <blockquote className="blockquote mb-0">
                                <p>{msg.message}</p>
                            </blockquote>
                        </div>
                    </div>
                ))}
            </div>
            <div className="row">
                <div className="col-md-12">
                    <form onSubmit={sendMessage}>
                        <div className="form-group">
                            <label htmlFor="author">Author:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="author"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message:</label>
                            <textarea
                                className="form-control"
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
  );
};

export default App;
