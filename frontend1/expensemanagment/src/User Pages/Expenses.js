import { alpha,useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PopupStyles.css';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';
import Popup from 'reactjs-popup';

import Navbar from '../Navbar';

const Expenses = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    if (sessionStorage.getItem("user") == undefined) {
        navigate("/")
    }

    const storedValue = JSON.parse(sessionStorage.getItem("user"))

    console.log(storedValue)
    const [Expenses, setExpenses] = useState([]);
    // const [filteredUsers, setFilteredUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        // Fetch users data from backend
        axios.get(`http://localhost:8002/retriveExpense?email=${storedValue.id}`)
            .then(response => {
                setExpenses(response.data.expenses);
                // setFilteredUsers(response.data.user_data); // Set filtered data to initial data
            })
            .catch(error => {
                console.error("No expenses added ", error);
            });
    }, []);

    // Filter users based on search input
    // useEffect(() => {
    //     const filtered = users.filter(user =>
    //         user.name.toLowerCase().includes(searchText.toLowerCase())
    //     );
    //     setFilteredUsers(filtered);
    // }, [searchText, users]);

    const submithandle = (expense, close) => {
        console.log(expense)
        axios.delete(`http://localhost:8002/deleteExpense?id=${expense.id}`)
            .then(response => {
                // setExpenses(response.data.expenses);
                // setFilteredUsers(response.data.user_data); // Set filtered data to initial data
                if (response.data.message == "Deleted Successfully") {
                    setExpenses(prevExpenses => prevExpenses.filter(item => item.id !== expense.id));

                    // Close the popup
                    close();
                }

            })
            .catch(error => {
                console.error("No expenses added ", error);
            });
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            <Navbar />

            {/* Search bar */}
            {/* <TextField
                label="Search by Name"
                variant="outlined"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{ margin: 2, width: '50%' }}
            /> */}

<Paper 
    sx={{ 
        width: '100%', 
        overflow: 'hidden', 
        backgroundColor: alpha(theme.palette.primary.light, 0.07),  // Lighter background color
        boxShadow: theme.shadows[3] 
    }}
>
    <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="expenses table">
            <TableHead>
                <TableRow>
                    <TableCell align="center" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell align="center" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell align="center" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell align="center" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Location</TableCell>
                    <TableCell align="center" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Edit Expense</TableCell>
                    <TableCell align="center" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Delete Expense</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {Expenses == undefined ? "No Expenses Found" : Expenses.map((user, index) => (
                    <TableRow 
                        hover 
                        key={user.id} 
                        sx={{ 
                            backgroundColor: index === 0 ? alpha(theme.palette.primary.light, 0.07) : 'inherit', // Set background color for the first row
                            color: index === 0 ? 'black' : 'inherit', // Set text color for the first row
                            '&:nth-of-type(even)': { backgroundColor: theme.palette.action.hover }
                        }}
                    >
                        <TableCell align="center" sx={{ color: index === 0 ? 'black' : 'inherit' }}>{user.name}</TableCell>
                        <TableCell align="center" sx={{ color: index === 0 ? 'black' : 'inherit' }}>{user.amount}</TableCell>
                        <TableCell align="center" sx={{ color: index === 0 ? 'black' : 'inherit' }}>{user.date}</TableCell>
                        <TableCell align="center" sx={{ color: index === 0 ? 'black' : 'inherit' }}>{user.location}</TableCell>
                        <TableCell align="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate('/EditExpense', { state: { ...user, userid: storedValue.id, id: user.id } })}
                            >
                                Edit
                            </Button>
                        </TableCell>
                        <TableCell align="center">
                            <Popup 
                                trigger={<Button variant="contained" color='error'>Delete</Button>} 
                                modal nested className="custom-popup"
                                overlayStyle={{ backgroundColor: "rgba(200, 200, 200, 0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}
                                contentStyle={{ width: "300px", padding: "20px", borderRadius: "10px", backgroundColor: theme.palette.background.paper, boxShadow: theme.shadows[4] }}>
                                {close => (
                                    <div>
                                        <div>Are you sure you want to delete this expense?</div>
                                        <div>
                                            <Button onClick={() => submithandle(user, close)} color='error'>Yes</Button>
                                            <Button color='success' onClick={() => close()}>No</Button>
                                        </div>
                                    </div>
                                )}
                            </Popup>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={Expenses == undefined ? 0 : Expenses.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
    />
</Paper>


            <Button href='/AddExpense' variant="contained" color='primary'> Add Expense</Button>
         </>
    );
 }
 export default Expenses;






// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './PopupStyles.css';
// import axios from 'axios';
// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';
// import { Button } from '@mui/material';
// import Popup from 'reactjs-popup';

// import Navbar from '../Navbar';

// const Expenses = () => {
//     const navigate = useNavigate();

//     if (sessionStorage.getItem("user") == undefined) {
//         navigate("/")
//     }

//     const storedValue = JSON.parse(sessionStorage.getItem("user"))

//     console.log(storedValue)
//     const [Expenses, setExpenses] = useState([]);
//     // const [filteredUsers, setFilteredUsers] = useState([]);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const [searchText, setSearchText] = useState('');

//     useEffect(() => {
//         // Fetch users data from backend
//         axios.get(`http://localhost:8000/retriveExpense?email=${storedValue.email_add}`)
//             .then(response => {
//                 setExpenses(response.data.expenses);
//                 // setFilteredUsers(response.data.user_data); // Set filtered data to initial data
//             })
//             .catch(error => {
//                 console.error("No expenses added ", error);
//             });
//     }, []);

//     // Filter users based on search input
//     // useEffect(() => {
//     //     const filtered = users.filter(user =>
//     //         user.name.toLowerCase().includes(searchText.toLowerCase())
//     //     );
//     //     setFilteredUsers(filtered);
//     // }, [searchText, users]);

//     const submithandle = (expense, close) => {
//         console.log(expense)
//         axios.delete(`http://localhost:8000/deleteExpense?id=${expense.id}`)
//             .then(response => {
//                 // setExpenses(response.data.expenses);
//                 // setFilteredUsers(response.data.user_data); // Set filtered data to initial data
//                 if (response.data.message == "Deleted Successfully") {
//                     setExpenses(prevExpenses => prevExpenses.filter(item => item.id !== expense.id));

//                     // Close the popup
//                     close();
//                 }

//             })
//             .catch(error => {
//                 console.error("No expenses added ", error);
//             });
//     }

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(+event.target.value);
//         setPage(0);
//     };

//     return (
//         <>
//             <Navbar />

//             {/* Search bar */}
//             {/* <TextField
//                 label="Search by Name"
//                 variant="outlined"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 sx={{ margin: 2, width: '50%' }}
//             /> */}

//             <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//                 <TableContainer sx={{ maxHeight: 440 }}>
//                     <Table stickyHeader aria-label="users table">
//                         <TableHead>
//                             <TableRow>
//                                 {/* <TableCell align="center">ID</TableCell> */}
//                                 <TableCell align="center">Name</TableCell>
//                                 <TableCell align="center">Amount</TableCell>
//                                 <TableCell align="center">Date</TableCell>
//                                 <TableCell align="center">Location</TableCell>
//                                 <TableCell align="center">Edit Expense</TableCell>
//                                 <TableCell align='center'>Delete Expense</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {Expenses == undefined ? "No Expenses Found" : Expenses.map((user) => (
//                                 <TableRow hover key={user.id}>
//                                     {/* <TableCell align="center">{user.id}</TableCell> */}
//                                     <TableCell align="center">{user.name}</TableCell>
//                                     <TableCell align="center">{user.amount}</TableCell>
//                                     <TableCell align="center">{user.date}</TableCell>
//                                     <TableCell align="center">{user.location}</TableCell>
//                                     {/* <TableCell align="center">{user.role}</TableCell>*/}
//                                     <TableCell align="center">
//                                         <Button
//                                         variant="contained"
//                                             color="primary"
//                                             onClick={() => navigate('/EditExpense', { state: { ...user, userid: storedValue.id, id: user.id } })}
//                                         >
//                                             Edit
//                                         </Button>
//                                     </TableCell>
//                                     <TableCell align='center'>
//                                         <Popup trigger={<Button variant="contained" color='error'>Delete

//                                         </Button>}
//                                             modal nested className="custom-popup" 
//                                             overlayStyle={{ 
//                                                 backgroundColor: "rgba(200, 200, 200, 0.6)",
//                                                 display: "flex",
//                                                 alignItems: "center",
//                                                 justifyContent: "center",
//                                             }}
//                                             contentStyle={{
//                                                 width: "300px",
//                                                 padding: "20px",
//                                                 borderRadius: "10px",
//                                                 backgroundColor: "#fff",
//                                                 boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
//                                             }}>
//                                             {close => (
//                                                 <div>
//                                                     <div>Are you sure you want to delete this expense?</div>
//                                                     <div>
//                                                         <Button
//                                                             onClick={() => submithandle(user, close)}  // Wrap in an anonymous function
//                                                             color='error'
//                                                         >
//                                                             Yes
//                                                         </Button>
//                                                         <Button
//                                                             color='success'
//                                                             onClick={() => close()}
//                                                         >
//                                                             No
//                                                         </Button>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </Popup>

//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//                 <TablePagination
//                     rowsPerPageOptions={[10, 25, 100]}
//                     component="div"
//                     count={Expenses == undefined ? 0 : Expenses.length}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                 />
//             </Paper>

//             <Button href='/AddExpense' variant="contained" color='primary'> Add Expense</Button>
//         </>
//     );
// }

// export default Expenses;
