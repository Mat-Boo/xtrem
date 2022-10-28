import React from 'react';

export default function Pagination({ totalItems, itemsPerPage, setCurrentPage, currentPage }) {

    let pages = [];
    for (let i = 1 ; i <= Math.ceil(totalItems / itemsPerPage) ; i++) {
        pages.push(i);
    }

    return (
        <div className='pagination'>
            <div className='navPage'
                onClick={() => {currentPage === 1 ? '' : setCurrentPage(currentPage - 1), scroll(0,0)}}
                style={currentPage === 1 ? {opacity: 0.2, cursor: 'auto'} : null}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="previousSvg" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
                <span>Précédente</span>
            </div>
            <div className='pageBtns'>
                {
                    pages.map((page, index) => (
                        <button 
                            className={page === currentPage ? 'activePage' : 'pageBtn'}
                            key={index} 
                            onClick={() => {setCurrentPage(page), scroll(0,0)}}>
                                {page}
                        </button>
                    ))
                }
            </div>
            <div className='navPage' 
                onClick={() => {currentPage === Math.ceil(totalItems / itemsPerPage) ? '' : setCurrentPage(currentPage + 1), scroll(0,0)}}
                style={currentPage === Math.ceil(totalItems / itemsPerPage) ? {opacity: 0.2, cursor: 'auto'} : null}>
                <span>Suivante</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="nextSvg" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </div>
        </div>
    )
}
