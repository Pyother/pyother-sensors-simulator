// * React:
import React, { useState } from 'react';

// * Components:
import { 
    Header, 
    Footer, 
    Content, 
    Form,
    CarthesianPlane
} from '../components';

const Home = () => {

    const [isAccordionOpen, setIsAccordionOpen] = useState(false);

    return (
        <div className="app">
            <Header />
            <Content
                title="Simulation"
                icon="flask"
                children={
                    <>
                        <div className="hidden md:flex md:flex-row md:space-x-1 w-full mb-0">
                            <div className="flex flex-col space-y-0.5 basis-3/4">
                                <Form />
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-1 basis-[125%]">
                                <CarthesianPlane />
                            </div>
                        </div>
                        <div className="flex md:hidden flex-col space-y-1 w-full">
                            <div className="border-b border-gray-200">
                                <button 
                                    className="w-full"
                                    onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                                >
                                    <p>{isAccordionOpen ? 'Hide chart' : 'Show chart'}</p>
                                </button>
                                <div className={`${isAccordionOpen ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}>
                                    <CarthesianPlane />
                                </div>
                            </div>
                            {!isAccordionOpen && (
                                <div className="flex flex-col space-y-1">
                                    <Form />
                                </div>
                            )}
                        </div>
                    </> 
                }
            />
            <Footer />
        </div>
    );
};

export default Home;
