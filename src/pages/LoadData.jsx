import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData, updateViewData } from "../components/Common/module/getData"
import { isEmptyArray } from "../components/Common/module/checkEmpty"
import { contentView } from "../components/Common/module/package"
import { errorHandler } from "../components/Common/module/errorHandler";
import Inputs from "../components/Common/inputs/Inputs";
import ArrayTable from "../components/Common/table/ArrayTable";
import Title from "../components/Common/title/title";
import { DrogDropFile } from "../components/LoadData/DrogDropFile";
import { Button } from "../components/Common/button/Button";
import { Loader } from "../components/Common/loader/Loader";
import { trainActions } from "../reducers/trainSlice";
import { testActions } from "../reducers/testSlice";
import { preprocessingActions } from "../reducers/preprocessingSlice";
import { dataActions } from "../reducers/dataSlice";
import { FiDatabase } from "react-icons/fi";
import style from "../static/css/component.module.css";
import * as dfd from "danfojs";

const LoadData = () => {
    const dispatch = useDispatch();

    // data redux
    const data = useSelector( state => state.data );

    const [ isLoading, setLoading ] = useState(false);

    // 데이터 뷰 정보
    const [ nData, setNData ] = useState(5);
    const [ viewData, setViewData ] = useState({
        'columns': [],
        'data': {},
        'shape': []
    });
    
    // 데이터 뷰 초기화
    useEffect(() => {
        updateViewData(data, setViewData, nData);
    }, [ data ])

    // url 불러오기 함수
    const [ url, setUrl ] = useState("");

    const onClickHandler = () => {
        setLoading(true);
        
        dispatch(trainActions.initialize());
        dispatch(testActions.initialize());
        dispatch(preprocessingActions.initialize());
        dispatch(dataActions.initialize());
        setViewData({
            'columns': [],
            'data': {},
            'shape': []
        });

        getData(url)
        .then( response => {
            if (response.isError) {
                errorHandler(response.errorData);
            } else {
                dispatch(dataActions.setData(response.data));
            }
        })
        .catch( err => {
            errorHandler({
                message: err.message,
                statuscode: err.status? err.status: null
            })
        })
        .finally( _ => {
            setLoading(false);
        })
    }

    // 파일 불러오기 함수
    const readFile = (file, type) => {
        setLoading(true);

        try {
            var reader = new FileReader();

            reader.onload = async function(e) {
                let newData = {};

                switch(type){
                    case "application/json":
                        const jsonDf = await dfd.readJSON(file);

                        newData = dfd.toJSON(jsonDf, { format: 'row' })

                        break;

                    case "text/csv":
                        const csvDf = await dfd.readCSV(file);

                        newData = dfd.toJSON(csvDf, { format: 'row' });

                        break;

                    default:
                        setLoading(false);

                        errorHandler({
                            message: "파일 형식이 맞지 않습니다. json, csv 파일만 지원합니다.",
                            statuscode: 1
                        })
                    }
                

                dispatch(dataActions.setData(newData));

                setLoading(false);
            };
            
            reader.readAsText(file);
            
        } catch (err) {
            setLoading(false);
            errorHandler({
                message: err.message,
                statuscode: err.status? err.status: null
            })
        }
    }

    return (
        <div className={style.container}>
            { isLoading && <Loader type="spin" color="black" message={"Load Data"}/>}
            <Title title="데이터 적재" icon={<FiDatabase/>}/>
            <div className={style.subContainer}>
                <div className={style.flexContainer}>
                    <Inputs 
                        kind="text"
                        title="Url로 불러오기"
                        placeholder="Url 입력"
                        value={url}
                        setValue={setUrl}
                        isValue={true}/>
                    <Button
                        className="right"
                        style={{"marginRight":"1rem"}}
                        type="button" 
                        onClick={onClickHandler}>
                        불러오기
                    </Button>
                </div>
                <DrogDropFile 
                    title="File로 불러오기"
                    readFile={readFile}
                />
            </div>
            <div style={{"display":"flex",
                        "justifyContent":"space-between",
                        "marginRight":"2.5rem"}}>
                <Title title="데이터 테이블"  icon={<FiDatabase/>}/>
                <div style={{"display":"flex"}}>
                    <Inputs
                        kind="input"
                        type="number"
                        mainTitle="데이터 뷰 개수"
                        title="nData"
                        placeholder="정수만 입력"
                        defaultValue={5}
                        step={1}
                        min={1}
                        max={data.shape[0]}
                        required={true}
                        value={nData}
                        setValue={setNData}
                        isValue={true}/>
                    <Button
                        className="right dataView"
                        type="button"
                        onClick={() => updateViewData(data, setViewData, nData)}>
                        적용
                    </Button>
                </div>
            </div>
            <div className={style.subContainer}>
                {contentView({
                    element: viewData.columns,
                    children: <ArrayTable 
                                style={{"height":"24rem"}}
                                data={viewData}
                                totalShape={data.shape}/>,
                    checkFunction: isEmptyArray
                })}
            </div>
        </div>
    );
}

export default LoadData;