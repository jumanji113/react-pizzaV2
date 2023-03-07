import React from 'react';
import { useState } from 'react';

function Categories() {
    const [activeIndex, setActiveIndex] = useState(2);

    const onClickCategories = (id) => {
        setActiveIndex(id);
    };
    const categories = ['Все', 'Мясные', 'Вегетарианские', 'Гриль', 'Острые', 'Закрытые'];

    return (
        <div className="categories">
            <ul>
                {categories.map((value, i) => (
                    <li
                        key={i}
                        onClick={() => onClickCategories(i)}
                        className={activeIndex === i ? 'active' : ''}>
                        {value}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Categories;
