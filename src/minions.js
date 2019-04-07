import React from 'react';
import {backendUrl} from "./config";
import LinearProgress from "@material-ui/core/LinearProgress";
import {isMobile} from "react-device-detect";
import Paper from "@material-ui/core/Paper";
import ReactDataGrid from 'react-data-grid';
import './index.css';

class Minions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            players: [{mounts: []}],
            numRows: 0
        };
    }


    componentWillMount() {
        fetch(backendUrl + '/minions')
            .then(results => {
                return results.json();
            })
            .then(data => {
                this.setState({
                    updated: data.lastUpdated,
                    columns: data.columns,
                    players: data.players,
                    numRows: data.numRows
                });
                console.log("listMinions", this.state.players);
            })
    }

    render() {
        let table;
        let result;
        let updated;

        if (this.state.updated == null) {
            table = <div>
                <p align="center">Loading minions...</p>
                <LinearProgress/>
            </div>
        } else if (this.state.players.length === 0) {
            table = <p align="center">No Players are being tracked</p>
        } else {
            table = <ReactDataGrid columns={this.state.columns}
                                   rowGetter={i => this.state.players[i]}
                                   rowsCount={this.state.numRows}
                                   enableCellSelect={true}/>;

            updated = <p>Last Updated: {this.state.updated}</p>;
        }

        if (isMobile) {
            result =
                <div>
                    <Paper style={{width: '100%', overflowX: 'auto'}}>
                        {table}
                    </Paper>
                    {updated}
                </div>;
        } else {
            result =
                <div>
                    {table}
                    {updated}
                </div>;
        }

        return (
            <div>
                {result}
            </div>
        );
    }
}

export default Minions