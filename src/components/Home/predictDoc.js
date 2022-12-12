import React from "react";
import pageStyle from "./pageStyle.module.css";
import Title from "../Common/title/title";

const PredictDoc = () => {
    const preprocessOption = [
        "Stardard Scale (표준화)",
        "Normalize (정규화)",
        "Fill Mean (Null값 평균으로 채우기)",
        "Fill Median (Null값 중앙값으로 채우기)",
        "Fill Most Frequnce (Null값 최빈값으로 채우기)",
        "One Hot Encoding (원 핫 인코딩)",
        "Label Encoding (라벨 인코딩)",
        "Drop Null Value (Null값 없애기)"
    ]

    return (
        <div className={pageStyle.docContainer}>
            <Title title="예 측"/>
            <div className={pageStyle.contentContainer}>
                예측에서는 테스트 셋을 훈련이 완료된 모델을 통해 예측을 진행한다.
                <img className={pageStyle.img} src="/img/pages/predict/predict.png" alt="" />
                예측 데이터 준비에서는 예측에 사용될 데이터 셋을 준비하는 과정이다.
                테스트 셋을 입력하는 것은 사용자 입력과 url 또는 파일로 입력을 지원한다.
                <br/>
                사용자 입력은 입력의 모양을 설정하고 데이터 순서에 맞춰 사용자가 값을 입력하여 사용이 가능하다.
                url 또는 파일은 데이터 적재과정과 동일하게 지원가능하다.
                <br/>
                <br/>
                데이터 테이블에서는 준비된 테스트 셋을 보여주며 테스트 셋으로 사용할 열을 다시 선택하거나, 열에 따른 전처리 옵션을 설정할 수 있다.
                지원하는 전처리 옵션은 아래와 같다.
                <br/>
                <br/>
                {preprocessOption.map( option => <div style={{"fontSize":"1.25rem"}}>{option}</div>)}
                <br/>
                예측 모델 준비는 예측을 진행할 모델을 선택하는 것이다. 훈련을 진행한 모델이 유실되었다면 선택된 모델을 눌러 localstorage에 저장된 모델을 사용하거나 파일로 모델을 불러와 사용하는 것이 가능하다.
                <br/>
                <br/>
                예측 버튼은 예측 모델과 테스트 셋이 준비되지 않으면 비활성화 되어있다.
                <br/>
                모델과 테스트 셋을 준비해 예측 버튼을 누르면 예측을 진행하며 완료되었을 시 아래에 예측 데이터 뷰가 활성화 되어 보여진다.
                예측된 데이터에 대해서는 csv, json 파일로 다운로드를 지원한다.
            </div>
            <div className={pageStyle.headline}/>
            <Title title="예 제"/>
            <div className={pageStyle.contentContainer}>
                <img className={pageStyle.img} src="/img/pages/predict/testsetExample.png" alt="" />
                데이터 전처리에서 나눠진 30개의 테스트 셋을 사용하거나 또는 사용자 입력, 파일 입력을 이용해 테스트 셋을 준비한다.
                <br/>
                각 열별로 전처리 옵션을 추가해줄 수 있지만 예제에서는 데이터 전처리과정에서 전처리가 끝났기 때문에 사용하지 않는다.
                <br/>
                <br/>
                <img className={pageStyle.img} src="/img/pages/predict/modelLoadExample.png" alt="" />
                <img className={pageStyle.img} src="/img/pages/predict/preparemodelExample.png" alt="" />
                모델 불러오기를 통해 예측을 진행할 모델을 불러온다.
                <img className={pageStyle.img} src="/img/pages/predict/predDataExample.png" alt="" />
                예측을 진행한 후 예측 결과를 볼 수 있으며, 다운로드가 가능하다.
            </div>
        </div>
    )
}

export default PredictDoc