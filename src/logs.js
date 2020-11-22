import React from 'react';
import './index.css';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql } from '@apollo/client';
import {backendUrl} from "./config";
import {isMobile} from "react-device-detect";
import Paper from "@material-ui/core/Paper/Paper";

let token;
fetch(backendUrl + '/oauth')
    .then(results => {
        return results.json();
    })
    .then(data => {
        token = data.token;
    })

const client = new ApolloClient({
    uri: 'https://www.fflogs.com/api/v2/client',
    cache: new InMemoryCache(),
    headers: {
        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5MjEyMDQwNS04OGYxLTQxMGQtOGZlOS04MGJhOGFiMWU4MDYiLCJqdGkiOiI2MGNlZjZiNTcwOTFhYjJjMGJmYTJjMjc0NGIwNDIyNmQzMzJhNjEwMzc0NGI0MTdhMTg1ZTQyMjgxNzE4ZjYxNmY3MDMzNmVmYTcwMjEyNyIsImlhdCI6MTYwNjA2MTE4MywibmJmIjoxNjA2MDYxMTgzLCJleHAiOjE2MDg2NTMxODMsInN1YiI6IiIsInNjb3BlcyI6WyJ2aWV3LXByaXZhdGUtcmVwb3J0cyJdfQ.RC9Mth0ChMXuPkZAeRv6TMeD8NkhBBWdLvxFCdNaWoM4p5-IbfqTJMCTcHX_gC8tGhBiXsJHZtT2sLpLxfs7u-DA7ocqaZpgVcrgsfYIz8JyEWX6vx787ujpAKA4ZGoHRmCdMbR0ssPrWlbB2xwHUzUNqzKXl5jgizdwXSvP32y41n1liyB-hj8RvhqTuGGbH5pZ6yuy3yn6e98euGPWRwyHSLiAd4ieEhhx0j26BQnx10-MpWgIbFgRxEjKd8ffhmV7mGroYjoS0vVh_zTVjQUokSI4c_JtZ0_TTqvswoP2Zn0skY_oAGw17QNeT1TuxLIW5WhXzO34BfF9Q972x89hRWegCnrp7tuQVTVthhg1Xr8tul7YLBZan-4-m_wO1M6d9npTzjvtf3IgfsKCPRwlDoCIhq1h2fTXiliYZ0UlZxEYVuZ_LbZ4jzBSyDe4udspmAdUwv10bp7ajC35Jl96c0mqPbLg_chla0YJcQZ-DACWKiwhMDbcgbPnHr11Jh725_YmVB83-B85IlkoUUntuAkpFjA0cAA4UH21JniivJtrRL8_uyLysPueq3jZzLeTjL-SXjg8eXDU85GchUH0xV1g8Z01uB0S8Jlpb2SLPp3-kbT4mExtBfgvzXiMylDsClqfQBYVyjTjR7xZ8nyB0gY46jRtuyLnBu-39vQ"
    }
});

export class LogsButtons extends React.Component {
    render() {
        return (
            <div className="titleButtons">
                {/*<Button color="inherit">Add Video</Button>*/}
            </div>
        );
    }
}

class Logs extends React.Component {
    render() {
        return (
            <div className="maincontent">
                <LogsTable/>
            </div>
        );
    }
}

class LogsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: []
        };
    }

    componentWillMount() {
        console.log("loading mounts");
        fetch(backendUrl + '/mounts')
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
                console.log("listMounts", this.state.players);
            })

        console.log("loading logs");
        client.query({
            query: gql`
                    {
                      reportData {
                        reports(userID: 108417) {
                          data {
                            code,
                            title,
                            startTime
                          }
                        }
                      }
                    }
                `
        })
            .then(result => {
                this.setState({
                    reports: result.data.reportData.reports.data
                })
                console.log(this.state.reports);
            });
    }

    render() {
        let result;
        let tableContent = this.state.reports.map(({ code, title, startTime }) => (
            <tr key={code} className="highlight">
                <td>{new Date(startTime).toLocaleDateString("en-GB")}</td>
                <td>{title}</td>
                <td><a href={"https://www.fflogs.com/reports/" + code} target="_blank" rel="noopener noreferrer">FFLogs</a></td>
                <td><a href={"https://xivanalysis.com/fflogs/" + code} target="_blank" rel="noopener noreferrer">xivanalysis</a></td>
            </tr>
         ));
        let table = <table border="0">
            <tbody>
                {tableContent}
            </tbody>
        </table>;

        if (isMobile) {
            result =
                <div>
                    <Paper style={{width: '90%', overflowX: 'auto'}}>
                        {table}
                    </Paper>
                </div>;
        } else {
            result =
                <div>
                    {table}
                </div>;
        }

        return result;
    }
}

export default Logs