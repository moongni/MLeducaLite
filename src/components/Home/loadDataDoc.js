import React from "react";
import pageStyle from "./pageStyle.module.css";
import Title from "../Common/title/title";

const LoadDataDoc = () => {
    var public_url = process.env.PUBLIC_URL[process.env.PUBLIC_URL.length - 1] === "/" ?
        process.env.PUBLIC_URL.slice(0, -1): process.env.PUBLIC_URL

    return (
        <div className={pageStyle.docContainer}>
            <Title title="데이터 적재"/>
            <div className={pageStyle.contentContainer}>
                <img className={pageStyle.img} src={`${public_url}/img/loadData.png`} alt="" />
                기계학습을 진행할 데이터셋을 불러옵니다. 데이터 셋은 Url과 파일을 지원하며 각각 json, csv 파일의 형태를 지원합니다. 
                
                데이터를 적재하게 되면 데이터 뷰를 통해 데이터를 확인할 수 있으며, 데이터 뷰의 개수를 입력해 뷰에 보여줄 데이터의 개수를 입력할 수 있습니다.
            </div>
            <div className={pageStyle.headline}/>
            <div className={pageStyle.contentContainer}>
                <img className={pageStyle.img} src={`${public_url}/img/pages/loadData/dataview.png`} alt="" />
                데이터 뷰의 열은 각 특성을 보여주며 행은 데이터 샘플입니다. 불러온 데이터는 웹 브라우저 sessionstorage 내의 저장되며 그 형태는 아래와 같습니다.
                <pre>
                    column : Array,
                    data : Object,
                    shape: Array,
                    dtype: Object
                </pre>
            </div>
            <div className={pageStyle.headline}/>
            <Title title="예 시"/>
            <div className={pageStyle.contentContainer}>
                iris는 setosa, versicolor, virginica 3개의 종으로 이뤄진 꽃이다. iris의 꽃받침 길이, 꽃받침 너비, 꽃잎 길이, 꽃잎 너비 정보를 통해 종을 예측하는 분류 문제를 해결한다.

                <a className={pageStyle.a} href="https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/0e7a9b0a5d22642a06d3d5b9bcbad9890c8ee534/iris.csv">[iris 데이터 링크]</a>
                iris 데이터 csv 파일 링크를 url 불러오기에 넣거나 iris 데이터 파일을 드로그 앤 드롭 형식으로 데이터를 불러온다.
                <img className={pageStyle.img} src={`${public_url}/img/pages/loadData/loadDataExample.png`} alt="" />
                
            </div>
        </div>
    )
}

export default LoadDataDoc;