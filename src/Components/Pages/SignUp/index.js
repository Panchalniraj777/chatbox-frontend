import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import Api from '../../../Helper/ApiHandler';

const SignUp = () => {
    const API = useMemo(() => new Api(), []);

    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            await API.post('/auth/signUp', {
                data: {
                    name,
                    phone,
                    email,
                    password,
                },
            });

            navigate('/sign-in');
        } catch (error) {
            console.error('Login error:', error);
        }
    };
    return (
        <Container maxWidth="xs">

            <Typography variant="h4" align="center" gutterBottom>
                Sign Up
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            margin="normal"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Phone"
                            type="tel"
                            name="phone"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                            margin="normal"
                        />
                    </Grid>
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
                            Sign Up
                        </Button>
                    </Grid>
                </Grid>
            </form>
            </Container>

    );
};

export default SignUp;
