import React, { useContext } from 'react';
import { NavContext } from './NavContext';
import style from './Nav.module.css';

const NavLink = ({ navLinkId, scrollToId }) => {
	const { activeNavLinkId, setActiveNavLinkId } = useContext(NavContext);

	const handleClick = () => {
		setActiveNavLinkId(navLinkId);
		document.getElementById(scrollToId).scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<div 
			id={navLinkId}
			className={style.navLinkContainer}
			onClick={handleClick}>
			<span
				className={[`${activeNavLinkId === navLinkId ? style.navSpanActive : style.navSpanDisabled}`, style.navSpan].join(' ')}
			>
				{navLinkId}
			</span>
		</div>
	);
};

export default NavLink;