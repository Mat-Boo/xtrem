import React from 'react';

export default function Pagination({ totalItems, itemsPerPage, setCurrentPage, currentPage }) {

    let pages = [];
    for (let i = 1 ; i <= Math.ceil(totalItems / itemsPerPage) ; i++) {
        pages.push(i);
    }

    return (
        <div className='pagination'>
            {
                pages.map((page, index) => (
                    <button 
                        className={page === currentPage ? 'activePage' : 'pageBtn'}
                        key={index} 
                        onClick={() => setCurrentPage(page)}>
                            {page}
                    </button>
                ))
            }
        </div>
    )
}
