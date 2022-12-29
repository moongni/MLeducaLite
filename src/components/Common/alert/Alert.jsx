import React from "react";
import { useState } from "react";

const Alect = ({message, value}) => {
    const style = {
        container: {
            position: "fixed",
            top: "5rem",
            left: "50%",
            zIndex: 50,
            transform: "translateX(-50%)",
        },
        inner: {
            display: "inline-block",
            padding: "8px 16px",
            borderRadius: "1rem",
            zIndex: 30,
            color: "#000",
            fontSize: "1.125rem",
            lineHeight: "1.75rem",
            backgroundColor: "rgb(248 250 252)",
            boxShadow: "1px 2px 10px -3px rgb(0 0 0 / 70%)",
            WebkitBoxShadow: "1px 2px 10px -3px rgb(0 0 0 / 70%)",
            MozBoxShadow: "1px 2px 10px -3px rgb(0 0 0 / 70%)",
        }
    }
    return (
        <>
            { value &&
                <div style={style.container}>
                    <div style={style.inner}>
                        {message}
                    </div>
                </div>

            }
        </>
    )
}

export default Alect;