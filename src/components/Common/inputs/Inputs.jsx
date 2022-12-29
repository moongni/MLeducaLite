import React, { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { isEmptyStr } from "../module/checkEmpty";
import style from './input.module.css'

const Contents = ({...props}) => {
    switch(props.kind){
        case "input":
            return <IntInput {...props}/>
        case "float":
            return <FloatInput {...props}/>
        case "array":
            return <IntArrayInput {...props}/>
        case "text":
            return <TextInput {...props}/>
        case "select":
            return <SelectInput {...props}/>
        case "MultiSelect":
            return <MultiSelectInput {...props}/>
        case "bool":
            return <BoolInput {...props}/>
    }
}

const Inputs = ({style, ...props}) => {
    // 디폴트 값이 존재할 경우
    useEffect(() => {
        if (!isEmptyStr(props.defaultValue) && !props.isValue) {
            props.setValue( preValue => ({
                    ...preValue,
                    [props.title]: props.defaultValue
                }
            ))
        }
    },[]);
    
    const inputStyle = {
        "display":"flex",
        "justifyContent":"space-between",
        "alignItems":"center",
        "height":"3.5rem",
        "width":"100%",
        
    }

    return (
        <div style={{...inputStyle, ...style}}>
            <span style={{"wordBreak":"keep-all"}}>{props.mainTitle? props.mainTitle: props.title}</span>
            <Contents {...props}/>
        </div>
    )    
}

export default Inputs;

const BoolInput = ({ ...props }) => {
    const valueHandler = (event) => {
        const { value } = event.target;

        props.setValue(JSON.parse(value));
    }

    const formHandler = (event) => {
        const { value, name } = event.target;

        props.setValue( preValue => ({
            ...preValue,
            [name]: JSON.parse(value)
        }))
    }

    return (
        <select 
            { ...props }
            className={[style.input, style.select].join(' ')}
            name={props.title}
            value={props.isValue? props.value: props.value[props.title]}
            onChange={props.isValue? valueHandler: formHandler}
        >
            {props.defaultName && 
                <option value={props.defaultValue}>{props.defaultName}</option>
            }
            {props.list.map(l => {
                return <option value={l}>{l}</option>
            })}
        </select>
    )
}

const FloatInput = ({ ...props }) => {
    const valueHandler = (event) => {
        const { value } = event.target;

        props.setValue(parseFloat(value));
    }

    const formHandler = (event) => {
        const { value, name } = event.target;

        props.setValue( preValue => ({
            ...preValue,
            [name]: parseFloat(value)
        }))}

    return (
        <input 
            { ...props }
            className={style.input}
            name={props.title}
            value={props.isValue? props.value: props.value[props.title]}
            onChange={props.isValue? valueHandler: formHandler}
        /> 
    )
}

const IntArrayInput = ({ ...props }) => {
    const [ string, setString ] = useState("");
    const [ name, setName ] = useState("");

    // int 배열 변환하여 set
    useEffect(() => {
            var value = string

            value = value.replace("[", "");
            value = value.replace("]", "");
            value = value.split(',').map((item) => {
                return parseInt(item, 10);
            }).filter(item => (typeof item == "number" || item == null) && !isNaN(item))
            
            if (props.isValue) {
                props.setValue(value);
            } else {
                !isEmptyStr(name) &&
                props.setValue((preValue) => ({
                        ...preValue,
                        [name]: value
                }))
            }
    }, [string]);
    
    const onChangeHandler = (event) => {
        let { value, name } = event.target;

        setString(value);
        setName(name);
    }

    return (
        <input 
            { ...props }
            className={style.input}
            name={props.title}
            value={string}
            onChange={onChangeHandler}
        /> 
    )
}

const IntInput = ({ ...props }) => {
    const valueHandler = (event) => {
        const { value } = event.target;

        props.setValue(parseInt(value));
    }

    const formHandler = (event) => {
        const { value, name } = event.target;

        props.setValue((preValue) => ({
            ...preValue,
            [name]: parseInt(value)
        }))
    }

    return (
        <input 
            { ...props }
            className={style.input}
            name={props.title}
            value={props.isValue? props.value: props.value[props.title]}
            onChange={props.isValue? valueHandler: formHandler}
        /> 
    )
}

const MultiSelectInput = ({ ...props }) => {
    return (
        <MultiSelect 
            { ...props }
            className="w-96"
            onChange={props.setValue}
            labelledBy="Select"
        />
    )   
}

const SelectInput = ({ ...props }) => {
    const valueHandler = (event) => {
        const { value } = event.target;

        props.setValue(value); 
    }

    const formHandler = (event) => {
        const { value, name } = event.target;
        
        props.setValue((preValue) => ({
            ...preValue,
            [name]: value
        }))
    }

    return (
        <select 
            { ...props }
            className={[style.input, style.select].join(' ')}
            name={props.title}
            value={props.isValue? props.value: props.value[props.title]}
            onChange={props.isValue? valueHandler: formHandler}
        >
            {props.defaultName && 
                <option value={props.defaultValue}>{props.defaultName}</option>
            }
            {props.list.map(l => (
                <option value={l}>{l}</option>
            ))}
        </select>
    )
}

const TextInput = ({ ...props }) => {
    const valueHandler = (event) => {
        const { value } = event.target;

        props.setValue(value); 
    }

    const formHandler = (event) => {
        const { value, name } = event.target;
        
        props.setValue((preValue) => ({
            ...preValue,
            [name]: value
        }))
    }

    return (
        <input 
            { ...props }
            className={style.input}
            name={props.title}
            value={props.isValue? props.value: props.value[props.title]}
            onChange={props.isValue? valueHandler: formHandler}
        /> 
    )
}