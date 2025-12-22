import {useEffect, useState} from "react";
import {backendUrl} from "../config";
import connection_issue from "../images/connection_issue.gif";
import DataTable from "../data-table";
import AddPlayers from "./add-players";

function MountsTable() {
    const [visiblePlayers, setVisiblePlayers] = useState([]);
    const [mounts, setMounts] = useState({players: [], mounts: []});
    const [players, setPlayers] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch(backendUrl + '/mounts')
            .then(res => res.json())
            .then(res => {
                setVisiblePlayers(res.players);
                setMounts(res.mounts);
                setLastUpdated(res.lastUpdated);
            })
            .then(() => setLoading(false))
            .catch(err => {
                console.log(err);
                setLoading(false);
                setError(true);
            });
        fetch(backendUrl + '/mounts/players')
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
            <DataTable title="Mount Name"
                       visiblePlayers={visiblePlayers}
                       data={mounts}
                       removeUrl="/mounts/players/remove"
                       collectUrl="https://ffxivcollect.com/mounts/"
                       reload={setLoading}
            />
            <p>Last Updated: {lastUpdated}</p>
        </div>
    );
}

export default MountsTable;
