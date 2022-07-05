import React from "react";
import {checkAuth, login} from "./scripts/auth";

class Profile extends React.Component<any, any>{

    private first : boolean = true;

    state={
        user: {
            name: "",
            identifier: ""
        }
    }

    componentDidMount() {
        let that = this;
        if (this.first) {
            this.first=false;
            checkAuth().then((d:any) => {
                that.setState({user: d});
            }).catch(() => {
                login("").then((d: any) => {
                    that.setState({user: d["user"]});
                }).catch(() => {
                    console.error("Could Not Login");
                })
            })
        }
    }

    render() {
        return (<div>
            <h1>Profile</h1>
            <h3>Name - {this.state.user.name}</h3>
            <h5>Id - {this.state.user.identifier}</h5>
        </div>);
    }
}

export default Profile;