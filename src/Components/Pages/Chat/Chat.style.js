import styled from 'styled-components';
import { Box, Input } from '@mui/material';

export const LayoutWrapper = styled(Box)`
    display: flex;
`;

export const ChatWrapper = styled(Box)`
    width: 100%;

    .app {
        display: flex;
        height: 100vh;
    }

    .sidebar {
        width: 250px;
        background-color: #f0f0f0;
        padding: 20px;
        border-right: 1px solid #ccc;
    }

    .sidebar h2 {
        font-size: 18px;
        margin-bottom: 10px;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    .user-list-item {
        display: flex;
        align-items: center;
        padding: 10px;
        cursor: pointer;
    }

    .status-indicator {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 10px;

        &.online {
            background-color: #5cb85c;
        }

        &.offline {
            background-color: #d9534f;
        }
    }

    .chat-area {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .message-list {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
    }

    .message {
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 5px;
        min-width: 100px;
        max-width: 400px;
        word-wrap: break-word;

        &.sent {
            background-color: #dcf8c6;
            align-self: flex-end;
        }

        &.received {
            background-color: #e5e5ea;
        }
    }

    .message-input {
        display: flex;
        align-items: center;
        padding: 10px;
    }
`;

export const MessageInputWrapper = styled(Input)`
    width: 100%;
`;

export const HeaderWrapper = styled(Box)`
    height: 50px;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    align-items: center;
    justify-content: space-between;
    padding: 0 25px;
`;
