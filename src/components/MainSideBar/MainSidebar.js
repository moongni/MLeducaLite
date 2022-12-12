import React from 'react';
import { AiOutlineMenu, AiOutlineArrowLeft } from "react-icons/ai"
import { RiComputerLine } from "react-icons/ri"
import { Link } from 'react-router-dom';
import { SidebarList } from './SidebarList';
import sidebars from '../../data/sidebarData.json';
import './MainSidebar.css';

export const MainSidebar = (props) => {
    return (
        <div >
            <div className={`${props.isOpen? "sidebar": "sidebar close"} container`}
            >
                <Link className="logo-details" to='/docs'>
                    <i ><RiComputerLine/></i>
                    <span className='logo_name'>Deep learning</span>
                </Link>
                <ul className='nav-links'>
                    {sidebars.sidebarLinkName
                        .map(sidebar => (
                            <SidebarList {...sidebar}/>
                    ))}
                </ul>
            </div>
            <section className='home-section'>
                <div className='home-content'>
                    <i onClick={()=> props.setMenu(!props.isOpen)}><AiOutlineMenu/></i>
                    <i className={`${props.isDashboardOpen? "":"rotate-180"}`} 
                       onClick={()=> props.setDashboard(!props.isDashboardOpen)}>
                        <AiOutlineArrowLeft/>
                    </i>
                </div>    
            </section>
        </div>
    )
}