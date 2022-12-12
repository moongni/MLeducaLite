export function makeRangeArray(start, end) {
    if (start > end){
        return [];
    }

    var num = end - start
    let newArray = new Array(num);

    for (var i = 0; i < num; i ++) {
        newArray[i] = start;
        start++;
    }

    return newArray;
}

export function selectColumn(data, columns) {
    /*
        데이터에서 해당하는 열만 걸러서 반환
        parameter:
            data: Object,
            columns: Array
        return Object
    */
    const newData = new Object();

    columns.map(column => {
        newData[column] = data[column]; 
    })

    return newData;
}

export function contentView({ element, children, checkFunction }) {
    const style = {
        center: {
            "width": "100%",
            "padding": "10px",
            "textAlign": "center",
            "fontSize": "1.25rem",
            "lineHeight": "1.75rem",
            "opacity": "0.6",
        }
    }
    
    if ( checkFunction( element ) ){
        return (
            <div style={style.center}>
                <span >No Data</span>
            </div>
        )
    } else {
        return children
    }
    
}

export function hashMap(data) {
    /* 
        배열 값의 빈도를 Object 형태로 반환

        parameter:
            data: Array
        return Object
    */

    var hashmap = data.reduce(( acc, val ) => {
        acc[val] = ( acc[val] || 0 ) + 1;
        
        return acc; 
    }, {})

    return hashmap;
}