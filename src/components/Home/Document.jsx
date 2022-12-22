import React, {
    useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Common/button/Button";
import Title from "../Common/title/title";
import style from "./horisonScroll.module.css";
import CardData from "../../data/docsData.json";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import "./hideScrollbar.css";
import { usePreventBodyScroll } from "./preventScroll";
import { LeftArrow, RightArrow } from "./Arrow";

const getItems = () => (
    CardData.map(( item, idx ) => ({
        ...item,
        ['id']: idx
    }))
)

const Docs = ({}) => {
    const [ items, setItems ] = useState(getItems);
    const { disableScroll, enableScroll } = usePreventBodyScroll();

    return (
        <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}
            style={{"width":"100%"}}>
            <ScrollMenu 
                LeftArrow={LeftArrow} 
                RightArrow={RightArrow}
                onWheel={onWheel}
            >
                {items.map(( item ) => (
                    <Card
                        itemId={item.id}
                        {...item}
                    />
                ))}
            </ScrollMenu>
        </div>
    )
}

const onWheel = (apiObj, ev) => {
    const isTouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

    if (isTouchpad) {
        ev.stopPropagation();
        return ;
    }

    if (ev.deltaY < 0) {
        apiObj.scrollNext();
    } else if (ev.deltaY > 0) {
        apiObj.scrollPrev();
    }
}


const Card = ({ itemId, ...props }) => {
    const navigate = useNavigate();

    const btnStyle = {
        "position":"absolute", 
        "bottom": "20px", 
        "left":"50%", 
        "transform":"translateX(-50%)",
        "radius":"1em",
        "width":"200px", 
        "height":"50px",
    }

    var public_url = process.env.PUBLIC_URL[process.env.PUBLIC_URL.length - 1] === "/" ?
        process.env.PUBLIC_URL.slice(0, -1): process.env.PUBLIC_URL

    return (
        <div className={style.cardContainer}>
            <div className={style.imgContainer}>
                <img className={style.img} src={public_url + props.imgUrl} alt=""/>
            </div>
            <div className={style.contentContainer}>
                <Title title={props.title} style={{"padding":"10px 15px"}}/>
                <span className={style.span}>{props.description}</span>
                <Button
                    className={"green"}
                    style={btnStyle}
                    type="button"
                    onClick={() => navigate(props.pageUrl)}>
                    페이지 이동
                </Button>
            </div>
        </div>
    )
}

export default Docs