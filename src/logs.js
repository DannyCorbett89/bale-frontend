import React from 'react';
import './index.css';
import {ApolloClient, createHttpLink, gql, InMemoryCache} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {backendUrl} from "./config";
import {isMobile} from "react-device-detect";
import Paper from "@mui/material/Paper/Paper";
import * as moment from 'moment'
import PageForwarder from "./pageForwarder";

const httpLink = createHttpLink({
    uri: 'https://www.fflogs.com/api/v2/client',
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
    constructor(props) {
        super(props);
        this.state = {
            reports: []
        };
    }

    componentWillMount() {
        fetch(backendUrl + '/oauth')
            .then(results => {
                return results.json();
            })
            .then(data => {
                const authLink = setContext((_, { headers }) => {
                    const token = data.token;

                    return {
                        headers: {
                            ...headers,
                            authorization: token ? `Bearer ${token}` : "",
                        }
                    }
                });

                const client = new ApolloClient({
                    uri: 'https://www.fflogs.com/api/v2/client',
                    cache: new InMemoryCache(),
                    link: authLink.concat(httpLink)
                });

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
                });
            })
    }

    render() {
        return (
            <div className="maincontent">
                <LogsTable reports={this.state.reports}/>
            </div>
        );
    }
}

class LogsTable extends React.Component {
    render() {
        let table = <table border="0">
            <tbody>
            {this.props.reports.map(({code, title, startTime}) => (
                <LogRow key={code} code={code} title={title} startTime={startTime}/>)
            )}
            </tbody>
        </table>;

        return <div>
            <MobileFriendly content={table}/>
            <PageForwarder/>
        </div>;
    }
}

class LogRow extends React.Component {
    render() {
        return <tr className="highlight">
            <td className="padded">{moment(new Date(this.props.startTime)).format('dddd DD/MM/YYYY')}</td>
            <td className="logs">{this.props.title}</td>
            <td className="logs"><a href={"https://www.fflogs.com/reports/" + this.props.code} target="_blank" rel="noopener noreferrer">FFLogs</a></td>
            <td className="logs"><a href={"https://xivanalysis.com/fflogs/" + this.props.code} target="_blank" rel="noopener noreferrer">xivanalysis</a></td>
        </tr>
    }
}

class MobileFriendly extends React.Component {
    render() {
        let result;
        if (isMobile) {
            result =
                <div>
                    <Paper style={{width: '90%', overflowX: 'auto'}}>
                        {this.props.content}
                    </Paper>
                </div>;
        } else {
            result =
                <div>
                    {this.props.content}
                </div>;
        }

        return result;
    }
}

export default Logs