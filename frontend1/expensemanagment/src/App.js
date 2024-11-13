import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserDetail from './User Pages/UserDetail';
import Home from './User Pages/UserHome';
import AddExpense from './User Pages/AddExpense';
import { ThemeProvider } from "@material-tailwind/react"; 
import SignUP from './signup';
import Login from './login';
import EditUser from './User Pages/editUser'
import UsersExpense from './Admin Pages/UsersExpense';
import Users from './Admin Pages/Users';
import AdminHome from './Admin Pages/AdminHome';
import Expenses from './User Pages/Expenses';
import EditExpense from './User Pages/EditExpense';
import UserReport from './User Pages/UserReport';
import AdminReport from './Admin Pages/AdminReport';
import AdminFilterReport from './Admin Pages/AdminFilterReport';
import UserFilterReport from './User Pages/UserFilterReport';
import AdminGraphExpense from './Admin Pages/graphExpense';
import UserGraphExpense from './User Pages/GraphExpense';



function App() {
  return (
    <ThemeProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUP />} />
        <Route path="/UserDetail" element={<UserDetail />} />
        <Route path="/AddExpense" element={<AddExpense />} />
        <Route path='/Users' element={<Users />}/>
        <Route path='/UserExpense/:email' element={<UsersExpense/>} />
        <Route path='/AdminHome' element={<AdminHome />}/>
        <Route path='/Expenses' element={<Expenses />} />
        <Route path='/EditExpense' element={<EditExpense />} />
        <Route path ='/editUser' element={<EditUser/>}/>
        <Route path='/userReport' element={<UserReport/>}/>
        <Route path='/adminReport' element={<AdminReport/>}/>
        <Route path='/adminFilterReport' element={<AdminFilterReport/>}/>
        <Route path='/userFilterReport' element={<UserFilterReport/>}/>
        <Route path='/AdminGraphExpense' element={<AdminGraphExpense/>}/>
        <Route path='/UserGraphExpense' element={<UserGraphExpense/>}/>

      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
