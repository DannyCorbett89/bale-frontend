import './data-table.css';

function NumberTable(props) {
    const {title, visiblePlayers, data} = props;
    return (
        <div className="side-by-side">
            <table>
                <tbody>
                <tr>
                    <th>{title}</th>
                    {
                        visiblePlayers.map(player => (
                            <th>{player.name}</th>
                        ))
                    }
                </tr>
                {
                    data.map(skill => (
                        <tr>
                            <td>{skill.name}</td>
                            {
                                skill.players.map(player => (
                                    <td className={player.value === player.max ? "have" : ""}>{player.value}</td>
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


export default NumberTable;
