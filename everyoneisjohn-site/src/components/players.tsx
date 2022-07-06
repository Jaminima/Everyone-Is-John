import React from "react";
import doFetch from "../scripts/fetch";
import Matchmaking from "./matchmaking";
import matchmaking from "./matchmaking";

class Players extends React.Component<any, any>{

    props={
        matchmaker: {} as matchmaking,
        user: {
            name: "",
            identifier: ""
        },
        matchmakingState:{
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

    getPlayersRows(){
        let rows = [];
        for (let i=0;i<this.props.matchmakingState.players.length;i++){
            rows.push((<tr key={i}>
                <td>{this.props.matchmakingState.playersNames[i]}</td>
                {(this.props.matchmakingState.john.creator.toString()==this.props.user.identifier ?
                    (<td><button type="button" onClick={()=>this.kickPlayer(this.props.matchmakingState.players[i])}>Kick</button></td>):
                    (<td></td>))}
            </tr>));
        }
        return rows;
    }

    getPendingPlayersRows(){
        let rows = [];
        for (let i=0;i<this.props.matchmakingState.john.pendingPlayers.length;i++){
            let id = this.props.matchmakingState.john.pendingPlayers[i];
            rows.push((<tr key={i}>
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
                    {(this.props.matchmakingState.john.creator.toString()==this.props.user.identifier ? this.getPendingPlayersRows() : [])}
                    {this.getPlayersRows()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Players;