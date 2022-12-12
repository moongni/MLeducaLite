import React from "react";
import pageStyle from "./pageStyle.module.css";
import Title from "../Common/title/title";

const FitDoc = () => {
    return (
        <div className={pageStyle.docContainer}>
            <div className={pageStyle.contentContainer}>
                <Title title="학 습"/>
                학습 페이지에서는 신경망 구성에서 설정한 값을 토대로 모델을 생성하고 데이터 전처치를 통해 준비된 훈련 셋을 통해 훈련을 진행한다.
                <img className={pageStyle.img} src="/img/pages/fit/fit.png" alt="" />
                모델의 정보는 설정한 층의 정보를 보여주며 또한 우측 상단의 모델선택을 통해 localstorage에 저장된 모델 또는 다운로드했었던 모델 json 파일, 가중치 파일을 통해 모델을 불러와서 재훈련 시킬 수 있다.
                <img className={pageStyle.img} src="/img/pages/fit/modelLoad.png" alt="" />

                설정 정보는 옵티마이저, 손실함수, 파라미터의 값을 보여준다. 또한 다운로드했던 설정 json 파일을 불러와 사용하는 것도 가능하다.
                <br/>
                <br/>

                훈련 셋은 모델을 훈련시킬 데이터를 보여준다.
                <br/>
                <br/>

                모델 정보, 설정 정보, 훈련 셋이 준비되지 않으면 훈련 버튼은 비활성화된다.
                <div className={pageStyle.headline}/>

                <Title title="예 제" />
                <img className={pageStyle.img} src="/img/pages/fit/dashboardExample.png" alt="" />
                이전 신경망 구성에서 설정한 값들을 모델 정보, 설정 정보 보드에서 볼 수 있다.
                <img className={pageStyle.img} src="/img/pages/fit/trainsetExample.png" alt="" />
                데이터 전처리 과정에서 만든 120개의 훈련 샘플을 볼 수 있다.
                <br/>
                <br/>
                활성화된 fit 버튼을 누르면 모델 훈련이 진행되고 훈련이 완료되면 localstorage://model/recent에 저장이 된다.
            </div>
        </div> 
    )
}

export default FitDoc