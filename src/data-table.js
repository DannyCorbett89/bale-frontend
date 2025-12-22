import './data-table.css';
import {backendUrl} from "./config";
import {show} from "./modal";

function DataTable(props) {
    const {title, visiblePlayers, data, removeUrl, collectUrl, reload} = props;
    return (
        <div>
            <table>
                <tbody>
                <tr>
                    <th>{title}</th>
                    {
                        visiblePlayers.map(player => (
                            <th>{player.name}
                                <button className="data" onClick={() => removePlayer(removeUrl, player, reload)}>-
                                </button>
                            </th>
                        ))
                    }
                    <td>
                        <button className="data" onClick={() => show()}>+</button>
                    </td>
                </tr>
                {
                    data.map(item => (
                        <tr>
                            <td><a className="data" href={collectUrl + item.id}
                                   target="_blank"
                                   rel={"noreferrer"}>{item.name}</a>
                            </td>
                            {
                                item.players.map(player => (
                                    <td className={player.owned ? "have" : "need"}>{player.owned ? "" : "X"}</td>
                                ))
                            }
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
}

function removePlayer(removeUrl, player, reload) {
    fetch(backendUrl + removeUrl + '?id=' + player.id, {method: "DELETE"})
        .then(res => reload());
}


export default DataTable;
