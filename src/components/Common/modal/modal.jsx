import React, { useState, useEffect, useRef } from "react";
import ReactModal from "react-modal";
import { useDispatch } from "react-redux";
import { isEmpty, isEmptyObject, isEmptyStr } from "../module/checkEmpty";
import { Button } from "../button/Button";
import * as tf from "@tensorflow/tfjs";
import Inputs from "../inputs/Inputs";
import Tabs from "../tab/Tabs";
import { settingActions } from "../../../reducers/settingSlice";
import { historyActions } from "../../../reducers/historySlice";
import { preprocessingActions } from "../../../reducers/preprocessingSlice";
import { errorHandler } from "../module/errorHandler";
import Title from "../title/title";

const style = {
    mainContainer: {
        "display":"flex",
        "width":"100%",
        "justifyContent":"space-between",
        "padding": "1.5rem 1rem"
    },
    span: {
        "display":"flex", 
        "alignItems":"center"
    },
    btnContainer: {
        "position":"absolute",
        "bottom":"0.75rem",
        "left":"50%",
        "display":"flex",
        "transform":"translateX(-50%)",
        "justifyContent":"center"
    },
    btn: {
        "width":"8rem",
        "margin":"0.5rem",
        "height":"2.5rem"
    },
    labelStyle: {
        display: "inline-block",
        padding: ".5em .75em",
        color: "#999",
        fontSize: "inherit",
        lineHeight: "normal",
        verticalAlign: "middle",
        backgroundColor: "#fdfdfd",
        cursor: "pointer",
        border: "1px solid #ebebeb",
        borderBottomColor: "#e2e2e2",
        borderRadius: ".25em",
    },
    nameStyle: {
        display: "inline-block",
        padding: ".5em .75em",
        marginRight: "3px",
        fontSize: "inherit",
        fontFamily: "inherit",
        lineHeight: "normal",
        verticalAlign: "middle",
        backgroundColor: "#f5f5f5",
        border: "1px solid #ebebeb",
        borderBottomColor: "#e2e2e2",
        borderRadius: ".25em",
        WebkitAppearance: "none",
        MozAppearance: "none",
        appearance: "none",
    }
}

const Modal = ({children, style, ...props}) => {

    return (
        <ReactModal
            isOpen={props.isShow}
            contentLabel={props.label}
            style={{
                ...style,
                overlay: {
                },
                content: {
                    position: "fixed",
                    display:"flex",
                    flexDirection: "column",
                    justifyContent:"left",
                    top:"50%",
                    left:"50%",
                    minWidth:"500px",
                    minHeight: "450px",
                    maxHeight: "50%",
                    overflow:"hidden",
                    transform:'translate(-50%, -50%)',
                    color: 'black'
                }
            }}>
            {children}
        </ReactModal>
    )
}

export default Modal


export const ModelSelectModal = ({ modalShow, setModalShow, ...props }) => {
    const dispatch = useDispatch();

    const [ currentTab, setCurrentTab ] = useState('1');
    const [ locValue, setLocValue ] = useState("");
    const [ downValue, setDownValue ] = useState({});

    // 모델 불러오기 함수
    async function loadModel(url) {
        try {
            var model = await tf.loadLayersModel(url);

            dispatch(settingActions.initLayer());
            
            // layer update
            try {
                model.layers.map( layer => {
                    if ( layer.constructor.name === "InputLayer" ) {
        
                        dispatch(settingActions.addModel({
                            "shape":layer.batchInputShape
                        }))
        
                    } else {
                        const newLayer = {
                            "units":layer.units,
                            "inputShape":layer.batchInputShape.filter( shape => shape != null ),
                            "activation":layer.activation.constructor.name.toLowerCase(),
                        }
        
                        dispatch(settingActions.addLayer(newLayer));
                    }
                })
            } catch (err) {
                dispatch(settingActions.initLayer());
                
                throw new Error("신경망 정보를 읽어올 수 없습니다.")
            }
            
            // 모델 설정
            if (props.setModel) {
                props.setModel(model);
                console.log(model);
            }

        } catch ( err ) {
            if ( err.message.includes("modelTopology")) {
                errorHandler({
                    "message": "파일을 불러오는데 실패하였습니다.",
                    "statuscode": 2
                })
                return;
            }

            errorHandler({
                    "message": err.message,
                    "statuscode": err.status? err.status: null
            })
        }
    }

    // 저장 버튼 함수
    const onClickHandler = (event) => {
        event.preventDefault();

        try {
            if (currentTab == '1') {
                if (isEmptyStr(locValue) || locValue == "model List") {
                    throw new Error("불러올 모델을 선택해주세요");
                }
                
                loadModel(locValue);
            } else {
                if (isEmptyObject(downValue)) {
                    throw new Error("모델을 불러와 주세요.");
                }
                if (isEmptyObject(downValue.model)) {
                    throw new Error("모델 파일을 불러와주세요");
                }
                if (isEmptyObject(downValue.weight)) {
                    throw new Error("가중치 파일을 불러와주세요");
                }
                if (downValue.model.type !== "application/json") {
                    throw new Error(`모델 파일 형식이 잘못되었습니다. \n입력파일: ${downValue.model.type}`);
                }
                if (downValue.weight.type !== "application/octet-stream") {
                    throw new Error(`가중치 파일 형식이 잘못되었습니다. \n입력파일: ${downValue.weight.type}`);
                }

                loadModel(tf.io.browserFiles([downValue.model, downValue.weight]));
            }
            
            setModalShow(false);
                
        } catch ( err ) {
            errorHandler({
                "message": err.message,
                "statuscode": err.status? err.status: null
            })
        }
    }

    const tabInfo = [
        {
            "id": 1,
            "title":"localstorage"
        },
        {
            "id": 2,
            "title":"download"
        }
    ]

    const tabContent = ( currentTab ) => {
        const curContent = tabInfo.filter(tab => `${tab.id}` == currentTab);
        
        switch (curContent[0].title) {
            case "localstorage":
                return <Localstorage 
                            value={locValue}
                            setValue={setLocValue}/>
            case "download":
                return <Download 
                            value={downValue}
                            setValue={setDownValue}/>
        }
    }
    
    return (
        <Modal
            isShow={modalShow}
        >
            <Tabs
                style={{"backgroundColor":"#ffffff"}}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                tabData={tabInfo}
            />
            <div>
                {tabContent(currentTab)}
            </div>

            <div style={style.btnContainer}> 
                <Button
                    className="red"
                    style={style.btn}
                    type="button"
                    onClick={() => {
                        setModalShow(false)}}>
                    닫기
                </Button>
                <Button
                    className="green"
                    style={style.btn}
                    type="button"
                    onClick={(e) => onClickHandler(e)}>
                    저장
                </Button>
            </div>
        </Modal>
    )
}

const Localstorage = ({ value, setValue, ...props }) => {
    const [ modelList, setModelList ] = useState([]);

    // 모델 목록 업데이트
    useEffect(() => {
        const modelList = async () => {
            const ret = await tf.io.listModels();
            return ret
        }

        modelList().then( result => {
            setModelList(Object.keys(result));
        });

    }, [])

    return (
        <div style={{"display":"flex",
                    "paddingBottom":"280px"}}>
            <Inputs 
                kind="select"
                mainTitle="모델 선택"
                style={{"marginLeft":"1.5rem"}}
                value={value}
                setValue={setValue}
                defaultName="model List"
                list={modelList}
                isValue={true}/>
        </div>
    )
}

const Download = ({ value, setValue, ...props }) => {
    const [ modelFile, setModelFile ] = useState({});
    const [ weightFile, setWeightFile ] = useState({});
    const [ modelName, setModelName ] = useState("");
    const [ weightName, setWeightName ] = useState("");

    const modelInput = useRef(null);
    const weigthInput = useRef(null);

    const modelChangeHandler = (event) => {
        setModelFile(event.target.files[0]);

        setModelName(event.target.files[0].name);
    }

    const weigthChangeHandler = (event) => {
        setWeightFile(event.target.files[0]);

        setWeightName(event.target.files[0].name);
    }

    useEffect(() => {
        setValue({
            "model": modelFile,
            "weight": weightFile
        })
    }, [ modelFile, weightFile ])

    return (
        <div style={{"display":"flex",
                    "flexDirection":"column",
                    "paddingBottom":"280px"}}>
            <div style={style.mainContainer}>
                <span style={style.span}>모델 선택</span>
                <div>
                    <input className="upload-name" value={isEmptyStr(modelName)? "파일 선택": modelName} disabled="disabled"
                        style={style.nameStyle}/>
                    <label  style={style.labelStyle}
                            onClick={() => {
                                modelInput.current.click();
                            }}
                    >
                        업로드
                    </label>
                    <input
                        id="json_upload" 
                        type="file"
                        ref={modelInput}
                        multiple={false}
                        onChange={modelChangeHandler}
                        style={{"display":"none"}}>
                    </input>
                </div>
            </div>
            <div style={style.mainContainer}>
                <span style={style.span}>가중치 선택</span>
                <div>
                    <input className="upload-name" value={isEmptyStr(weightName)? "파일 선택": weightName} disabled="disabled"
                        style={style.nameStyle}/>
                    <label  style={style.labelStyle}
                            onClick={() => {
                                weigthInput.current.click();
                            }}
                    >
                        업로드
                    </label>
                    <input
                        id="weight_upload" 
                        type="file"
                        ref={weigthInput}
                        multiple={false}
                        onChange={weigthChangeHandler}
                        style={{"display":"none"}}>
                    </input>
                </div>
            </div>
        </div>
    )
}

export const HistorySelectModal = ({ modalShow, setModalShow, ...props }) => {
    const dispatch = useDispatch();

    const histInput = useRef(null);

    const [ histName, setHistName ] = useState("");
    const [ histFile, setHistFile ] = useState({});

    const histChangeHandler = (event) => {
        const onReaderLoad = (event) => {
            var obj = JSON.parse(event.target.result);

            setHistFile(obj);
        }

        try {
            if (event.target.files[0].type !== "application/json") {
                throw new Error(`json 파일이 아닙니다. \n입력 파일: ${event.target.files[0].type}`);
            }

            var reader = new FileReader();
            reader.onload = onReaderLoad;
            reader.readAsText(event.target.files[0]);
    
            setHistName(event.target.files[0].name);
        } catch (err) {
            errorHandler({
                "message": err.message,
                "statuscode": err.status? err.status: null
            })
        }
    }

    // 저장 버튼 함수
    const onClickHandler = () => {
        try {
            if (isEmptyObject(histFile)) {
                throw new Error("History 파일을 불러와주세요");
            }
            if (isEmpty(histFile.history)) {
                throw new Error("파일을 불러오는데 실패하였습니다.");
            }

            dispatch(historyActions.setHist(histFile));
    
            setModalShow(false);
        } catch (err) {
            errorHandler({
                "message": err.message,
                "statuscode": err.status? err.status: null
            })
        }
    }


    return (
        <Modal isShow={modalShow}>
            <Title  title="History 파일 선택" />
            <div style={style.mainContainer}>
                <span style={style.span}>History 선택</span>
                <div>
                    <input className="upload-name" value={isEmptyStr(histName)? "파일 선택": histName} disabled="disabled"
                        style={style.nameStyle}/>
                    <label  style={style.labelStyle}
                            onClick={() => {
                                histInput.current.click();
                            }}
                    >
                        업로드
                    </label>
                    <input
                        id="hist_upload" 
                        type="file"
                        ref={histInput}
                        multiple={false}
                        onChange={histChangeHandler}
                        style={{"display":"none"}}>
                    </input>
                </div>
            </div>
            <div style={style.btnContainer}
            > 
                <Button
                    className="red"
                    style={style.btn}
                    type="button"
                    onClick={() => setModalShow(false)}>
                    close
                </Button>
                <Button
                    className="green"
                    style={style.btn}
                    type="button"
                    onClick={onClickHandler}>
                    save
                </Button>
            </div>
        </Modal>
    )
}

export const SettingSelectModal = ({ modalShow, setModalShow, ...props }) => {
    const dispatch = useDispatch();

    const settingInput = useRef(null);
    
    const [ settingName, setsettingName ] = useState("");
    const [ settingFile, setsettingFile ] = useState({});

    const settingChangeHandler = (event) => {
        const onReaderLoad = (event) => {
            var obj = JSON.parse(event.target.result);
            
            setsettingFile(obj);

        }

        try {
            if (event.target.files[0].type !== "application/json") {
                throw new Error(`json 파일이 아닙니다. \n입력 파일: ${event.target.files[0].type}`);
            }

            var reader = new FileReader();
            reader.onload = onReaderLoad;
            reader.readAsText(event.target.files[0]);
            
            setsettingName(event.target.files[0].name);
        } catch (err) {
            errorHandler({
                "message": err.message,
                "statuscode": err.status? err.status: null
            })
        }
    }

    // 저장 버튼 함수
    const onClickHandler = () => {
        try {
            if (isEmptyObject(settingFile)) {
                throw new Error("setting 파일을 불러와주세요.");
            }
            if (isEmpty(settingFile.compile) || isEmpty(settingFile.parameter) || isEmpty(settingFile.preprocess)) {
                throw new Error("파일을 불러오는데 실패하였습니다.");
            }

            dispatch(settingActions.setParam(settingFile.parameter.info));
            dispatch(settingActions.setOptimizer(settingFile.compile.optimizer));
            dispatch(settingActions.setLoss(settingFile.compile.loss));
            dispatch(preprocessingActions.loadProcess(settingFile.preprocess));

            setModalShow(false);
            
        } catch (err) {
            errorHandler({
                "message": err.message,
                "statuscode": err.status? err.status: null
            })
        }
    }

    return (
        <Modal isShow={modalShow}>
            <Title  title="Setting 파일 선택" />
            <div style={style.mainContainer}>
                <span style={style.span}>Setting 불러오기</span>
                <div>
                    <input className="upload-name" value={isEmptyStr(settingName)? "파일 선택": settingName} disabled="disabled"
                        style={style.nameStyle}/>
                    <label  style={style.labelStyle}
                            onClick={() => {settingInput.current.click();}}
                    >
                        업로드
                    </label>
                    <input
                        id="hist_upload" 
                        type="file"
                        ref={settingInput}
                        multiple={false}
                        onChange={settingChangeHandler}
                        style={{"display":"none"}}>
                    </input>
                </div>
            </div>
            <div style={style.btnContainer}
            > 
                <Button
                    className="red"
                    style={style.btn}
                    type="button"
                    onClick={() => setModalShow(false)}>
                    close
                </Button>
                <Button
                    className="green"
                    style={style.btn}
                    type="button"
                    onClick={onClickHandler}>
                    save
                </Button>
            </div>
        </Modal>
    )
}