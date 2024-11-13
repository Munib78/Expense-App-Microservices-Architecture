import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AdminNavbar from './AdminNavbar';

const UsersExpense = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(7);

    useEffect(() => {
        axios.get(`http://localhost:8002/retriveExpense?email=${email}`)
            .then(response => {
                setExpenses(response.data.expenses);
            })
            .catch(error => {
                console.error("There was an error fetching the expenses!", error);
                setError("No expenses added");
            });
    }, [email]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    if (error) return <Typography variant="h6" color="error" align="center">{error}</Typography>;

    return (
        <>
            <AdminNavbar />
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.06)', borderRadius: 2 }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="expenses table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Name</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Amount</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Date</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Location</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {expenses == undefined ? "No Expensees Added": expenses.length > 0 ? (
                                    expenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((expense) => (
                                        <TableRow hover key={expense.name} sx={{ backgroundColor: '#F4FAFF' }}>
                                            <TableCell align="center" sx={{ color: "#455A64" }}>{expense.name}</TableCell>
                                            <TableCell align="center" sx={{ color: "#455A64" }}>{expense.amount}</TableCell>
                                            <TableCell align="center" sx={{ color: "#455A64" }}>{expense.date}</TableCell>
                                            <TableCell align="center" sx={{ color: "#455A64" }}>{expense.location}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ color: "#455A64" }}>No Expenses Added</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[7, 25, 100]}
                        component="div"
                        count={expenses == undefined ? 0 : expenses.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
        </>
    );
};

export default UsersExpense;


// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import AdminNavbar from './AdminNavbar';

// const UsersExpense = () => {
//     const { email } = useParams(); // Get the email from route params
//     const [expenses, setExpenses] = useState([]);
//     // const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         // Fetch expenses based on the email
//         // /retriveExpense?email=bcd@gmail.com
//         axios.get(`http://localhost:8000/retriveExpense?email=${ email }`)
//             .then(response => {
//                 setExpenses(response.data.expenses);
//             })
//             .catch(error => {
//                 console.error("There was an error fetching the expenses!", error);
//                 setError("No expenses added");
//             })

//     }, [email]);

//     // if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;

//     return (
//         <>
//             <AdminNavbar />
//             <TableContainer component={Paper}>
//                 <Table sx={{ minWidth: 650 }} aria-label="simple table">
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>Name</TableCell>
//                             <TableCell align="right">Amount</TableCell>
//                             <TableCell align="right">Date</TableCell>
//                             <TableCell align="right">Location</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {expenses == undefined ? "No Expenses Added"  : expenses.map((expense) => (
//                             <TableRow
//                                 key={expense.name}
//                                 sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//                             >
//                                 <TableCell component="th" scope="row">
//                                     {expense.name}
//                                 </TableCell>
//                                 <TableCell align="right">{expense.amount}</TableCell>
//                                 <TableCell align="right">{expense.date}</TableCell>
//                                 <TableCell align="right">{expense.location}</TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </>
//     );
// }

// export default UsersExpense;
