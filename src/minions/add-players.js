import '../modal.css';
import Modal from "../modal";

function AddPlayers(props) {
    return (
        <Modal endpoint="/minions/players/add" players={props.players} reload={props.reload}/>
    );
}

export default AddPlayers;
