import './scss/app.scss';
import Categories from './components/Categories';
import Header from './components/Header';
import Sort from './components/Sort';
import Pagination from './components/Pagination';
import PizzaBlock from './components/PizzaBlock';

// import pizzas from './assets/pizzas.json';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get('https://6384c0c94ce192ac60624a72.mockapi.io/items').then((res) => {
            setItems(res.data);
        });
    }, []);

    return (
        <div className="wrapper">
            <Header />
            <div className="content">
                <div className="container">
                    <div className="content__top">
                        <Categories />
                        <Sort />
                    </div>
                    <h2 className="content__title">Все пиццы</h2>
                    <div className="content__items">
                        {items.map((obj) => (
                            <PizzaBlock {...obj} key={obj.id} />
                        ))}
                    </div>
                    <Pagination />
                </div>
            </div>
        </div>
    );
}

export default App;
