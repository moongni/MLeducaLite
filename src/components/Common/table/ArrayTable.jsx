import React, { useState , useCallback } from "react";
import { isEmpty, isEmptyArray } from "../module/checkEmpty";
import "./scrollStyle.css";
import tableStyle from "./table.module.css";

const ArrayTable = ({children, style, data, ...props}) => {
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
        <>
            {!isEmptyArray(data.columns) && 
                <>
                    <div 
                        className={`${hovering? "scrollhost":"disViable"} ${tableStyle.container}`}
                        style={style}
                        onMouseLeave={handleMouseOut}
                        onMouseEnter={handleMouseOver}
                    >
                        <table style={{"width":"100%"}}>
                            <thead>
                                <tr key={"column"}
                                    className={tableStyle.theadTr}>
                                    {data.columns.map((column) => (
                                        <th className={tableStyle.th}>{column}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                { Object.values(data.data)[0].map((_, idx) => (
                                    <tr className={tableStyle.tbodyTr}>
                                        {data.columns.map(column => (
                                            <td className={tableStyle.td}>
                                                {!isEmpty(data.data[column][idx])? data.data[column][idx]: "null"}
                                            </td>  
                                        ))}                
                                    </tr>
                                ))}
                            </tbody>
                            <tbody>
                                <tr>
                                    {data.columns.map((_, i) => (
                                        <th className={tableStyle.children}>
                                            {children}
                                        </th>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {!isEmptyArray(data.shape) &&
                        <div style={{"display":"flex"}}>
                            <p style={{"marginLeft":"auto"}}>shape: {data.shape.join(" x ")} {props.totalShape? ` / ${props.totalShape.join(" x ")}`: ""}</p>
                        </div>
                    }
                </>
            }
        </>
    )
}

export default React.memo(ArrayTable);