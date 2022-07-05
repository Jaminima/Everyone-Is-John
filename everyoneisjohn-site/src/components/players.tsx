import React from "react";

class Players extends React.Component<any, any>{

    props={
        players:[],
        playersNames: []
    }

    getRows(){
        let rows = [];
        for (let i=0;i<this.props.players.length;i++){
            rows.push((<tr key={i}><td>{this.props.playersNames[i]}</td></tr>));
        }
        return rows;
    }

    render() {
        return (
            <div>
                <table style={{width: "100vw"}}>
                    <tbody>
                    {this.getRows()}
                    </tbody>
                </table>

            </div>
        );
    }
}

export default Players;