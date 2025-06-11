// * React:
import React from 'react';

// * Icons:
import { IoFlaskOutline, IoStatsChartOutline  } from "react-icons/io5";

const Content = ({ title, icon, children }) => {
    return (
        <div
            className="flex w-full p-1 flex-1 lg-screen-spacing-content"
        >
            <div className="content">
                <div className="flex flex-row space-x-1 items-center p-1 border-bottom">
                    {
                        icon === 'flask' ? <IoFlaskOutline className="text-2xl" /> :
                        icon === 'stats' ? <IoStatsChartOutline className="text-2xl" /> :
                        null
                    }
                    <p className="text-2xl font-semibold">
                        {title}
                    </p>
                </div>
                <div className="flex flex-col space-y-1 items-center justify-center p-1 h-full">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Content;