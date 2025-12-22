import './logs.css'
import {backendUrl} from "./config";
import {ApolloClient, createHttpLink, gql, InMemoryCache} from '@apollo/client';
import {setContext} from "@apollo/client/link/context";
import {useEffect, useState} from "react";
import * as moment from 'moment'

function Logs() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetch(backendUrl + '/oauth')
            .then(res => res.json())
            .then(data => {
                const authLink = setContext((_, {headers}) => {
                    const token = data.token;

                    return {
                        headers: {
                            ...headers,
                            authorization: token ? `Bearer ${token}` : "",
                        }
                    }
                });

                const httpLink = createHttpLink({
                    uri: 'https://www.fflogs.com/api/v2/client',
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
                        setReports(result.data.reportData.reports.data);
                    })
                    .then(result => setLoading(false));
            });
    }, [loading]);


    if (loading) {
        return <p>Loading Logs...</p>
    }

    return (
        <table>
            <tbody>
            {
                reports.map(({code, title, startTime}) => (
                        <tr className="highlight">
                            <td className="padded">{moment(new Date(startTime)).format('dddd DD/MM/YYYY')}</td>
                            <td className="logs">{title}</td>
                            <td className="logs"><a href={"https://www.fflogs.com/reports/" + code} target="_blank"
                                                    rel="noopener noreferrer">FFLogs</a></td>
                            <td className="logs"><a href={"https://xivanalysis.com/fflogs/" + code} target="_blank"
                                                    rel="noopener noreferrer">xivanalysis</a></td>
                        </tr>
                    )
                )}
            </tbody>
        </table>
    );
}

export default Logs;
