import React from "react";
import pageStyle from "./pageStyle.module.css";
import Title from "../Common/title/title";

const AnalyticDoc = () => {
    return (
        <div className={pageStyle.docContainer}>
            <Title title="분 석"/>
            <div className={pageStyle.contentContainer}>
                분석 페이지에서는 훈련을 위해 설정한 정보, 훈련의 결과, 훈련 데이터의 시각화가 가능하다.
                <img className={pageStyle.img} src="/img/pages/analytic/analytic.png" alt="" />
                모델 정보는 모델을 구성한 층 정보를 보여준다.
                <br/>
                <br/>
                설정 정보는 옵티마이저, 손실함수 파라미터를 보여준다.
                <br/>
                <br/>                
                History는 모델 훈련의 기록으로 에포크에 따른 손실함수의 값과 예측결과의 정확도를 시각화해서 보여준다.
                <br/>
                <br/>
                Data Set은 훈련 샘플들을 시각화해서 산점도로 나타내며 열 이름으로 두개의 축을 설정할 수 있다.
            </div>
            <div className={pageStyle.headline}/>
            <div className={pageStyle.contentContainer}>
                <img className={pageStyle.img} src="/img/pages/analytic/boardExample.png" alt="" />
                훈련을 진행했던 모델 정보와 훈련 정보를 보여준다. 다운로드한 파일을 불러와 확인이 가능하다.
                <img className={pageStyle.img} src="/img/pages/analytic/historyExample.png" alt="" />
                History는 훈련 이후 모델을 저장할 때 같이 저장되며 다운로드한 파일을 불러와 확인할 수 있다.
                손실함수의 값과 정확도의 추이를 통해 모델의 훈련이 잘 되었는지, 과대적함, 과소적합 등의 모델 훈련에 대한 판단할 수 있다.
                <img className={pageStyle.img} src="/img/pages/analytic/dataviewExample.png" alt="" />
                훈련 샘플의 열을 축으로 설정해서 시각화가 가능하며 예제에서는 sepal_length와 petal_length를 축으로 한 시각화를 보여준다.
            </div>
        </div>
    )
}

export default AnalyticDoc