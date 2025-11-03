import {react, useState, useEffect} from "react"

export default function Casual_Main_Area(){
    return(
        <div className="casualMainAreaWrapper">
        <div className="casualMainUserOne">
            <h2 classname="userOne-rPoints">Round Points:</h2>
            <section classname="userOneButtons">
                <button classname="userOne" id="bagOn">+1</button>
                <button classname="userOne" id="bagOff">-1</button>
                <button classname="userOne" id="bagIn">+3</button>
                <button classname="userOne" id="bagOut">-3</button>
            </section>
        </div>
        <div className="casualMainUserTwo">
            <h2 classname="userTwo-rPoints">Round Points:</h2>
            <section classname="userTwoButtons">
                <button classname="userTwo" id="bagOn">+1</button>
                <button classname="userTwo" id="bagOff">-1</button>
                <button classname="userTwo" id="bagIn">+3</button>
                <button classname="userTwo" id="bagOut">-3</button>
            </section>
        </div>
        </div>
    )

}