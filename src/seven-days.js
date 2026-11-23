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
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const getTime = () => {
        const time = Date.now();

        let elapsedSeconds = Math.floor(time / 1000) % 60;
        let elapsedMinutes = Math.floor(time / 1000 / 60) % 60;

        if (elapsedSeconds === 0 && elapsedMinutes === 0) {
            setLoading(true);
        }
        setSeconds(elapsedSeconds);
        setMinutes(elapsedMinutes);
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

    let remainingMinutes = 60 - minutes;
    let remainingSeconds = 60 - seconds;

    if(remainingSeconds === 0) {
        remainingMinutes += 1;
    }

    if(remainingMinutes < 10) {
        remainingMinutes = "0" + remainingMinutes;
    } else if (remainingMinutes === 60) {
        remainingMinutes = "00";
    }

    if(remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;
    } else if (remainingSeconds === 60) {
        remainingSeconds = "00";
    }

    return (
        <div>
            <div className="padded">Numbers are refreshed every hour, {remainingMinutes}:{remainingSeconds} until next refresh: <progress value={(minutes * 60) + seconds} max={3600}/></div>
            <NumberTable title="Seven Days to Die - Player Skills"
                       visiblePlayers={players}
                       data={skills}
                       reload={setLoading}
            />
        </div>
    );
}

export default SevenDaysPlayerSkills;
