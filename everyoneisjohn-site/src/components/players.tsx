import React from "react";
import doFetch from "../scripts/fetch";
import Matchmaking from "./matchmaking";
import matchmaking from "./matchmaking";

class Players extends React.Component<any, any>{
    constructor(props:any) {
        super(props);
        this.props = props;
    }

    props={
        matchmaker: {} as matchmaking,
        user: {
            name: "",
            identifier: ""
        },
        matchmakingState:{
            fullPlayers:[
                {user: -1,
                    missions:[{
                        desc: "Example",
                        acheived: 0,
                        idx: 0,
                        level: 0,
                        suggestedAcheived: 0
                    }]}
            ],
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
    }

    state={
        viewPlayerId: -1
    }

    kickPlayer(playerId: any){
        let that = this;
        doFetch("john/players?kick=true&player="+playerId, "POST",(d)=>{
            that.props.matchmaker.getJohn();
        },(d)=>{

        });
    }

    acceptPlayer(playerId: any){
        let that = this;
        doFetch("john/players?accept=true&player="+playerId, "POST",(d)=>{
            that.props.matchmaker.getJohn();
        },(d)=>{

        });
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if (this.state.viewPlayerId!=-1){
            let idx = this.props.matchmakingState.fullPlayers.findIndex(x=>x.user==this.state.viewPlayerId);

            this.props.matchmaker.playerViewRef.current?.setState({newName: this.props.matchmakingState.playersNames[idx],player:this.props.matchmakingState.fullPlayers[idx]});
        }
    }

    getPlayersRows(){
        let rows = [];
        for (let i=0;i<this.props.matchmakingState.players.length;i++){
            let id = this.props.matchmakingState.players[i];
            let fullPlayer = this.props.matchmakingState.fullPlayers!= null ? this.props.matchmakingState.fullPlayers.find(x=>x.user==id) : null;
            let name = this.props.matchmakingState.playersNames[i];
            let isOwner = this.props.matchmakingState.john.creator.toString()==this.props.user.identifier;
            let missions = isOwner ? (<button type="button" onClick={()=>this.setState({viewPlayerId: id})}>View</button>) : (<a></a>)
                let kick = isOwner ? (<button type="button" onClick={()=>this.kickPlayer(id)}>Kick</button>) : (<a></a>)

            rows.push((<tr key={i} style={{backgroundColor: (fullPlayer!=null && fullPlayer.missions.some(x=>x.acheived!=x.suggestedAcheived) ? "orange" : "inherit" )}}>
                <td>{id}</td>
                <td>{name}</td>
                <td>{missions}</td>
                <td>{kick}</td>
            </tr>));
        }
        return rows;
    }

    getPendingPlayersRows(){
        let rows = [];
        for (let i=0;i<this.props.matchmakingState.john.pendingPlayers.length;i++){
            let id = this.props.matchmakingState.john.pendingPlayers[i];
            rows.push((<tr key={i}>
                <td>{id}</td>
                <td>Pending - {this.props.matchmakingState.pendingPlayersNames[i]}</td>
                <td><button type="button" onClick={()=>this.acceptPlayer(id)}>Accept</button></td>
                <td><button type="button" onClick={()=>this.kickPlayer(id)}>Reject</button></td>
            </tr>));
        }
        return rows;
    }

    render() {
        return (
            <div>
                <h2>Players</h2>
                <table style={{width: "100vw"}}>
                    <tbody>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th></th>
                        <th></th>
                    </tr>
                    {(this.props.matchmakingState.john.creator.toString()==this.props.user.identifier ? this.getPendingPlayersRows() : [])}
                    {this.getPlayersRows()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Players;