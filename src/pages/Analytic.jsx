import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { isEmptyObject, isEmptyStr, isEmptyArray } from "../components/Common/module/checkEmpty";
import { contentView } from "../components/Common/module/package";
import { ModelSelectModal, SettingSelectModal, HistorySelectModal } from "../components/Common/modal/modal";
import { ChartModal } from "../components/Common/modal/SaveModal";
import Title from "../components/Common/title/title";
import { LayerBoard, SettingBoard } from "../components/ModelDashBoard/Board";
import { Loader } from "../components/Common/loader/Loader";
import mainStyle from "../components/Common/component.module.css";
import { Button } from "../components/Common/button/Button";
import Inputs from "../components/Common/inputs/Inputs";
import { Bubble, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title as TitleJS,
    Tooltip,
    Legend,
    Colors
  } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TitleJS,
    Tooltip,
    Legend,
    Colors
);

const Analytic = () => {
    const history = useSelector( state => state.history.info );
    
    const [ model, setModel ] = useOutletContext();

    const [ isLoading, setLoading ] = useState(false);
    const [ modelModal, setModelModal ] = useState(false);
    const [ settingModal, setSettingModal ] = useState(false);
    const [ historyModal, setHistoryModal ] = useState(false);
    const [ chartModal, setChartModal ] = useState(false);

    const [ histData, setHistData ] = useState({
        datasets: []
    });
    const [ plotData, setPlotData ] = useState({
        datasets: []
    });
    const [ plotOpt, setPlotOpt ] = useState({});

    const histOpt = {
        reponsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: "History by Epochs"
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
            },
            x: {
                type: 'linear',
                display: true,
                title: {
                    display: true,
                    text: "epoch"
                }
            }
        }
    }

    // 히스토리 데이터 뷰 업데이트
    useEffect(() => {
        if ( !isEmptyObject(history) && 
             !isEmptyArray(history.history.loss) &&
             !isEmptyArray(history.history.acc) ) {
            setHistData({
                labels: history.epoch,
                datasets: [
                    {
                        label: "loss",
                        data: history.history.loss,
                        fill: false,
                        backgroundColor: "rgba(255, 99, 71, 0.05)",
                        borderColor: "rgba(255, 99, 71, 1)",
                        pointBackgroundColor: "rgba(255, 99, 71, 1)",
                        pointBorderColor: "rgba(255, 99, 71, 1)",
                        pointHoverBackgroundColor: "rgba(255, 99, 71, 1)",
                        pointHoverBorderColor: "rgba(255, 99, 71, 1)",
                    },
                    {
                        label: "accuracy",
                        data: history.history.acc,
                        fill: false,
                        backgroundColor: "rgba(78, 115, 223, 0.05)",
                        borderColor: "rgba(78, 115, 223, 1)",
                        pointBackgroundColor: "rgba(78, 115, 223, 1)",
                        pointBorderColor: "rgba(78, 115, 223, 1)",
                        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                        pointHoverBorderColor: "rgba(78, 115, 223, 1)",

                    }
                ]
            });
        }
    }, [ history ])

    const style = {
        btn: {
            "alignText":"center",
            "marginLeft":"auto"
        }
    }

    return (
        <>
            <ModelSelectModal
                modalShow={modelModal}
                setModalShow={setModelModal}
                setLoading={setLoading}
                setModel={setModel}/>
            <SettingSelectModal
                modalShow={settingModal}
                setModalShow={setSettingModal}/>
            <HistorySelectModal
                modalShow={historyModal}
                setModalShow={setHistoryModal}/>
            {isLoading && <Loader type="spin" color="black" message={"training..."} style={{"position":"fixed"}}/>}
            <div className={mainStyle.container}>
                <div style={{"display":"flex"}}>
                    <Title title="모델 정보"/>
                    <Button 
                        className="right"
                        type="button"
                        style={style.btn}
                        onClick={() => {
                            setModelModal(true);
                        }}
                        >
                        모델 선택
                    </Button>
                </div>
                <div className={mainStyle.subContainer}>
                    <LayerBoard />
                </div>
            </div>
            <div className={mainStyle.container}>
                <div style={{"display":"flex"}}>
                    <Title title="설정 정보"/>
                    <Button
                        className="right"
                        type="button"
                        style={style.btn}
                        onClick={() => {
                            setSettingModal(true);
                        }}>
                        설정 선택
                    </Button>
                </div>
                <div className={mainStyle.subContainer}>
                    <SettingBoard />
                </div>
            </div>
            <div className={mainStyle.container}>
                <div style={{"display":"flex"}}>
                    <Title title="히스토리 뷰"/>
                    <Button 
                        className="right"
                        type="button"
                        style={style.btn}
                        onClick={() => {
                            setHistoryModal(true);
                        }}
                        >
                        History 선택
                    </Button>
                </div>
                <div className={mainStyle.subContainer}>
                    {contentView({
                        element: histData.datasets, 
                        children:<Line options={histOpt} data={histData}/>, 
                        checkFunction: isEmptyArray})}
                </div>
            </div>
            <div className={mainStyle.container}>
                <div style={{"display":"flex"}}>
                    <Title title="데이터 시각화"/>
                    <Button 
                        className="right"
                        type="button"
                        style={style.btn}
                        onClick={() => {
                            setChartModal(true);
                        }}
                        >
                        데이터 조건 설정
                    </Button>
                </div>
                <PlotData
                    setPlotData={setPlotData}
                    setOption={setPlotOpt}
                    modalShow={chartModal}
                    setModalShow={setChartModal}
                    />
                <div className={mainStyle.subContainer}>
                    {contentView({
                        element: plotData.datasets, 
                        children: <Bubble options={plotOpt} data={plotData}/>,
                        checkFunction: isEmptyArray})}
                </div>
            </div>
        </>
    )
}

const PlotData = ({setPlotData, setOption, modalShow, setModalShow, ...props}) => {
    const trainSet = useSelector( state => state.train );

    const columns = trainSet.label.columns.concat(trainSet.feature.columns);
    const rowData = {
        ...trainSet.feature.data,
        ...trainSet.label.data
    }

    const [ xTick, setXTick ] = useState("");
    const [ yTick, setYTick ] = useState("");
    const [ viewOptions, setViewOptions ] = useState([]);

    // 플롯 데이터 뷰 업데이트
    useEffect( () => {
        if ( !isEmptyStr(xTick) && !isEmptyStr(yTick) ){
            setOption({
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: yTick
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: xTick
                        }
                    }
                }
            })
            
            if (isEmptyArray(viewOptions)) {
                setPlotData({                    
                    datasets: [
                        {
                            label: "Data",
                            data: Array.from(rowData[xTick], 
                                ( element, index ) => ({
                                    x: rowData[xTick][index],
                                    y: rowData[yTick][index],
                                    r: 5
                                })),
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        },
                    ]
                });
            } else {
                var newDatasets = []
                
                for ( const [ idx, option ] of viewOptions.entries() ) {
                    var idxArray = []
                    
                    rowData[option.column].map(( value, index ) => {
                        if (option.options.includes(`${value}`)) {
                            idxArray.push(index);
                        }                        
                    })

                    newDatasets.push({
                        label: `${option.column} - ${option.options}`,
                        data: Array.from(idxArray, 
                            ( element, index ) => ({
                                x: rowData[xTick][element],
                                y: rowData[yTick][element],
                                r: 5
                            })),
                    })

                }

                setPlotData({
                    datasets: newDatasets
                });
            }
        }

    }, [ xTick, yTick, viewOptions ])

    return (
        <>
            <ChartModal
                modalShow={modalShow}
                setModalShow={setModalShow}
                columns={columns}
                rowData={rowData}
                viewOptions={viewOptions}
                setViewOptions={setViewOptions}
            />
            <div style={{"display":"flex"}}>
                <Inputs
                    title="x-ticks"
                    kind="select"
                    value={xTick}
                    setValue={setXTick}
                    default={""}
                    defaultName={"select x-ticks"}
                    list={columns}
                    isValue={true}
                />
                <Inputs
                    title="y-ticks"
                    kind="select"
                    value={yTick}
                    setValue={setYTick}
                    default={""}
                    defaultName={"select y-ticks"}
                    list={columns}
                    isValue={true}
                />
            </div>
        </>
    )
}

export default Analytic;