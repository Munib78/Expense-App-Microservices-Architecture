import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { Button } from '@mui/material';
import Popup from 'reactjs-popup';
import AdminNavbar from './AdminNavbar';

const Users = () => {
    const navigate = useNavigate();

    if (sessionStorage.getItem("user") === undefined) {
        navigate("/");
    }

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(7);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8001/getusers')
            .then(response => {
                setUsers(response.data.user_data);
                setFilteredUsers(response.data.user_data);
            })
            .catch(error => {
                console.error("There was an error fetching the users data!", error);
            });
    }, []);

    useEffect(() => {
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchText, users]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const submithandle = (user, close) => {
        axios.delete(`http://localhost:8001/deleteUser?email=${user.email_add}`)
            .then(response => {
                if (response.data.message === "User deleted successfully") {
                    setUsers(prevUsers => prevUsers.filter(item => item.id !== user.id));
                    close();
                }
            })
            .catch(error => {
                console.error("No expenses added ", error);
            });
    };

    return (
        <>
            <AdminNavbar />

            {/* Search bar */}
            <TextField
                label="Search by Name"
                variant="outlined"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{
                    margin: 2,
                    width: '50%',
                    backgroundColor: 'white', // Set background color to white
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#ccc', // Light border color
                        },
                        '&:hover fieldset': {
                            borderColor: '#1976d2', // Primary color on hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#1976d2', // Primary color when focused
                        },
                    },
                }}
            />

            <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.06)', borderRadius: 2 }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="users table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>ID</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Name</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Email</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Mobile No</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Username</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Role</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>View Expense</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Delete User</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                                <TableRow hover key={user.id} sx={{ backgroundColor: '#F4FAFF' }}>
                                    <TableCell align="center">{user.id}</TableCell>
                                    <TableCell align="center">{user.name}</TableCell>
                                    <TableCell align="center">{user.email_add}</TableCell>
                                    <TableCell align="center">{user.mobile_no}</TableCell>
                                    <TableCell align="center">{user.user_name}</TableCell>
                                    <TableCell align="center">{user.role}</TableCell>
                                    <TableCell align="center"  variant="contained">
                                        <Button  onClick={() => navigate(`/UserExpense/${user.id}`)}  
                                        variant="contained"
                                        color="primary">
                                            Expense
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Popup trigger={<Button color="error" variant="contained">Delete</Button>} modal nested
                                            overlayStyle={{
                                                backgroundColor: "rgba(200, 200, 200, 0.6)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                            contentStyle={{
                                                width: "300px",
                                                padding: "20px",
                                                borderRadius: "10px",
                                                backgroundColor: "#fff",
                                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
                                            }}
                                        >
                                            {close => (
                                                <div>
                                                    <div>Are you sure you want to delete this user?</div>
                                                    <div>
                                                        <Button
                                                            onClick={() => submithandle(user, close)}
                                                            color="error"
                                                            variant="contained"
                                                            sx={{ marginRight: 1 }}
                                                        >
                                                            Yes
                                                        </Button>
                                                        <Button
                                                            color="success"
                                                            variant="contained"
                                                            onClick={() => close()}
                                                        >
                                                            No
                                                        </Button>
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
                    rowsPerPageOptions={[7, 25, 100]}
                    component="div"
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </>
    );
}

export default Users;






// import React, { useEffect, useState } from 'react';
// import { Link,useNavigate } from 'react-router-dom';
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
// import { Button } from '@mui/material';
// import Popup from 'reactjs-popup';

// import AdminNavbar from './AdminNavbar';

// const Users = () => {
//     const navigate = useNavigate();
    
//     if(sessionStorage.getItem("user") == undefined)
//         {
//             navigate("/")
//         }
//     const [users, setUsers] = useState([]);
//     const [filteredUsers, setFilteredUsers] = useState([]);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(7);
//     const [searchText, setSearchText] = useState('');

//     useEffect(() => {
//         // Fetch users data from backend
//         axios.get('http://localhost:8000/getusers')
//             .then(response => {
//                 setUsers(response.data.user_data);
//                 setFilteredUsers(response.data.user_data); // Set filtered data to initial data
//             })
//             .catch(error => {
//                 console.error("There was an error fetching the users data!", error);
//             });
//     }, []);

//     // Filter users based on search input
//     useEffect(() => {
//         const filtered = users.filter(user =>
//             user.name.toLowerCase().includes(searchText.toLowerCase())
//         );
//         setFilteredUsers(filtered);
//     }, [searchText, users]);

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(+event.target.value);
//         setPage(0);
//     };

//     const submithandle = (expense, close) => {
//         console.log(expense)
//         axios.delete(`http://localhost:8000/deleteUser?email=${expense.email_add}`)
//             .then(response => {
//                 // setExpenses(response.data.expenses);
//                 // setFilteredUsers(response.data.user_data); // Set filtered data to initial data
//                 if (response.data.message == "User deleted successfully") {
//                     setUsers(prevExpenses => prevExpenses.filter(item => item.id !== expense.id));

//                     // Close the popup
//                     close();
//                 }

//             })
//             .catch(error => {
//                 console.error("No expenses added ", error);
//             });
//     }

//     return (
//         <>
//             <AdminNavbar />
            
//             {/* Search bar */}
//             <TextField
//                 label="Search by Name"
//                 variant="outlined"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 sx={{ margin: 2, width: '50%' }}
//             />

//             <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//                 <TableContainer sx={{ maxHeight: 440 }}>
//                     <Table stickyHeader aria-label="users table">
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell align="center">ID</TableCell>
//                                 <TableCell align="center">Name</TableCell>
//                                 <TableCell align="center">Email</TableCell>
//                                 <TableCell align="center">Mobile No</TableCell>
//                                 <TableCell align="center">Username</TableCell>
//                                 <TableCell align="center">Role</TableCell>
//                                 <TableCell align='center'>View Expense</TableCell>
//                                 <TableCell align='center'>Delete User</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {filteredUsers
//                                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                                 .map((user) => (
//                                     <TableRow hover key={user.id}>
//                                         <TableCell align="center">{user.id}</TableCell>
//                                         <TableCell align="center">{user.name}</TableCell>
//                                         <TableCell align="center">{user.email_add}</TableCell>
//                                         <TableCell align="center">{user.mobile_no}</TableCell>
//                                         <TableCell align="center">{user.user_name}</TableCell>
//                                         <TableCell align="center">{user.role}</TableCell>
//                                         <TableCell align="center">
//                     <Link to={`/UserExpense/${user.email_add}`} style={{ textDecoration: 'none', color: 'blue' }}>
//                         Expense
//                     </Link>
//                 </TableCell>
//                 <TableCell align='center'>
//                                         <Popup trigger={<Button color='error'>Delete

//                                         </Button>}
//                                             modal nested className="modal"
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
//                                             }}
//                                         >
//                                             {close => (
//                                                 <div>
//                                                     <div>Are you sure you want to delete this expense?</div>
//                                                     <div>
//                                                         <Button
//                                                             onClick={() => submithandle(user, close)}  // Wrap in an anonymous function
//                                                             color='error'
//                                                             variant="contained"
//                                                         >
//                                                             Yes
//                                                         </Button>
//                                                         <Button
//                                                             color='success'
//                                                             variant="contained"
//                                                             onClick={() => close()}
//                                                         >
//                                                             No
//                                                         </Button>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </Popup>

//                                     </TableCell>
//                                     </TableRow>
//                                 ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//                 <TablePagination
//                     rowsPerPageOptions={[7, 25, 100]}
//                     component="div"
//                     count={filteredUsers.length}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                 />
//             </Paper>
//         </>
//     );
// }

// export default Users;
