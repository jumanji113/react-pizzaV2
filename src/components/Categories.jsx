import React from 'react';

function Categories({ value, onChangeCategory }) {
    const onClickCategories = (id) => {
        onChangeCategory(id);
    };
    const categories = ['Все', 'Мясные', 'Вегетарианские', 'Гриль', 'Острые', 'Закрытые'];

    return (
        <div className="categories">
            <ul>
                {categories.map((categoryName, i) => (
                    <li
                        key={i}
                        onClick={() => onClickCategories(i)}
                        className={value === i ? 'active' : ''}>
                        {categoryName}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Categories;
