import React from "react";
import { Option, PollContainer, VoteButtonWrapper } from "../LoginPage/styles";
import { getUser, constructRequest } from "../common/helper";

export default class Poll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chosenOption: null,
            message: null
        }
    }

    changeOption = (event) => {
        this.setState({ chosenOption: event.target.value });
    };

    makeVote = () => {
        const { chosenOption } = this.state;

        if (!chosenOption) {
            this.setState({
                message: 'Please select an option'
            })
        } else {
            this.setState({ message: null });
            const { name } = this.props;
            fetch(`http://localhost:3000/vote`, constructRequest("POST", `username=yoktur&pollName=${name}&subjectName=${chosenOption}`))
                .then(res => res.json())
                .then(res => this.setState({ message: res.message }))
                .catch(msg => console.log(msg))
        }
    };

    close = () => {
        this.setState({ message: null })
    };

    render() {
        const { name, options } = this.props;
        const { message } = this.state;
        return <PollContainer>
            <h2>{name}</h2>
            {options.map((option, idx) => <Option key={idx}><input type="radio" name={name} value={option} onClick={this.changeOption} />{option}</Option>)}<br />
            {message && <div onClick={this.close}>{message}</div>}
            <VoteButtonWrapper><button onClick={this.makeVote}>Vote</button></VoteButtonWrapper>
        </PollContainer>
    }
}