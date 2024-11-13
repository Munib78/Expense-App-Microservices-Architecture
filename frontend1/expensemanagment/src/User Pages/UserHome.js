
import React from 'react';

import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar'

const Home = () => {
    const navigate = useNavigate();
    
    if(sessionStorage.getItem("user") == undefined)
        {
            navigate("/")
        }

    return (

        <>
            <Navbar />

            <div>This is Home Page</div>
        </>

    );
}

export default Home;