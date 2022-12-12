import React from "react";
import { useState, useCallback } from "react";
import Inputs from "../../Common/inputs/Inputs";
import { AdvancedSettingButton } from "../../Common/button/Button";
import { BsQuestion } from "react-icons/bs";
import boxStyle from "./box.module.css";

function Box({style, info, selectHandler, ...props}){
    const [ value, setValue ] = useState({});
    const [ isSubOpen, setSubOpen ] = useState(false);
    const [ hovering, setHovering ] = useState(false);
    
    const handleMouseOver = useCallback(() => {
        !hovering &&
        setHovering(true);
    }, [hovering]);
    
    const handleMouseOut = useCallback(() => {
        !!hovering &&
        setHovering(false);
    }, [hovering]);
    
    return (
        <div className={boxStyle.container}>
            <div className={boxStyle.subContainer}>
                <div style={{"display":"flex"}}>
                    <button onClick={ event => selectHandler(event, info.title, value)}>
                        <h2 className={boxStyle.header}>
                            {info.title}
                        </h2>
                    </button>
                    <i className={boxStyle.i}
                        onMouseLeave={handleMouseOut}
                        onMouseEnter={handleMouseOver}>
                        <BsQuestion/>
                        {hovering &&
                            <div className={boxStyle.iTooltip}
                                onMouseLeave={handleMouseOut}
                                onMouseEnter={handleMouseOver}>
                                <h3 className={boxStyle.h3}>{info.description.header}</h3>
                                <span className={boxStyle.span}>
                                    {info.description.content}
                                </span>
                                <a className={boxStyle.a} href={info.description.link} target="_blank">[소스보기]</a>
                            </div>
                        }
                    </i>
                </div>
            {info.params &&
                <AdvancedSettingButton 
                type="button" 
                value={isSubOpen}
                setValue={setSubOpen}/>
            }
            </div>
            <div className={`${isSubOpen? "" : boxStyle.isSubOpen}`}>
                {info.params &&
                    info.params.map(param => (
                        <Inputs 
                            {...param}
                            style={{"paddingLeft":"10px"}}
                            value={value}
                            setValue={setValue}
                        />
                ))}
            </div>
        </div>
    )
}

export default Box;