import './scss/app.scss';

import Header from './components/Header';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';
import { useState, createContext } from 'react';

export const SearchContext = createContext('');

function App() {
    const [searchValue, setSearchValue] = useState('');
    return (
        <SearchContext value={(searchValue, setSearchValue)}>
            <div className="wrapper">
                <Header />
                <div className="content">
                    <div className="container">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </SearchContext>
    );
}

export default App;
