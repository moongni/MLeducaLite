import React, { useContext, useState, useEffect } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import style from "./horisonScroll.module.css";
import { VisibilityContext } from "react-horizontal-scrolling-menu";

const Arrow = ({ children, disabled, onClick }) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            style={{
                "cursor":"pointer",
                "display":"flex",
                "justifyContent": "center",
                "opacity": disabled? "0":"1",
                "userSelect":"none",
            }}
        >
            {children}
        </button>
    )
}

export const LeftArrow = () => {
    const { isFirstItemVisible, scrollPrev, visibleElements, initComplete } = useContext(VisibilityContext);

    const [ disabled, setDisabled ] = useState(!initComplete || (initComplete && isFirstItemVisible));

    useEffect(() => {
        if (visibleElements.length) {
            setDisabled(isFirstItemVisible);
        }

    }, [ isFirstItemVisible, visibleElements ])

    return (
        <Arrow disabled={disabled} onClick={() => scrollPrev()} style={{"left":"0"}}>
            <i className={style.i}><AiOutlineArrowLeft/></i>
        </Arrow>
    )
}

export const RightArrow = () => {
    const { isLastItemVisible, scrollNext, visibleElements } = useContext(VisibilityContext);

    const [ disabled, setDisabled ] = useState(!visibleElements.length && isLastItemVisible);

    useEffect(() => {
        if (visibleElements.length) {
            setDisabled(isLastItemVisible);
        }
    }, [ isLastItemVisible, visibleElements ]);

    return (
        <Arrow disabled={disabled} onClick={() => scrollNext()} style={{"right":"30rem"}}>
            <i className={style.i}><AiOutlineArrowRight/></i>
        </Arrow>
    )
}
