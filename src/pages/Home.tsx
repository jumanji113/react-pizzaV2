import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';

import { Categories, PizzaBlock, Skeleton, Pagination, Sort } from '../components';
import { sortList } from '../components/Sort';
import {
    selectedFilter,
    setCategoryId,
    setCurrentPage,
    setFilters,
} from '../redux/slices/filterSlice';
import { useRef } from 'react';
import { fetchPizzas, SearchPizzaParams, selectPizzaData } from '../redux/slices/pizzaSlice';
import { useAppDispatch } from '../redux/store';

const Home: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isSearch = useRef(false);
    const isMounted = useRef(false);

    const { categoryId, sort, currentPage, searchValue } = useSelector(selectedFilter); //из редакса получаем стейты
    const { items, status } = useSelector(selectPizzaData); //из редакса получаем стейты
    const sortType = sort.sortProperty;

    const onChangeCategory = React.useCallback((idx: number) => {
        dispatch(setCategoryId(idx));
    }, []);
    //функцию изменения категорий, диспатчим из слайса

    const onChangePage = (page: number) => {
        dispatch(setCurrentPage(page));
    }; // аналогия как с категориями

    const getPizzas = async () => {
        //асинхронный код, получаем с бэка данные // стейт загрузки правдивый

        const order = sortType.includes('-') ? 'asc' : 'desc'; // если тип сортировки содержит - то по-убыванию сортировка
        const sortBy = sortType.replace('-', ''); // убираем -
        const category = categoryId > 0 ? `category=${categoryId}` : '';
        const search = searchValue ? `&search=${searchValue}` : '';

        dispatch(
            fetchPizzas({
                order,
                sortBy,
                category,
                search,
                currentPage: String(currentPage),
            }),
        );
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
            const params = qs.parse(
                window.location.search.substring(1),
            ) as unknown as SearchPizzaParams;
            const sort = sortList.find((obj) => obj.sortProperty === params.sortBy);
            dispatch(
                setFilters({
                    searchValue: params.search,
                    categoryId: Number(params.category),
                    currentPage: Number(params.currentPage),
                    sort: sort || sortList[0],
                }),
            );
        }
        isMounted.current = true;
    }, []);

    // если был 1 рендер, то запрашиваем пиццы
    useEffect(() => {
        window.scrollTo(0, 0);
        if (!isSearch.current) {
            getPizzas();
        }

        isSearch.current = false;
    }, [categoryId, sortType, searchValue, currentPage]);

    const pizzas = items.map((obj: any) => <PizzaBlock key={obj.id} {...obj} />); //массив пицц с помощью метода мэп , превращаем в джсх элемент
    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />); // скелетоны при загрузке, с помощью пустового массива

    return (
        <div className="container">
            <div className="content__top">
                <Categories value={categoryId} onChangeCategory={onChangeCategory} />
                <Sort value={sort} />
            </div>
            <h2 className="content__title">Все пиццы</h2>
            {status === 'error' ? (
                <div className="content__error-info">
                    <h2>Произошла ошибка😕</h2>
                    <p>Не удалось загрузить пиццы!</p>
                </div>
            ) : (
                <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
            )}
            <Pagination currentPage={currentPage} onChangePage={onChangePage} />
        </div>
    );
};

export default Home;
