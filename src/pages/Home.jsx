import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Categories from '../components/Categories';
import Pagination from '../components/Pagination';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Sort from '../components/Sort';
import { setCategoryId } from '../redux/slices/filterSlice';
import { SearchContext } from '../App';

const Home = () => {
    const { categoryId, sort } = useSelector((state) => state.filterSlice);
    const sortType = sort.sortProperty;

    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const { searchValue } = useContext(SearchContext);
    const dispatch = useDispatch();

    const onClickCategory = (id) => {
        dispatch(setCategoryId(id));
    };

    useEffect(() => {
        setIsLoading(true);

        const order = sortType.includes('-') ? 'asc' : 'desc';
        const sortBy = sortType.replace('-', '');
        const category = categoryId > 0 ? `category=${categoryId}` : '';
        const search = searchValue ? `&search=${searchValue}` : '';

        axios
            .get(
                `https://6384c0c94ce192ac60624a72.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
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
                <Categories value={categoryId} onClickCategory={onClickCategory} />
                <Sort />
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">{isLoading ? skeletons : pizzas}</div>
            <Pagination onChangePage={(number) => setCurrentPage(number)} />
        </div>
    );
};

export default Home;
