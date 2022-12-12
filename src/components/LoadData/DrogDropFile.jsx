import React, { 
    useState,
    useRef,
    useCallback } from "react";
import style from './drogDropFile.module.css';

export const DrogDropFile = ({children, readFile, ...props}) => {
    const inputRef = useRef(null);

    const [ dragActive, setDragActive ] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }}
        
    , []);

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            var file = e.dataTransfer.files[0];
            readFile(file, file.type);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        
        let selectFile = {};
        
        if (e.type === "drop"){
            selectFile = e.dataTransfer.files[0];
        } else {
            selectFile = e.target.files[0];
        }
        
        readFile(selectFile);
    };

    const onButtonClick = (e) => {
        e.preventDefault();

        inputRef.current.click();
    }

    return (
        <div className={style.container}>
            <span>
                {props.title}
            </span>
            <form 
                className={style.form}
                onDragEnter={handleDrag}
                onChange={handleChange}
            >
                <input 
                    ref={inputRef} 
                    type="file" 
                    style={{"display":"none"}}
                    multiple={false} 
                />
                <label 
                    className={`${style.label} ${dragActive? "bg-white": " bg-slate-100"}`}
                    htmlFor="input-file-upload"
                >
                    <div>
                        <p>Drag and drop your file here or</p>
                        <button 
                            className={style.button}
                            onClick={onButtonClick}
                        >
                            Upload a file
                        </button>
                    </div> 
                </label>
                { dragActive && 
                    <div 
                        className={style.dragActive}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        />
                }
            </form>
        </div>
    );
}