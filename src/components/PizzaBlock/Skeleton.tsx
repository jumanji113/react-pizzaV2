import React from 'react';
import ContentLoader from 'react-content-loader';

export const Skeleton: React.FC = () => (
    <ContentLoader
        className="pizza-block"
        speed={2}
        width={280}
        height={500}
        viewBox="0 0 280 500"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb">
        <circle cx="133" cy="136" r="128" />
        <rect x="-1" y="277" rx="15" ry="15" width="275" height="26" />
        <rect x="-1" y="321" rx="10" ry="10" width="280" height="88" />
        <rect x="-2" y="424" rx="10" ry="10" width="95" height="30" />
        <rect x="126" y="424" rx="24" ry="24" width="152" height="45" />
    </ContentLoader>
);
