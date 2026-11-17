import './data-table.css';

function NumberTable(props) {
    const {title, visiblePlayers, data} = props;
    return (
        <div>
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
                    data.map(item => (
                        <tr>
                            <td>{item.name}</td>
                            {
                                item.players.map(player => (
                                    <td>{player.value}</td>
                                    // <td className={player.value > 1 ? "have" : "need"}>{player.value}</td>
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
