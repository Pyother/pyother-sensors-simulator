// * React:
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// * Redux:
import { Provider } from 'react-redux';
import store from './store/store';

// * Pages:
import { Home, Stats } from './pages';

// * UI:
import './styles/globals.css';

const root = createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/stats" element={<Stats />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    </StrictMode>
);