import React, { useState } from "react";
import Layers from "../components/Setting/Layers/Layers";
import Params from "../components/Setting/Params";
import Nav from "../components/Common/singlePageNav/Nav";
import NavProvider from "../components/Common/singlePageNav/NavContext";
import { settingLinks } from "../components/Setting/settingLinks";
import Compile from "../components/Setting/Compile/compile";
import { useEffect } from "react";
import Alect from "../components/Common/alert/Alert";

const Setting = ({children, ...props}) => {
    const [ isAlectVisable, setAlectVisiable ] = useState(false);
    const [ alectMsg, setAlectMsg ] = useState("");

    useEffect(() => {
        if (isAlectVisable) {
            setTimeout(() => {
                setAlectVisiable(false);
            }, 1500);
        }
    }, [ isAlectVisable ])

    const style = {
        main:{
            position:"relative",
            display:"flex",
            width:"100%",
            height:"100%"
        },
        nav:{
            position:"fixed",
            width:"13rem",
            height:"100%"
        },
        setting:{
            position:"relative",
            marginLeft:"14rem",
            width:"100%",
            height:"100%"
        }
    }

    return (
        <div style={style.main}>
            <NavProvider>
                <div style={style.nav}>
                    <Nav links={settingLinks}/>
                </div>
                <div style={style.setting}>
                    <Layers />
                    <Compile setAlectVisiable={setAlectVisiable} setAlectMsg={setAlectMsg}/>
                    <Params setAlectVisiable={setAlectVisiable} setAlectMsg={setAlectMsg}/>
                </div>
            </NavProvider>
            <Alect 
                message={alectMsg}
                value={isAlectVisable}
                setValue={setAlectVisiable}/>
        </div>
    )
}

export default Setting;