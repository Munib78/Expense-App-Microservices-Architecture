import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, MenuItem, Typography, Box } from '@mui/material';
import { alpha,useTheme } from '@mui/material/styles';
import AdminNavbar from './AdminNavbar';

const AdminGraphExpense = () => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [filter, setFilter] = useState('fullYear');

    const storedValue = JSON.parse(sessionStorage.getItem("user"));
    const theme = useTheme(); // Access the Material UI theme

    useEffect(() => {
        if (!sessionStorage.getItem("user")) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        axios.get(`http://localhost:8002/admin_graph_expense?id=${storedValue.id}`)
            .then(response => {
                setExpenses(response.data.expenses);
                setFilteredData(response.data.expenses); // Set default to all data
            })
            .catch(error => {
                console.error("There was an error fetching the expenses!", error);
                setError("No expenses added");
            });
    }, []);

    useEffect(() => {
        filterExpenses();
    }, [filter, expenses]);

    const filterExpenses = () => {
        const currentDate = new Date();
        let filtered = [];

        if (filter === 'currentMonth') {
            filtered = expenses.filter(expense =>
                new Date(expense.date).getMonth() === currentDate.getMonth() &&
                new Date(expense.date).getFullYear() === currentDate.getFullYear()
            );
        } else if (filter === 'quarter') {
            const quarterStart = new Date(currentDate.setMonth(currentDate.getMonth() - (currentDate.getMonth() % 3)));
            filtered = expenses.filter(expense => new Date(expense.date) >= quarterStart);
        } else if (filter === 'halfYear') {
            const halfYearStart = new Date(currentDate.setMonth(currentDate.getMonth() - 5));
            filtered = expenses.filter(expense => new Date(expense.date) >= halfYearStart);
        } else if (filter === 'fullYear') {
            const yearStart = new Date(currentDate.setMonth(0));
            filtered = expenses.filter(expense => new Date(expense.date) >= yearStart);
        }

        setFilteredData(filtered);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    return (
        <>
            <AdminNavbar />
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>Expense Analysis</Typography>
                <Select value={filter} onChange={handleFilterChange}>
                    <MenuItem value="currentMonth">Current Month</MenuItem>
                    <MenuItem value="quarter">Quarter</MenuItem>
                    <MenuItem value="halfYear">Half Year</MenuItem>
                    <MenuItem value="fullYear">Full Year</MenuItem>
                </Select>
                {error && <div>{error}</div>}
                {filteredData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={filteredData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="amount" fill={alpha(theme.palette.primary.light,0.5)} /> {/* Use theme primary light color */}
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <Typography variant="body1">No data available for the selected filter.</Typography>
                )}
            </Box>
        </>
    );
};

export default AdminGraphExpense;





// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AdminNavbar from './AdminNavbar';

// const AdminGraphExpense = () => {
//     const navigate = useNavigate();
//     const [expenses, setExpenses] = useState(); // Corrected the useState syntax
//     const [error, setError] = useState(); // Corrected the useState syntax

//     useEffect(() => {
//         if (sessionStorage.getItem("user") === undefined) {
//             navigate("/");
//         }
//     }, [navigate]);

//     useEffect(() => {
//         axios.get(`http://localhost:8002/admin_graph_expense`)
//             .then(response => {
//                 setExpenses(response.data.expenses);
//                 console.log(response.data.expenses);
//             })
//             .catch(error => {
//                 console.error("There was an error fetching the expenses!", error);
//                 setError("No expenses added");
//             });
//     }, []);

//     return (
//         <>
//             <AdminNavbar />
//             {/* You can display expenses or error here */}
//             {error && <div>{error}</div>}
//             {expenses && <div>{/* Render expenses here */}</div>}
//         </>
//     );
// };

// export default AdminGraphExpense;
