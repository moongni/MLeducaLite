# MLeducaLite V.1.0.0

[MLeduca](https://github.com/moongni/MLeduca)는 서버리스 머신러닝 교육용 웹앱으로 수학공식과 복잡한 텍스트 코딩이 필요한 머신러닝 교육에 앞서 머신러닝의 전반적인 흐름을 직접 조작하고 그 조작을 직관적으로 보여줄 수 있는 도구를 통해 머신러닝을 처음 접하는 이들을 위한 교육용 웹앱입니다. 

MLeducaLite는 MLeduca를 깃허브 페이지를 통해 도메인으로 접근해 앱을 사용하는 버전입니다.

![앱 이미지](https://user-images.githubusercontent.com/88421322/207049366-fb5f7cf2-314a-48e1-9cf4-7059c2b260d6.png)

## 기능

- 데이터 적재: URL, json, csv 파일을 통한 데이터 적재, 데이터 뷰 테이블
- 데이터 전처리: 라벨 열, 특성 열 설정과 각 열별 전처리 옵션 설정
- 신경망 구성: 레이어 구성 및 손실 함수 최적화 함수 설정
- 학습
- 예측
- 분석: 데이터 산점도, 학습 결과 시각화
- 다운로드: 모델 및 설정 파일 다운로드 

## 소스코드 사용

MLeducaLite가 아닌 MLeduca의 소스코드를 편집하여 사용하실 분들은 아래의 링크로 MLeduca의 소스코드를 확인할 수 있습니다.

[MLeduca](https://github.com/moongni/MLeduca)

## 깃허브 페이지에 연동하는 법

### Requirements

#### Node.js 설치
MLeducaLite는 Node.js를 기반으로 React.js 프레임워크를 사용하여 만들었습니다.

Node.js 14.16.1 이후 버전의 개발환경이 필요합니다.

[Node.js 다운로드 페이지](https://nodejs.org/en/download/)

Node.js에 더 자세한 내용은 [Node.js github](https://github.com/nodejs/node)를 참조해주세요.

### 템플릿 사용

MLeducaLite의 템플릿을 통해 사용자 github 계정의 repository를 만듭니다.

![Use this template](https://user-images.githubusercontent.com/88421322/207036943-f1a4d690-ab76-4aeb-b9ab-e734ec8eb2c4.png)

사용자 계정의 repository를 만듭니다.

![create a new repository](https://user-images.githubusercontent.com/88421322/207042808-19f2b788-7ab1-4109-8434-24f543ba8d73.png)

### 깃허브 페이지 사용하기

clone 명령어를 통해 만들어진 repository를 로컬 환경에 다운받는다.

```
git clone https://github.com/{사용자이름}/{레포지토리 이름}.git
```

clone한 로컬 환경의 디렉토리로 이동하여 package.json 파일에 아래의 내용을 추가한다.

```
"homepage": "https://{사용자이름}.github.io/{레포지토리 이름}",
```
![update package.json](https://user-images.githubusercontent.com/88421322/207045679-6f2a2a90-e1c4-4475-b00c-95e28ef4009e.png)

이후 아래의 명령어를 cmd 또는 터미널에서 명령어를 실행합니다.

```
npm install
npm run deploy
```

명령어가 완료되면 빌드된 웹앱이 들어있는 `gh-pages` 브랜치가 생성된다.

이후 Settings - Pages의 Branch를 gh-pages가 맞는지 확인합니다.

![Pages-branch](https://user-images.githubusercontent.com/88421322/207047768-f720c1e1-2b94-4509-acc8-4847953d8b5b.png)

## 확인

```
https://{사용자이름}.github.io/{레포지토리 이름}
```

위 주소를 통해 웹브라우저를 통해 접근할 수 있습니다. 

![mleduca-lite](https://user-images.githubusercontent.com/88421322/207048303-783e17c4-a4b0-4613-a5b2-545ebb2fde42.png)
