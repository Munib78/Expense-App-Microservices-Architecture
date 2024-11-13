import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const AdminReport = () => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const session = JSON.parse(sessionStorage.getItem("user"));
    
    useEffect(() => {
        if (!session) {
            navigate("/");
        } else {
            axios.get(`http://localhost:8002/adminReportExpense`)
                .then(response => {
                    setUser(response.data.user_data);
                })
                .catch(error => {
                    console.error("Error fetching user details: ", error);
                });
        }
    }, [navigate]);

    const handleClick = () => {
        navigate("/adminFilterReport");
    };

    return (
        <>
            <AdminNavbar />
            <Box 
                sx={{ 
                    p: 5, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '80vh', 
                    flexDirection: 'column' 
                }}
            >
                <Box 
                    onClick={handleClick} 
                    sx={{
                        maxWidth: 600,
                        width: '100%',
                        p: 3,
                        boxShadow: 3,
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        mb: 2,
                        cursor: 'pointer'
                    }}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        textAlign="center"
                        sx={{ color: '#0D47A1', fontWeight: 'bold' }}
                    >
                        User Report
                    </Typography>
                    <List sx={{ width: '100%' }}>
                        <ListItem>
                            <ListItemText
                                primary="Total Users"
                                secondary={<strong>{user.total_user}</strong>}
                                primaryTypographyProps={{ sx: { color: '#1565C0', fontWeight: 'bold' } }}
                                secondaryTypographyProps={{ sx: { color: 'black', fontWeight: 'bold', fontSize: '1.2rem' } }}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Current Month Expense"
                                secondary={<><strong>₹</strong> <strong>{user.total_exp}</strong></>}
                                primaryTypographyProps={{ sx: { color: '#1565C0', fontWeight: 'bold' } }}
                                secondaryTypographyProps={{ sx: { color: 'black', fontWeight: 'bold', fontSize: '1.2rem' } }}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Expense per User"
                                secondary={<><strong>₹</strong> <strong>{user.exp_per_user}</strong></>}
                                primaryTypographyProps={{ sx: { color: '#1565C0', fontWeight: 'bold' } }}
                                secondaryTypographyProps={{ sx: { color: 'black', fontWeight: 'bold', fontSize: '1.2rem' } }}
                            />
                        </ListItem>
                    </List>
                </Box>
            </Box>
        </>
    );
}

export default AdminReport;





// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AdminNavbar from './AdminNavbar';
// import axios from 'axios';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';

// const AdminReport = () => {
//     const [user, setUser] = useState({});
//     const navigate = useNavigate();
//     const session = JSON.parse(sessionStorage.getItem("user"));
    
//     useEffect(() => {
//         if (!session) {
//             navigate("/");
//         } else {
//             axios.get(`http://localhost:8000/adminReport`)
//                 .then(response => {
//                     setUser(response.data.user_data);
//                 })
//                 .catch(error => {
//                     console.error("Error fetching user details: ", error);
//                 });
//         }
//     }, [navigate]);

//     const handleClick = () => {
//         navigate("/adminFilterReport");
//     };

//     return (
//         <>
//             <AdminNavbar />
//             <Box 
//                 sx={{ 
//                     p: 5, 
//                     display: 'flex', 
//                     justifyContent: 'center', 
//                     alignItems: 'center', 
//                     minHeight: '80vh', 
//                     flexDirection: 'column' 
//                 }}
//             >
//                 <Box 
//                     onClick={handleClick} 
//                     sx={{
//                         maxWidth: 400,
//                         width: '100%',
//                         p: 3,
//                         boxShadow: 3,
//                         borderRadius: 2,
//                         bgcolor: 'background.paper',
//                         mb: 2, // Adds bottom margin to separate the button from the card
//                         cursor: 'pointer' // Changes cursor to pointer on hover
//                     }}
//                 >
//                     <Typography
//                         variant="h4"
//                         gutterBottom
//                         textAlign="center"
//                         sx={{ color: '#0D47A1' }} // Dark blue color for the heading
//                     >
//                         User Report
//                     </Typography>
//                     <List>
//                         <ListItem>
//                             <ListItemText
//                                 primary="Total Users"
//                                 secondary={user.total_user}
//                                 primaryTypographyProps={{ sx: { color: '#1565C0', fontWeight: 'bold' } }} // Darker blue for list item labels
//                                 secondaryTypographyProps={{ sx: { color: 'black' } }} // Darkest blue for the text
//                             />
//                         </ListItem>
//                         <ListItem>
//                             <ListItemText
//                                 primary="Current Month Expense"
//                                 secondary={user.total_exp}
//                                 primaryTypographyProps={{ sx: { color: '#1565C0', fontWeight: 'bold' } }} // Darker blue for list item labels
//                                 secondaryTypographyProps={{ sx: { color: 'black' } }} // Darkest blue for the text
//                             />
//                         </ListItem>
//                         <ListItem>
//                             <ListItemText
//                                 primary="Expense per User"
//                                 secondary={user.exp_per_user}
//                                 primaryTypographyProps={{ sx: { color: '#1565C0', fontWeight: 'bold' } }} // Darker blue for list item labels
//                                 secondaryTypographyProps={{ sx: { color: 'black' } }} // Darkest blue for the text
//                             />
//                         </ListItem>
//                     </List>
//                 </Box>
//             </Box>
//         </>
//     );
// }

// export default AdminReport;
