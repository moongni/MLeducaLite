import React from "react";
import tabStyle from "./tab.module.css";

function Tabs({style, ...props}) {
    const handleTabClick = (id) => {
        props.setCurrentTab(`${id}`);
    }

    return (
        <div className={tabStyle.container}
            style={style}>
            { props.tabData.map((tab) => (
                <button 
                    className={tabStyle.button}
                    key={tab.id} 
                    disabled={props.currentTab === `${tab.id}`} 
                    onClick={()=>handleTabClick(tab.id)}
                >
                    {tab.title}
                </button>
            ))}
        </div>
    )
}

export default Tabs;