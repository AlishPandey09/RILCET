import React from 'react';
import { useNavigate } from 'react-router-dom';

// Importing Icons
import { RiLogoutCircleRLine } from "react-icons/ri";

const AdminPanel = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the login state
        localStorage.removeItem('isAdminLoggedIn');

        // Redirect to the login page
        navigate('/admin-login');
        window.history.pushState(null, '', '/admin-login'); // Clear the history stack
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-primaryColor">
            {/* Header Component */}
            <header className="w-full bg-tertiaryColor py-4 shadow-lg shadow-gray-400 flex justify-between items-center px-8">
                <h1 className="text-2xl text-white font-semibold">Admin Panel</h1>

                {/* Logo with Logout Button */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLogout}
                        className="py-3 px-4 bg-fifthColor text-white rounded-lg hover:bg-sixthColor flex items-center gap-4"
                    >
                        <RiLogoutCircleRLine size={24}/>
                        <h1 className="">Logout</h1>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center flex-grow mt-16">
                <h2 className="text-xl font-medium mb-8">Welcome to the Admin Panel</h2>
                {/* Add any other admin panel content here */}
            </div>
        </div>
    );
};

export default AdminPanel;