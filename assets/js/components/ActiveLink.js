import React from 'react';
import  { withRouter} from 'next/router';
import styles from '../Navbar/Navbar.module.scss';

const ActiveLink = ({ router, href, children }) => {

    (function prefectchPages() {
        if (typeof window !== "undefined") {
            router.prefetch(router.pathname)
        }
    })()

    const handleClick = event => {
        event.preventDefault();
        router.push(href);
    }

    let pathnameTemp = '';
    let asPathTemp = '';

    if (router.pathname === '/prestations/[prestation]') {
        pathnameTemp = asPathTemp = '/prestations';
    } else {
        pathnameTemp = router.pathname;
        asPathTemp = router.asPath;
    }

    const isCurrentPath = pathnameTemp === href || asPathTemp=== href;

    return (
        <a href={href} onClick={handleClick} className={styles.menuItem}
            style={{
                borderBottom: isCurrentPath ? '1px solid #E8E9E9' : 'none',
                opacity: isCurrentPath ? 0.8 : 1
            }}
        >
            {children}
        </a>
    )
};

export default withRouter(ActiveLink);
