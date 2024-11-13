import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Button } from '@mui/material';

const UserDetail = () => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const session = JSON.parse(sessionStorage.getItem("user"));
    
    useEffect(() => {
        if (!session) {
            navigate("/");
        } else {
            axios.get(`http://localhost:8001/finduser?email=${session.email_add}`)
                .then(response => {
                    setUser(response.data.user_data);
                })
                .catch(error => {
                    console.error("Error fetching user details: ", error);
                });
        }
    }, [navigate]);

    return (
        <>
            <Navbar />
            <Box sx={{ p: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column' }}>
                <Box sx={{
                    maxWidth: 400,
                    width: '100%',
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    mb: 2  // Adds bottom margin to separate the button from the card
                }}>
                    <Typography
                        variant="h4"
                        gutterBottom
                        textAlign="center"
                        sx={{ color: '#0D47A1' }} // Dark blue color for the heading
                    >
                        User Details
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="Name"
                                secondary={user.name || session.name}
                                primaryTypographyProps={{ sx: { color: '#1565C0', fontWeight: 'bold' } }} // Darker blue for list item labels
                                secondaryTypographyProps={{ sx: { color: 'black' } }} // Darkest blue for the text
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Email ID"
                                secondary={user.email_add || session.email_add}
                                primaryTypographyProps={{ sx: { color: '#1565C0', fontWeight: 'bold' } }} // Darker blue for list item labels
                                secondaryTypographyProps={{ sx: { color: 'black' } }} // Darkest blue for the text
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Mobile Number"
                                secondary={user.mobile_no || "N/A"}
                                primaryTypographyProps={{ sx: { color: '#1565C0', fontWeight: 'bold' } }}
                                secondaryTypographyProps={{ sx: { color: 'black' } }}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Username"
                                secondary={user.username || "N/A"}
                                primaryTypographyProps={{ sx: { color: '#1565C0', fontWeight: 'bold' } }}
                                secondaryTypographyProps={{ sx: { color: 'black' } }}
                            />
                        </ListItem>
                    </List>
                </Box>
                <Button 
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/editUser', { state: { ...user } })}
                >
                    Edit User Details
                </Button>
            </Box>
        </>
    );
}

export default UserDetail;



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

// const UserDetail = () => {
//     const [user, setUser] = useState({});
//     const navigate = useNavigate();
//     const session = JSON.parse(sessionStorage.getItem("user"));
    
//     useEffect(() => {
//         if (!session) {
//             navigate("/");
//         } else {
//             axios.get(`http://localhost:8000/finduser?email=${session.email_add}`)
//                 .then(response => {
//                     setUser(response.data.user_data);
//                 })
//                 .catch(error => {
//                     console.error("Error fetching user details: ", error);
//                 });
//         }
//     }, [navigate]);

//     return (
//         <>
//             <Navbar />
//             <Box sx={{ p: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
//                 <Box sx={{
//                     maxWidth: 400,
//                     width: '100%',
//                     p: 3,
//                     boxShadow: 3,
//                     borderRadius: 2,
//                     bgcolor: 'background.paper'
//                 }}>
//                     <Typography
//                         variant="h4"
//                         gutterBottom
//                         textAlign="center"
//                         sx={{ color: '#0D47A1' }} // Dark blue color for the heading
//                     >
//                         User Details
//                     </Typography>
//                     <List>
//                     <ListItem>
//                             <ListItemText
//                                 primary="Name"
//                                 secondary={user.name || session.name}
//                                 primaryTypographyProps={{ sx: { color: '#1565C0', fontWeight: 'bold' } }} // Darker blue for list item labels
//                                 secondaryTypographyProps={{ sx: { color: '#black' } }} // Darkest blue for the text
//                             />
//                         </ListItem>
//                         <ListItem>
//                             <ListItemText
//                                 primary="Email ID"
//                                 secondary={user.email_add || session.email_add}
//                                 primaryTypographyProps={{ sx: { color: '#1565C0', fontWeight: 'bold' } }} // Darker blue for list item labels
//                                 secondaryTypographyProps={{ sx: { color: '#black' } }} // Darkest blue for the text
//                             />
//                         </ListItem>
//                         <ListItem>
//                             <ListItemText
//                                 primary="Mobile Number"
//                                 secondary={user.mobile_no || "N/A"}
//                                 primaryTypographyProps={{ sx: { color: '#1565C0', fontWeight: 'bold' } }}
//                                 secondaryTypographyProps={{ sx: { color: '#black' } }}
//                             />
//                         </ListItem>
//                         <ListItem>
//                             <ListItemText
//                                 primary="Username"
//                                 secondary={user.username || "N/A"}
//                                 primaryTypographyProps={{ sx: { color: '#1565C0', fontWeight: 'bold' } }}
//                                 secondaryTypographyProps={{ sx: { color: 'black' } }}
//                             />
//                         </ListItem>
//                     </List>
//                 </Box>
//             </Box>
//             <Button variant="contained"
//                                 color="primary"
//                                 onClick={() => navigate('/editUser', { state: { ...user} })}
//                             >
//                 Edit User Deatils
//             </Button>
//         </>
//     );
// }

// export default UserDetail;
