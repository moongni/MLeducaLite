import errordata from "./errorcode.json";

const { httpError, ignoreError } = errordata;

const httpErrorMap = new Map(httpError);
const ignoreErrorMap = new Map(ignoreError);

export function errorHandler(err) {
    console.log(err);
    
    if (httpErrorMap.has(err.statuscode)) {
        alert(httpErrorMap.get(err.statuscode));

    } else if (ignoreErrorMap.has(err.message)) {
        return;
    }
    else {
        if (err.message.includes("Cannot read properties of undefined")) {
            alert("초기화 후 다시 시도해주세요.");
            return;
        }
        if ( err.message == "Failed to fetch") {
            alert("정보를 받아오는데 실패했습니다.")
            return;
        }

        alert(err.message);
    }
}