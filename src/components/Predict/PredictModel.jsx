import React, { useState, useEffect} from "react";
import Title from "../Common/title/title";
import { ModelSelectModal } from "../Common/modal/modal";
import { isEmptyObject, isEmptyStr } from "../Common/module/checkEmpty";

export const PredictModel = ({ model, setModel, ...props }) => {
    const [ modalShow, setModalShow ] = useState(false);
    const [ modelName, setModelName ] = useState("");

    useEffect(() => {
        if (!isEmptyObject(model)) {
            setModelName(model.constructor.name);
        }
    }, [ model ])

    const style = {
        container: {
            display:"inline-block",
            width:"calc(100% - 280px)",
            marginRight: "2.5rem",
            padding:"0 5px",
            textAlign:"left",
            fontSize:"1.25rem",
            lineHeight:"1.75rem",
            opacity:"0.7",
            borderBottom:"solid 2px rgb(203 213 255)",
            cursor: "pointer"
        }
    }

    return (
        <>
            <ModelSelectModal
                modalShow={modalShow}
                setModalShow={setModalShow}
                setModel={setModel}/>
            <div>
                <Title 
                    title="선택된 모델"
                    style={{display:"inline-block",
                            width:"200px",
                            "fontSize":"1.25rem",}}
                />
                <div style={style.container}
                    onClick={() => setModalShow(true)}>
                    <span>{!isEmptyStr(modelName)? modelName: "No Model Data"}</span>
                </div>
            </div>
        </>   
    )
}