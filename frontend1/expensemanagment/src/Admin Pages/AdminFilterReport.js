import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { alpha, Box } from '@mui/material';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import { useTheme } from '@mui/material/styles';
import AdminNavbar from './AdminNavbar';

const AdminFilterReport = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    if (sessionStorage.getItem("user") === undefined) {
        navigate("/");
    }

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(7);
    const [error, setError] = useState("");
    const [searchname, setSearchName] = useState("");
    const [searchexpname, setSearchExpName] = useState("");
    const [searchamount, setSearchAmount] = useState("");
    const [searchlocation, setSearchLocation] = useState("");
    const [searchstartDate, setSearchStartDate] = useState("");
    const [searchendDate, setSearchEndDate] = useState("");

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setUsers([])
            axios.get('http://localhost:8002/adminFilterReport', {
                params: {
                    "user": searchname,
                    "exp_name": searchexpname,
                    "amount": searchamount,
                    "location": searchlocation,
                    "start_date": searchstartDate,
                    "end_date": searchendDate
                }
            })
            .then(response => {
                setUsers(response.data.filtered_data);
                console.log(response.data.filtered_data)
                setError(""); // Clear error if the request is successful
            })
            .catch(error => {
                setError("No expenses found"); // Set error message
                console.error("There was an error fetching the expense data!", error);
            });
        }, 1000); 

        return () => clearTimeout(delayDebounceFn); 
    }, [searchname, searchlocation, searchamount, searchexpname, searchstartDate, searchendDate]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            <AdminNavbar />
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
                    <FormLabel sx={{ fontWeight: 'bold' }}>User</FormLabel>
                    <TextField
                        type='text'
                        label="Search by Name"
                        variant="outlined"
                        value={searchname}
                        onChange={(e) => setSearchName(e.target.value)}
                        sx={{ backgroundColor: 'white' }}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
                    <FormLabel sx={{ fontWeight: 'bold' }}>Expense Name</FormLabel>
                    <TextField
                        type='text'
                        label="Search by Expense Name"
                        variant="outlined"
                        value={searchexpname}
                        onChange={(e) => setSearchExpName(e.target.value)}
                        sx={{ backgroundColor: 'white' }}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
                    <FormLabel sx={{ fontWeight: 'bold' }}>Amount</FormLabel>
                    <TextField
                        type='number'
                        label="Search by Amount"
                        variant="outlined"
                        value={searchamount}
                        onChange={(e) => setSearchAmount(e.target.value)}
                        sx={{ backgroundColor: 'white' }}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
                    <FormLabel sx={{ fontWeight: 'bold' }}>Location</FormLabel>
                    <TextField
                        type='text'
                        label="Search by Location"
                        variant="outlined"
                        value={searchlocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        sx={{ backgroundColor: 'white' }}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
                    <FormLabel sx={{ fontWeight: 'bold' }}>Start Date</FormLabel>
                    <TextField
                        type='date'
                        variant="outlined"
                        value={searchstartDate}
                        onChange={(e) => setSearchStartDate(e.target.value)}
                        sx={{ backgroundColor: 'white' }}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
                    <FormLabel sx={{ fontWeight: 'bold' }}>End Date</FormLabel>
                    <TextField
                        type='date'
                        variant="outlined"
                        value={searchendDate}
                        onChange={(e) => setSearchEndDate(e.target.value)}
                        sx={{ backgroundColor: 'white' }}
                    />
                </Box>
            </Box>

            <Paper sx={{ width: '100%', overflow: 'hidden', backgroundColor: alpha(theme.palette.primary.light, 0.07), boxShadow: theme.shadows[3] }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="Filtered User Data">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>User Name</TableCell>
                                <TableCell align="center" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Expense Name</TableCell>
                                <TableCell align="center" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Amount</TableCell>
                                <TableCell align="center" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Date</TableCell>
                                <TableCell align="center" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Location</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {error ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">{error}</TableCell>
                                </TableRow>
                            ) : users.length > 0 ? (
                                users.map((user, index) => (
                                    <TableRow hover key={user.name}>
                                        <TableCell align="center">{user.name}</TableCell>
                                        <TableCell align="center">{user.expname}</TableCell>
                                        <TableCell align="center">{user.amount}</TableCell>
                                        <TableCell align="center">{user.date}</TableCell>
                                        <TableCell align="center">{user.location}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">No data available</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={users.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </>
    );
}

export default AdminFilterReport;


// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { alpha } from '@mui/material';
// import axios from 'axios';
// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';
// import TextField from '@mui/material/TextField';
// import FormLabel from '@mui/material/FormLabel';
// import { useTheme } from '@mui/material/styles';
// import AdminNavbar from './AdminNavbar';

// const AdminFilterReport = () => {
//     const navigate = useNavigate();
//     const theme = useTheme();

//     if (sessionStorage.getItem("user") === undefined) {
//         navigate("/");
//     }

//     console.log(sessionStorage.getItem("user"))

//     const [users, setUsers] = useState([]);
//     // const [filteredUsers, setFilteredUsers] = useState([]);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(7);

//     const [error, setError] = useState("")
//     const [searchname, setSearchName] = useState("");
//     const [searchexpname, setSearchExpName] = useState("");
//     const [searchamount, setSearchAmount] = useState("");
//     const [searchlocation, setSearchLocation] = useState("");
//     const [searchstartDate, setSearchStartDate] = useState("");
//     const [searchendDate, setSearchEndDate] = useState("");

//     console.log({
//         "user": searchname,
//         "exp_name": searchexpname,
//         "amount": searchamount,
//         "location": searchlocation
//     })

//     useEffect(() => {
//         const delayDebounceFn = setTimeout(() => {
//             axios.get('http://localhost:8000/adminFilterReport', {
//                 params: {
//                     "user": searchname,
//                     "exp_name": searchexpname,
//                     "amount": searchamount,
//                     "location": searchlocation,
//                     "start_date": searchstartDate,
//                     "end_date": searchendDate
//                 }
//             })
//             .then(response => {
//                 setUsers(response.data.filtered_data);
//                 setError("");
//             })
//             .catch(error => {
//                 setError("No expenses found")
//                 console.error("There was an error fetching the expense data!", error);
//             });
//         }, 1000); 

//         return () => clearTimeout(delayDebounceFn); 
//     }, [searchname, searchlocation, searchamount, searchexpname, searchstartDate, searchendDate]);

    
//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(+event.target.value);
//         setPage(0);
//     };

//     return (
//         <>
//             <AdminNavbar />

//             <FormLabel>User</FormLabel>
//             <TextField
//                 type='text'
//                 label="Search by Name"
//                 variant="outlined"
//                 value={searchname}
//                 onChange={(e) => setSearchName(e.target.value)}
//                 sx={{
//                     margin: 2,
//                     width: '20%',
//                     backgroundColor: 'white', // Set background color to white
//                     '& .MuiOutlinedInput-root': {
//                         '& fieldset': {
//                             borderColor: '#ccc', // Light border color
//                         },
//                         '&:hover fieldset': {
//                             borderColor: '#1976d2', // Primary color on hover
//                         },
//                         '&.Mui-focused fieldset': {
//                             borderColor: '#1976d2', // Primary color when focused
//                         },
//                     },
//                 }}
//             />

//             <FormLabel>Expense Name</FormLabel>
//             <TextField
//                 type='text'
//                 label="Search by Expense Name"
//                 variant="outlined"
//                 value={searchexpname}
//                 onChange={(e) => setSearchExpName(e.target.value)}
//                 sx={{
//                     margin: 2,
//                     width: '20%',
//                     backgroundColor: 'white', // Set background color to white
//                     '& .MuiOutlinedInput-root': {
//                         '& fieldset': {
//                             borderColor: '#ccc', // Light border color
//                         },
//                         '&:hover fieldset': {
//                             borderColor: '#1976d2', // Primary color on hover
//                         },
//                         '&.Mui-focused fieldset': {
//                             borderColor: '#1976d2', // Primary color when focused
//                         },
//                     },
//                 }}
//             />

//             <FormLabel>Amount</FormLabel>
//             <TextField
//                 type='number'
//                 label="Search by Amount"
//                 variant="outlined"
//                 value={searchamount}
//                 onChange={(e) => setSearchAmount(e.target.value)}
//                 sx={{
//                     margin: 2,
//                     width: '20%',
//                     backgroundColor: 'white', // Set background color to white
//                     '& .MuiOutlinedInput-root': {
//                         '& fieldset': {
//                             borderColor: '#ccc', // Light border color
//                         },
//                         '&:hover fieldset': {
//                             borderColor: '#1976d2', // Primary color on hover
//                         },
//                         '&.Mui-focused fieldset': {
//                             borderColor: '#1976d2', // Primary color when focused
//                         },
//                     },
//                 }}
//             />

//             <FormLabel>Location</FormLabel>
//             <TextField
//                 type='text'
//                 label="Search by Location"
//                 variant="outlined"
//                 value={searchlocation}
//                 onChange={(e) => setSearchLocation(e.target.value)}
//                 sx={{
//                     margin: 2,
//                     width: '20%',
//                     backgroundColor: 'white', // Set background color to white
//                     '& .MuiOutlinedInput-root': {
//                         '& fieldset': {
//                             borderColor: '#ccc', // Light border color
//                         },
//                         '&:hover fieldset': {
//                             borderColor: '#1976d2', // Primary color on hover
//                         },
//                         '&.Mui-focused fieldset': {
//                             borderColor: '#1976d2', // Primary color when focused
//                         },
//                     },
//                 }}
//             />

//             <FormLabel>Start Date</FormLabel>
//             <TextField
//                 type='date'
//                 label="Search by start Date"
//                 variant="outlined"
//                 value={searchstartDate}
//                 onChange={(e) => setSearchStartDate(e.target.value)}
//                 sx={{
//                     margin: 2,
//                     width: '20%',
//                     backgroundColor: 'white', // Set background color to white
//                     '& .MuiOutlinedInput-root': {
//                         '& fieldset': {
//                             borderColor: '#ccc', // Light border color
//                         },
//                         '&:hover fieldset': {
//                             borderColor: '#1976d2', // Primary color on hover
//                         },
//                         '&.Mui-focused fieldset': {
//                             borderColor: '#1976d2', // Primary color when focused
//                         },
//                     },
//                 }}
//             />

//             <FormLabel>End Date</FormLabel>
//             <TextField
//                 type='date'
//                 label="Search by End Date"
//                 variant="outlined"
//                 value={searchendDate}
//                 onChange={(e) => setSearchEndDate(e.target.value)}
//                 sx={{
//                     margin: 2,
//                     width: '20%',
//                     backgroundColor: 'white', // Set background color to white
//                     '& .MuiOutlinedInput-root': {
//                         '& fieldset': {
//                             borderColor: '#ccc', // Light border color
//                         },
//                         '&:hover fieldset': {
//                             borderColor: '#1976d2', // Primary color on hover
//                         },
//                         '&.Mui-focused fieldset': {
//                             borderColor: '#1976d2', // Primary color when focused
//                         },
//                     },
//                 }}
//             />

//             <Paper
//                 sx={{
//                     width: '100%',
//                     overflow: 'hidden',
//                     backgroundColor: alpha(theme.palette.primary.light, 0.07),  // Lighter background color
//                     boxShadow: theme.shadows[3]
//                 }}
//             >
//                 <TableContainer sx={{ maxHeight: 440 }}>
//                     <Table stickyHeader aria-label="Filtered User Data">
//                         <TableHead>
//                             <TableRow>
//                             <TableCell align="center" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>User Name</TableCell>
//                                 <TableCell align="center" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Name</TableCell>
//                                 <TableCell align="center" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Amount</TableCell>
//                                 <TableCell align="center" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Date</TableCell>
//                                 <TableCell align="center" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Location</TableCell>
//                                 {/* <TableCell align="center" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Edit Expense</TableCell>
//                                 <TableCell align="center" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Delete Expense</TableCell> */}
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {error ? ( // Check if there's an error
//                                 <TableRow>
//                                     <TableCell colSpan={5} align="center">{error}</TableCell>
//                                 </TableRow>
//                             ) : users.length > 0 ? (
//                                 users.map((user, index) => (
//                                     <TableRow
//                                         hover
//                                         key={user.name}
//                                         sx={{
//                                             backgroundColor: index === 0 ? alpha(theme.palette.primary.light, 0.07) : 'inherit',
//                                             color: index === 0 ? 'black' : 'inherit',
//                                             '&:nth-of-type(even)': { backgroundColor: theme.palette.action.hover }
//                                         }}
//                                     >
//                                         <TableCell align="center" sx={{ color: index === 0 ? 'black' : 'inherit' }}>{user.name}</TableCell>
//                                         <TableCell align="center" sx={{ color: index === 0 ? 'black' : 'inherit' }}>{user.expname}</TableCell>
//                                         <TableCell align="center" sx={{ color: index === 0 ? 'black' : 'inherit' }}>{user.amount}</TableCell>
//                                         <TableCell align="center" sx={{ color: index === 0 ? 'black' : 'inherit' }}>{user.date}</TableCell>
//                                         <TableCell align="center" sx={{ color: index === 0 ? 'black' : 'inherit' }}>{user.location}</TableCell>
//                                     </TableRow>
//                                 ))
//                             ) : (
//                                 <TableRow>
//                                     <TableCell colSpan={5} align="center">No data available</TableCell>
//                                 </TableRow>
//                             )}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//                 <TablePagination
//                     rowsPerPageOptions={[10, 25, 100]}
//                     component="div"
//                     count={users == undefined ? 0 : users.length}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                 />
//             </Paper>

//         </>
//     );
// }

// export default AdminFilterReport;
