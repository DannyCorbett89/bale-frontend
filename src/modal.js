import './modal.css';
import {backendUrl} from "./config";

function Modal(props) {

    let modal = document.getElementById("addPlayersModal");

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    return (
        <div id="addPlayersModal" className="modal">

            <div className="modal-content">
                <div className="modal-header">
                    <span className="close" onClick={hide}>&times;</span>
                    <h2>Add Players</h2>
                </div>
                <div className="modal-body">
                    <p>Players that are visible here can be filtered down by rank, to make it easier to find
                        people</p>
                    <input type="text" id="playerSearch" onKeyUp={filterPlayers}
                           placeholder="Enter player name to filter..."/>

                    <div style={{overflow: "scroll", height: "400px"}}>
                        <ul id="playerList">
                            {
                                props.players.map(player => {
                                    return <li key={player.id}>
                                        <button onClick={() => addPlayer(props.endpoint, player, props.reload)}>
                                            <img className="avatar" alt={player.name} src={player.icon}/>
                                            <img className="rank" alt={player.name} src={player.rank.icon}/>
                                            &nbsp;{player.name}
                                        </button>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="close-button" onClick={hide}>Close</button>
                </div>
            </div>

        </div>
    );
}

// When the user clicks on the button, open the modal
export function show() {
    // Get the modal
    let modal = document.getElementById("addPlayersModal");
    modal.style.display = "block";
}


// When the user clicks on <span> (x), close the modal
function hide() {
    let modal = document.getElementById("addPlayersModal");
    modal.style.display = "none";
}

function filterPlayers() {
    // Declare variables
    let input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('playerSearch');
    filter = input.value.toUpperCase();
    ul = document.getElementById("playerList");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("button")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function addPlayer(endpoint, player, reload) {
    fetch(backendUrl + endpoint + '?ids=' + player.id, {method: "POST"})
        .then(res => reload())
    // .then(res => hide())
    ;
}

export default Modal;
