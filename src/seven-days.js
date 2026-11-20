import {useEffect, useState} from "react";
import "./seven-days.css"
import {backendUrl} from "./config";
import connection_issue from "./images/connection_issue.gif";
import DataTable from "./data-table";
import NumberTable from "./number-table";

function SevenDaysPlayerSkills() {
    const [skills, setSkills] = useState([]);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [seconds, setSeconds] = useState(0);

    const getTime = () => {
        const time = Date.now();

        let elapsed = Math.floor(time / 1000) % 60;
        if (elapsed === 0) {
            setLoading(true);
        }
        setSeconds(elapsed);
    }

    useEffect(() => {
        const interval = setInterval(() => getTime(), 1000);
        return () => clearInterval(interval);
    }, []);

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
            <div className="side-by-side">Refreshing: <progress value={seconds} max={60}/></div>
        </div>
    );
}

export default SevenDaysPlayerSkills;
