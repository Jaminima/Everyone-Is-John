import React from "react";
import doFetch from "../scripts/fetch";
import "./players.css"

class PlayerView extends React.Component<any, any> {
    static defaultProps = {}
    props = {
        ownJohn: false,
        user: {
            name: "",
            identifier: ""
        }
    }
    state = {
        playerError: "",
        player: {
            user: -1,
            missions: [{
                desc: "Example",
                acheived: 0,
                idx: 0,
                level: 0,
                suggestedAcheived: 0
            }]
        }
    }
    public ignoreUpdate: boolean = false;
    private mainLoad: boolean = true;

    constructor(props: any) {
        super(props);
        this.props = props;
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if (!this.ignoreUpdate) {
            this.getPlayer();
            this.ignoreUpdate = true;
        }
    }

    componentDidMount() {
        if (this.mainLoad) {
            this.getPlayer();
        }
    }

    softMergePlayer(d: any) {
        let plr = this.state.player;
        for (let i = 0; i < d.missions.length; i++) {
            if (plr.missions.length <= i) {
                plr.missions.push(d.missions[i])
            } else {
                plr.missions[i].acheived = d.missions[i].acheived;
                plr.missions[i].suggestedAcheived = d.missions[i].suggestedAcheived;
            }
        }
        this.setState({player: plr});
    }

    getPlayer() {
        let that = this;
        if (this.props.ownJohn) return;
        doFetch("player?id=" + (that.state.player.user != -1 ? that.state.player.user.toString() : ""), "GET", (d) => {
            that.ignoreUpdate = true;
            if (that.mainLoad) {
                that.mainLoad = false;
                that.setState({player: d, newName: that.props.user.name})
            } else {
                that.softMergePlayer(d);
            }
        }, (d) => {

        })
    }

    updateMission(idx: number, desc: string | undefined = undefined, level: string | undefined = undefined) {
        let plr = this.state.player;
        if (desc != undefined) {
            plr.missions[idx].desc = desc;
        }
        if (level != undefined) {
            let i_level = parseInt(level.replace(plr.missions[idx].level.toString(), ""));
            if (i_level != NaN && i_level > 0 && i_level < 4) {
                plr.missions[idx].level = i_level;
            }
        }
        this.ignoreUpdate = true;
        this.setState({player: plr});
    }

    incrementScore(idx: number, decrement = false) {
        let that = this;
        doFetch("player/score/" + idx + "?playerId=" + this.state.player.user + "&decrement=" + (decrement ? "true" : "false"), "POST",
            (d) => {
                let plr = that.state.player;
                plr.missions = d["missions"];
                that.setState({player: plr});
            },
            (d) => {
                that.setState({playerError: d["detail"]});
                setTimeout(() => {
                    that.setState({playerError: ""})
                }, 10000);
            });
    }

    ignoreScore(idx: number) {
        let that = this;
        doFetch("player/score/ignoresuggested/" + idx + "?playerId=" + this.state.player.user, "POST",
            (d) => {
                let plr = that.state.player;
                plr.missions = d["missions"];
                that.setState({player: plr});
            },
            (d) => {
                that.setState({playerError: d["detail"]});
                setTimeout(() => {
                    that.setState({playerError: ""})
                }, 10000);
            });
    }

    getRows() {
        let rows = [];
        for (let i = 0; i < this.state.player.missions.length; i++) {
            let e = this.state.player.missions[i];
            let sp = (<button type="button" onClick={() => this.incrementScore(i, false)}>+</button>);
            let sm = (<button type="button" onClick={() => this.incrementScore(i, true)}>-</button>);
            let si = (<button type="button" onClick={() => this.ignoreScore(i)}>Ignore</button>);
            rows.push((<tr key={i}>
                <td><textarea onChange={(e) => this.updateMission(i, e.target.value)} readOnly={this.props.ownJohn}
                              value={e.desc}/></td>
                <td><input onChange={(e) => this.updateMission(i, undefined, e.target.value)}
                           readOnly={this.props.ownJohn} value={e.level}/></td>
                <td>{this.props.ownJohn ? sp : null}{e.acheived}{this.props.ownJohn ? sm : null}</td>
                <td>{!this.props.ownJohn ? sp : null}{e.suggestedAcheived}{!this.props.ownJohn ? sm : si}</td>
            </tr>))
        }
        return rows;
    }

    save() {
        let that = this;
        doFetch("player/missions", "POST",
            (d) => {

            },
            (d) => {
                that.setState({playerError: d["detail"]});
                setTimeout(() => {
                    that.setState({playerError: ""})
                }, 10000);
            },
            {},
            that.state.player.missions
        )
    }

    render() {
        return this.state.player.user != -1 ? (<div>
            <h3>Player Details</h3>
            <a style={{color: "orangered"}}>{this.state.playerError}</a>
            <table style={{width: "100vw"}} className="players">
                <tbody>
                <tr>
                    <th>Description</th>
                    <th>Level (1-3)</th>
                    <th>Real Score</th>
                    <th>Suggested Score</th>
                </tr>
                {this.getRows()}
                </tbody>
            </table>
            <button type="button" onClick={() => {
                this.save()
            }}>Update
            </button>
        </div>) : (<div></div>);
    }
}

export default PlayerView;