import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles'; // Import useTheme and alpha

const AddExpense = () => {
  const navigate = useNavigate();
  const theme = useTheme(); // Access theme values
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
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
    const response = await axios.post('http://localhost:8002/addExpense', {
      userid: storedValue.id,
      name,
      amount,
      location,
      date,
    });
    if (response.data.message === "Expense added successfully") {
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
            Add Expense
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
            Add Expense
          </Button>
        </form>
      </Box>
    </>
  );
};

export default AddExpense;

// // import React from 'react';
// import Navbar from '../Navbar';
// import React, { useEffect, useState } from 'react';
// import {useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AddExpense = () => {
//     const navigate = useNavigate();
//     const [name, setName] = useState("");
//     const [amount, setamount] = useState("");
//     const [date, setdate] = useState("");
//     const [location, setlocation] = useState(0);
//     // const [username, setUsername] = useState("");
   
  
//     const [isdisable, setdisable] = useState(true);
    
//     if(sessionStorage.getItem("user") == undefined)
//         {
//             navigate("/")
//         }
    
//     // const [error, seterror] = useState("");
//     const storedValue = JSON.parse(sessionStorage.getItem("user"))

//     console.log(storedValue)

//     async function submitHandler(event) {
//       event.preventDefault();
  
//        const response = await axios.post(`http://localhost:8000/addExpense`, {
//               "userid": storedValue.id,
//               "name": name,
//               "amount": amount,
//               'location': location,
//               'date': date
              
             
//           });
//           console.log(response.data.message);
//       if(response.data.message === "Expense added successfully"){
//         navigate("/Expenses")
//       }
  
//       else{
  
//       }
      
  
//     }
  
//     function changelocation(event) {
//       setlocation(event.target.value)
//     }
  
//     function changeamount(event) {
//       setamount(event.target.value)
//     }
  
//     useEffect(() => {
//       if (name !== "" && amount !== "" && date !== "" && location !== "") {
//         setdisable(false);
//       } else {
//         setdisable(true);
//       }
//     }, [amount, date, name, location]);
  
  

//     return (

//         <>
//             <Navbar />

//             <div className="p-5 mb-20">
//   <form onSubmit={submitHandler} className="w-96 mx-auto pl-8 pr-8 pb-8 rounded-lg shadow-md bg-white">
//     <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add Expense</h2>

//     <div className="mb-3">
//       <label htmlFor="text" className="block text-gray-700 font-bold mb-2">Name</label>
//       <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter expense name"
//         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
//     </div>

//     <div className="mb-3">
//       <label htmlFor="date" className="block text-gray-700 font-bold mb-2">Date</label>
//       <input type="date" value={date} onChange={(e) => setdate(e.target.value)} placeholder="Enter expense date"
//         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
//     </div>

//     <div className="mb-3">
//       <label htmlFor="number" className="block text-gray-700 font-bold mb-2">Amount</label>
//       <input type="number" value={amount} onChange={changeamount} placeholder="Enter expense amount"
//         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
//     </div>

//     <div className="mb-6">
//       <label htmlFor="text" className="block text-gray-700 font-bold mb-2">Location</label>
//       <input type="text" value={location} onChange={changelocation} placeholder="Enter expense location"
//         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
//     </div>

//     <button type="submit" disabled={isdisable}
//       className={`w-full bg-indigo-500 text-white py-2 px-4 rounded-lg font-semibold ${isdisable ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-600"}`}>
//       Add Expense
//     </button>
//   </form>
// </div>
//     </>

//     );
// }

// export default AddExpense;