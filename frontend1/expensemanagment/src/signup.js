import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

export default function Login(props) {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [uernameError, setusernameError] = React.useState(false);
  const [usernameErrorMessage, setusernameErrorMessage] = React.useState('');
  const [nameError, setnameError] = React.useState(false);
  const [nameErrorMessage, setnameErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [mobileError, setmobileError] = React.useState(false);
  const [mobileErrorMessage, setmobileErrorMessage] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (emailError || passwordError || nameError || mobileError || uernameError) {
      return;
    }
    
    const data = new FormData(event.currentTarget);
    try {
           const response = await axios.post(`http://localhost:8001/signUP`, {
           
            "name": data.get('name'),
            "email_add": data.get('email'),
            'password': data.get('password'),
            'mobile_no': data.get('mobile'),
            'user_name': data.get('username'),
            'role': "User"

           
        });
        console.log(response.data.message);
    if(response.data.message === "User created successfully"){
      navigate("/")
    }

      // const response = await axios.get(`http://localhost:8000/login`, {
      //   params: {
      //     email: data.get('email'),
      //     password: data.get('password'),
      //   },
      // });

      // if (response.data.message === "Login successful!") {
      //   setError("");
      //   sessionStorage.setItem("user", JSON.stringify(response.data.user));

      //   if (response.data.user.role === "User") {
      //     navigate("/Home");
      //   } else {
      //     navigate("/AdminHome");
      //   }
      // } else {
      //   setError("Invalid credentials");
      // }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSignupRedirect = () => {
    navigate("/");
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={(event) => {
              validateInputs();
              handleSubmit(event);
            }}
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
                error={uernameError}
                helperText={usernameErrorMessage}
                id="username"
                type="text"
                name="username"
                placeholder="Your user name"
                autoComplete="username"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={uernameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormLabel htmlFor="password">Password</FormLabel>
              </Box>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
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
                placeholder="Your mobile number"
                autoComplete="0"
                autoFocus
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
              SignUP
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
             Already have an account?{' '}
              <span onClick={handleSignupRedirect} style={{ cursor: 'pointer', color: 'blue' }}>
                Login
              </span>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </>
  );
}




// import React from 'react';
// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const SignUP = () => {
//   const [email, setuseremail] = useState("");
//   const [password, setpassword] = useState("");
//   const [name, setName] = useState("");
//   const [mobileno, setMobile] = useState(0);
//   const [username, setUsername] = useState("");
//   const navigate = useNavigate();

//   const [isdisable, setdisable] = useState(true);

//   // const [error, seterror] = useState("");


//   async function submitHandler(event) {
//     event.preventDefault();

//      const response = await axios.post(`http://localhost:8000/signUP`, {
           
//             "name": name,
//             "email_add": email,
//             'password': password,
//             'mobile_no': mobileno.toString(),
//             'user_name': username,
//             'role': "User"

           
//         });
//         console.log(response.data.message);
//     if(response.data.message === "User created successfully"){
//       navigate("/")
//     }

//     else{

//     }
    

//   }

//   function changeusername(event) {
//     setuseremail(event.target.value)
//   }

//   function changepassword(event) {
//     setpassword(event.target.value)
//   }

//   useEffect(() => {
//     if (email !== "" && password !== "" && name !== "" && mobileno !== "" && username !== "") {
//       setdisable(false);
//     } else {
//       setdisable(true);
//     }
//   }, [email, password, name, mobileno, username]);


//   return (

//     <>
//       <div className="p-5 mb-20">

//         <form onSubmit={submitHandler} className="w-96 mx-auto pl-8 pr-8 pb-8 rounded-lg shadow-md">
//           {/* <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2> */}
//           <div className="mb-3">
//             <label htmlFor='text' className="block text-gray-700 font-bold mb-2">Name</label>
//             <input type='text' value={name} onChange={(e) => { setName(e.target.value) }} placeholder='Enter your Name'
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
//           </div>

//           <div className="mb-3">
//             <label htmlFor='text' className="block text-gray-700 font-bold mb-2">User Name</label>
//             <input type='text' value={username} onChange={(e) => { setUsername(e.target.value) }} placeholder='Enter your Emailid'
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
//           </div>

//           <div className="mb-3">
//             <label htmlFor='email' className="block text-gray-700 font-bold mb-2">Email</label>
//             <input type='email' value={email} onChange={changeusername} placeholder='Enter your Emailid'
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
//           </div>

//           <div className="mb-6">
//             <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>

//             <input type='password' value={password} onChange={changepassword} placeholder='Enter your Password'
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             ></input>
//           </div>

//           <div className="mb-6">
//             <label htmlFor="mo" className="block text-gray-700 font-bold mb-2">Mobile No</label>

//             <input type="tel" value={mobileno} onChange={(e) => { setMobile(e.target.value) }} pattern="[0-9]{10}" placeholder='Enter your Password'
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             ></input>
//           </div>

//           <div>
//             <button type='submit' disabled={isdisable}
//               className={`w-full bg-indigo-500 text-white py-2 px-4 rounded-lg font-semibold 
//                     ${isdisable ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-600"}`}
//             >SignUP</button>
//           </div>

//           <div>
//             <span className="text-gray-700">Already have an account? </span>
//             <Link to="/" className="text-indigo-600 hover:underline">
//               Login
//             </Link>
//           </div>

//         </form>
//       </div>

//     </>

//   );
// }

// export default SignUP;