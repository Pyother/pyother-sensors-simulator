// * React:
import React from 'react';

// * Icons:
import { IoFlaskOutline } from "react-icons/io5";

const Content = ({ title, icon }) => {
    return (
        <div
            className="flex w-full p-1 flex-1 lg-screen-spacing-content"
        >
            <div className="content">
                <div className="flex flex-row space-x-1 items-center p-1 border-bottom">
                    {
                        icon === 'flask' ?
                        <IoFlaskOutline className="text-2xl" />
                        : null
                    }
                    <p className="text-2xl font-semibold">
                        {title}
                    </p>
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}

export default Content;