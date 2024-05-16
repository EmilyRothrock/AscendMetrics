import React, { useState } from 'react';
import api from '../services/api';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function SignUp() {
    const [alert, setAlert] = useState({ visible: false, severity: 'success', message: '' });
    // TODO: fix issues with severity and alert component... stupid TS

    // TODO: consider refactoring this function's redundancies with SINGIN to a helper...
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        api.post('/signup', { 
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            email: data.get('email'), 
            password: data.get('password') 
        })
        .then(function (response) {
            setAlert({
                visible: true,
                severity: response.data.severity,
                message: response.data.message
            });
        })
        .catch(function (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setAlert({
                    visible: true,
                    severity: 'error',
                    message: error.response.data.message
                });
            } else {
                setAlert({
                    visible: true,
                    severity: 'error',
                    message: 'An unexpected error occurred. Please try again later.'
                });
            }
        });
    };

  return (
    <Container component="main" maxWidth="xs">
    <CssBaseline />
    <Box
        sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        }}
    >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
        Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
            <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
            />
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
            />
            </Grid>
            <Grid item xs={12}>
            <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
            />
            </Grid>
            <Grid item xs={12}>
            <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
            />
            </Grid>
        </Grid>
        <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
        >
            Sign Up
        </Button>
        {alert.visible && (
            <Alert variant="outlined" severity={alert.severity}>
                {alert.message}
                {alert.severity === 'success' && (
                    <Link href="/signin" variant="body2" sx={{ marginLeft: 1 }}>
                        Sign in
                    </Link>
                )}
            </Alert>
        )}
        {alert.severity != "success" && (<Grid container justifyContent="flex-end">
            <Grid item>
            <Link href="/signin" variant="body2">
                Already have an account? Sign in
            </Link>
            </Grid>
        </Grid>)}
        </Box>
    </Box>
    </Container>
  );
}