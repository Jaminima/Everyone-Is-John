import React from "react";
import doFetch from "../scripts/fetch";
import {isLocalhost} from "../scripts/customFetch";

class PlayerView extends React.Component<any, any>{
    props={
        playerId: "",
        user: {
            name: "",
            identifier: ""
        }
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
    private ignoreReUpdate: boolean = false;

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if (!this.ignoreReUpdate) {
            this.ignoreReUpdate = true;
            this.getPlayer();
        }
        else{
            this.ignoreReUpdate = false;
        }
    }

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
            <label>Name: </label><input value={this.props.user.name}/>
            <table style={{width: "100vw"}}>
                <tbody>
                <tr>
                    <th>Description</th>
                    <th>Level (1-3)</th>
                    <th>Score</th>
                </tr>
                {this.getRows()}
                </tbody>
            </table>
        </div>)
    }
}

export default PlayerView;