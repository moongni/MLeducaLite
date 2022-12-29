import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { createModel } from "../components/TF/CreateModel";
import { convertToTensor } from "../components/TF/ConvertToTensor";
import { trainModel } from "../components/TF/TrainModel";
import { updateViewData } from "../components/Common/module/getData"
import { isEmptyArray, isEmptyObject, isEmptyStr } from "../components/Common/module/checkEmpty"
import { errorHandler } from "../components/Common/module/errorHandler";
import { contentView } from "../components/Common/module/package";
import Title from "../components/Common/title/title";
import Inputs from "../components/Common/inputs/Inputs";
import ArrayTable from "../components/Common/table/ArrayTable";
import { LayerBoard, SettingBoard } from "../components/ModelDashBoard/Board";
import { Button } from "../components/Common/button/Button";
import { Loader } from "../components/Common/loader/Loader";
import { ModelSelectModal, SettingSelectModal } from "../components/Common/modal/modal";
import { historyActions } from "../reducers/historySlice";
import mainStyle from "../static/css/component.module.css";

// 훈련 진행 함수
async function run(model, compile, parameter, xs, ys) {
  const { features, labels } = convertToTensor(xs,  ys);
  console.log('convertToTensor 완료');
  
  const { history, trainedModel } = await trainModel(model, features, labels, compile, parameter);

  console.log('Done Training');
  console.log("history", history);
  console.log('trainedModel', trainedModel);

  return { history, trainedModel };
}

const Fit = () => {
  const dispatch = useDispatch();
  
  const [ model, setModel ] = useOutletContext();

  // redux 정보
  const compile = useSelector( state => state.setting.compile );
  const parameter = useSelector( state => state.setting.parameter.info );
  const layers = useSelector( state => state.setting.layer );
  const xs = useSelector( state => state.train.feature );
  const ys = useSelector( state => state.train.label );

  // 데이터 뷰 정보
  const initData = {
    'columns': [],
    'data': {},
    'shape': []
  };
  const [ viewTrainX, setViewTrainX ] = useState(initData);
  const [ viewTrainY, setViewTrainY ] = useState(initData);

  const [ nData, setNData ] = useState(5);

  const [ modelModal, setModelModal ] = useState(false);
  const [ settingModal, setSettingModal ] = useState(false);
  const [ isLoading, setLoading ] = useState(false);

  // 학습 버튼 초기화
  const [ disabled, setDisabled] = useState(
    isEmptyArray(layers.info) || isEmptyObject(parameter) || 
    isEmptyObject(compile.optimizer) || isEmptyStr(compile.loss) ||
    isEmptyObject(xs) || isEmptyObject(ys)
  );

  // 학습 버튼 활성화
  useEffect(() => {
    setDisabled(    
      isEmptyArray(layers.info) || isEmptyObject(parameter) || 
      isEmptyObject(compile.optimizer) || isEmptyStr(compile.loss) ||
      isEmptyObject(xs) || isEmptyObject(ys)
    )    
  }, [ layers, parameter, compile ])
  
  // 데이터 뷰 초기화
  useEffect(() => {
    updateViewData(xs, setViewTrainX, nData);
    updateViewData(ys, setViewTrainY, nData);
  }, [xs, ys])

  // 모델 생성 함수
  async function makeModel() {
    try{
      var preTrainModel = model;
      
      // 이미 모델이 생성되어있는 경우
      if (!isEmptyObject(preTrainModel) && window.confirm("현재 모델이 존재합니다. 재학습을 진행하시겠습니까?\n 예: 기존 모델 재학습, 아니요: 새로운 모델 생성")){
      } else {
        preTrainModel = await createModel(layers);
      }
  
      return preTrainModel

    } catch (err) {
      errorHandler({
        "message": `모델 생성에 실패하였습니다.\n${err.message}`,
        "statuscode": err.status? err.status: null
      })
    }
  }   
  
  // 훈련 버튼 함수
  const onClickHandler = async () => {
    setDisabled(true);
    setLoading(true);

    console.log("fit call");

    var model = await makeModel();

    run(model, compile, parameter, xs.data, ys.data)
    // 훈련 완료 모델 및 히스토리 저장
    .then( async ({ history, trainedModel }) => {
      setModel(trainedModel);

      const saveResult = await trainedModel.save("localstorage://model/recent");
      
      dispatch(historyActions.setHist(JSON.stringify(history)));

      console.log(saveResult);
    })
    .then( _ => {
      alert("모델 훈련 완료, localstroage://model/recent에 저장되었습니다.");
    })
    .catch( err => {
      errorHandler({
        "message": err.message,
        "statuscode": err.status? err.status: null
      })
    })
    .finally( _ => {
      setDisabled(false);
      setLoading(false);
    })
  }

  const style = {
    loadingStyle: {
      "position":"fixed",
      "top":"0",
      "left":"0",
      "width":"100vw",
      "height":"100vw",
      "backgroundColor":"gray",
      "opacity":"0.3",
      "zIndex":"100"
    },
    btn: {
      "alignText":"center",
      "marginLeft":"auto"
    }
  }
  
  return (
    <>
      <ModelSelectModal
        modalShow={modelModal}
        setModalShow={setModelModal}
        setModel={setModel}
        setLoading={setLoading}/>
      <SettingSelectModal
        modalShow={settingModal}
        setModalShow={setSettingModal}/>
      <div className={mainStyle.container}>
        {isLoading && <Loader type="spin" color="black" message={"Loading..."}/>}
        <div style={{"display":"flex"}}>
          <Title title="모델 정보"/>
          <Button 
              className="right"
              type="button"
              style={style.btn}
              onClick={() => setModelModal(true)}>
              모델 선택
          </Button>
        </div>
        <div className={mainStyle.subContainer}>
            <LayerBoard />
        </div>
        <div style={{"display":"flex"}}>
          <Title title="설정 정보"/>
          <Button
              className="right"
              type="button"
              style={style.btn}
              onClick={() => setSettingModal(true)}>
              설정 선택
          </Button>
        </div>
        <div className={mainStyle.subContainer}>
            <SettingBoard/>
        </div>
        <div style={{"display":"flex",
                    "justifyContent":"space-between",
                    "marginRight":"2.5rem"}}>
          <Title title="훈련 셋"/>
          <div style={{"display":"flex"}}>
            <Inputs
                kind="input"
                type="number"
                mainTitle="데이터 뷰 개수"
                title="trainNData"
                placeholder="정수만 입력"
                defaultValue={5}
                step={1}
                min={1}
                max={xs.shape[0]}
                required={true}
                value={nData}
                setValue={setNData}
                isValue={true}/>
            <Button
                className="right dataView"
                type="button"
                onClick={() => {
                  updateViewData(xs, setViewTrainX, nData)
                  updateViewData(ys, setViewTrainY, nData)
                }}>
                적용
            </Button>
          </div>
        </div>

        <div className={mainStyle.subContainer}>
              <Title title="라벨 데이터 테이블"
                  style={{"fontSize":"1.25rem", "margin": "0.5rem 0"}}/>
              <div className={mainStyle.subContainer}>
                  {contentView({
                      element: viewTrainY.columns,
                      children: <ArrayTable
                                  style={{"height":"24rem"}}
                                  data={viewTrainY}
                                  totalShape={ys.shape}
                                  />,
                      checkFunction: isEmptyArray
                  })}
              </div>
              <Title title="특성 데이터 테이블"
                  style={{"fontSize":"1.25rem", "margin": "0.5rem 0"}}/>
              <div className={mainStyle.subContainer}>
                  {contentView({
                      element: viewTrainX.columns,
                      children: <ArrayTable
                                  style={{"height":"24rem"}}
                                  data={viewTrainX}
                                  totalShape={xs.shape}
                                />,
                      checkFunction: isEmptyArray
                  })}
              </div>
        </div>
        <Button
          className="center green"
          style={{"width":"100%"}}
          type="button"
          disabled={disabled}
          onClick={onClickHandler}>
            학습
        </Button>
      </div>
    </>
  )
}

export default React.memo(Fit)