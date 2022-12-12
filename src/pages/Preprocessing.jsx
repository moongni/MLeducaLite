import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateViewData } from "../components/Common/module/getData"
import { isEmptyArray } from "../components/Common/module/checkEmpty"
import { contentView, selectColumn } from "../components/Common/module/package";
import { errorHandler } from "../components/Common/module/errorHandler";
import SetColumn  from "../components/Preprocessing/SetColumn";
import ArrayTable from "../components/Common/table/ArrayTable";
import Title from "../components/Common/title/title";
import Inputs from "../components/Common/inputs/Inputs";
import { Loader } from "../components/Common/loader/Loader";
import { Button } from "../components/Common/button/Button";
import { preprocess } from "../components/TF/Preprocess";
import { PreprocessingOptions } from "../components/Preprocessing/PreprocessingOption";
import { preprocessingActions } from "../reducers/preprocessingSlice";
import { testActions } from "../reducers/testSlice";
import { trainActions } from "../reducers/trainSlice";
import { MdOutlineToc } from "react-icons/md"
import mainStyle from '../components/Common/component.module.css';

const splitTrainTest = async (labelData, featureData, trainRatio) => {
    /* 
        labelData: Object
        featureData: Object
        trainRatio: Number

        return Object
    */

    const numSample = Object.values(labelData)[0].length;

    if ( numSample != Object.values(featureData)[0].length ) {
        return {
            isError: true,
            errorData: {
                "message": "데이터의 길이가 다릅니다. 초기화 후 다시 시도 해주세요",
                "statuscode": 2 
            }
        }
    }

    const features = Object.keys(featureData);
    const labels = Object.keys(labelData);

    const numTrainSample = Math.round(numSample * trainRatio);
    
    const testX = {}
    const testY = {}
    
    // testX, testY 초기화
    for ( const col of features ) {
        testX[col] = []
    }
    for ( const col of labels ) {
        testY[col] = []
    }

    // 랜덤으로 testX, testY 추가
    for ( var i = numSample; i > numTrainSample; i-- ) {
        var idx = Math.floor(Math.random() * i)

        for ( const col of features ) {
            testX[col].push(featureData[col].splice(idx, 1)[0]);
        }
        for ( const col of labels ) {
            testY[col].push(labelData[col].splice(idx, 1)[0]);
        }
    }

    return {
        isError: false,
        data: {
            trainX: featureData,
            trainY: labelData,
            testX: testX,
            testY: testY
        }
    }
}

const Preprocessing = () => {
    const dispatch = useDispatch();

    const data = useSelector( state => state.data.data );
    const dataColumns = useSelector( state => state.data.columns );

    const trainX = useSelector( state => state.train.feature );
    const trainY = useSelector( state => state.train.label );
    const process = useSelector( state => state.preprocess.train );
    const testX = useSelector( state => state.test.feature );
    const testY = useSelector( state => state.test.label );

    const [ isLoading, setLoading ] = useState(false);
    const [ splitRatio, setSplitRatio ] = useState();
    const [ nData, setNData ] = useState({"trainNData": 5, "testNData": 5});
    
    const initData = {
        'columns': [],
        'data': {},
        'shape': []
    }
    const [ viewTrainX, setViewTrainX ] = useState(initData);
    const [ viewTrainY, setViewTrainY ] = useState(initData);
    const [ viewTestX, setViewTestX ] = useState(initData);
    const [ viewTestY, setViewTestY ] = useState(initData);
    
    // splitRatio 값 검증
    useEffect(() => {
        if (splitRatio < 0.0 || splitRatio > 1.0) {
            alert("Please, check ratio of split set (0.0 ~ 1.0 available)");
            setSplitRatio(1.0)
        }
    }, [ splitRatio ])

    // 데이터 뷰 초기화
    useEffect(() => {
        updateViewData(trainX, setViewTrainX, nData.trainNData);
        updateViewData(trainY, setViewTrainY, nData.trainNData);
    },[ trainX, trainY ])

    useEffect(() => {
        updateViewData(testX, setViewTestX, nData.testNData);
        updateViewData(testY, setViewTestY, nData.testNData);
    }, [ testX, testY ])

    // 전처리 훈련 셋을 나눠 저장하는 함수
    async function setProcessedData() {
        try {
            dispatch(preprocessingActions.updateProcess({
                title: 'label',
                columns: trainY.columns,
                kind: "train"
            }));
    
            dispatch(preprocessingActions.updateProcess({
                title: 'feature',
                columns: trainX.columns,
                kind: "train"
            }))
    
            // 전처리 모듈 실행
            const { labelData, featureData } = await preprocess(selectColumn(data, trainY.columns), selectColumn(data, trainX.columns), process);

            // 훈련 셋 비율에 따라 데이터 저장
            if ( splitRatio == 1.0 || splitRatio == null) {
                dispatch(trainActions.setData({
                    title: "feature",
                    data: featureData
                    }))
            
                dispatch(trainActions.setData({
                    title: "label",
                    data: labelData
                }))
            } else {
                var response = await splitTrainTest(labelData, featureData, splitRatio);
    
                if (response.isError) {
                    return response;
                } else {
                    const { trainX, trainY, testX, testY } = response.data;
                    
                    dispatch(trainActions.setData({
                        title: "feature",
                        data: trainX
                        }))
                
                    dispatch(trainActions.setData({
                        title: "label",
                        data: trainY
                    }))
        
                    dispatch(testActions.setFeatureData(testX));
        
                    dispatch(testActions.setLabelData(testY));
        
                    dispatch(testActions.setData({
                        ...testX,
                        ...testY
                    }))
                }
            }
    
            return {
                isError: false
            }

        } catch (err) {
            console.log(err);
            return {
                isError: true,
                errorData: {
                    message: err.message,
                    statuscode: err.status? err.status: null
                }
            };
        }
    }

    // 전처리 적용 버튼 함수
    const onClickHandler = (e) => {
        e.preventDefault();
        setLoading(true);

        setProcessedData()
        .then( respose => {
            if ( respose.isError ) {
                errorHandler(respose.errorData);
            }
        })
        .finally( _ => setLoading(false))
    }

    const style = {
        CenterContainer: {
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
        },
        tableContainer: {
            "display":"flex",
            "justifyContent":"space-between",
            "marginRight":"2.5rem"
        },
        smallTitle: {
            "fontSize":"1.25rem", 
            "margin": "0.5rem 0"
        }
    }

    return (
        <>
            { isLoading && <Loader type="spin" color="black" message="Loading"/>}
            <div className={mainStyle.container}>
                <Title title="전처리 설정" icon={<MdOutlineToc/>} style={style.CenterContainer}/>
                <div className={mainStyle.subContainer}>
                    <Title title={"라벨 설정"} />
                    <div style={{"padding": "0 1rem"}}>
                        <SetColumn 
                            title={"열 선택"}
                            setData={trainActions.setLabelData}
                            setLoading={setLoading}
                            data={data}
                            dataColumns={dataColumns}
                            initFunction={() => {
                                dispatch(preprocessingActions.initOne({
                                    "title": "train",
                                    "initName": "label"
                                }))
                            }}
                        />
                        {!isEmptyArray(trainY.columns) &&
                            <PreprocessingOptions
                                title="label"
                                kind="train"
                                columns={trainY.columns}
                                preprocess={process.label}
                            />
                        }
                    </div>
                    <Title title="특성 설정" style={{"marginTop":"2rem"}}/>
                    <div style={{"padding": "0 1rem"}}>
                        <SetColumn
                            title={"열 선택"}
                            setData={trainActions.setFeatureData}
                            setLoading={setLoading}
                            data={data}
                            dataColumns={dataColumns}
                            initFunction={() => {
                                dispatch(preprocessingActions.initOne({
                                    "title": "train",
                                    "initName": "feature"
                                }))
                            }}
                        />
                        {!isEmptyArray(trainX.columns) &&
                            <PreprocessingOptions
                                title="feature"
                                kind="train"
                                columns={trainX.columns}
                                preprocess={process.feature}
                            />
                        }
                    </div>
                    <Title title="훈련셋, 테스트셋 나누기" style={{"marginTop":"2rem"}}/>
                    <div style={{"padding":"0 1rem"}}>
                        <Inputs
                            kind="float"
                            type="number"
                            title="train set ratio"
                            min={0.0}
                            max={1.0}
                            defaultValue={1.0}
                            step={0.01}
                            value={splitRatio}
                            setValue={setSplitRatio}
                            placeholder="0.0 ~ 1.0 train set ratio"
                            isValue={true}/>
                    </div>
                </div>
                <div style={style.CenterContainer}>
                    <Button 
                        className="red"
                        style={style.btn}
                        type="button"
                        onClick={() => {
                            dispatch(trainActions.initialize());
                            dispatch(preprocessingActions.initialize());
                            setViewTestX(initData);
                            setViewTestY(initData);
                            setViewTrainX(initData);
                            setViewTrainY(initData);
                        }}>
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
            </div>
            <div className={mainStyle.container}>
                <Title title="데이터 테이블"
                    icon={<MdOutlineToc/>}
                    style={style.CenterContainer}/>
                <div style={style.tableContainer}>
                    <Title title="훈련 셋" />
                    <div style={{"display":"flex"}}>
                        <Inputs
                            kind="input"
                            type="number"
                            mainTitle="데이터 뷰 개수"
                            title="trainNData"
                            placeholder="정수만 입력"
                            defaultValue={5}
                            step={1}
                            min={1}
                            max={trainX.shape[0]}
                            required={true}
                            value={nData}
                            setValue={setNData}/>
                        <Button
                            className="right dataView"
                            type="button"
                            onClick={() => {
                                updateViewData(trainX, setViewTrainX, nData.trainNData)
                                updateViewData(trainY, setViewTrainY, nData.trainNData)
                            }}>
                            적용
                        </Button>
                    </div>
                </div>
                <div className={mainStyle.subContainer}>
                    <Title title="라벨 데이터 테이블"
                        style={style.smallTitle}/>
                    <div className={mainStyle.subContainer}>
                        {contentView({
                            element: viewTrainY.columns,
                            children: <ArrayTable
                                        style={{"height":"24rem"}}
                                        data={viewTrainY}
                                        totalShape={trainY.shape}
                                        />,
                            checkFunction: isEmptyArray
                        })}
                    </div>
                        <Title title="특성 데이터 테이블"
                            style={style.smallTitle}/>
                        <div className={mainStyle.subContainer}>
                            {contentView({
                                element: viewTrainX.columns,
                                children: <ArrayTable
                                            style={{"height":"24rem"}}
                                            data={viewTrainX}
                                            totalShape={trainX.shape}
                                          />,
                                checkFunction: isEmptyArray
                            })}
                        </div>
                </div>
                <div style={style.tableContainer}>
                    <Title title="테스트 셋"/>
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
                            onClick={() => {
                                updateViewData(testX, setViewTestX, nData.testNData)
                                updateViewData(testY, setViewTestY, nData.testNData)
                            }}>
                            적용
                        </Button>
                    </div>
                </div>
                <div className={mainStyle.subContainer}>
                        <Title title="라벨 데이터 테이블"
                            style={style.smallTitle}/>
                        <div className={mainStyle.subContainer}>
                            {contentView({
                                element: viewTestY.columns,
                                children: <ArrayTable
                                            style={{"height":"24rem"}}
                                            data={viewTestY}
                                            totalShape={testY.shape}
                                          />,
                                checkFunction: isEmptyArray
                            })}
                        </div>
                        <Title title="특성 데이터 테이블"
                            style={style.smallTitle}/>
                        <div className={mainStyle.subContainer}>
                            {contentView({
                                element: viewTestY.columns,
                                children: <ArrayTable
                                            style={{"height":"24rem"}}
                                            data={viewTestX}
                                            totalShape={testX.shape}
                                          />,
                                checkFunction: isEmptyArray
                            })}
                        </div>
                </div>
            </div>
        </>
    )
}

export default Preprocessing;
