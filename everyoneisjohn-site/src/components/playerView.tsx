import React from "react";
import doFetch from "../scripts/fetch";
import "./players.css"
import {isLocalhost} from "../scripts/customFetch";

class PlayerView extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        this.props = props;
    }

    props={
        ownJohn: false,
        user: {
            name: "",
            identifier: ""
        }
    }

    static defaultProps={
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

    private mainLoad: boolean = true;
    public ignoreUpdate: boolean = false;

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if (!this.ignoreUpdate) {
            this.getPlayer();
            this.ignoreUpdate = true;
        }
    }

    componentDidMount() {
        if (this.mainLoad){
            this.getPlayer();
        }
    }

    softMergePlayer(d:any){
        let plr = this.state.player;
        for (let i=0;i<d.missions.length;i++){
            if (plr.missions.length<=i){
                plr.missions.push(d.missions[i])
            }
            else{
                plr.missions[i].acheived = d.missions[i].acheived;
                plr.missions[i].suggestedAcheived = d.missions[i].suggestedAcheived;
            }
        }
        this.setState({player: plr});
    }

    getPlayer(){
        let that = this;
        if (this.props.ownJohn) return;
        doFetch("player?id="+(that.state.player.user!=-1 ? that.state.player.user.toString() : ""), "GET", (d)=>{
            that.ignoreUpdate = true;
            if (that.mainLoad) {
                that.mainLoad = false;
                that.setState({player: d, newName: that.props.user.name})
            }
            else{
                that.softMergePlayer(d);
            }
        },(d)=>{

        })
    }

    updateMission(idx: number, desc: string | undefined = undefined, level: string | undefined = undefined){
        let plr = this.state.player;
        if (desc != undefined){
            plr.missions[idx].desc=desc;
        }
        if (level != undefined){
            let i_level = parseInt(level.replace(plr.missions[idx].level.toString(),""));
            if (i_level!=NaN && i_level>0 && i_level<4){
                plr.missions[idx].level=i_level;
            }
        }
        this.ignoreUpdate = true;
        this.setState({player:plr});
    }


    getRows(){
        let rows = [];
        for (let i=0;i<this.state.player.missions.length;i++){
            let e = this.state.player.missions[i];
            rows.push((<tr key={i}>
                <td><textarea onChange={(e) => this.updateMission(i, e.target.value)} readOnly={this.props.ownJohn} value={e.desc}/></td>
                <td><input onChange={(e)=>this.updateMission(i,undefined,e.target.value)} readOnly={this.props.ownJohn} value={e.level}/></td>
                <td>{e.acheived}</td>
            </tr>))
        }
        return rows;
    }

    save(){
        let that = this;
        doFetch("player/missions", "POST",
            (d)=>{

            },
            (d)=>{

            },
            {},
            that.state.player.missions
            )
    }

    render() {
        return (<div>
            <h3>Player Details</h3>
            <table style={{width: "100vw"}} className="players">
                <tbody>
                <tr>
                    <th>Description</th>
                    <th>Level (1-3)</th>
                    <th>Score</th>
                </tr>
                {this.getRows()}
                </tbody>
            </table>
            <button type="button" onClick={()=>{this.save()}}>Update</button>
        </div>)
    }
}

export default PlayerView;