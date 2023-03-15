import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';

import Categories from '../components/Categories';
import Pagination from '../components/Pagination';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Sort, { sortList } from '../components/Sort';
import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice';
import { SearchContext } from '../App';
import { useRef } from 'react';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isSearch = useRef(false);
    const isMounted = useRef(false);

    const { categoryId, sort, currentPage } = useSelector((state) => state.filterSlice); //из редакса получаем стейты
    const sortType = sort.sortProperty; // вытаскиваем из сорта нужное свойтство объекта
    const [items, setItems] = useState([]); //стейт пустой массив, потом будут хранится пиццы
    const [isLoading, setIsLoading] = useState(true); //стейт загрузки

    const { searchValue } = useContext(SearchContext); // используем контекст
    // метод для экшнов

    const onClickCategory = (id) => {
        dispatch(setCategoryId(id));
    }; //функцию изменения категорий, диспатчим из слайса

    const onChangePage = (number) => {
        dispatch(setCurrentPage(number));
    }; // аналогия как с категориями

    const fetchPizzas = () => {
        //асинхронный код, получаем с бэка данные
        setIsLoading(true); // стейт загрузки правдивый

        const order = sortType.includes('-') ? 'asc' : 'desc'; // если тип сортировки содержит - то по-убыванию сортировка
        const sortBy = sortType.replace('-', ''); // убираем -
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
    };

    // вшиваем ссылку в браузере с помощью qs - парсинг нужных параметров
    useEffect(() => {
        if (isMounted.current) {
            const queryString = qs.stringify({
                sortProperty: sort.sortProperty,
                categoryId,
                currentPage,
            });
            navigate(`?${queryString}`);
        }
        isMounted.current = true;
    }, [categoryId, sort.sortProperty, currentPage]);

    // Если был первый рендер , то проверяем URL-параметры и сохранеям в редукс
    useEffect(() => {
        if (window.location.search) {
            const params = qs.parse(window.location.search.substring(1)); // данные из поисковой строки парсяться в объект

            const sort = sortList.find((obj) => obj.sortProperty === params.sortProperty);

            dispatch(
                setFilters({
                    ...params,
                    sort,
                }),
            );
            isSearch.current = true;
        }
    }, []);

    // если был 1 рендер, то запрашиваем пиццы
    useEffect(() => {
        window.scrollTo(0, 0);
        if (!isSearch.current) {
            fetchPizzas();
        }

        isSearch.current = false;
    }, [categoryId, sortType, searchValue, currentPage]);

    const pizzas = items.map((obj) => <PizzaBlock {...obj} key={obj.id} />); //массив пицц с помощью метода мэп , превращаем в джсх элемент
    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />); // скелетоны при загрузке, с помощью пустового массива

    return (
        <div className="container">
            <div className="content__top">
                <Categories value={categoryId} onClickCategory={onClickCategory} />
                <Sort />
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">{isLoading ? skeletons : pizzas}</div>
            <Pagination currentPage={currentPage} onChangePage={onChangePage} />
        </div>
    );
};

export default Home;
