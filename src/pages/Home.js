import React , { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Title from "../components/Common/title/title";
import mainStyle from "../static/css/component.module.css";

function Home() {
    useEffect(() => {
        let vh = 0;
        vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
    }, [window.innerHeight]);

    return (
        <div className={mainStyle.container}>
            <Title title="웹앱 사용법" className={mainStyle.centerContainer}/>
            <div className={mainStyle.centerContainer} style={{"margin":"3rem 0"}}>
                <Outlet />
            </div>
        </div>
    );
}

export default Home