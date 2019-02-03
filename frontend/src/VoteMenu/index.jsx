import React from 'react';
import {constructRequest, getCookie, MOCK} from '../common/helper';
import {VoteMenuContainer} from '../common/styles';
import {Redirect} from 'react-router-dom';
import Poll from '../Poll';

export default class VoteMenu extends React.Component {
    constructor(props) {
        super(props);
        const user = getCookie('user');
        this.state = {
            user,
            polls: MOCK,
            activePoll: 0,
            isAdmin: false
        }
    }

    componentDidMount() {
        fetch('https://localhost:3000/polls', constructRequest('GET'))
            .then(res => res.json())
            .then(res => {
                const polls = [{name: '-', options: []}]
                const isAdmin = res['type'] === 'admin'

                for (let poll in res) {
                    if (res.hasOwnProperty(poll)) {
                        const options = [];

                        if (isAdmin) {
                            for (let option in res[poll]) {
                                if (res[poll].hasOwnProperty(option)) {
                                    options.push({option, voteCount: res[poll][option]})
                                }
                            }
                        } else {
                            res[poll].forEach(option => options.push({option}))
                        }

                        polls.push({name: poll, options})
                    }
                }

                this.setState({isAdmin, polls})
            })
            .catch(msg => console.log(msg));
    }

    setActivePoll = (event) => {
        this.setState({activePoll: event.target.value})
    };

    logOut = () => {
        document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:01 GMT'
        document.cookie = 'jwt=; expired=Thu, 01 Jan 1970 00:00:01 GMT'
        this.setState({user: null})
    };

    render() {
        const {user, polls, isAdmin, activePoll} = this.state;
        return <VoteMenuContainer>
            {!user && <Redirect to='/'/>}
            <h2>Currently logged in: {user}
                <button onClick={this.logOut}>Log out</button>
            </h2>
            <select onChange={this.setActivePoll}>
                {polls.map((poll, idx) => <option key={idx} value={idx}>{poll.name}</option>)}
            </select><br/><br/>
            {activePoll > 0 &&
            <Poll isAdmin={isAdmin} name={polls[activePoll].name} options={polls[activePoll].options}/>}<br/><br/>
        </VoteMenuContainer>
    }
}