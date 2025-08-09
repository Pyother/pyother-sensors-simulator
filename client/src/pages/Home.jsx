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
                        <div id="a" className="hidden md:flex md:flex-row md:space-x-1 w-full mb-0">
                            <div id="a1" className="flex flex-col space-y-0.5 basis-3/4">
                                <Form />
                            </div>
                            <div id="a1" className="flex flex-col items-center justify-center space-y-1 basis-[125%]">
                                <CarthesianPlane active={isAccordionOpen} />
                            </div>
                        </div>
                        <div id="b" className="flex md:hidden flex-col space-y-1 w-full flex-1">
                            <div id="b1" className="border-b border-gray-200 h-full flex flex-col space-y-1">
                                <button 
                                    id="b11"
                                    className="w-full"
                                    onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                                >
                                    <p>{isAccordionOpen ? 'Hide chart' : 'Show chart'}</p>
                                </button>
                                <div id="b12" className={`${isAccordionOpen ? 'flex flex-1' : 'hidden'} transition-all duration-300 ease-in-out`}>
                                    <CarthesianPlane active={isAccordionOpen} />
                                </div>
                            </div>
                            <div id="b2" className="flex flex-col space-y-1">
                                <Form />
                            </div>
                        </div>
                    </> 
                }
            />
            <Footer />
        </div>
    );
};

export default Home;
