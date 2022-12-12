import React, { useState, useEffect, useCallback } from "react";
import Modal from "./modal";
import { Button } from "../button/Button";
import Inputs from "../inputs/Inputs";
import mainStyle from "../component.module.css";
import Title from "../title/title";
import { toArray, toOption } from "../module/option";
import { hashMap } from "../module/package";
import { isEmptyArray, isEmptyStr } from "../module/checkEmpty";
import { MultiSelect } from "react-multi-select-component";
import { AiOutlineDelete } from "react-icons/ai";

const style = {
    container: {
        "height":"14rem"
    },
    btnContainer: {
        "position":"absolute",
        "bottom":"0",
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
    inputContainer: {
        "position":"relative",
        "flexGrow": "1",
        "width":"100%",
        "textAlign":"center",
    }
}

export const SaveModal = ({ modalShow, setModalShow, data, ...props }) => {
    const [ fileName, setFileName ] = useState('');
    const [ hovering, setHovering ] = useState(false);
    
    const handleMouseOver = useCallback(() => {
        !hovering &&
        setHovering(true);
    }, [hovering]);

    const handleMouseOut = useCallback(() => {
        !!hovering &&
        setHovering(false);
    }, [hovering]);


    return (
        <Modal
            isShow={modalShow}
        >
            <Title title={props.title}/>
            <div className={`${hovering? "scrollhost":"disViable"} ${mainStyle.subContainer}`}
                style={style.container}
                onMouseLeave={handleMouseOut}
                onMouseEnter={handleMouseOver}
            >
                {JSON.stringify(data)}
            </div>
            <form style={style.inputContainer}
                onSubmit={(e) => props.submitHandler(e, data, fileName)}>
                <Inputs
                    title="file name"
                    kind="text"
                    style={{"paddingLeft":"4rem"}}
                    value={fileName}
                    setValue={setFileName}
                    placeholder="write file name"
                    required={true}
                    isValue={true}
                    />
                <div style={style.btnContainer}> 
                    <Button
                        className="red"
                        style={style.btn}
                        type="button"
                        onClick={() => {
                            setModalShow(false)}}>
                        close
                    </Button>
                    <Button
                        className="green"
                        style={style.btn}
                        type="submit">
                        save
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export const LocalSave = ({ modalShow, setModalShow, data, ...props }) => {
    const [ fileName, setFileName ] = useState('');
    const [ hovering, setHovering ] = useState(false);
    
    const handleMouseOver = useCallback(() => {
        !hovering &&
        setHovering(true);
    }, [hovering]);

    const handleMouseOut = useCallback(() => {
        !!hovering &&
        setHovering(false);
    }, [hovering]);

    return (
        <Modal
            isShow={modalShow}
        >
            <Title title={props.title}/>
            <div className={`${hovering? "scrollhost":"disViable"} ${mainStyle.subContainer}`}
                style={style.container}
                onMouseLeave={handleMouseOut}
                onMouseEnter={handleMouseOver}
            >
                {JSON.stringify(data)}
            </div>
            <form style={style.inputContainer}
                onSubmit={(e) => props.submitHandler(e, data, fileName)}>
                <Inputs
                    title="file name"
                    kind="text"
                    style={{"paddingLeft":"4rem"}}
                    value={fileName}
                    setValue={setFileName}
                    placeholder="write file name"
                    required={true}
                    isValue={true}
                    />
                <div style={style.btnContainer}> 
                    <Button
                        className="red"
                        style={style.btn}
                        type="button"
                        onClick={() => {
                            setModalShow(false)}}>
                        close
                    </Button>
                    <Button
                        className="green"
                        style={style.btn}
                        type="submit">
                        save
                    </Button>
                </div>
            </form>

        </Modal>
    )
}

export const ChartModal = ({ modalShow, setModalShow, columns, rowData, viewOptions, setViewOptions, ...props }) => {
    const [ hovering, setHovering ] = useState(false);
    
    const handleMouseOver = useCallback(() => {
        !hovering &&
        setHovering(true);
    }, [hovering]);

    const handleMouseOut = useCallback(() => {
        !!hovering &&
        setHovering(false);
    }, [hovering]);

    const [ column, setColumn ] = useState("");
    const [ columnValue, setColumnValue ] = useState([]);
    
    const [ splitOptions, setSplitOptions ] = useState([]);
    const [ splitValue, setSplitValue ] = useState([]);

    const [ tempOptions, setTempOptions ] = useState(viewOptions);

    // 열 이름 목록 업데이트
    useEffect(() => {
        if (!isEmptyArray(columnValue)) {
            setColumn(toArray(columnValue)[0]);
        }
    }, [ columnValue ])

    // 조건 목록 업데이트
    useEffect(() => {
        if (column) {
            var newOptions = toOption(Object.keys(hashMap(rowData[column])))

            setSplitOptions(newOptions);
        }    
    }, [ column ])

    // 조건 추가 버튼 함수
    const onAddClick = () => {
        if (!isEmptyStr(column) && !isEmptyArray(splitValue)){
            setTempOptions( preValue => 
                [ ...preValue, {
                        "column": column, 
                        "options": toArray(splitValue)
                    }
                ]);
        } else {
            alert("열과 조건을 모두 입력해주세요.");
        }
    }
    
    // 조건 삭제 함수
    const handleRemove = (idx) => {
        setTempOptions( preValue => (
            preValue.filter(( _, index) => index != idx)
        ))
    }

    const tableStyle = {
        tr: {
            "padding": "0 2rem",
        },
        th: {
            "position": "sticky",
            "top": "0",
            "minWidth": "150px",
            "textAlign": "center",
            "padding": "0.75rem",
            "fontWeight": "500",
            "backgroundColor": "rgb(248 250 252)"
        },
        td: {
            "padding": "0.75rem 1rem",
            "width": "1.25rem",
            "textAlign": "center",
            "margin-right": "0.5rem",
            "fontWeight": "100",
            "letter-spacing": "0.1em",
        },
        removeTd: {
            "cursor": "pointer",
            "padding": "0.75rem 1rem",
            "width": "1.25rem",
            "textAlign": "center",
            "textAlign": "center",
            "margin-right": "0.5rem",
            "letter-spacing": "0.1em",
        },
    }

    return (
        <Modal isShow={modalShow}>
            <Title title="차트 설정"/>
            <div style={{"display":"flex", "justifyContent":"space-between"}}>
                <div style={{"display":"flex", "flexDirection":"column", "width":"40%"}}>
                    <Title title="열 선택" style={{"fontSize": "1rem"}}/>
                    <MultiSelect
                        value={columnValue}
                        hasSelectAll={false}
                        options={toOption(columns)}
                        onChange={setColumnValue}
                        labelledBy="Select"/>
                </div>
                <div style={{"display":"flex", "flexDirection":"column", "width":"40%"}}>
                    <Title title="조건" style={{"fontSize": "1rem"}}/>
                    <MultiSelect
                        value={splitValue}
                        hasSelectAll={false}
                        options={splitOptions}
                        onChange={setSplitValue}
                        labelledBy="Select"/>
                </div>
                <Button
                    style={{"width":"10%", "paddingTop":"32px"}}
                    type="button"
                    onClick={onAddClick}>
                        추가
                </Button>
            </div> 
            <div className={`${hovering? "scrollhost":"disViable"} ${mainStyle.subContainer}`}
                style={{...style.container, "padding":"0"}}
                onMouseLeave={handleMouseOut}
                onMouseEnter={handleMouseOver}>
                <table style={{"width": "100%"}}>
                    <thead>
                        <tr key={"column"} style={tableStyle.tr}>
                            <th style={tableStyle.th}>
                                열 이름
                            </th>
                            <th style={tableStyle.th}>
                                조건
                            </th>
                            <th style={tableStyle.th}>
                                 
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tempOptions.map( (option, i) => (
                            <tr style={tableStyle.tr}>
                                <td style={tableStyle.td}>
                                    {option["column"]}
                                </td>
                                <td style={tableStyle.td}>
                                    {option["options"]}
                                </td>
                                <td 
                                    className={"hover:text-red-400"}
                                    style={{...tableStyle.removeTd}}
                                    onClick={() => handleRemove(i)}>
                                    <AiOutlineDelete/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={style.btnContainer}> 
                <Button
                    className="red"
                    style={style.btn}
                    type="button"
                    onClick={() => {
                        setModalShow(false)}}>
                    close
                </Button>
                <Button
                    className="green"
                    style={style.btn}
                    type="button"
                    onClick={() => {
                        setViewOptions(tempOptions);
                        setModalShow(false);
                    }}>
                    save
                </Button>
            </div>

        </Modal>
    )
}
