// * React:
import React from 'react';

// * Components:
import { Header, Footer, Content } from '../components';

const Home = () => {
    return (
        <div className="app">
            <Header />
            <Content 
                title="Simulation"
                icon="flask"
            />
            <Footer />
        </div>
    )
}

export default Home;