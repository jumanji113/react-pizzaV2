import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import Categories from '../components/Categories';
import Pagination from '../components/Pagination';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Sort from '../components/Sort';
import { SearchContext } from '../App';

const Home = () => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryId, setCategoryId] = useState(0);
    const [sortType, setSortType] = useState({
        name: 'Популярности',
        sortProperty: 'rating',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const { searchValue } = useContext(SearchContext);

    useEffect(() => {
        setIsLoading(true);

        axios
            .get(
                `https://6384c0c94ce192ac60624a72.mockapi.io/items?page=${currentPage}&limit=4${
                    categoryId > 0 ? `category=${categoryId}` : ''
                }&sortBy=${sortType.sortProperty.replace('-', '')}${
                    searchValue ? `&search=${searchValue}` : ''
                }&order=${sortType.sortProperty.includes('-') ? 'asc' : 'desc'}`,
            )
            .then((res) => {
                setItems(res.data);
                setIsLoading(false);
            });
        window.scrollTo(0, 0);
    }, [categoryId, sortType, searchValue, currentPage]);

    const pizzas = items.map((obj) => <PizzaBlock {...obj} key={obj.id} />);
    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

    return (
        <div className="container">
            <div className="content__top">
                <Categories value={categoryId} onChangeCategory={(id) => setCategoryId(id)} />
                <Sort value={sortType} onChangeSort={(id) => setSortType(id)} />
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">{isLoading ? skeletons : pizzas}</div>
            <Pagination onChangePage={(number) => setCurrentPage(number)} />
        </div>
    );
};

export default Home;
