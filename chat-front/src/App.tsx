import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    TextField,
    Typography
} from "@mui/material";
import './App.css';
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
                        'Content-Type':'application/json'
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
        <>
            <Container>
                <Typography variant="h3" gutterBottom className="main-title">
                    Chat App
                </Typography>
                <Box className="content" sx={{ marginBottom:3}}>
                    {allInfo.map((msg, index) => (
                        <Card key={index} className="block">
                            <CardHeader
                                title={
                                    <Typography variant="subtitle1">
                                        <b>Author :</b>
                                        <span> {msg.author}</span>
                                    </Typography>
                                }
                                subheader={
                                    <Typography variant="subtitle1">
                                        <b>Date : </b>
                                        <span>{dayjs(msg.datetime).format('DD.MM.YYYY HH:mm:ss')}</span>
                                    </Typography>
                                }
                                sx={{ paddingLeft: 2, paddingRight: 2, margin: 0, paddingTop:0  }}
                            />
                            <CardContent sx={{ paddingLeft: 2, paddingRight: 2, margin: 0, paddingTop: 0, paddingBottom: 0}}>
                                <Typography sx={{ paddingLeft: 3, paddingRight: 3, margin: 0, paddingTop: 2, paddingBottom: 2}} className='blockquote' variant="h6" >
                                    {msg.message}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
                <Box className="row">
                    <Box className="col-md-12">
                        <form onSubmit={sendMessage}>
                            <TextField
                                required
                                label="Author"
                                variant="outlined"
                                fullWidth
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                required
                                label="Message"
                                variant="outlined"
                                fullWidth
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                            <Button type="submit" variant="contained" color="primary">
                                Send
                            </Button>
                        </form>
                    </Box>
                </Box>
            </Container>
        </>
  );

};

export default App;
