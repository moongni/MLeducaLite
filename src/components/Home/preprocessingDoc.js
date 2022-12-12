import React from "react";
import Title from "../Common/title/title";
import pageStyle from "./pageStyle.module.css";

const PreprocessingDoc = () => {
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
            <Title title="데이터 전처리"/>
            <div className={pageStyle.contentContainer}>
                <img className={pageStyle.img} src="/img/pages/preprocessing/preprocessingSetting.png" alt=""/> 
                데이터 전처리에서는 불러온 데이터에서 모델의 훈련에 사용될 라벨과 특성으로 또는 훈련 셋과 테스트 셋으로 나눌 수 있습니다.
                <br/>
                불러온 데이터의 열 이름 중 라벨과 특성으로 사용할 열 이름을 각각 선택한 후 적용 버튼을 누르면 각 열에 대한 전처리 옵션을 설정할 수 있습니다.
                사용가능한 전처리 옵션은 아래와 같다.
                <br/>
                <br/>
                {preprocessOption.map( option => <div style={{"fontSize":"1.25rem"}}>{option}</div>)}
                <br/>
                전처리 옵션은 선택한 순번대로 진행을 하기 때문에 순서가 달라지면 값이 달라질 수 있습니다.
                <br/>
                또한 훈련 셋과 테스트 셋 나누기에서 훈련 셋의 대한 비율을 입력한 후 적용 버튼을 누를 시에 각 열에 대한 전처리와 훈련 셋과 테스트 셋을 비율에 맞게 랜덤으로 나누게 됩니다.
            </div>
            <div className={pageStyle.headline}/>
            <div className={pageStyle.contentContainer}>
                나눠진 데이터 셋은 훈련 셋과 테스트 셋 각각의 데이터 뷰에 나타나며 데이터 뷰의 표시할 개수를 입력받아 수동적으로 렌더링이 가능합니다.
                <img className={pageStyle.img} src="/img/pages/preprocessing/preprocessingDataview.png" alt="" />
            </div>
            <div className={pageStyle.headline}/>
            <Title title="예 시"/>
            <div className={pageStyle.contentContainer}>
                <img className={pageStyle.img} src="/img/pages/preprocessing/settingExample.png" alt="" />
                불러온 iris 데이터에서 species를 라벨로 설정하고 나머지 sepal_length, sepal_width, petal_length, petal_width를 특성으로 설정한다. 
                <br/>
                라벨에 대한 전처리 옵션은 species에 Drop Null Value, One Hot Encoding을 설정합니다.
                <br/>
                특성에 대한 전처리 옵션은 4개의 특성에 모두 Stardard Scale(정규화)를 설정합니다.
                <br/>
                <br/>
                훈련 셋의 비율은 0.8로 150개의 샘플 데이터 중 훈련 샘플 120개 테스트 셋 30개로 나뉘게 됩니다.

                <img className={pageStyle.img} src="/img/pages/preprocessing/trainviewExample.png" alt="" />
                <img className={pageStyle.img} src="/img/pages/preprocessing/testviewExample.png" alt="" />
            </div>
        </div>
    )
}

export default PreprocessingDoc;