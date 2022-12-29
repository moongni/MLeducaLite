import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNav } from "../../Common/singlePageNav/useNav";
import { settingActions } from "../../../reducers/settingSlice";
import data from "../../../data/data.json"
import Box from "./Box";
import Title from "../../Common/title/title";
import { Button } from "../../Common/button/Button";
import { AiOutlineControl } from "react-icons/ai";
import { errorHandler } from "../../Common/module/errorHandler";
import style from "../../../static/css/component.module.css";

const Compile = ({ ...props }) => {
    // 사이드 Nav 설정 Ref
    const compileRef = useNav("Compile");

    return (
        <div className={style.container}
            ref={compileRef}
            id="compileContainer">
            <Title title="컴파일 설정" icon={<AiOutlineControl/>} style={{"marginBottom":"1rem"}}/>
            <Optimizers {...props}/>
            <Losses {...props}/>
            <Metrics {...props}/>
        </div>
    )
}

export default Compile

function Optimizers({ ...props }) {
    const dispatch = useDispatch();

    // 최적화 함수의 Input 정보
    const optimizers = data.Compile.filter(v => v.title === "optimizer")[0].info;

    // 커서가 컴포넌트 내에 있는지 확인
    const [ hovering, setHovering ] = useState(false);

    const handleMouseOver = useCallback(() => {
        !hovering &&
        setHovering(true);
    }, [hovering]);

    const handleMouseOut = useCallback(() => {
        !!hovering &&
        setHovering(false);
    }, [hovering]);

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
            <div className={`${hovering? "scrollhost":"disViable"} ${style.subContainer}`}
                style={{"height": "18rem"}}
                onMouseLeave={handleMouseOut}
                onMouseEnter={handleMouseOver}>
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

    // 손실 함수 리스트 정보
    const losses = data.Compile.filter(v => v.title === "loss")[0].info;

    // 커서가 컴포넌트 내부에 있는지 확인
    const [ hovering, setHovering ] = useState(false);

    const handleMouseOver = useCallback(() => {
        !hovering &&
        setHovering(true);
    }, [hovering]);

    const handleMouseOut = useCallback(() => {
        !!hovering &&
        setHovering(false);
    }, [hovering]);

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
            <div className={`${hovering? "scrollhost":"disViable"} ${style.subContainer}`}
                style={{"height": "18rem"}}
                onMouseLeave={handleMouseOut}
                onMouseEnter={handleMouseOver}>
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

function Metrics({ ...props }) {
    const dispatch = useDispatch();

    // 훈련 평가 지표 리스트 정보
    const metrics = data.Compile.filter(v => v.title === "metrics")[0].info;
    
    // 커서가 컴포넌트 내에 있는지 확인
    const [ hovering, setHovering ] = useState(false);

    const handleMouseOver = useCallback(() => {
        !hovering &&
        setHovering(true);
    }, [hovering]);

    const handleMouseOut = useCallback(() => {
        !!hovering &&
        setHovering(false);
    }, [hovering]);

    // 훈련 평가 지표 설정 함수
    const selectHandler = (event, title, value) => {
        const setData = async () => {
            dispatch(settingActions.setMetrics(title));
        }

        event.preventDefault();
        
        setData()
        .then( _ => {
            props.setAlectMsg(`Metrics: ${title} saved`);
            props.setAlectVisiable(true);  
        })
        .catch( err => errorHandler({
            message: err.message,
            statuscode: err.status? err.status: null
        }));

    }

    // 훈련 평가 지표 삭제 함수
    const handleRemove = () => {
        const removeData = async () => {
            dispatch(settingActions.removeMetrics());
        }

        removeData()
        .then( _ => {
            props.setAlectMsg("Metrics removed");
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
                <Title title="훈련 평가 지표"/>
                <Button
                    className="right"
                    style={{"width":"4rem"}}
                    type="button"
                    onClick={handleRemove}>
                        초기화
                </Button>
            </div>
            <div className={`${hovering? "scrollhost":"disViable"} ${style.subContainer}`}
                style={{"height": "18rem"}}
                onMouseLeave={handleMouseOut}
                onMouseEnter={handleMouseOver}>
                {metrics.map((info) => (
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