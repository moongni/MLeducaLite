import React from "react";
import ReactLoading from "react-loading";

export const Loader = ({ type, color, style, message }) => {
    const divStyle = {
        container: {
            "position":"fixed",
            "top":"0",
            "left":"0",
            "width":"100vw",
            "height":"100vw",
            "backgroundColor":"gray",
            "opacity":"0.3",
            "zIndex":"100"
        },
        subContainer: {
            "position": "fixed",
            "opacity": "1",
            "top": "50%",
            "left": "50%",
            "transform": "translate(-50%, -50%)"
        }
    }

    return (
        <div style={{...divStyle.container, ...style}}>
            <div style={divStyle.subContainer}>
                <h2>{message}</h2>
                <ReactLoading
                    type={type}
                    color={color}
                    height={'80%'}
                    width={'80%'}/>
            </div>
        </div>
    )
}