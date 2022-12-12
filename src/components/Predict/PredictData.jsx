import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "../Common/tab/Tabs";
import Inputs from "../Common/inputs/Inputs";
import { Button } from "../Common/button/Button";
import { isEmptyArray, isEmptyObject } from "../Common/module/checkEmpty";
import { getData } from "../Common/module/getData";
import { errorHandler } from "../Common/module/errorHandler";
import { makeRangeArray } from "../Common/module/package";
import { DrogDropFile } from "../LoadData/DrogDropFile";
import { Loader } from "../Common/loader/Loader";
import { testActions } from "../../reducers/testSlice";
import { GrAdd } from "react-icons/gr";
import * as dfd from "danfojs";
import mainStyle from "../Common/component.module.css";
import tableStyle from "../Common/table/table.module.css";

export const PredictData = ({children, style, className, ...props}) => {
    const [currentTab, setCurrentTab] = useState('1');

    const testSet = useSelector( state => state.test );

    const tabData = [
        {
            "id":"1",
            "title":"Custom Input"
        },
        {
            "id":"2",
            "title":"File Input"
        }
    ]

    const tapContent = (currentTab) => {
        const curContent = tabData.filter(tab => `${tab.id}` == currentTab);
        switch (curContent[0].id) {
            case "1":
                return <CustomInput
                            data={testSet.x}
                            columns={testSet.feature}/>
            case "2":
                return <FileInput
                            data={testSet.x}
                            columns={testSet.feature}/>
        }
    }

    return (
        <>
            <Tabs
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                tabData={tabData}
            />
            {tapContent(currentTab)}
        </>
    )
}

const CustomInput = ({children, className, style, ...props}) => {
    const dispatch = useDispatch();

    const [ sample, setSample ] = useState({});
    const [ inputShape, setInputShape ] = useState();
    const [ rangeArray, setRangeArray ] = useState([]);
    const [ hovering, setHovering ] = useState(false);

    useEffect(() => {
        if (!isEmptyArray(rangeArray)) {
            var newObj = new Object();

            if (isEmptyObject(sample)) {
                rangeArray.map( i => {
                    newObj[i] = null;
                })
            }
            else if (rangeArray.length <= Object.keys(sample).length) {
                Object.values(sample).map(( s, i ) => {
                    if (i < rangeArray.length) {
                        newObj[i] = s;
                    }
                })
            }
            else {
                newObj = {...sample};
                
                makeRangeArray(Object.keys(sample).length, rangeArray.length).map( i => {
                    newObj[i] = null;
                })
            }
            
            setSample(newObj);
        }
    }, [ rangeArray ])

    const handleMouseOver = useCallback(() => {
        !hovering &&
        setHovering(true);
    }, [hovering]);

    const handleMouseOut = useCallback(() => {
        !!hovering &&
        setHovering(false);
    }, [hovering]);

    const addData = () => {
        try {
            var temp = new Object();

            Object.entries(sample).map(value => {
                temp[value[0]] = [value[1]]
            })
    
            var newSample = dfd.toJSON(new dfd.DataFrame(temp), {
                format: "row"
            })
    
            dispatch(testActions.addSample(newSample));
        } catch(err) {
            errorHandler({
                message: err.message,
                statuscode: err.statuscode? err.statuscode: null
            })
        }
    }

    return (
        <>
            <div style={{"display":"flex",
                        "marginRight":"2.5rem",
                        "marginLeft":"2.5rem"}}>
                <Inputs
                    kind="input"
                    type="number"
                    mainTitle="입력값 모양"
                    title="inputShape"
                    default={0}
                    placeholder="정수만 입력"
                    min={1}
                    step={1}
                    value={inputShape}
                    setValue={setInputShape}
                    isValue={true}/>
                <Button
                    className="right"
                    type="button"
                    onClick={() => {
                            setRangeArray(makeRangeArray(0, parseInt(inputShape)))
                        }}>
                    적용
                </Button>
            </div>
            {!isEmptyArray(rangeArray) &&
                <div style={{"display":"flex"}}>
                    <div                         
                        className={`${hovering? "scrollhost":"disViable"}`}
                        onMouseLeave={handleMouseOut}
                        onMouseEnter={handleMouseOver}
                    >
                        <table>
                            <thead>
                                <tr key={"column"}>
                                    {rangeArray.map( i => (
                                        <th className={tableStyle.th}
                                            style={{"borderRight":"1px solid rgb(202, 202, 209)",
                                                    "borderLeft":"1px solid rgb(202, 202, 209)",
                                                    "borderBottom":"1px solid rgb(202, 202, 209)"}}>
                                            {i}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {rangeArray.map( i => (
                                        <td style={{"borderRight":"1px solid rgb(202, 202, 209)",
                                                    "borderLeft":"1px solid rgb(202, 202, 209)"}}>
                                            <input
                                                className={tableStyle.input}
                                                type="number"
                                                name={i}
                                                value={sample[i]}
                                                onChange={(e) => {
                                                    const { value, name } = e.target;

                                                    setSample(preValue => ({
                                                        ...preValue,
                                                        [name]: parseFloat(value)
                                                    }))
                                                }}/>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <button
                        style={{"display":"flex",
                                "width":"5rem",
                                "justifyContent":"center",
                                "alignItems":"center",
                                "font-size": "1.25rem 2rem",
                                "padding":"1rem 0"}}
                        type="button"
                        onClick={addData}>
                            <GrAdd />
                    </button>
                </div>
            }
        </>
    )
}

const FileInput = ({children, className, ...props}) => {
    const dispatch = useDispatch();

    const [ url, setUrl ] = useState("");
    const [ isLoading, setLoading ] = useState(false);

    const onClickHandler = () => {
        setLoading(true);

        getData(url)
        .then( response => {
            if (response.isError) {
                errorHandler(response.errorData);
            } else {
                dispatch(testActions.setData(response.data));
            }
        })
        .catch( err => {
            errorHandler({
                message: err.message,
                statuscode: null
            })
        })
        .finally( _ => {
            setLoading(false);
        })
    }


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

                dispatch(testActions.setData(newData));
                
                setLoading(false);

              };
            
            reader.readAsText(file);

        } catch (err) {
            setLoading(false);
            errorHandler({
                message: err.message,
                statuscode: null
            })
        }
    }

    return (
        <>
            { isLoading && <Loader type="spin" color="black" message={"Load Data"}/>}
            <div style={{"display":"flex",
                    "margin":"0 2.5rem"}}>
                <Inputs 
                    kind="text"
                    title="Load For Url"
                    placeholder="Url 입력"
                    value={url}
                    setValue={setUrl}
                    isValue={true}
                />
                <Button 
                    className="right"
                    type="button"
                    onClick={onClickHandler}
                >
                    불러오기
                </Button>
            </div>
            <DrogDropFile 
            title="Load For File"
            readFile={readFile}
            />
        </>
    )      
}