import React from 'react';
import {Pie} from "react-chartjs-2";
import {ChartContainer} from "../common/styles";

export default class Result extends React.Component {
    render() {
        const {options, colors} = this.props;

        return <React.Fragment>
            <h2>Total votes: {options.reduce((acc, {voteCount}) => acc + voteCount, 0)}</h2>
            <ChartContainer>
                <Pie data={{
                    labels: options.map(({option}) => option),
                    datasets: [{
                        label: 'Results',
                        data: options.map(({voteCount}) => voteCount),
                        backgroundColor: colors
                    }]
                }}
                     options={{
                         legend: {
                             display: true,
                             position: 'right'
                         }
                     }}/>
            </ChartContainer>
        </React.Fragment>
    }
}