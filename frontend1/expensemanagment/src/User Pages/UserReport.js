import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const UserReport = () => {
    const [user, setUser] = useState({});
    const [error, setError] = useState("")
    const navigate = useNavigate();
    const session = JSON.parse(sessionStorage.getItem("user"));

    const handleClick = () => { navigate("/userFilterReport") }

    useEffect(() => {
        if (!session) {
            navigate("/");
        } else {
            axios.get(`http://localhost:8002/userReportExpense?email=${session.id}`)
                .then(response => {
                    setUser(response.data.user_exp);
                    console.log(response.data.user_exp)
                })
                .catch(error => {
                    console.error("Error fetching user details: ", error);
                    setError("No expense Found")
                });
        }
    }, [navigate]);

    return (
        <>
            <Navbar />
            <Box sx={{ p: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column' }}>
                { error != "" ? error : <Box 
                    onClick={handleClick}
                    sx={{
                        maxWidth: 600,
                        width: '100%',
                        p: 3,
                        boxShadow: 3,
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        mb: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        textAlign="center"
                        sx={{ color: '#0D47A1', fontWeight: 'bold' }}
                    >
                        Current Month Report
                    </Typography>
                    <List sx={{ width: '100%' }}>
                        <ListItem>
                            <ListItemText
                                primary="Total Expense"
                                secondary={<><strong>₹</strong> <strong>{user.total_exp}</strong></>}
                                primaryTypographyProps={{ sx: { color: '#1565C0', fontWeight: 'bold' } }}
                                secondaryTypographyProps={{ sx: { color: 'black', fontWeight: 'bold', fontSize: '1.2rem' } }}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Average Expense"
                                secondary={<><strong>₹</strong> <strong>{user.avg_exp}</strong></>}
                                primaryTypographyProps={{ sx: { color: '#1565C0', fontWeight: 'bold' } }}
                                secondaryTypographyProps={{ sx: { color: 'black', fontWeight: 'bold', fontSize: '1.2rem' } }}
                            />
                        </ListItem>
                    </List>
                </Box>}
            </Box>
        </>
    );
}

export default UserReport;




// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../Navbar';
// import axios from 'axios';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
// import { Button } from '@mui/material';

// const UserReport = () => {
//     const [user, setUser] = useState({});
//     const navigate = useNavigate();
//     const session = JSON.parse(sessionStorage.getItem("user"));
        
//     const handleClick = () => { navigate("/userFilterReport")}

//     useEffect(() => {
//         if (!session) {
//             navigate("/");
//         } else {
//             axios.get(`http://localhost:8000/userReport?email=${session.email_add}`)
//                 .then(response => {
//                     setUser(response.data.user_exp);
//                 })
//                 .catch(error => {
//                     console.error("Error fetching user details: ", error);
//                 });
//         }
//     }, [navigate]);

//     console.log(user)

//     return (
//         <>
//             <Navbar />
//             <Box sx={{ p: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column' }}>
//                 <Box 
//                     onClick={handleClick}

//                     sx={{
//                     maxWidth: 400,
//                     width: '100%',
//                     p: 3,
//                     boxShadow: 3,
//                     borderRadius: 2,
//                     bgcolor: 'background.paper',
//                     mb: 2  // Adds bottom margin to separate the button from the card
//                 }}>
//                     <Typography
//                         variant="h4"
//                         gutterBottom
//                         textAlign="center"
//                         sx={{ color: '#0D47A1' }} // Dark blue color for the heading
//                     >
//                         Current Month Report
//                     </Typography>
//                     <List>
//                         <ListItem>
//                             <ListItemText
//                                 primary="Total Expense"
//                                 secondary={user.total_exp}
//                                 primaryTypographyProps={{ sx: { color: '#1565C0', fontWeight: 'bold' } }} // Darker blue for list item labels
//                                 secondaryTypographyProps={{ sx: { color: 'black' } }} // Darkest blue for the text
//                             />
//                         </ListItem>
//                         <ListItem>
//                             <ListItemText
//                                 primary="Average Expense"
//                                 secondary={user.avg_exp}
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

// export default UserReport;
