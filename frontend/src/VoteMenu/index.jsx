import React from "react";
import {constructRequest, getCookie, MOCK} from "../common/helper";
import {VoteMenuContainer} from "../LoginPage/styles";
import {Redirect} from "react-router-dom";
import Poll from "../Poll";

export default class VoteMenu extends React.Component {
    constructor(props) {
        super(props);
        const user = getCookie('user');
        this.state = {
            user,
            polls: MOCK,
            activePoll: 0,
        }
    }

    componentDidMount() {
        fetch("http://localhost:3000/polls", constructRequest("GET"))
            .then(res => res.json())
            .then(res => {
                const polls = [{name: '-', options: []}];

                for (let poll in res) {
                    if (res.hasOwnProperty(poll)) {
                        polls.push({name: poll, options: res[poll]})
                    }
                }

                this.setState({polls})
            })
            .catch(msg => console.log(msg));
    }

    setActivePoll = (event) => {
        this.setState({activePoll: event.target.value})
    };

    logOut = () => {
        document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        this.setState({user: null})
    };

    render() {
        const {user, polls, activePoll} = this.state;
        return <VoteMenuContainer>
            {!user && <Redirect to='/'/>}
            <h2>Welcome {user}</h2>
            <select onChange={this.setActivePoll}>
                {polls.map((poll, idx) => <option key={idx} value={idx}>{poll.name}</option>)}
            </select><br/><br/>
            {activePoll > 0 && <Poll name={polls[activePoll].name} options={polls[activePoll].options}/>}<br/><br/>
            <button onClick={this.logOut}>Log out</button>
        </VoteMenuContainer>
    }

}