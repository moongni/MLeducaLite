import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNav } from "../../Common/singlePageNav/useNav";
import { isEmptyArray } from "../../Common/module/checkEmpty";
import Inputs from "../../Common/inputs/Inputs";
import Title from "../../Common/title/title";
import Tabs from "../../Common/tab/Tabs"
import { LayerList } from "./LayerList";
import { AdvancedSettingButton, Button } from "../../Common/button/Button";
import { settingActions } from "../../../reducers/settingSlice";
import { AiOutlineControl } from "react-icons/ai";
import data from "../../../data/data.json"
import style from "../../../static/css/component.module.css";

function Layers() {
    const dispatch = useDispatch();
    
    // 레이어 구성 redux 정보
    const layers = useSelector(state => state.setting.layer);

    // 사이드 Nav를 위한 Ref
    const layerRef = useNav("Layer");

    const [ disabled, setDisabled ] = useState(false);
    
    // 탭 메뉴에 따라 보이는 컴포넌트 설정
    const [ currentTab, setCurrentTab ] = useState('1');

    function tapContent(currentTab) {
        const curContent = data.Layers.filter(tab => `${tab.id}` == currentTab)
        switch (curContent[0].title) {
            case "Sequence":
                return <Sequence info={curContent[0].info} disabled={disabled} setDisabled={setDisabled}/>                
            case "Model":
                return <Model info={curContent[0].info} disabled={disabled} setDisabled={setDisabled}/>
        }
    }

    // 레이어 제거 함수
    const handleRemove = (idx) => {
        setDisabled(true);

        dispatch(settingActions.removeLayer(idx))
        dispatch(settingActions.reIndexing())

        setDisabled(false);
    }
    
    return(
        <div 
            className={style.container}
            ref={layerRef}
            id="layerContainer"
        >
            <Title title="레이어 구성" icon={<AiOutlineControl/>}/>
            <Tabs 
                currentTab={currentTab} 
                setCurrentTab={setCurrentTab} 
                tabData={data.Layers}
            />
            <div>
                {tapContent(currentTab)}
            </div>
            {!isEmptyArray(layers.info) &&
                <>
                    <Title title="레이어 테이블"/>
                    <div className={style.subContainer}>
                        <LayerList 
                            style={{"maxHeight":"24rem"}}
                            data={layers.info}
                            isModel={layers.isModel}
                            isHandleRemove={true}
                            handleRemove={handleRemove}/>
                    </div>
                </>
            }
        </div>
    )
}

export default Layers

// tf.model 모델 지원
function Model({ disabled, setDisabled, ...props }) {
    const dispatch = useDispatch();

    const [value, setValue] = useState({});

    // 레이어 추가 함수
    const handleSubmit = (event) => {
        event.preventDefault();
        setDisabled(true);

        dispatch(settingActions.addModel(value))

        setDisabled(false);        
    }

    return (
        <form
            className={style.subContainer}
            onSubmit={handleSubmit}
        >
            {props.info.filter(n => n.name === "mainParams")[0].params
                .map( info => (
                    <Inputs
                        {...info}
                        value={value}
                        setValue={setValue}/>
            ))}
            <Button
                className="green center"
                style={{"width":"100%", "marginTop":"1.25rem"}}
                type="submit"
                disabled={disabled}>
                레이어 추가
            </Button>
        </form>
    )
}

// tf.sequential 모델 지원
function Sequence({ disabled, setDisabled, ...props }) {
    const dispatch = useDispatch();

    const [ isSubOpen, setSubOpen ] = useState(false);
    const [ value, setValue ] = useState({});

    // 레이어 추가 함수
    const handleSubmit = (event) =>{
        event.preventDefault();
        setDisabled(true);

        dispatch(settingActions.addLayer(value));
        
        setDisabled(false);
    }

    return(
        <form
            className={style.subContainer} 
            onSubmit={handleSubmit}
        >
            {props.info.filter((n)=> n.name === "mainParams")[0].params
                .map(v => (
                    <Inputs 
                        {...v}
                        value={value}
                        setValue={setValue}/>
            ))}
            <AdvancedSettingButton
                style={{"margin":"1rem 0"}}
                value={isSubOpen}
                setValue={setSubOpen}
            />
            {isSubOpen &&
                <>
                    {props.info.filter((n)=>n.name === "subParams")[0].params
                        .map(v => (
                            <Inputs 
                                {...v}
                                value={value}
                                setValue={setValue}
                            />
                    ))}
                </>
            }
            <Button
                className="green center"
                style={{"width":"100%", "marginTop":"3rem"}}
                type="submit"
                disabled={disabled}>
                레이어 추가
            </Button>
        </form>
    )
}