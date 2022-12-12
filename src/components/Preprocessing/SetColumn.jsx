import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Inputs from "../Common/inputs/Inputs";
import { Button } from "../Common/button/Button";
import { toArray, toOption } from "../Common/module/option";
import { selectColumn } from "../Common/module/package";
import { errorHandler } from "../Common/module/errorHandler";

const SetColumn = ({ setData, data, dataColumns, initFunction, style, ...props }) => {
    const dispatch = useDispatch();
    
    const [ selectedValue, setSelectedValue ] = useState([]);

    const onClickHandler = () => {
        props.setLoading(true);

        try {
            if (initFunction) {
                initFunction();
            }
            
            const newCol = toArray(selectedValue);
            const newData = selectColumn(data, newCol);
            
            dispatch(setData(newData));

            props.setLoading(false);
            
        } catch (err) {
            errorHandler({
                message: err.message,
                statuscode: err.statuscode? err.statuscode: null
            })
        }

    }

    const divStyle = {
        "display":"flex",
        "width":"100%",
        "height":"3.5rem",
        "marginBottom":"0.5rem",
        "justifyContent":"space-between",
        "alignItems":"center"
    }
    
    return (
        <div style={{...divStyle, ...style}}>
            <Inputs 
                kind="MultiSelect"
                title={props.title}
                value={selectedValue}
                setValue={setSelectedValue}
                options={toOption(dataColumns)}
            />
            <Button 
                className="right"
                style={{"margin":"0 40px", "wordBreak":"keep-all"}} 
                type="button" 
                onClick={onClickHandler}>
                적용
            </Button>
        </div>
    )
}

export default SetColumn