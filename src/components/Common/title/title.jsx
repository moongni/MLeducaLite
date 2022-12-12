import React from "react";

const Title = ({icon, style, className, ...props}) => {
    const titleStyle = {
        display: "flex",
        fontSize: "1.5rem",
        lineHeight: "2rem",
        alignItems: "center"
    }

    return (
        <div className={className} style={{...titleStyle, ...style}}>
            {icon && <i style={{"marginRight":"1rem"}}>{icon}</i>}
            <span>{props.title}</span>
        </div>
    )
}

export default Title;