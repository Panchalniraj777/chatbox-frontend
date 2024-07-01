import React, { useState, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import Api from '../../../Helper/ApiHandler';
import { AuthContext } from '../../../App';

const SignIn = () => {
    const { handleLogin } = useContext(AuthContext);

    const API = useMemo(() => new Api(), []);

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            let response = await API.post('/auth/signIn', {
                data: {
                    email,
                    password,
                },
            });
            
            const { authToken, user } = response.data.data;

            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('accessToken', authToken.token);

            handleLogin();
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" align="center" gutterBottom>
                Sign In
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Password"
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" fullWidth variant="contained" color="primary">
                            Sign In
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default SignIn;
