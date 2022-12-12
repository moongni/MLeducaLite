import React from "react";
import btnStyle from './button.module.css';
import { AiOutlineDown } from "react-icons/ai";
import { isEmptyStr } from "../module/checkEmpty";

export const Button = ({children, className, style, ...props}) => {
    let styleArray = []
    
    if (!isEmptyStr(className)){
        const clsArray = className.split(' ');
    
        styleArray = clsArray.map(cls => btnStyle[cls]);
    }

    return (
        <button 
            className={[btnStyle.button, ...styleArray].join(' ')}
            style={style}
            type={props.type}
            disabled={props.disabled}
            onClick={props.onClick}
            >
            {children}
        </button>
    )
}

export const AdvancedSettingButton = ({children, style, ...props}) => {
    const iconStyle = {
        justifyContents:"center",
        marginLeft:"0.5rem",
        transform: props.value? "rotate(-180deg)": ""
    }

    return (
        <button
            className={[btnStyle.right, btnStyle.button].join(' ')}
            style={style}
            type="button"
            onClick={()=> props.setValue(!props.value)}>
            Advanced setting
            <i style={iconStyle}><AiOutlineDown/></i>
        </button>
    )
}