import React from 'react';
import { Option, PollContainer, VoteButtonWrapper, VoteMessage } from '../LoginPage/styles';
import { constructRequest, getCookie } from '../common/helper';

export default class Poll extends React.Component {

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.name !== prevState.name) {
            return {
                name: nextProps.name,
                chosenOption: null,
                message: null
            };
        }
        return null;
    }

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
                message: { text: 'Please select an option', color: 'lightCoral' }
            })
        } else {
            this.setState({ message: null });
            const { name } = this.props;
            fetch(`https://localhost:3000/vote`, constructRequest(
                'POST', `embg=${getCookie('user')}&pollName=${name}&subjectName=${chosenOption}`))
                .then(res => {
                    if (res.status === 200) {
                        this.setState({ message: { text: 'Vote successful', color: 'lightGreen' } })
                    } else {
                        this.setState({ message: { test: 'You have already voted in this poll', color: 'lightCoral' } })
                    }
                })
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
            {options.map((option, idx) => <Option key={idx}><input type='radio' name={name} value={option}
                onClick={this.changeOption} />{option}</Option>)}<br />
            {message && <VoteMessage backgroundColor={message.color} onClick={this.close}>{message.text}</VoteMessage>}
            <VoteButtonWrapper>
                <button onClick={this.makeVote}>Vote</button>
            </VoteButtonWrapper>
        </PollContainer>
    }
}