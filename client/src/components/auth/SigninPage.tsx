import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const SigninPage = () => {
  const [alert, setAlert] = useState({ visible: false, severity: 'success', message: '' });
  const navigate = useNavigate();
  // TODO: fix issues with severity and alert component... stupid TS
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    api.post('/auth/signin', { 
      email: data.get('email'), 
      password: data.get('password') 
    })
    .then(function (response) {
      setAlert({
        visible: true,
        severity: response.data.severity,
        message: response.data.message
      });
      navigate('/dashboard');
    })
    .catch(function (error) {
      if (error.response && error.response.data && error.response.data.message) { // TODO: better error handling
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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        {alert.visible && (
          <Alert variant="outlined" severity={alert.severity}>
            {alert.message}
          </Alert>
        )}
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="/auth/signup" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SigninPage;