import * as React from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Navbar from '../Navbar';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const editUser = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

export default function EditUser(props) {
    const sessiondata = JSON.parse(sessionStorage.getItem('user'));

    if(sessiondata === undefined)
    {
        navigate("/")
    }
    const navigate = useNavigate();
    const { state } = useLocation();
    const [error, setError] = React.useState('');

    console.log(state)
    console.log(sessiondata)
    
    const [name, setName] = React.useState(state?.name || '');
    const [username, setUsername] = React.useState(state?.username || '');
    const [mobile, setMobile] = React.useState(state?.mobile_no || '');
  
    const [usernameError, setUsernameError] = React.useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');
    const [nameError, setNameError] = React.useState(false);
    const [nameErrorMessage, setNameErrorMessage] = React.useState('');
    const [mobileError, setMobileError] = React.useState(false);
    const [mobileErrorMessage, setMobileErrorMessage] = React.useState('');
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (nameError || mobileError || usernameError) {
        return;
      }
  
      const data = new FormData(event.currentTarget);
      try {
        const response = await axios.put(`http://localhost:8001/editUser`, {
          id: sessiondata.id,
          name: data.get('name'),
          mobile_no: data.get('mobile'),
          user_name: data.get('username'),
        });
        console.log(response.data.message);
        if (response.data.message === "User updated successfully") {
          navigate("/UserDetail");
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
      }
    };
  
    return (
      <>
        <Navbar />
        <CssBaseline enableColorScheme />
        <Stack direction="column" justifyContent="space-between">
          <Card variant="outlined">
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
              Edit User Details
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 2,
              }}
            >
              <FormControl>
                <FormLabel htmlFor="name">Name</FormLabel>
                <TextField
                  error={nameError}
                  helperText={nameErrorMessage}
                  id="name"
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="Name"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={nameError ? 'error' : 'primary'}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="username">User Name</FormLabel>
                <TextField
                  error={usernameError}
                  helperText={usernameErrorMessage}
                  id="username"
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your user name"
                  autoComplete="username"
                  required
                  fullWidth
                  variant="outlined"
                  color={usernameError ? 'error' : 'primary'}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="mobile">Mobile Number</FormLabel>
                <TextField
                  error={mobileError}
                  helperText={mobileErrorMessage}
                  id="mobile"
                  type="text"
                  name="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Your mobile number"
                  autoComplete="mobile"
                  required
                  fullWidth
                  variant="outlined"
                  color={mobileError ? 'error' : 'primary'}
                />
              </FormControl>
              {error && <div className="mb-3 text-red-500">{error}</div>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
              >
                Update Details
              </Button>
            </Box>
          </Card>
        </Stack>
      </>
    );
  }