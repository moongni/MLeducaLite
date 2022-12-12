import React from "react";
import Box from "./Box";
import data from "../../../data/data.json"
import { useNav } from "../../Common/singlePageNav/useNav";
import style from "../../Common/component.module.css";
import Title from "../../Common/title/title";
import { AiOutlineControl } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Button } from "../../Common/button/Button";
import { settingActions } from "../../../reducers/settingSlice";
import { errorHandler } from "../../Common/module/errorHandler";

const Compile = ({ ...props }) => {
    const compileRef = useNav("Compile");

    return (
        <div className={style.container}
            ref={compileRef}
            id="compileContainer">
            <Title title="컴파일 설정" icon={<AiOutlineControl/>} style={{"marginBottom":"1rem"}}/>
            <Optimizers {...props}/>
            <Losses {...props}/>
        </div>
    )
}

export default Compile

function Optimizers({ ...props }) {
    const dispatch = useDispatch();

    const optimizers = data.Compile.filter(v => v.title === "optimizer")[0].info;
    
    // 최적화 선택 함수
    const selectHandler = (event, title, value) => {
        const setData = async () => {
            const data = {
                "title": title,
                "value": value
            }
            dispatch(settingActions.setOptimizer(data))
        }

        event.preventDefault();

        setData()
        .then( _ => {
            props.setAlectMsg(`Optimizer: ${title} saved`);
            props.setAlectVisiable(true);  
        })
        .catch( err => errorHandler({
            message: err.message,
            statuscode: err.status? err.status: null
        }));    
    };
    
    // 최적화 초기화 함수
    const handleRemove = () => {
        const removeData = async () => {
            dispatch(settingActions.removeOptimizer())
        }

        removeData()
        .then( _ => {
            props.setAlectMsg("Optimizer removed");
            props.setAlectVisiable(true);
        }).catch( err => errorHandler({
            message: err.message,
            statuscode: err.status? err.status: null
        }));
    }

    return (
        <div>
            <div style={{"display":"flex", "justifyContent":"space-between"}}>
                <Title title="최적화 함수"    />
                <Button
                className="right"
                    style={{"width":"4rem"}}
                    type="button"
                    onClick={handleRemove}>
                        초기화
                </Button>

            </div>

            <div className={style.subContainer}>
                {optimizers.map((info) => (
                    <Box 
                        info={info} 
                        selectHandler={selectHandler}
                    />
                ))}
            </div>
        </div>
    );
}


function Losses({ ...props }) {
    const dispatch = useDispatch();

    const losses = data.Compile.filter(v => v.title === "loss")[0].info;

    // 손실 함수 선택 함수
    const selectHandler = (event, title, value) => {
        const setData = async () => {
            dispatch(settingActions.setLoss(title));
        }

        event.preventDefault();
        
        setData()
        .then( _ => {
            props.setAlectMsg(`Loss: ${title} saved`);
            props.setAlectVisiable(true);  
        })
        .catch( err => errorHandler({
            message: err.message,
            statuscode: err.status? err.status: null
        }));
    };

    // 손실 함수 초기화 함수
    const handleRemove = () => {
        const removeData = async () => {
            dispatch(settingActions.removeLoss());
        }

        removeData()
        .then( _ => {
            props.setAlectMsg("Loss removed");
            props.setAlectVisiable(true);
        })
        .catch( err => errorHandler({
            message: err.message,
            statuscode: err.status? err.status: null
        }));
    }
    
    return (
        <div>
            <div style={{"display":"flex", "justifyContent":"space-between"}}>
                <Title title="손실 함수" />
                <Button
                    className="right"
                    style={{"width":"4rem"}}
                    type="button"
                    onClick={handleRemove}>
                        초기화
                </Button>
            </div>
            <div className={style.subContainer}>
                {losses.map((info) => (
                    <Box 
                        info={info} 
                        style={{"minHeight": "200px"}}
                        selectHandler={selectHandler}>
                    </Box>
                ))}
            </div>
        </div>
    );
}