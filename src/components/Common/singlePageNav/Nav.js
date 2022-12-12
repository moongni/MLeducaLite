import React from 'react';
import NavLink from './NavLink';
import style from "./Nav.module.css";

const Nav = ({...props}) => {

	return (
		<nav className={style.navContainer}>
			{props.links.map(({ navLinkId, scrollToId }, idx) => (
				<NavLink 
					key={idx} 
					navLinkId={navLinkId} 
					scrollToId={scrollToId} 
				/>
			))}
		</nav>
	);
};

export default Nav;