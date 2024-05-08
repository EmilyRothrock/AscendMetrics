import { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', { username, password });
            console.log('Login successful', response);
        } catch (error) {
            console.error('Failed to login', error);
        }
    };

    return (
        <>
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit">Log In</button>
            <button>Forgot Password</button>
            <button>Register New Account</button>
        </form>
        </>
    );
};

export default LoginPage;
