import React, { useState, useEffect } from "react";
import { ModelDashBoard } from "../components/ModelDashBoard/ModelDashBoard";
import { MainSidebar } from "../components/MainSideBar/MainSidebar"
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    const [ isOpen, setMenu ] = useState(false);
    const [ isDashboardOpen, setDashboard ] = useState(false);
    
    const [ model, setModel ] = useState({});
    
    useEffect(() => {
        let vh = 0;
        vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
    }, [window.innerHeight]);

    const styles = {
        main: {
            position: "relative",
            padding: "5rem 1rem 1rem 1rem",
            marginLeft: "78px",
            minWidth: "700px",
            backgroundColor:"rgb(241 245 249)",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            transitionDuration: "300ms",
            minHeight: "calc(var(--vh, 1vh) * 100)"
        }
    }

    return (
        <>
            <MainSidebar
                isOpen={isOpen} 
                setMenu={setMenu} 
                isDashboardOpen={isDashboardOpen} 
                setDashboard={setDashboard}
            />
            <ModelDashBoard
                isDashboardOpen={isDashboardOpen}
            />
            <div style={styles.main}>
                <Outlet context={[model, setModel]}/>
            </div>

        </>
    )
}

export default MainLayout;