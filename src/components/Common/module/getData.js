import * as dfd from "danfojs";
import { isEmptyObject, isEmptyStr, isEmpty, isEmptyArray } from "./checkEmpty";
import { errorHandler } from "./errorHandler";

function checkUrl(strUrl) {
    let expUrl = /^http[s]?:\/\/([\S]{3,})/i;

    return expUrl.test(strUrl);
}

export async function getData(url) {
    /* 
        parameter
            url: String
        return
            Object
    */

    // url 형식 체크
    if (isEmptyStr(url) || !checkUrl(url)){
        return {
            isError: true,
            errorData: {
                message: "유효하지 않은 입력입니다.",
                statuscode: 1
            }
        }
    }

    const response = await fetch(url)
    
    // http 에러 체크
    if (response.ok) {
        let newData = {};
    
        var splitUrl = url.split("/");
        var splitFileName = splitUrl[splitUrl.length - 1].split('.');
        var fileExtension = splitFileName[1];
        
        switch (fileExtension){
            case "json":
                if ( isEmptyObject(await response.json()) ) {
                    console.log('empty object');
                }
                const jsonDf = await dfd.readJSON(url);
                newData = dfd.toJSON(jsonDf, { format: 'row' });
                break;
            case "csv":
                if ( isEmptyStr(await response.text()) ) {
                    console.log('empty str');
                }
                const csvDf = await dfd.readCSV(url);
                newData = dfd.toJSON(csvDf, { format: 'row' });
                break;
            default:
                return {
                    isError: true,
                    errorData: {
                        message: "파일 형식이 맞지 않습니다. json, csv 파일만 지원합니다.",
                        statuscode: 2
                    }
                }
        }

        return {
            isError: false,
            data: newData
        }

    } else {
        return {
            isError: true,
            errorData: {
                message: "Unknown",
                statuscode: response.status
            }
        }
    }
}

export function getDtype(data) {
    const df = new dfd.DataFrame(data);
    
    const columns = df.columns;
    const dtype = df.dtypes;

    const ret = {};

    // 열 별 dtype 매핑
    if ( columns.length == dtype.length ) {
        for(var i = 0; i < columns.length ; i++) {
            ret[columns[i]] = dtype[i];
        }
    }

    return ret;
}

export function getShape(data) {
    return new dfd.DataFrame(data).shape;
}

export function getNData(data, nData) {
    const newData = new Object();

    for ( const [ key, value ] of Object.entries(data)) {
        newData[key] = value.slice(0, nData);
    }

    return newData;
}

export function getViewData(data, nData) {
    if (isEmpty(nData) || nData < 1 || nData > data.shape[0]) {
        return {
            isError: true,
            errorData: {
                message: `0 ~ ${data.shape[0]}사이의 값을 입력해주세요. 현재 값 : ${nData}`,
                statuscode: 2
            }
        }
    }

    const newData = getNData(data.data, nData);

    return {
        isError: false,
        data: {
            ['columns']: data.columns,
            ['data']: newData,
            ['shape']: getShape(newData)
        }
    }
} 

export function updateViewData(data, setView, nData) {
    try {
        if (!isEmptyArray(data.columns)) {
            var response = getViewData(data, nData)
            
            if (response.isError){
                errorHandler(response.errorData);
            } else {
                setView(response.data);
            }
        }

    } catch (err) {
        errorHandler({
            "message": err.message,
            "statuscode": null
        })
    }
}
