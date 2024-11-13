import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  function logout() {
    sessionStorage.setItem("user", undefined);
    navigate("/");
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: "#E3F2FD", boxShadow: "none" }}>
      <Toolbar>
        <Typography
          variant="h6"
          color="primary"
          sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
          component={Link}
          href="/home"
          underline="none"
        >
          Expense APP
        </Typography>

        {isSmallScreen && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/home" underline="none" color="text.primary">
              <Typography variant="body1" fontWeight="bold">Home</Typography>
            </Link>
            <Link href="/UserDetail" underline="none" color="text.primary">
              <Typography variant="body1" fontWeight="bold">UserDetails</Typography>
            </Link>
            <Link href="/Expenses" underline="none" color="text.primary">
              <Typography variant="body1" fontWeight="bold">Expenses</Typography>
            </Link>
            <Link href="/AddExpense" underline="none" color="text.primary">
              <Typography variant="body1" fontWeight="bold">Add Expense</Typography>
            </Link>
            <Link href="/userReport" underline="none" color="text.primary">
              <Typography variant="body1" fontWeight="bold">Report</Typography>
            </Link>
            <Link href="/UserGraphExpense" underline="none" color="text.primary">
              <Typography variant="body1" fontWeight="bold">Graph</Typography>
            </Link>

          </Box>
        )}

        {isLargeScreen && (
          <Button
            color="primary"
            onClick={logout}
            sx={{ fontWeight: 'bold', textTransform: 'none' }}
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}


// import React from 'react';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';
// import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
// import useMediaQuery from '@mui/material/useMediaQuery';
// import { useTheme } from '@mui/material/styles';
// // import AcmeLogo from './AcmeLogo.jsx';
// import { useNavigate } from 'react-router-dom';

// export default function Navbar() {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.up('sm'));
//   const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));


//     function logout()
//   {
//     sessionStorage.setItem("user", undefined);
//     navigate("/")
//   }
//   return (
//     <AppBar position="static" color="default">
//       <Toolbar>
//         {/* <IconButton edge="start" color="inherit" aria-label="logo" sx={{ mr: 2 }}>
//           <AcmeLogo />
//         </IconButton> */}
//         <Typography
//           variant="h6"
//           color="inherit"
//           sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
//           component={Link}
//           href="/home" // replace with your target route
//           underline="none"
//         >
//           Expense APP
//         </Typography>

        
//         {isSmallScreen && (
//           <Box sx={{ display: 'flex', gap: 2 }}>
//             <Link href="/home" underline="none" color="inherit">
//               <Typography variant="body1" fontWeight="bold">Home</Typography>
//             </Link>
//             <Link href="/UserDetail" underline="none" color="inherit" aria-current="page">
//               <Typography variant="body1" fontWeight="bold">UserDetails</Typography>
//             </Link>
//             <Link href="/Expenses" underline="none" color="inherit">
//               <Typography variant="body1" fontWeight="bold">Expenses</Typography>
//             </Link>
//             <Link href="/AddExpense" underline="none" color="inherit">
//               <Typography variant="body1" fontWeight="bold">Add Expense</Typography>
//             </Link>
//           </Box>
//         )}

//         {isLargeScreen && (
//           <Button color="inherit" onClick={logout} sx={{ color: 'text.primary', fontWeight: 'bold' }}>
//             Logout
//           </Button>
//         )}
//         {/* <Button color="primary" variant="contained" href="#">
//           Sign Up
//         </Button> */}
//       </Toolbar>
//     </AppBar>
//   );
// }


