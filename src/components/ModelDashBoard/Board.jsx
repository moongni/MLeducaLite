import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { isEmptyObject, isEmptyStr, isEmptyArray } from "../Common/module/checkEmpty";
import Title from "../Common/title/title";
import { LayerList } from "../Setting/Layers/LayerList";
import { contentView } from "../Common/module/package";
import boardStyle from "./ModelDashBoard.module.css";
import mainStyle from "../../static/css/component.module.css";

export const SideCompileBoard = ({ children, className, style, ...props }) => {
    // 컴파일 설정 redux 정보
    const compile = useSelector( state => state.setting.compile );

    return (
        <ul style={{"marginBottom":"0.5rem"}}>
            <Link to={props.link}>
            <li style={style}>Compiles</li>
            {!isEmptyObject(compile) &&
                Object.entries(compile).map(setting => {
                    if (setting[0] === "optimizer" && !isEmptyObject(setting[1])){
                        return (
                            <li style={{"paddingLeft":"0.5rem"}}>
                                <p style={{"wordBreak":"break-all"}}>{setting[0]}:&nbsp; &nbsp;{setting[1].title}</p>
                                {!isEmptyObject(setting[1].value) &&
                                    Object.entries(setting[1].value).map(item => (
                                        <p style={{"wordBreak":"break-all",
                                                "paddingLeft":"2rem"}}>
                                            {item[0]}&nbsp; &nbsp;{String(item[1])}
                                        </p>
                                ))}
                            </li>  
                        )
                    }
                    if ((setting[0] === "loss" || setting[0] === "matrics") && !isEmptyStr(setting[1])){
                        return (
                            <li style={{"paddingLeft":"0.5rem"}}>
                                <p style={{"wordBreak":"break-all"}}>{setting[0]}:&nbsp; &nbsp;{setting[1]}</p>
                            </li>
                        )
                    }
            })}
           </Link>
        </ul>
    )
}

const OptimizerBoard = ({ style }) => {
    // 최적화 함수 redux 정보
    const optimizer = useSelector( state => state.setting.compile.optimizer );
    
    return (
        <div style={style.mainStyle}>
            <Title title="optimizer"/>
            <div className={mainStyle.subContainer}
                style={style.contentStyle}>
                {contentView({
                    element: optimizer,
                    children:                 
                        <div>
                            <Title title={optimizer.title}/>
                            <div style={{"display":"flex"}}>
                                {Object.entries(optimizer.value? optimizer.value : {})
                                    .map(value => (
                                        <li className={boardStyle.li}>{value[0]}&nbsp;:&nbsp;{value[1]}</li>
                                ))}
                            </div>
                        </div>,
                    checkFunction: isEmptyObject
                })}
            </div>
        </div>
    )        
}

const LossBoard = ({ style }) => {
    // 손실 함수 redux 정보
    const loss = useSelector( state => state.setting.compile.loss );

    return (
        <div style={style.mainStyle}>
            <Title title="손실 함수"/>
            <div className={mainStyle.subContainer}
                style={style.contentStyle}>
                {contentView({
                    element: loss,
                    children: 
                        <li className={boardStyle.li}>{loss}</li>,
                    checkFunction: isEmptyStr
                })}
            </div>
        </div>
    )    
}

export const SideLayerBoard = ({children, className, style, ...props}) => {
    // 레이어 구성 redux 정보
    const layers = useSelector( state => state.setting.layer.info );

    return (
        <ul style={{"marginBottom":"0.5rem"}}>
            <Link to={props.link}>
                <li style={style}>Layers</li>
                {!isEmptyObject(layers) &&
                    layers.map((layer) => (
                        <li style={{"paddingLeft":"0.5rem"}}>
                            <p style={{"wordBreak":"break-all"}}>
                                {layer.idx} Layer
                            </p>
                            {Object.entries(layer.info).map(item => 
                                    <p style={{"wordBreak":"break-all"}}>{item[0]}&nbsp; &nbsp;{String(item[1])}</p>
                                )
                            }
                        </li>
                    )
                )}
            </Link>
        </ul>
    )
}

export const LayerBoard = () => {
    // 레이어 구성 redux 정보
    const layers = useSelector( state => state.setting.layer );

    const style = {
        mainStyle: {
            "display":"inline-block",
            "verticalAlign":"top",
            "margin":"0 10px"
        },
        contentStyle: {
            "position":"relative",
            "display":"flex",
            "minHeight":"130px",
            "alignItems":"center"
        }
    }

    return (
        <div style={{...style.mainStyle, "display":"block"}}>
            <Title title="레이어 테이블"/>
            <div className={mainStyle.subContainer}>
                {contentView({
                    element: layers.info,
                    children: 
                        <LayerList
                            style={{...style.contentStyle,
                                "maxHeight":"24rem"}}
                            data={layers.info}
                            isModel={layers.isModel}
                        />,
                    checkFunction: isEmptyArray

                })}
            </div>
        </div >
    )
}


export const SideParamBoard = ({children, className, style, ...props}) => {
    // 파라미터 redux 정보
    const parameter = useSelector( state => state.setting.parameter.info );
    
    return (
        <ul style={{"marginBottom":"0.5rem"}}>
            <Link to={props.link}>
                <li style={style}>Parameters</li>
                {!isEmptyObject(parameter) &&
                    Object.entries(parameter).map(setting => (
                        <li style={{"paddingLeft":"0.5rem"}}>
                            <p style={{"wordBreak":"break-all"}}>{setting[0]}:&nbsp; &nbsp;{String(setting[1])}</p>
                        </li>
                ))}
            </Link>
        </ul>
    )
}

const ParamBoard = ({ style }) => {
    // 파라미터 redux 정보
    const parameter = useSelector( state => state.setting.parameter.info );

    return (
        <div style={style.mainStyle}>
            <Title title="파라미터"/>
            <div className={mainStyle.subContainer}
                style={style.contentStyle}>
                {contentView({
                    element: parameter,
                    children:
                        <div style={{"display":"flex"}}>
                            {Object.entries(parameter)
                                .map(value => (
                                    <li className={boardStyle.li} >{value[0]}&nbsp;:&nbsp;{value[1]}</li>
                            ))}
                        </div>,
                    checkFunction: isEmptyObject
                })}
            </div>
        </div>
    )
}

export const SettingBoard = () => {
    const style = {
        mainStyle: {
            "display":"inline-block",
            "verticalAlign":"top",
            "margin":"0 10px"
        },
        contentStyle: {
            "position":"relative",
            "display":"flex",
            "minHeight":"130px",
            "alignItems":"center"
        },
        content: {
            "display": "flex"
        }
    }

    return (
        <div style={{"display":"table", "justifyContent":"start", "maxWidth":"inherit", "overflow":"hidden"}}>
            <OptimizerBoard style={style}/>
            <LossBoard style={style}/>
            <ParamBoard style={style}/>
        </div>
    )
}