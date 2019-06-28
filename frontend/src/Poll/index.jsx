import React from 'react';
import { Option, PollContainer, VoteButtonWrapper, VoteMessage } from '../common/styles';
import { constructRequest, generateColors } from '../common/helper';
import Results from '../Results';

const INIT_STATE = {
    chosenOption: null,
    message: null,
    showResults: false,
};

export default class Poll extends React.Component {
    static getDerivedStateFromProps(nextProps, prevState) {
        const { isAdmin, options, name } = nextProps

        return nextProps.name !== prevState.name ? {
            ...INIT_STATE,
            name,
            colors: isAdmin && generateColors(options.length)
        } : null
    }

    constructor(props) {
        super(props);
        this.state = { ...INIT_STATE, name: this.props.name }
    }

    componentDidMount() {
        const { isAdmin, options } = this.props;
        this.setState({ colors: isAdmin && generateColors(options.length) })
    }

    changeOption = (event) => {
        this.setState({ chosenOption: event.target.value });
    };

    makeVote = () => {
        const { chosenOption } = this.state

        if (!chosenOption) {
            this.setState({
                message: { text: 'Please select an option', color: 'lightCoral' }
            })
        } else {
            console.log("voopsto ne se prakja povikot");
            const { name } = this.props
            fetch(`https://localhost:3000/vote`, constructRequest(
                'POST', `pollName=${name}&subjectName=${chosenOption}`))
                .then(res => {
                    if (res.status === 200) {
                        this.setState({ message: { text: 'Vote successful', color: 'lightGreen' } })
                    } else {
                        this.setState({ message: { text: 'You have already voted in this poll', color: 'lightCoral' } })
                    }
                })
                .catch(msg => console.log(msg))
        }
    };

    close = () => {
        this.setState({ message: null })
    };

    toggleResults = () => {
        this.setState({ showResults: !this.state.showResults })
    }

    render() {
        const { name, options, isAdmin } = this.props
        const { message, showResults } = this.state
        return <React.Fragment>
            {!isAdmin && <PollContainer>
                <h2>{name}</h2>
                {options.map(({ option }, idx) => <Option key={`${name}${idx}`}><input type='radio' name={name}
                    value={option}
                    onClick={this.changeOption} />{option}
                </Option>)}<br />
                {message &&
                    <VoteMessage backgroundColor={message.color} onClick={this.close}>{message.text}</VoteMessage>}
                <VoteButtonWrapper>
                    <button onClick={this.makeVote}>Vote</button>
                </VoteButtonWrapper>
            </PollContainer>}<br />
            {isAdmin && <React.Fragment>
                <button onClick={this.toggleResults}>{showResults ? 'Hide' : 'Show'} results</button>
                {showResults && <Results colors={this.state.colors} options={options} />}
            </React.Fragment>}
        </React.Fragment>
    }
}