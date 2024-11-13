
import React from 'react';
import {useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AdminNavbar from './AdminNavbar';

const AdminHome = () => {
    const navigate = useNavigate();

    if(sessionStorage.getItem("user") == undefined)
        {
            navigate("/")
        }
    
    return (

        <>
            <AdminNavbar />
            <div>This is Admin Home Page</div>
        </>

    );
}

export default AdminHome;