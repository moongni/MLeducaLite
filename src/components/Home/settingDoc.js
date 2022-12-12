import React from "react";
import Title from "../Common/title/title";
import pageStyle from "./pageStyle.module.css";
import data from "../../data/data.json";

const SettingDoc = () => {
    const optimizer = data.Compile.filter( d => d.title == "optimizer" )[0].info;
    const loss = data.Compile.filter( d => d.title == "loss" )[0].info;

    return (
        <div className={pageStyle.docContainer}>
            <Title title="신경망 구성" />
            <div className={pageStyle.contentContainer}>
                신경망 구성 페이지에서는 층(layer) 설정, 컴파일 설정, 파라미터 설정을 할 수 있습니다.
                <img className={pageStyle.img} src="/img/pages/setting/layer.png" alt="" />
                층(layer) 설정에서는 이전 층의 결과값을 층의 입력값으로 순차적으로 연결하는 tf.sequenctial 모델과 그래프와 같은 방식으로 여러 층을 병렬적으로 연결하는 tf.model을 지원한다.
                <br/>
                <div>
                    각 층의 필수 설정값으로는 결과값의 형태(units), 입력값의 모양(inputShape), 활성화함수(activation)가 있습니다. 그 외에도 세부적인 설정을 할 수 있으며 자세한 내용은 <a className={pageStyle.a} href="https://js.tensorflow.org/api/2.3.0/#layers.dense">[TensorFlow for JS API]</a>에서 확인할 수 있습니다.
                </div>

                <div className={pageStyle.headline}/>

                <img className={pageStyle.img} src="/img/pages/setting/optimizer.png" alt="" />
                최적화 함수 설정에서는 텐서플로우에서 지원하는 최적화 함수들을 설정할 수 있습니다. 현재 지원하는 최적화 함수들은 아래와 같습니다.
                <br/>
                <br/>
                {optimizer.map( opti => <div style={{"fontSize":"1.25rem"}}>{opti.title}</div> )}
                <br/>
                <br/>
                함수의 이름을 누르면 설정이 가능하며 Advanced setting 버튼을 통해 각 최적화 함수에 필요한 파라미터를 수정할 수 있습니다.

                <div className={pageStyle.headline}/>

                <img className={pageStyle.img} src="/img/pages/setting/loss.png" alt="" />
                손실 함수 설정도 최적화 함수 설정과 동일하게 텐서플로우에서 지원하는 손실 함수들을 설정할 수 있습니다. 현재 지원하는 손실 함수는 아래와 같습니다.
                <br/>
                <br/>
                {loss.map( l => <div style={{"fontSize":"1.25rem"}}>{l.title}</div>)}
                <br/>
                <br/>
                동일하게 함수의 이름을 누르면 설정이 가능합니다.

                <div className={pageStyle.headline}/>

                <img className={pageStyle.img} src="/img/pages/setting/param.png" alt="" />
                파라미터 설정에서는 배치 크기와 에포크 수를 설정 가능합니다. 기본값으로는 배치 크기 : 32 에포크 수 : 50으로 설정되어 있습니다.
                입력을 변화시킨 후 적용 버튼을 눌러야 적용됩니다.

                <div className={pageStyle.headline}/>
                <Title title="예 시"/>
                iris 데이터의 신경층 구성으로는 3개의 층을 구성한다.
                <img className={pageStyle.img} src="/img/pages/setting/layerExample.png" alt="" />
                첫 번째 층으로는 입력의 모양은 sepal_length, sepal_width, petal_length, petal_width로 [, 4]개의 입력을 받으며 [, 1000]의 결과값의 형태를 반환하며 활성화함수는 "relu"이다.
                <br/>
                두 번째 층은 첫 번째 층의 결과값의 모양인 [, 1000]을 입력을 받아 [, 10]의 형태로 반환하며 활성화함수는 "relu"로 동일하다.
                <br/>
                세 번째 층은 두 번째 층의 결과값의 모양인 [, 10]을 입력 받아 [, 3]의 형태로 반환하는 "softmax" 분류 활성화 함수를 사용한다.
                <br/>
                <br/>
                옵티마이저는 Adam 함수를 선택하고 손실함수로는 categoricalHinge를 사용한다.
                <br/>
                배치 크기는 32, 에포크 수는 50을 설정한다.
            </div>
        </div>
    )
}

export default SettingDoc;