import React from "react";
import doFetch from "../scripts/fetch";
import {isLocalhost} from "../scripts/customFetch";

class PlayerView extends React.Component<any, any>{
    props={
        playerId: ""
    }

    static defaultProps={
        playerId: ""
    }

    state={
        player: {
            user: -1,
            missions:[{
                desc: "Example",
                acheived: 0,
                idx: 0,
                level: 0,
                suggestedAcheived: 0
            }]
        }
    }

    private first: boolean = true;

    componentDidMount() {
        if (this.first){
            this.first = false;
            this.getPlayer();
        }
    }

    getPlayer(){
        let that = this;
        doFetch("player?id="+that.props.playerId, "GET", (d)=>{
            that.setState({player: d})
        },(d)=>{

        })
    }

    getRows(){
        let rows = [];
        for (let i=0;i<this.state.player.missions.length;i++){
            let e = this.state.player.missions[i];
            rows.push((<tr>
                <td><input value={e.desc}/></td>
                <td><input value={e.level}/></td>
                <td>{e.acheived}</td>
            </tr>))
        }
        return rows;
    }

    render() {
        return (<div>
            <h3>Player Details</h3>
            <table style={{width: "100vw"}}>
                <tbody>
                <tr>
                    <th>Description</th>
                    <th>Level (0-2)</th>
                    <th>Score</th>
                </tr>
                {this.getRows()}
                </tbody>
            </table>
        </div>)
    }
}

export default PlayerView;