import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';

const EditExpense = () => {
  const navigate = useNavigate();
  const theme = useTheme(); // Access theme values
  const { state } = useLocation();
  console.log(state);
  
  const [name, setName] = useState(state?.name || "");
  const [amount, setAmount] = useState(state?.amount || "");
  const [date, setDate] = useState(state?.date || "");
  const [location, setLocation] = useState(state?.location || "");
  const [isDisabled, setIsDisabled] = useState(true);

  const storedValue = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (sessionStorage.getItem("user") === undefined) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    setIsDisabled(!(name && amount && date && location));
  }, [name, amount, date, location]);

  const submitHandler = async (event) => {
    event.preventDefault();
    const response = await axios.put('http://localhost:8002/editExpense', {
      id: state.id,
      userid: storedValue.id,
      name,
      amount,
      location,
      date,
    });
    if (response.data.message === "Updated successfully") {
      navigate("/Expenses");
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          p: 5,
          mb: 20,
          backgroundColor: alpha(theme.palette.primary.light, 0.06), // Lighter background using primary color
          borderRadius: 2,
          boxShadow: theme.shadows[3],
        }}
      >
        <form onSubmit={submitHandler} style={{ maxWidth: '500px', margin: 'auto' }}>
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            color={theme.palette.text.primary} // Text color from theme
          >
            Edit Expense
          </Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{
              backgroundColor: "white",
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.grey[300],
                },
                '&:hover fieldset': { borderColor: theme.palette.primary.main },
              },
            }}
          />
          <TextField
            label="Date"
            type="date"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            sx={{
              backgroundColor: "white",
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.grey[300],
                },
                '&:hover fieldset': { borderColor: theme.palette.primary.main },
              },
            }}
          />
          <TextField
            label="Amount"
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            sx={{
              backgroundColor: "white",
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.grey[300],
                },
                '&:hover fieldset': { borderColor: theme.palette.primary.main },
              },
            }}
          />
          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            margin="normal"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            sx={{
              backgroundColor: "white",
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.grey[300],
                },
                '&:hover fieldset': { borderColor: theme.palette.primary.main },
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
            disabled={isDisabled}
          >
            Edit Expense
          </Button>
        </form>
      </Box>
    </>
  );
}

export default EditExpense;



// import React, { useEffect, useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import Navbar from '../Navbar';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';

// const EditExpense = () => {
//   const navigate = useNavigate();
//   const {state} = useLocation();
//     console.log(state)
//   const [name, setName] = useState(state?.name || "");
//   const [amount, setAmount] = useState(state?.amount || "");
//   const [date, setDate] = useState(state?.date || "");
//   const [location, setLocation] = useState(state?.location || "");
//   const [isDisabled, setIsDisabled] = useState(true);

//   const storedValue = JSON.parse(sessionStorage.getItem("user"));

//   useEffect(() => {
//     if (sessionStorage.getItem("user") === undefined) {
//       navigate("/");
//     }
//   }, [navigate]);

//   useEffect(() => {
//     setIsDisabled(!(name && amount && date && location));
//   }, [name, amount, date, location]);

//   const submitHandler = async (event) => {
//     event.preventDefault();

//     const response = await axios.put('http://localhost:8000/editExpense', {
//         id : state.id,
//         userid: storedValue.id,
//         name,
//         amount,
//         location,
//         date,
//       });
//       if (response.data.message === "Updated successfully") {
//         navigate("/Expenses");
//       }
    
//     }
  

//   return (
//     <>
//       <Navbar />
//       <Box sx={{ p: 5, mb: 20 }}>
//         <form onSubmit={submitHandler} style={{ maxWidth: '500px', margin: 'auto' }}>
//           <Typography variant="h4" gutterBottom textAlign="center" color="text.primary">
//             Edit Expense
//           </Typography>
//           <TextField
//             label="Name"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//           <TextField
//             label="Date"
//             type="date"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             InputLabelProps={{ shrink: true }}
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             required
//           />
//           <TextField
//             label="Amount"
//             type="number"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             required
//           />
//           <TextField
//             label="Location"
//             variant="outlined"
//             fullWidth
//             margin="normal"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             required
//           />
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             color="primary"
//             sx={{ mt: 2 }}
//             disabled={isDisabled}
//           >
//             Edit Expense
//           </Button>
//         </form>
//       </Box>
//     </>
//   );
// }

// export default EditExpense;


