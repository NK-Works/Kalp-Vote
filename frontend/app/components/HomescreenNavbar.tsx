import React, {MouseEventHandler} from "react";
import {FaSun} from "react-icons/fa6";
import {GiHamburgerMenu} from "react-icons/gi";


const HomescreenNavbar = ({mousePosition, hoverState, leaveState}: { mousePosition: { x: number, y: number }, hoverState: React.MouseEventHandler,leaveState: React.MouseEventHandler }): React.ReactNode => {


    return (
        <nav
            className={`text-white font-light z-[99] flex justify-between items-center w-[85%] absolute top-0 left-1/2 -translate-x-1/2 p-8`}>
            <h1 className={`uppercase`}>
                KALP
                <br/>
                Vote
            </h1>
            <div
                onMouseEnter={hoverState}
                onMouseLeave={leaveState}
                className={`p-2 bg-white/10 rounded-full`}>
                <FaSun/>
            </div>
            <div className={`flex items-center gap-[0.5rem] rounded-full`}>
                Menu
                <div className={`p-2 rounded-full bg-white/10`}>
                    <GiHamburgerMenu/>
                </div>
            </div>
        </nav>
    )
}

export default HomescreenNavbar;