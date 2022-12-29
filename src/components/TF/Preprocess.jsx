import * as dfd from "danfojs"
import { isEmpty } from "../Common/module/checkEmpty";
import { hashMap } from "../Common/module/package";

const preprocessOption = {
  STARDARDSCALE: "stardardScale",
  NORMALIZE: "normalize",
  FILLMEAN: "fillMean",
  FILLMEDIAN: "fillMedian",
  FILLEMOSTFREQUNCE: "fillMostFrequnce",
  ONEHOTENCODING: "oneHotEncoding",
  LABELENCODING: "labelEncoding",
  DROPNA: "dropNull"
}

export async function preprocess(labelData, featureData, process) {
  /*
    parameter
      labelData: Object [column: Array]
      featureData: Object [column: Array]
      process: Object

    return
      Object
      
      입력받은 labelData, featureData와 동일한 형식을 합친 Object로 반환
      { 
        "labelData": label_data,
        "featureData": feature_data 
      }
  */

  // 표준화
  function stardardScale(dataFrame, column) {    
    const scaler = new dfd.StandardScaler();

    scaler.fit(dataFrame[column]);
    dataFrame[column] = scaler.transform(dataFrame[column]).values;
  }

  // 정규화
  function minMaxNormalize(dataFrame, column) {
    function normalizeAlgorithm(x) {
      return (x - min) / (max - min)
    }

    const max = dataFrame[column].max();
    const min = dataFrame[column].min();

    dataFrame[column] = dataFrame[column].map(normalizeAlgorithm).values;
  }

  // 평균 채우기
  function fillMean(dataFrame, column) {
    const mean = dataFrame[column].mean();

    dataFrame[column] = dataFrame[column].fillNa(mean).values;
  }

  // 중앙값 채우기
  function fillMedian(dataFrame, column) {
    const median = dataFrame[column].median();

    dataFrame[column] = dataFrame[column].fillNa(median).values;
  }
  
  // 최빈값 채우기
  function fillMostFrequnce(dataFrame, column) {
    // 데이터 타입 확인
    const dataType = data[column].reduce(( dtype, val ) => {
      return dtype == typeof val || isEmpty(val) ? dtype : "object";
    }, typeof data[column][0]);
    
    var convertType = {
      number(item) {
        return Number(item)
      },
      boolean(item) {
        return Boolean(item)
      },
      string(item) {
        return item
      },
      object(item) {
        return item
      }
    }

    // 최빈값 찾기
    const hashmap = hashMap(data[column]);
    
    const mostFreVal = Object.keys(hashmap).reduce(( a, b ) => 
      hashmap[a] > hashmap[b] && !isEmpty(a) ? a : b )

    // 최빈값 채우기
    dataFrame[column] = dataFrame[column].fillNa(convertType[dataType](mostFreVal)).values;
  }

  // onehotencoding
  // [1,2,3] -> [[1,0,0], [0,2,0], [0,0,1]]
  function oneHotEncoding(dataFrame, column) {
    const encode = new dfd.OneHotEncoder();
    
    encode.fit(dataFrame[column]);

    const sf_enc = encode.transform(dataFrame[column].values);
    
    const encodedDataFrame = new dfd.DataFrame(sf_enc);

    // rename 0, 1, 2 -> column-0, column-1, column-2
    const onehotIndex = encodedDataFrame.columns;
    const newColName = {}

    for (var i of onehotIndex) {
      newColName[`${i}`] = `${column}-${i}`
    }

    encodedDataFrame.rename(newColName, { inplace: true });

    // 나머지 컬럼과 onehotencoding 결과 합치기
    dataFrame.drop({ columns: [column], inplace: true });

    const newDataFrame = dfd.concat({ dfList: [dataFrame, encodedDataFrame], axis: 1 });

    return newDataFrame
  }

  // 라벨인코딩
  function labelEncoding(dataFrame, column) {
    const encode = new dfd.LabelEncoder();

    encode.fit(dataFrame[column]);
    
    dataFrame[column] = encode.transform(dataFrame[column].values);
  }

  // 널값 drop
  function dropNa(dataFrame, column) {
    const nall_face = dfd.toJSON(dataFrame[column].isNa())[0];

    const nall_idx = nall_face.reduce(( acc, val, idx ) => {
      if ( val == true ) {
        acc.push(idx);
      }

      return acc
    }, [])

    
    dataFrame.drop({ index:nall_idx, inplace:true });
    dataFrame.resetIndex({ inplace:true });

    anotherFrame.drop({ index:nall_idx, inplace:true });
    anotherFrame.resetIndex({ inplace:true });
  }

  var label_df = new dfd.DataFrame(labelData);
  var feature_df = new dfd.DataFrame(featureData);
  
  for (const title of Object.keys(process)) {
    var data = labelData;
    var dataFrame = label_df;
    var anotherFrame = feature_df;
    
    if ( title == "feature" ) {
      data = featureData;
      dataFrame = feature_df;
      anotherFrame = label_df;
    }

    // 전처리 진행
    for (const [key, value] of Object.entries(process[title])) {

      if (value.length != 0) {
  
        for (const preOption of value) {
          if (preOption == preprocessOption.STARDARDSCALE)
            stardardScale(dataFrame, key);
          if (preOption == preprocessOption.NORMALIZE)
            minMaxNormalize(dataFrame, key);
          if (preOption == preprocessOption.FILLMEAN)
            fillMean(dataFrame, key);
          if (preOption == preprocessOption.FILLMEDIAN)
            fillMedian(dataFrame, key);
          if (preOption == preprocessOption.FILLEMOSTFREQUNCE)
            fillMostFrequnce(dataFrame, key);
          if (preOption == preprocessOption.ONEHOTENCODING)
            dataFrame = oneHotEncoding(dataFrame, key);
          if (preOption == preprocessOption.LABELENCODING)
            labelEncoding(dataFrame, key);
          if (preOption == preprocessOption.DROPNA)
            dropNa(dataFrame, key);
        }

      }
  
    }

    // 결과 선언
    if ( title == "feature") {
      feature_df = dataFrame;
      label_df = anotherFrame;
    } else {
      label_df = dataFrame;
      feature_df = anotherFrame;
    }

  }

  const label_data = dfd.toJSON(label_df, {
    format: "row"
  });
  const feature_data = dfd.toJSON(feature_df, {
    format: "row"
  })

  return {
    "labelData": label_data,
    "featureData": feature_data,
  }
}