import {useEffect, useState} from "react";
import {backendUrl} from "../config";
import connection_issue from "../images/connection_issue.gif";
import DataTable from "../data-table";
import AddPlayers from "../minions/add-players";

function MinionsTable() {
    const [visiblePlayers, setVisiblePlayers] = useState([]);
    const [minions, setMinions] = useState([]);
    const [players, setPlayers] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch(backendUrl + '/minions')
            .then(res => res.json())
            .then(res => {
                setVisiblePlayers(res.players);
                setMinions(res.minions);
                setLastUpdated(res.lastUpdated);
            })
            .then(() => setLoading(false))
            .catch(err => {
                console.log(err);
                setLoading(false);
                setError(true);
            });
        fetch(backendUrl + '/minions/players')
            .then(res => res.json())
            .then(json => setPlayers(json))
            .then(() => setLoading(false))
            .catch(err => {
                console.log(err);
            });
    }, [loading])

    if (loading) {
        return <p>Loading Mounts</p>
    }

    if (error) {
        return <img src={connection_issue} alt="Error loading mounts"/>
    }

    return (
        <div>
            <AddPlayers players={players} reload={setLoading}/>
            <DataTable title="Minion Name"
                       visiblePlayers={visiblePlayers}
                       data={minions}
                       removeUrl="/minions/players/remove"
                       collectUrl="https://ffxivcollect.com/minions/"
                       reload={setLoading}
            />
            <p>Last Updated: {lastUpdated}</p>
        </div>
    );
}

export default MinionsTable;
