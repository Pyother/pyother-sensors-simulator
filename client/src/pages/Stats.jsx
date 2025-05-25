// * React:
import React from 'react';

// * Components:
import { Header, Footer, Content } from '../components';

const Stats = () => {
    return (
        <div className="app">
            <Header />
            <Content 
                title="Stats"
                icon="stats"
            />
            <Footer />
        </div>
    )
}

export default Stats;