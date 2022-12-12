# Serverless Web App For Machine Learning Education V.1.0.0

서버리스 머신러닝 교육용 웹앱은 수학공식과 복잡한 텍스트 코딩이 필요한 머신러닝 교육에 앞서 머신러닝의 전반적인 흐름을 직접 조작하고 그 조작을 직관적으로 보여줄 수 있는 도구를 통해 머신러닝을 처음 접하는 이들을 위한 교육용 웹앱입니다. 

 ![앱 이미지](https://user-images.githubusercontent.com/88421322/204133751-58cea6cf-c6f8-48de-8c76-ee1d9e07122d.png)


## 기능

- 데이터 적재: URL, json, csv 파일을 통한 데이터 적재, 데이터 뷰 테이블
- 데이터 전처리: 라벨 열, 특성 열 설정과 각 열별 전처리 옵션 설정
- 신경망 구성: 레이어 구성 및 손실 함수 최적화 함수 설정
- 학습
- 예측
- 분석: 데이터 산점도, 학습 결과 시각화
- 다운로드: 모델 및 설정 파일 다운로드 

## 사용

도메인으로 접근하여 사용하려면 아래의 링크를 통해 접근할 수 있습니다.

[Serverless Web App For Machine Learning Education](https://moongni.github.io/webappforMLEDU)

## 소스코드 사용
### Requirements

#### Node.js 설치
이 웹앱은 Node.js를 기반으로 React.js 프레임워크를 사용하여 만들었습니다.

Node.js 14.16.1 이후의 버전으로 다운받습니다.

[Node.js 다운로드 페이지](https://nodejs.org/en/download/)

Node.js에 더 자세한 내용은 [Node.js github](https://github.com/nodejs/node)를 참조해주세요.

#### 웹 앱 다운로드

웹앱의 소스코드를 다운받습니다. 

```git clone https://github.com/moongni/ServerlessWebAppForMachineLearningEducation.git```

#### 앱 실행

다운로드한 웹앱 디렉토리에서 cmd 또는 터미널에서 아래의 명령어를 실행합니다.

```
npm install
npm start
```

앱을 실행하면 브라우저에서 [http://localhost:3000](http://localhost:3000) 에서 앱을 실행할 수 있습니다.

실행하는 포트 설정을 변화하면 주소는 바뀔 수 있습니다.
