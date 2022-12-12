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
      labelData: selectColumns(dataSlice.info, label)
      featureData: selectColumns(dataSlice.info, feature)
      process: preprocessingSlice.info

    return
      process 내부에 있는 컬럼으로만 이루어진 data(dataSlice.info와 구조 동일) 반환
  */

  // const nullToNaN = (data, columns) => {
  //   for (const column of columns) {
  //     data[column] = data[column].map(value => {
  //       return (value == null ? NaN : value)
  //     })
  //   }
  // }


  function stardardScale(dataFrame, column) {    
    const scaler = new dfd.StandardScaler();

    scaler.fit(dataFrame[column]);
    dataFrame[column] = scaler.transform(dataFrame[column]).values;
  }

  function minMaxNormalize(dataFrame, column) {
    function normalizeAlgorithm(x) {
      return (x - min) / (max - min)
    }

    const max = dataFrame[column].max();
    const min = dataFrame[column].min();

    dataFrame[column] = dataFrame[column].map(normalizeAlgorithm).values;
  }

  function fillMean(dataFrame, column) {
    const mean = dataFrame[column].mean();

    dataFrame[column] = dataFrame[column].fillNa(mean).values;
  }

  function fillMedian(dataFrame, column) {
    const median = dataFrame[column].median();

    dataFrame[column] = dataFrame[column].fillNa(median).values;
  }
  
  function fillMostFrequnce(dataFrame, column) {
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

    const hashmap = hashMap(data[column]);
    
    const mostFreVal = Object.keys(hashmap).reduce(( a, b ) => 
      hashmap[a] > hashmap[b] && !isEmpty(a) ? a : b )

    console.log(dataFrame);
    console.log(convertType[dataType](mostFreVal));

    dataFrame[column] = dataFrame[column].fillNa(convertType[dataType](mostFreVal)).values;
  }

  function oneHotEncoding(dataFrame, column) {
    const encode = new dfd.OneHotEncoder();

    encode.fit(dataFrame[column]);

    const sf_enc = encode.transform(dataFrame[column].values);

    const encodedDataFrame = new dfd.DataFrame(sf_enc);

    dataFrame.drop({ columns: [column], inplace: true });

    const newDataFrame = dfd.concat({ dfList: [dataFrame, encodedDataFrame], axis: 1 });

    return newDataFrame
  }

  function labelEncoding(dataFrame, column) {
    const encode = new dfd.LabelEncoder();

    encode.fit(dataFrame[column]);
    
    dataFrame[column] = encode.transform(dataFrame[column].values);
  }

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

  // var selectedData = selectColumn(data, Object.keys(process));
  // var dataFrame = new dfd.DataFrame(data);
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

    for (const [key, value] of Object.entries(process[title])) {

      if (value.length != 0) {
  
        for (const preprocess of value) {
          if (preprocess == preprocessOption.STARDARDSCALE)
            stardardScale(dataFrame, key);
          if (preprocess == preprocessOption.NORMALIZE)
            minMaxNormalize(dataFrame, key);
          if (preprocess == preprocessOption.FILLMEAN)
            fillMean(dataFrame, key);
          if (preprocess == preprocessOption.FILLMEDIAN)
            fillMedian(dataFrame, key);
          if (preprocess == preprocessOption.FILLEMOSTFREQUNCE)
            fillMostFrequnce(dataFrame, key);
          if (preprocess == preprocessOption.ONEHOTENCODING)
            dataFrame = oneHotEncoding(dataFrame, key);
          if (preprocess == preprocessOption.LABELENCODING)
            labelEncoding(dataFrame, key);
          if (preprocess == preprocessOption.DROPNA)
            dropNa(dataFrame, key);
        }

      }
  
    }

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