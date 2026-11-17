import {useEffect, useState} from "react";
import {backendUrl} from "./config";
import connection_issue from "./images/connection_issue.gif";
import DataTable from "./data-table";
import NumberTable from "./number-table";

function SevenDaysPlayerSkills() {
    const [skills, setSkills] = useState({players: [], skills: []});
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch(backendUrl + '/seven-days-players')
            .then(res => res.json())
            .then(res => {
                setSkills(res.skills);
                setPlayers(res.players);
            })
            .then(() => setLoading(false))
            .catch(err => {
                console.log(err);
                setLoading(false);
                setError(true);
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
            <NumberTable title="Seven Days to Die - Player Skills"
                       visiblePlayers={players}
                       data={skills}
                       reload={setLoading}
            />
        </div>
    );
}

export default SevenDaysPlayerSkills;
