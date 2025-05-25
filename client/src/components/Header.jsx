// * React:
import React from 'react';
import { useNavigate } from 'react-router-dom';

// * UI:
import { IoHomeOutline, IoStatsChartOutline  } from "react-icons/io5";
import logo from '../assets/logo.png';

const Header = () => {

    const navigate = useNavigate();

    return (
        <div className="flex flex-row space-x-1 p-1 shadow-sm lg-screen-spacing-header" >
            <div className="flex flex-row space-x-0.5 w-full items-center">
                <img src={logo} alt="Logo" className="w-3 h-3" />
                <p className="font-semibold text-lg hidden md:inline">
                    pyother-sensors-simulator
                </p>
            </div>
            <div className="flex flex-row space-x-0.5 justify-end w-full">
                <button 
                    className="text-2xl" 
                    onClick={() => navigate('/')}
                >
                    <IoHomeOutline />
                </button>
                <button 
                    className="text-2xl" 
                    onClick={() => navigate('/stats')}
                >
                    <IoStatsChartOutline />
                </button>
            </div>
        </div>
    )
}

export default Header;