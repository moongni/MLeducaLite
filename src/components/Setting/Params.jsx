import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNav } from "../Common/singlePageNav/useNav"
import { errorHandler } from "../Common/module/errorHandler";
import Inputs from "../Common/inputs/Inputs";
import Title from "../Common/title/title";
import { Button } from "../Common/button/Button";
import { settingActions } from "../../reducers/settingSlice";
import { AiOutlineControl } from "react-icons/ai";
import mainStyle from "../../static/css/component.module.css";
import data from "../../data/data.json"

function Params({ ...props }){
    const dispatch = useDispatch();

    // 사이드 Nav를 위한 Ref
    const paramRef = useNav('Param');
    
    const [ disabled, setDisabled ] = useState(false);

    const [ value, setValue ] = useState({});
    
    // 파라미터 Input 데이터 
    const dataForInputs = data.Parameters
    
    // 파라미터 적용 함수
    const handleSubmit = (event) => {
        const setData = async () => {
            dispatch(settingActions.setParam(value));
        }
        
        event.preventDefault();
        setDisabled(true);
        
        setData()
        .then( _ => {
            props.setAlectMsg("Parameter saved");
            props.setAlectVisiable(true);
        })
        .catch( err => errorHandler({
            message: err.message,
            statuscode: err.status? err.status: null
        }));
        
        setDisabled(false);
    }

    // 파라미터 초기화 함수
    const handleRemove = () => {
        const setData = async () => {
            dispatch(settingActions.removeParam());
        }
        
        setDisabled(true);
        
        setData()
        .then( _ => {
            props.setAlectMsg("parameter removed");
            props.setAlectVisiable(true);
        })
        .catch( err => errorHandler({
            message: err.message,
            statuscode: err.status? err.status: null
        }));
        
        setDisabled(false);
    }

    return (
        <div 
            className={mainStyle.container}
            ref={paramRef}
            id="paramContainer"
        >
            <div style={{"display":"flex", "justifyContent":"space-between"}}>
                <Title title="파라미터 설정" icon={<AiOutlineControl/>}/>
                <Button
                    className="right"
                    style={{"width":"4rem"}}
                    type="button"
                    onClick={handleRemove}>
                        초기화
                </Button>
            </div>
            <form 
                className={mainStyle.subContainer}
                onSubmit={handleSubmit}
            >
                {dataForInputs.map(
                    param => (
                        <Inputs 
                            {...param}
                            value={value}
                            setValue={setValue}/>
                ))}
                <div className={mainStyle.centerContainer}>
                    <Button
                        className="green inCenter"
                        type="submit"
                        style={{"width":"20%"}}
                        disabled={disabled}>
                        적용
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Params;