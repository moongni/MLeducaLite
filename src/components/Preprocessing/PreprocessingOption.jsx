import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { isEmptyArray } from "../Common/module/checkEmpty";
import { toArray, toOption } from "../Common/module/option";
import { preprocessingActions } from "../../reducers/preprocessingSlice";
import Inputs from "../Common/inputs/Inputs";
import "../../static/css/scrollStyle.css";

export const PreprocessingOptions = ({children, preprocess, ...props}) => {
  const style = {
    divStyle: {
      paddingRight: "6.80rem",
      paddingLeft: "1rem",
    }
  }

  return (
    <div style={style.divStyle}>
      {!isEmptyArray(props.columns) &&
        <div style={{"display":"inline"}}>
          {props.columns.map( column => (
            <PreprocessingInputs
              title={props.title}
              kind={props.kind}
              column={column}
              preprocess={preprocess[column]}
            /> 
          ))}
        </div>
      }
    </div>

  )
}

const PreprocessingInputs = ({ children, preprocess, ...props }) => {
  const dispatch = useDispatch();

  const [ selectedValue, setSeletedValue ] = useState([]);

  // 전처리 목록 배열 => 옵션
  useEffect(()=> {
    setSeletedValue(toOption(preprocess))
  }, [])
  
  // 선택된 옵션 => 배열 저장
  useEffect(() => {
    var curProcess = toArray(selectedValue);
    
    dispatch(preprocessingActions.setProcess({
      title: props.title,
      column: props.column,
      preprocess: curProcess,
      kind: props.kind
    }));

  }, [ selectedValue ])

  const options = [
    {value: "stardardScale", label: "Standard Scale"},
    {value: "normalize", label: "Normalize"},
    {value: "fillMean", label: "Fill Mean"},
    {value: "fillMedian", label: "Fill Median"},
    {value: "fillMostFrequnce", label: "Fill Most Frequnce"},
    {value: "oneHotEncoding", label: "One Hot Encoding"},
    {value: "labelEncoding", label: "Label Encoding"},
    {value: "dropNull", label: "Drop Null Value"}
  ];

  return (
    <Inputs
      kind="MultiSelect"
      title={props.column}
      value={selectedValue}
      setValue={setSeletedValue}
      options={options}
      hasSelectAll={false}/>
  )
}
