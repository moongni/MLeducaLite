import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { preprocess } from "../components/TF/Preprocess";
import { PredictModel } from "../components/Predict/PredictModel";
import { isEmpty, isEmptyArray, isEmptyObject } from "../components/Common/module/checkEmpty";
import { updateViewData } from "../components/Common/module/getData";
import { makeRangeArray, contentView, selectColumn } from "../components/Common/module/package";
import { objectToTensor } from "../components/TF/ConvertToTensor";
import Title from "../components/Common/title/title";
import ArrayTable from "../components/Common/table/ArrayTable";
import Inputs from "../components/Common/inputs/Inputs";
import SetColumn from "../components/Preprocessing/SetColumn";
import { Button } from "../components/Common/button/Button";
import { PredictData } from "../components/Predict/PredictData";
import { Loader } from "../components/Common/loader/Loader";
import { PreprocessingOptions } from "../components/Preprocessing/PreprocessingOption";
import { preprocessingActions } from "../reducers/preprocessingSlice";
import { testActions } from "../reducers/testSlice";
import mainStyle from "../static/css/component.module.css";
import * as dfd from "danfojs";
import { errorHandler } from "../components/Common/module/errorHandler";


const Predict = () => {
    const dispatch = useDispatch();

    // redux
    const rowData = useSelector( state => state.test.rowData );
    const testX = useSelector( state => state.test.feature );
    const predY = useSelector( state => state.test.predData );
    const process = useSelector( state => state.preprocess.test );
    const yColumn = useSelector( state => state.train.label.columns );

    // 모델 정보
    const [ model, setModel ] = useOutletContext();
    
    const [ disable, setDisable ] = useState(true);
    const [ isLoading, setLoading ] = useState(false);

    // 데이터 뷰 정보
    const [ nData, setNData ] = useState({"testNData":5, "predNData":5});

    const initData = {
        'columns': [],
        'data': {},
        'shape': []
    };
    const [ viewTestX, setViewTestX ] = useState(initData);
    const [ viewPredY, setViewPredY ] = useState(initData)

    // 예측 버튼 활성화
    useEffect(() => {
        // 버튼 활성화 조건
        if ( !isEmptyObject(model) && !isEmptyObject(testX.data) ) {
            setDisable(false);
        } else {
            setDisable(true);
        }

        // 테스트 셋 데이터 뷰 초기화
        updateViewData(testX, setViewTestX, nData.testNData);

    }, [ model, testX.data ])
    
    // 예측 데이터 뷰 초기화
    useEffect(() => {
        // 예측 데이터 뷰 초기화
        updateViewData(predY, setViewPredY, nData.predNData);
    }, [ predY ])

    // 새로운 데이터 입력시 데이터 업데이트
    useEffect(() => {
        if ( !isEmptyArray(testX.columns) ) {
            dispatch(testActions.setFeatureData(selectColumn(rowData.data, testX.columns)))
        }
    }, [ rowData ])
    
    // 예측 진행 함수
    async function predict(model, testX) {
        const arrToObject = async ( data ) => {
            var colName = isEmpty(yColumn) || isEmptyArray(yColumn)? makeRangeArray(0, data[0].length) : yColumn;
            
            var ret = data.reduce(( acc, val ) => {
                if ( !isEmptyArray(val) ) {
                    val.map(( value, idx ) => {
                        if ( !isEmpty(acc[`${colName[idx]}`]) ) {
                            acc[`${colName[idx]}`].push(value);
                        } else {
                            acc[`${colName[idx]}`] = [value]
                        }
                    })
                }
                return acc;
            }, {})
    
            return ret;
        }
    
        var tensorData = objectToTensor(testX);
        var predData = await arrToObject((await model.predict(tensorData)).arraySync());
    
        return predData;
    }
    
    // 예측 버튼 함수
    const onClickPredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            var predData = await predict(model, testX.data);
    
            dispatch(testActions.setPredData(predData));
        } catch (err) {
            errorHandler({
                "message": err.message,
                "statuscode": null
            });
        }

        setLoading(false);
    }

    // 전처리 적용 함수
    const onClickHandler = async () => {
        setLoading(true);

        try {
            dispatch(preprocessingActions.updateProcess({
                title: 'feature',
                kind: "test",
                columns: testX.columns
            }))
            
            // 라벨 셋이 필요 없기 때문에 복사한 데이터 사용
            const cashData = selectColumn(rowData.data, testX.columns);
            const dummyData = cashData;
            
            const { labelData, featureData } = await preprocess(dummyData, cashData, process);
            
            dispatch(testActions.setFeatureData(featureData));
            

        } catch (err) {
            errorHandler({
                "message": err.message,
                "statuscode": null
            })
        }

        setLoading(false);
    }

    const style = {
        verticalBtnContainer: {
            "display":"flex",
            "flexDirection":"column",
            "fontSize":"1.25rem",
            "lineHeight":"1.75rem",
            "wordBreak":"break-word",
            "justifyContent":"space-between",
            "padding":"4rem"
        },
        horizonBtnContainer: {
            "position":"relative",
            "left":"50%",
            "display":"flex",
            "transform":"translateX(-50%)",
            "justifyContent":"center"
        },
        btn: {
            "width":"8rem",
            "margin":"0.5rem",
            "height":"2.5rem"
        }
    }
    
    return (
        <>
            {isLoading && <Loader type="spin" color="black" message={"Loading..."}/>}
            <div className={mainStyle.container}>
                <Title title="예측 데이터 준비"/>
                <div className={mainStyle.subContainer}>
                    <PredictData/>
                </div>
                <div style={{"display":"flex",
                        "justifyContent":"space-between" ,
                        "marginRight":"2.5rem"}}>
                    <Title title="데이터 테이블"/>
                    <div style={{"display":"flex"}}>
                        <Inputs
                            kind="input"
                            type="number"
                            mainTitle="데이터 뷰 개수"
                            title="testNData"
                            placeholder="정수만 입력"
                            defaultValue={5}
                            step={1}
                            min={1}
                            max={testX.shape[0]}
                            required={true}
                            value={nData}
                            setValue={setNData}/>
                        <Button
                            className="right dataView"
                            type="button"
                            onClick={() => updateViewData(testX, setViewTestX, nData.testNData)}>
                            적용
                        </Button>
                    </div>
                </div>
                {!isEmptyArray(rowData.columns) &&
                    <SetColumn
                        title={"열 선택"}
                        style={{"padding":"0 1rem"}}
                        setData={testActions.setFeatureData}
                        setLoading={setLoading}
                        data={rowData.data}
                        dataColumns={rowData.columns}/>
                }
                <div className={mainStyle.subContainer}>
                    {contentView({
                        element: viewTestX.columns,
                        children: 
                        <>
                            <ArrayTable 
                                style={{"maxHeight":"24rem"}}
                                data={viewTestX}
                                totalShape={testX.shape}/>
                            <PreprocessingOptions
                                title="feature"
                                kind="test"
                                columns={testX.columns}
                                preprocess={process.feature}
                            />
                            <div style={style.horizonBtnContainer}>
                                <Button 
                                    className="red"
                                    style={style.btn}
                                    type="button"
                                    onClick={() => {
                                        dispatch(testActions.initialize());
                                        dispatch(preprocessingActions.initialize());
                                        setViewTestX({
                                            'columns': [],
                                            'data': {},
                                            'shape': []
                                        });
                                    }}
                                >
                                    초기화
                                </Button>
                                <Button 
                                    className="green"
                                    style={style.btn}
                                    type="button"
                                    onClick={onClickHandler}
                                    >
                                    적용
                                </Button>
                            </div>

                        </>,
                        checkFunction: isEmptyArray
                    })}
                </div>
            </div>
            <div className={mainStyle.container}>
                <Title title="예측 모델 준비"/>
                <div className={mainStyle.subContainer}>
                    <PredictModel 
                        model={model}
                        setModel={setModel}/>
                </div>
                <Button
                    className="center green"
                    style={{"width":"100px"}}
                    type="button"
                    disabled={disable}
                    onClick={onClickPredict}
                >
                    예측
                </Button>
            </div>
            {!isEmptyArray(predY.columns) &&
                <div className={mainStyle.container}>
                    <div style={{"display":"flex",
                        "justifyContent":"space-between" ,
                        "marginRight":"2.5rem"}}>
                        <Title title="예측 결과 데이터 테이블"/>
                        <div style={{"display":"flex"}}>
                            <Inputs
                                kind="input"
                                type="number"
                                mainTitle="데이터 뷰 개수"
                                title="predNData"
                                placeholder="정수만 입력"
                                defaultValue={5}
                                step={1}
                                min={1}
                                max={predY.shape[0]}
                                required={true}
                                value={nData}
                                setValue={setNData}/>
                            <Button
                                className="right dataView"
                                type="button"
                                onClick={() => updateViewData(predY, setViewPredY, nData.predNData)}>
                                적용
                            </Button>
                        </div>
                    </div>
                    <div className={mainStyle.subContainer}
                        style={{"display":"flex"}}>
                            <div style={{"width":"100%"}}>
                                <ArrayTable
                                    style={{"height":'24rem'}}
                                    data={viewPredY}
                                    totalShape={predY.shape}/>
                            </div>
                            <div style={style.verticalBtnContainer}>
                                <Button
                                    type="button"
                                    children="download as csv"
                                    onClick={() => {
                                        try {
                                            var df = new dfd.DataFrame(predY.data);

                                            dfd.toCSV(df, {download: true});
                                        
                                        } catch (err) {
                                            errorHandler({
                                                "message": err.message,
                                                "statuscode": null
                                            })
                                        }
                                    }}/>
                                <Button
                                    type="button"
                                    children="download as json"
                                    onClick={() => {
                                        try {
                                            var df = new dfd.DataFrame(predY.data);

                                            dfd.toJSON(df, {download: true});
                                        } catch (err) {
                                            errorHandler({
                                                "message": err.message,
                                                "statuscode": null
                                            })
                                        }
                                    }}/>
                            </div>
                    </div>
                        
                </div>
            }
        </>
    )
}

export default Predict;