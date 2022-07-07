import React from "react";
import doFetch from "../scripts/fetch";
import customFetch, {isLocalhost} from "../scripts/customFetch";
import Players from "./players";
import PlayerView from "./playerView";

class Matchmaking extends React.Component<any, any>{
    private first: boolean = true;
    public playerViewRef: React.RefObject<PlayerView>;

    constructor(props:any) {
        super(props);
        this.props=props;
        this.playerViewRef = React.createRef<PlayerView>();
    }

    props={
        user: {
            name: "",
            identifier: ""
        }
    }

    state = {
        gameError: "",
        joinIdentifier: "",
        inJohn: false,
        ownJohn: false,
        ownerName: "",
        john:{
            creator: -1,
            isPlaying: false,
            name: "",
            pendingPlayers: [],
            identifier: ""
        },
        fullPlayers: [],
        players: [],
        playersNames: [],
        pendingPlayersNames: []
    }

    private johnUpdater: NodeJS.Timer | undefined;

    getJohn(){
        let that = this;
        customFetch("john", (d)=>{
                if (d["john"]["creator"] == that.props.user.identifier || d["players"].includes(that.props.user.identifier) || d["john"]["pendingPlayers"].includes(that.props.user.identifier)){
                    that.setState({john: d["john"], ownerName: d["ownerName"], ownJohn: d["john"]["creator"]==that.props.user.identifier, fullPlayers: d["fullPlayers"], players: d["players"], playersNames: d["playersNames"], pendingPlayersNames: d["pendingPlayersNames"], inJohn: true})
                    if (that.johnUpdater == undefined) {
                        that.johnUpdater = setInterval(() => {
                            that.getJohn()
                        }, 15000);
                    }
                }
                else{
                    that.reset();
                }
            },(d)=>{
            that.reset();
        })
    }

    reset(){
        this.setState({
                joinIdentifier: "",
                inJohn: false,
                fullPlayers: [],
                ownerName: "",
                john: {
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
        )
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
            if (isLocalhost) localStorage.setItem("johnId",d["identifier"])
            that.getJohn();
        },(d)=>{

        })
    }

    startJohn(){
        let that = this;
        doFetch("john/start", "POST", (d)=>{
            that.getJohn();
        },(d)=>{
            that.setState({gameError: d["detail"]})
            setTimeout(()=>{that.setState({gameError: ""})},10000);

        })
    }

    joinJohn(){
        let that = this;
        doFetch("john/join/"+this.state.joinIdentifier, "POST", (d)=>{
            if (isLocalhost) localStorage.setItem("johnId",d["identifier"])
            that.getJohn();
        },(d)=>{
            that.setState({gameError: d["detail"]})
            setTimeout(()=>{that.setState({gameError: ""})},10000);
        })
    }

    leaveJohn(){
        let that = this;
        doFetch("john/leave", "POST", (d)=>{
            that.setState({john: null, inJohn: false})
            if (isLocalhost) localStorage.removeItem("johnId");
        },(d)=>{
            that.setState({gameError: d["detail"]})
            setTimeout(()=>{that.setState({gameError: ""})},10000);
        })
    }

    updateJohn(){
        let that=this;
        doFetch("john/name?name="+this.state.john.name, "POST", (d)=>{
            that.setState({john: d});
        },(d)=>{
            that.setState({gameError: d["detail"]})
            setTimeout(()=>{that.setState({gameError: ""})},10000);
        })
    }

    render() {
        return (<div>
            {(this.state.inJohn ?
                (<div>
                    <h2>Game - {this.state.john.identifier}</h2>
                    <h3>{(this.state.john.pendingPlayers.includes(this.props.user.identifier as never) ? "Awaiting Join" : (this.state.john.isPlaying) ? "Playing" : "Awaiting Start")} </h3>

                    <p style={{color: "red"}}>{this.state.gameError}</p>
                    {(this.state.john.creator.toString() == this.props.user.identifier && !this.state.john.isPlaying ?
                            (<div>
                                <h4><input value={this.state.john.name} onChange={(e)=>{
                                    let j = this.state.john;
                                    j.name = e.target.value;
                                    this.setState({john: j});
                                }}/> Created By {this.state.ownerName}</h4>
                                    <button type="button" onClick={() => {this.updateJohn()}}>Update John Name</button>
                                <button type="button" onClick={() => {this.startJohn()}}>Start John</button>
                                    <button type="button" onClick={() => {this.leaveJohn()}}>Delete John</button>
                            </div>
                            ):(<div>
                                <h4>{this.state.john.name} Created By {this.state.ownerName}</h4>
                                <button type="button" onClick={() => {this.leaveJohn()}}>Leave John</button>
                            </div>)
                    )}
                    <hr/>
                    {(this.state.john.creator.toString() == this.props.user.identifier || this.state.players.includes(this.props.user.identifier as never) ?
                            (<div>
                                <Players matchmaker={this} user={this.props.user} matchmakingState={this.state}></Players>
                                <hr/>
                                <PlayerView ref={this.playerViewRef} ownJohn={this.state.ownJohn} user={this.props.user}></PlayerView>
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