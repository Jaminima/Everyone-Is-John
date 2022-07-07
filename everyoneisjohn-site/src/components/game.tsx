import React from "react";
import {checkAuth, login} from "../scripts/auth";
import Matchmaking from "./matchmaking";
import doFetch from "../scripts/fetch";

class Game extends React.Component<any, any>{

    private first : boolean = true;

    state={
        loaded: false,
        user: {
            name: "",
            identifier: ""
        },
        colorI: 0,
        colorR: 255,
        colorG: 0,
        colorB: 127
    }

    componentDidMount() {
        let that = this;
        if (this.first) {
            this.first=false;
            checkAuth().then((d:any) => {
                that.setState({user: d, loaded: true});
            }).catch(() => {
                login("").then((d: any) => {
                    that.setState({user: d["user"], loaded: true});
                }).catch(() => {
                    console.error("Could Not Login");
                })
            })
        }

        setInterval(()=>{
            let s = that.state;

            s.colorR += s.colorI==0 ? -1 : (s.colorI==2 ? 1 : 0);
            s.colorG += s.colorI==1 ? -1 : (s.colorI==0 ? 1 : 0);
            s.colorB += s.colorI==2 ? -1 : (s.colorI==1 ? 1 : 0);

            if (s.colorR==255 || s.colorG==255 || s.colorB == 255) s.colorI=(s.colorI+1)%3;

            that.setState(s);
        },50)
    }

    updateName(){
        doFetch("authentication/update?name="+this.state.user.name,"post",
            (d)=>{
            },
            (d)=>{

            })
    }

    render() {
        return (<div>
            {(this.state.loaded ?
                (<div>
                    <h1>Everyone Is <span style={{color: "rgb("+this.state.colorR+","+this.state.colorG+","+this.state.colorB+")"}}><em>John</em></span></h1>
                    <hr/>
                    <label>Name: </label><input onChange={(e)=>this.setState({user: {name: e.target.value, identifier: this.state.user.identifier}})} value={this.state.user.name}/>
                    <button type="button" onClick={()=>this.updateName()}>Update Name</button>
                    <Matchmaking user={this.state.user}></Matchmaking>
                </div>)
                :(<h3>No Login Yet.</h3>)
            )}
        </div>);
    }
}

export default Game;