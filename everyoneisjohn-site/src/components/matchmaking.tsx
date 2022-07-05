import React from "react";
import doFetch from "../scripts/fetch";
import customFetch, {isLocalhost} from "../scripts/customFetch";

class Matchmaking extends React.Component<any, any>{
    private first: boolean = true;

    props={
        user: {
            name: "",
            identifier: ""
        }
    }

    state = {
        inJohn: false,
        john:{
            creator: -1,
            isPlaying: false,
            name: "",
            pendingPlayers: [],
            identifier: ""
        }
    }

    componentDidMount() {
        let that = this;
        if (this.first){
            this.first=false;

            customFetch("john", (d)=>{
                that.setState({john: d["john"], inJohn: true})
            },(d)=>{

            })
        }
    }

    createJohn(){
        let that = this;
        doFetch("john/new", "POST", (d)=>{
            that.setState({john: d, inJohn: true})
            if (isLocalhost) localStorage.setItem("johnId",d["identifier"])
        },(d)=>{

        })
    }

    joinJohn(){

    }

    render() {
        return (<div>
            {(this.state.inJohn ?
                (<div>
                    <h2>Active Game - {this.state.john.identifier}</h2>
                    <h3>Character Name: {this.state.john.name}</h3>
                </div>) :
                (<div>
                    <button type="button" onClick={() => {this.createJohn()}}>Create John</button>
                    <button type="button" onClick={() => {this.joinJohn()}}>Join John</button>
                </div>))}
        </div>);
    }
}

export default Matchmaking;