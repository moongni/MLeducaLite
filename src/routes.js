import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import LoadData from './pages/LoadData';
import Preprocessing from './pages/Preprocessing';
import Fit from './pages/fit';
import Setting from './pages/Setting';
import Predict from './pages/Predict';
import MainLayout from './pages/MainLayout';
import Page404 from './pages/404';
import Analytic from './pages/Analytic';
import Download from './pages/Download';
import Docs from './components/Home/Document';
import LoadDataDoc from './components/Home/loadDataDoc';
import PreprocessingDoc from './components/Home/preprocessingDoc';
import SettingDoc from './components/Home/settingDoc';
import FitDoc from './components/Home/fitDoc';
import PredictDoc from './components/Home/predictDoc';
import AnalyticDoc from './components/Home/analyticDoc';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout/>}>
        {/* 앱 사용 설명 */}
        <Route path="/" element={<Navigate to="docs/"/>}/>
        <Route path="docs/" element={<Home/>}>
          <Route path="" element={<Docs/>}/>
          <Route path="loadData" element={<LoadDataDoc/>}/>
          <Route path="preprocessing" element={<PreprocessingDoc/>}/>
          <Route path="setting" element={<SettingDoc/>}/>
          <Route path="fit" element={<FitDoc/>}/>
          <Route path="predict" element={<PredictDoc/>}/>
          <Route path="analytic" element={<AnalyticDoc/>}/>
        </Route>
        {/* 앱 기능 페이지 */}
        <Route path='predict/*' element={<Predict/>}/>
        <Route path='fit' element={<Fit /> }/>
        <Route path='loadData' element={<LoadData/>}/>
        <Route path='preprocessing' element={<Preprocessing/>}/>
        <Route path='setting' element={<Setting/>}/>
        <Route path='analytic/' element={<Analytic/>}/>
        <Route path='download' element={<Download/>}/>
      </Route>
      <Route path="*" element={<Page404/>}/>
    </Routes>
  )
}
export default Router;