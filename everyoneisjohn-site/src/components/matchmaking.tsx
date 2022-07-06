import React from "react";
import doFetch from "../scripts/fetch";
import customFetch, {isLocalhost} from "../scripts/customFetch";
import Players from "./players";

class Matchmaking extends React.Component<any, any>{
    private first: boolean = true;

    constructor(props:any) {
        super(props);
        this.props=props;
    }

    props={
        user: {
            name: "",
            identifier: ""
        }
    }

    state = {
        joinIdentifier: "",
        inJohn: false,
        john:{
            creator: -1,
            isPlaying: false,
            name: "",
            pendingPlayers: [],
            identifier: ""
        },
        players: [],
        playersNames: [],
        pendingPlayersNames: []
    }

    getJohn(){
        let that = this;
        customFetch("john", (d)=>{
                if (d["john"]["creator"] == that.props.user.identifier || d["players"].includes(that.props.user.identifier) || d["john"]["pendingPlayers"].includes(that.props.user.identifier)){
                    that.setState({john: d["john"], players: d["players"], playersNames: d["playersNames"], pendingPlayersNames: d["pendingPlayersNames"], inJohn: true})
                }
                else{
                    that.setState({
                        joinIdentifier: "",
                        inJohn: false,
                        john:{
                            creator: -1,
                            isPlaying: false,
                            name: "",
                            pendingPlayers: [],
                            identifier: ""
                        },
                        players: [],
                        playersNames: [],
                        pendingPlayersNames: []
                    })
                }
            },(d)=>{

        })
    }

    componentDidMount() {
        if (this.first){
            this.first=false;

            this.getJohn();
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
        let that = this;
        doFetch("john/join/"+this.state.joinIdentifier, "POST", (d)=>{
            that.getJohn();

            if (isLocalhost) localStorage.setItem("johnId",d["identifier"])
        },(d)=>{

        })
    }

    leaveJohn(){
        this.setState({john: null, inJohn: false})
        if (isLocalhost) localStorage.removeItem("johnId");
    }

    render() {
        return (<div>
            {(this.state.inJohn ?
                (<div>
                    <h2>{(this.state.john.pendingPlayers.includes(this.props.user.identifier as never) ? "Pending Join To" : "Playing In")} Game - {this.state.john.identifier}</h2>
                    <h3>Character Name: {this.state.john.name}</h3>
                    <button type="button" onClick={() => {this.leaveJohn()}}>Leave John</button>
                    <hr/>
                    {(this.state.john.creator.toString() == this.props.user.identifier || this.state.players.includes(this.props.user.identifier as never) ?
                            (<div>
                                <Players matchmaker={this} user={this.props.user} matchmakingState={this.state}></Players>
                            </div>)
                            : (<div></div>)
                    )}
                </div>) :
                (<div>
                    <table style={{width: "100vw"}}>
                        <tbody>
                            <tr>
                                <td>
                                    <button type="button" onClick={() => {this.createJohn()}}>Create John</button>
                                </td>
                                <td>
                                    <h4>John Join Code:</h4>
                                    <input onChange={(event) => {this.setState({joinIdentifier: event.target.value})}} placeholder="000000"/>
                                    <br/>
                                    <button type="button" onClick={() => {this.joinJohn()}}>Join John</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>


                </div>))}
        </div>);
    }
}

export default Matchmaking;