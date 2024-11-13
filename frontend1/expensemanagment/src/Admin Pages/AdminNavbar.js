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
        {/* App Title */}
        <Typography
          variant="h6"
          color="primary"
          sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
          component={Link}
          href="/AdminHome"
          underline="none"
        >
          Expense APP
        </Typography>

        {/* Navigation Links for Small Screens */}
        {isSmallScreen && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/AdminHome" underline="none" color="text.primary">
              <Typography variant="body1" fontWeight="bold">Home</Typography>
            </Link>
            <Link href="/Users" underline="none" color="text.primary">
              <Typography variant="body1" fontWeight="bold">Users</Typography>
            </Link>
            <Link href="/adminReport" underline="none" color="text.primary">
              <Typography variant="body1" fontWeight="bold">Report</Typography>
            </Link>
            <Link href="/AdminGraphExpense" underline="none" color="text.primary">
              <Typography variant="body1" fontWeight="bold">Graph</Typography>
            </Link>

          </Box>
        )}

        {/* Logout Button for Large Screens */}
        {isLargeScreen && (
          <Button
            color="primary"
            onClick={logout}
            sx={{ fontWeight: 'bold', textTransform: 'none', color: 'text.primary' }}
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}



// import React from 'react';
// import { Link,useNavigate } from 'react-router-dom'; // If using React Router

// const AdminNavbar = () => {
//   const navigate = useNavigate();

//   function logout()
//   {
//     navigate("/")
//   }

//   return (
//     <div className="font-sans text-lg bg-fixed bg-to dark:bg-slate-800 dark:text-white bg-gradient-to-l from-transparent via-slate-200 to-transparent">

//       <nav className="flex items-center justify-between">
//         <ul className="hidden md:flex space-x-6 tracking-wide transition duration-300 ease-in-out">
//           <li>
//             <Link to="/AdminHome" className="hover:font-semibold">
//               Admin Home
//             </Link>
//           </li>
//           <li>
//             <Link to="/Users" className="hover:font-semibold">
//               Users
//             </Link>
//           </li>
          

//           <li>
//             <button onClick={logout}>
//               Logout
//             </button>
//           </li>

//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default AdminNavbar;
