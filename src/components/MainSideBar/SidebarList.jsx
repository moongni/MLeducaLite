import React, { useState } from "react";
import { isEmptyArray } from "../Common/module/checkEmpty";
import { Link } from 'react-router-dom';
import { IoMdAnalytics } from "react-icons/io";
import { AiFillCaretDown, AiOutlineLineChart, AiOutlineControl } from "react-icons/ai"
import { FaFileExport } from "react-icons/fa"
import { FiDatabase } from "react-icons/fi";
import { GoTriangleRight } from "react-icons/go"
import { MdOutlineToc } from "react-icons/md"

const Icon = props => {
    switch (props.icon){
        case 'IoMdAnalytics': return <IoMdAnalytics/>
        case 'AiOutlineLineChart': return <AiOutlineLineChart/>
        case 'FaFileExport': return <FaFileExport/>
        case 'GoTriangleRight': return <GoTriangleRight/>
        case 'AiOutlineControl': return <AiOutlineControl/>
        case 'FiDatabase': return <FiDatabase/>
        case 'MdOutlineToc': return <MdOutlineToc/>
        default: return null
    }
};

export const SidebarList = ({children, ...props}) => {
    const [isShowMenu, setShowMenu] = useState(false);

    return (
        <li className={isShowMenu? "showMenu" : ""}>
            <div className='icon-link'>
                <Link to={props.link}
                    onClick={()=> setShowMenu(props.clsName)}>
                    <i><Icon icon={props.icon}></Icon></i>
                    <span className='link-name'>{props.name}</span>
                    {!isEmptyArray(props.subLinkName) && 
                        <i className='down ml-auto'><AiFillCaretDown /></i>}
                </Link>
            </div>
            <ui className='sub-menu'>
                <li>
                    <Link className='submenu-name' to={props.link}>{props.name}</Link>
                </li>
                {props.subLinkName.map(sub => {
                    return (
                        <li><Link to={sub.link}>{sub.name}</Link></li>
                    )
                })}
            </ui>
        </li>

    )
}