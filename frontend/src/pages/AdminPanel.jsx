import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiLogoutCircleRLine } from "react-icons/ri";

// Import your other components
import ManageData from './ManageData';
import EvaluationResults from './EvaluationResults';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState('ManageData'); // State for the active page

    const handleLogout = () => {
        localStorage.removeItem('isAdminLoggedIn');
        navigate('/admin-login');
        window.history.pushState(null, '', '/admin-login'); // Clear the history stack
    };

    const renderContent = () => {
        if (activePage === 'ManageData') {
            return <ManageData />;
        } else if (activePage === 'EvaluationResults') {
            return <EvaluationResults />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-primaryColor">
            {/* Header Component */}
            <header className="w-full py-8 shadow-gray-400 flex justify-between items-center px-12 md:px-24 lg:px-40">
                <h1 className="text-2xl text-tertiaryColor font-semibold">Admin Panel</h1>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLogout}
                        className="py-3 px-6 border-sixthColor border-2 text-sixthColor rounded-lg hover:bg-sixthColor hover:text-tertiaryColor flex items-center gap-4"
                    >
                        <RiLogoutCircleRLine size={24}/>
                        <h1>Logout</h1>
                    </button>
                </div>
            </header>

            {/* Navigation Menu */}
            <div className="flex flex-col flex-grow mx-12 md:mx-24 lg:mx-40 my-8">
                <div className="nav-menu flex gap-4">
                    <button
                        onClick={() => setActivePage('ManageData')}
                        className={`px-6 md:px-14 py-3 rounded-full border-2 ${
                            activePage === 'ManageData' ? 'bg-sixthColor text-tertiaryColor' : 'border-sixthColor text-sixthColor'
                        } text-sm md:text-base font-semibold transition-all duration-300 ease-in-out`}
                    >
                        Manage Data
                    </button>
                    <button
                        onClick={() => setActivePage('EvaluationResults')}
                        className={`px-6 md:px-14 py-3 rounded-full border-2 ${
                            activePage === 'EvaluationResults' ? 'bg-sixthColor text-tertiaryColor' : 'border-sixthColor text-sixthColor'
                        } text-sm md:text-base font-semibold transition-all duration-300 ease-in-out`}
                    >
                        Evaluation Results
                    </button>
                </div>

                {/* Content Section */}
                <div className="mt-6">
                    {renderContent()}
                </div>

                <div className="my-16 text-center text-sixthColor font-medium">Developed by BihariG</div>
            </div>
        </div>
    );
};

export default AdminPanel;