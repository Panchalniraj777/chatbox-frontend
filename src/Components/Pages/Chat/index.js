import React, { useState, useEffect, useMemo, useContext } from 'react';
import io from 'socket.io-client';

import { Box, Button, Typography } from '@mui/material';
import { LayoutWrapper, ChatWrapper, MessageInputWrapper, HeaderWrapper } from './Chat.style';

import Api from '../../../Helper/ApiHandler';

import { AuthContext } from '../../../App';

const Chat = () => {
    const socket = io(process.env.REACT_APP_API_URL);
    const userData = JSON.parse(localStorage.getItem('user'));
    const API = useMemo(() => new Api(), []);

    const [recentChats, setRecentChats] = useState([]);
    const [receiver, setReceiver] = useState({});
    const [message, setMessage] = useState([]);
    const [chat, setChat] = useState({});

    const getUsers = async () => {
        try {
            let response = await API.get('/user/users');
            setRecentChats(response?.data?.data || []);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        socket.on('connect', async () => {
            socket.emit('user_connected', userData.id);
            getUsers();
        });

        socket.on('user_connected', user => {
            getUsers();
        });

        socket.on('receive_message', async receiveMessage => {
            setMessage(prev => [...prev, receiveMessage]);
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    const sendMessage = message => {
        const data = {
            sender_id: userData?.id,
            receiver_id: receiver?._id,
            receiver_socket_id: receiver?.socket_id,
            message,
        };

        setMessage(prev => [...prev, { ...data, sender_id: {
            ...userData,
            _id: userData.id
        } }]);
        socket.emit('send_message', data);
    };

    return (
        <LayoutWrapper>
            <ChatWrapper>
                <div className="app">
                    <Sidebar
                        recentChats={recentChats}
                        setReceiver={setReceiver}
                        setChat={setChat}
                        setMessage={setMessage}
                    />

                    <ChatArea receiver={receiver} message={message} sendMessage={sendMessage} />
                </div>
            </ChatWrapper>
        </LayoutWrapper>
    );
};

const Sidebar = ({ recentChats, setReceiver, setMessage, setChat }) => {
    return (
        <div className="sidebar">
            <h2>Recent Chats</h2>
            <ul>
                {recentChats?.length ? (
                    recentChats.map(user => (
                        <UserListItem
                            key={user.id}
                            user={user}
                            setReceiver={setReceiver}
                            setMessage={setMessage}
                            setChat={setChat}
                        />
                    ))
                ) : (
                    <>
                        <Box>Please sign up to add another user and start using the chat.</Box>
                    </>
                )}
            </ul>
        </div>
    );
};

const UserListItem = ({ user, setReceiver, setMessage, setChat }) => {
    const API = useMemo(() => new Api(), []);

    const handleChats = async () => {
        setReceiver(user);
        const userData = JSON.parse(localStorage.getItem('user'));

        try {
            let response = await API.post('/chat', {
                data: {
                    sender_id: userData.id,
                    receiver_id: user._id,
                },
            });

            const { chat, messages } = response?.data?.data;
            setMessage(messages);
            setChat(chat);
        } catch (error) {
            console.error('Login error:', error);
        }
    };
    return (
        <li className="user-list-item" onClick={() => handleChats(user)}>
            <span className={`status-indicator ${user.is_online ? 'online' : 'offline'}`}></span>
            {user.name}
        </li>
    );
};

const Header = ({ receiver }) => {
    const { handleLogout } = useContext(AuthContext);
    return (
        <HeaderWrapper>
            <Box>
                <Typography>{receiver?.name}</Typography>
            </Box>

            <Box>
                <Button onClick={() => handleLogout()}>Logout</Button>
            </Box>
        </HeaderWrapper>
    );
};

const ChatArea = ({ message, sendMessage, receiver }) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        sendMessage(newMessage);
        setNewMessage('');
    };

    return (
        <Box className="chat-area">
            <Header receiver={receiver} />

            <Box className="message-list">
                {message.map((msg, index) => (
                    <Box
                        key={index}
                        className={`message ${
                            msg.sender_id?._id === userData.id ? 'sent' : 'received'
                        }`}
                    >
                        <strong>
                            {msg.sender_id?._id === userData.id ? 'You' : `${msg.sender_id?.name}`}:{' '}
                        </strong>
                        <Typography>{msg.message}</Typography>
                    </Box>
                ))}
            </Box>
            <Box className="message-input">
                <MessageInputWrapper
                    type="text"
                    variant="outlined"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                />
                <Button onClick={handleSendMessage}>Send</Button>
            </Box>
        </Box>
    );
};

export default Chat;
