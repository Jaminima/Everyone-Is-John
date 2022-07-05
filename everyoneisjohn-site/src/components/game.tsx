import React from "react";
import {checkAuth, login} from "../scripts/auth";
import Matchmaking from "./matchmaking";

class Game extends React.Component<any, any>{

    private first : boolean = true;

    state={
        loaded: false,
        user: {
            name: "",
            identifier: ""
        }
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
    }

    render() {
        return (<div>
            {(this.state.loaded ?
                (<div>
                    <h1>Profile</h1>
                    <h3>Name - {this.state.user.name}</h3>
                    <h5>Id - {this.state.user.identifier}</h5>
                    <hr/>
                    <Matchmaking user={this.state.user}></Matchmaking>
                </div>)
                :(<h3>No Login Yet.</h3>)
            )}
        </div>);
    }
}

export default Game;