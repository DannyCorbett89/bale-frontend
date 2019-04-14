import {backendUrl} from "./config";
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import NavBar from './NavBar'
import Videos, {VideoButtons} from './videos'
import Minions from './minions'
import Info from './info'
import TableCell from "@material-ui/core/TableCell";
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Paper from "@material-ui/core/Paper/Paper";
import {isMobile} from "react-device-detect";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Avatar from "@material-ui/core/Avatar/Avatar";

class MessageWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.text,
            onClick: props.onClick
        };
    }

    render() {
        // Render nothing if the "show" prop is false
        if (!this.props.show) {
            return null;
        }

        let button;

        if (this.state.onClick != null) {
            button = <DialogActions>
                <Button onClick={this.state.onClick} color="primary">
                    Close
                </Button>
            </DialogActions>;
        } else {
            button = <div/>;
        }

        return (
            <Dialog
                open="true"
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{this.state.text}</DialogTitle>
                {button}
            </Dialog>
        );
    }
}

class AddPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            players: [],
            value: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        fetch(backendUrl + '/players')
            .then(results => {
                return results.json();
            })
            .then(data => {
                if(data.length > 0) {
                    this.setState({
                        players: data,
                        value: data[0].id
                    });
                }
                console.log("players", this.state.players);
            })
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    render() {
        let dropdown;

        if(this.state.players.length > 0) {
            dropdown = <Select onChange={this.handleChange}
                               value={this.state.value}>
                {this.state.players.map((player) =>
                    <MenuItem key={player.id} value={player.id}>{player.name}</MenuItem>
                )}
            </Select>;
        } else {
            dropdown =
                <DialogContentText>
                    No more players are available to add
                </DialogContentText>;
        }
        return (
            <div className="titleButton">
                <Button color="inherit" onClick={this.handleClickOpen}>Add Player</Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Add Player</DialogTitle>
                    <DialogContent>
                        {dropdown}
                    </DialogContent>
                    <DialogActions>
                        <AddPlayerButton player={this.state.value} numPlayers={this.state.players.length}/>
                        <Button onClick={this.handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

class RemovePlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            players: [],
            value: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        fetch(backendUrl + '/players/visible')
            .then(results => {
                return results.json();
            })
            .then(data => {
                if(data.length > 0) {
                    this.setState({
                        players: data,
                        value: data[0].id
                    });
                }
                console.log("visiblePlayers", this.state.players);
            })
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleToggle = player => () => {
        let newPlayers = this.state.players;
        const index = newPlayers.indexOf(player);

        newPlayers[index].visible = !newPlayers[index].visible;
        newPlayers[index].enabled = !newPlayers[index].enabled;

        this.setState({
            players: newPlayers
        });
    };

    render() {
        let dropdown;

        if(this.state.players.length > 0) {
            dropdown = <List>
                    {this.state.players.map((player) =>
                        <ListItem key={player.id} dense button onClick={this.handleToggle(player)}>
                            <ListItemText primary={player.name}/>
                            <Checkbox checked={this.state.players[this.state.players.indexOf(player)].enabled === true}/>
                        </ListItem>
                    )}
                </List>;
        } else {
            dropdown =
                <DialogContentText>
                    No players are available to remove
                </DialogContentText>;
        }
        return (
            <div className="titleButton">
                <Button color="inherit" onClick={this.handleClickOpen}>Remove Player</Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Remove Player</DialogTitle>
                    <DialogContent>
                        {dropdown}
                    </DialogContent>
                    <DialogActions>
                        <RemovePlayerButton2 players={this.state.players}/>
                        <Button onClick={this.handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

class AddPlayerButton extends React.Component {
    constructor(props) {
        super(props);
        if(props.numPlayers > 0) {
            this.state = {
                disabled: false,
                text: "Add"
            };
        } else {
            this.state = {
                disabled: true,
                text: "Add"
            };
        }
    }

    addPlayer() {
        this.setState({
            disabled: true,
            text: "Adding Player..."
        });
        fetch(backendUrl + "/players/add?playerId=" + this.props.player, {method: 'POST'})
            .then(() => {
                window.location.reload();
            });
    }

    render() {
        return (
            <Button id={this.props.player}
                    color="primary"
                    onClick={() => this.addPlayer(this.props.player)}
                    disabled={this.state.disabled}>{this.state.text}</Button>
        );
    }
}

class RemovePlayerButton2 extends React.Component {
    constructor() {
        super();
        this.state = {
            disabled: false,
            text: "Remove"
        };
    }

    applyVisibility() {
        this.setState({
            disabled: true,
            text: "Removing Players..."
        });
        fetch(backendUrl + "/players/visible", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.props.players)
        })
            .then(() => {
                window.location.reload();
            });
    }

    render() {
        return (
            <Button id="removePlayers"
                    color="primary"
                    onClick={() => this.applyVisibility(this.props.players)}
                    disabled={this.state.disabled}>{this.state.text}</Button>
        );
    }
}

class AddMount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            mounts: [],
            mountName: ''
        };
        this.handleMountChange = this.handleMountChange.bind(this);
    }

    componentWillMount() {
        fetch(backendUrl + '/mounts/available')
            .then(results => {
                return results.json();
            })
            .then(data => {
                this.setState({
                    mounts: data,
                    mountName: data[0].name
                });
                console.log("listAvailableMounts", this.state.mounts);
            })
            .catch(error => {
                console.log("Empty response for /listAvailableMounts", error)
            });
    }

    handleMountChange(event) {
        this.setState({
            mountName: event.target.value
        });
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    render() {
        let window;

        if (this.state.mountName === "") {
            window = <MessageWindow show={this.state.open} text={"No more mounts to add"} onClick={this.handleClose}/>;
        } else {
            window = <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Add Mount</DialogTitle>
                <DialogContent>
                    <InputLabel>Mount&nbsp;</InputLabel>
                    <Select onChange={this.handleMountChange}
                            value={this.state.mountName}>
                        {this.state.mounts.map((mount) =>
                            <MenuItem key={mount.name} value={mount.name}>{mount.name}</MenuItem>
                        )}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <AddMountButton mountName={this.state.mountName}/>
                    <Button onClick={this.handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>;
        }

        return (
            <div className="titleButton">
                <Button color="inherit" onClick={this.handleClickOpen}>Add Mount</Button>
                {window}
            </div>
        );
    }
}

class AddMountButton extends React.Component {
    constructor() {
        super();
        this.state = {
            disabled: false,
            text: "Add"
        };
    }

    addMount() {
        this.setState({
            disabled: true,
            text: "Adding Mount..."
        });
        fetch(backendUrl + "/mounts/add?name=" + this.props.mountName, {method: 'POST'})
            .then(() => {
                window.location.reload();
            });
    }

    render() {
        return (
            <Button id={this.props.mountName}
                    color="primary"
                    onClick={() => this.addMount(this.props.mountName)}
                    disabled={this.state.disabled}>{this.state.text}</Button>
        );
    }
}

class Ranks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            ranks: []
        };
    }

    componentWillMount() {
        fetch(backendUrl + '/ranks')
            .then(results => {
                return results.json();
            })
            .then(data => {
                this.setState({
                    ranks: data
                });
                console.log("ranks", this.state.ranks);
            })
            .catch(error => {
                console.log("Empty response for /ranks", error)
            });
    }

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleToggle = rank => () => {
        let newRanks = this.state.ranks;
        const index = newRanks.indexOf(rank);

        newRanks[index].enabled = !newRanks[index].enabled;

        this.setState({
            ranks: newRanks
        });
    };

    render() {
        return (
            <div className="titleButton">
                <Button color="inherit" onClick={this.handleClickOpen}>Ranks</Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Manage Ranks</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Only players whose rank is ticked here can be added to the table
                        </DialogContentText>
                    </DialogContent>
                    <DialogContent>
                        <List>
                            {this.state.ranks.map((rank) =>
                                <ListItem key={rank.id} dense button onClick={this.handleToggle(rank)}>
                                    <Avatar alt={rank.name} src={rank.icon} style={{width: 20, height: 20}}/>
                                    <ListItemText primary={rank.name}/>
                                    <Checkbox checked={this.state.ranks[this.state.ranks.indexOf(rank)].enabled === true}/>
                                </ListItem>
                            )}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <ApplyRanksButton enabledRanks={this.state.ranks}/>
                        <Button onClick={this.handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

class ApplyRanksButton extends React.Component {
    constructor() {
        super();
        this.state = {
            disabled: false,
            text: "Apply"
        };
    }

    applyRanks() {
        this.setState({
            disabled: true,
            text: "Applying Ranks..."
        });
        fetch(backendUrl + "/ranks/enable", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.props.enabledRanks)
        })
            .then(() => {
                window.location.reload();
            });
    }

    render() {
        return (
            <Button id="applyRanks"
                    color="primary"
                    onClick={() => this.applyRanks(this.props.ranks)}
                    disabled={this.state.disabled}>{this.state.text}</Button>
        );
    }
}

class RemovePlayerButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            text: "Remove",
            player: props.player,
            messageWindowIsOpen: false
        };
    }

    removePlayer(name) {
        this.setState({
            disabled: true,
            messageWindowIsOpen: true
        });
        fetch(backendUrl + "/players/remove?name=" + name, {method: 'DELETE'})
            .then(() => {
                window.location.reload();
            });
    }

    render() {
        return (
            <div>
                <Button id={this.state.player.name}
                        variant="outlined"
                        size="small"
                        onClick={() => this.removePlayer(this.state.player.name)}
                        disabled={this.state.disabled}>{this.state.text}</Button>
                <MessageWindow show={this.state.messageWindowIsOpen} text={"Removing " + this.state.player.name}/>
            </div>
        );
    }
}

class RemoveMountButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            text: "Remove",
            mount: props.mount,
            messageWindowIsOpen: false
        };
    }

    removeMount(mount) {
        this.setState({
            disabled: true,
            messageWindowIsOpen: true
        });
        fetch(backendUrl + "/mounts/remove?id=" + mount.id, {method: 'DELETE'})
            .then(() => {
                window.location.reload();
            });
    }

    render() {
        return (
            <div>
                <Button id={this.state.mount.name}
                        variant="outlined"
                        size="small"
                        onClick={() => this.removeMount(this.state.mount)}
                        disabled={this.state.disabled}>{this.state.text}</Button>
                <MessageWindow show={this.state.messageWindowIsOpen} text={"Removing " + this.state.mount.name}/>
            </div>
        );
    }
}

const CustomTableCell = withStyles(theme => ({
    head: {
        textAlign: 'center'
    },
    body: {
        textAlign: 'center'
    },
}))(TableCell);

class Mounts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updated: null,
            columns: null,
            players: [{mounts: []}]
        };
    }


    componentWillMount() {
        fetch(backendUrl + '/mounts')
            .then(results => {
                return results.json();
            })
            .then(data => {
                this.setState({
                    updated: data.lastUpdated,
                    columns: data.numColumns,
                    players: data.players
                });
                console.log("listMounts", this.state.players);
            })
    }

    render() {
        let table;
        let result;
        let updated;

        if (this.state.updated == null) {
            table = <div>
                <p align="center">Loading mounts...</p>
                <LinearProgress/>
            </div>
        } else if (this.state.players.length === 0) {
            table = <p align="center">No Players are being tracked</p>
        } else {
            table = <Table padding="none">
                <TableHead>
                    <TableRow>
                        <CustomTableCell>Name</CustomTableCell>
                        <CustomTableCell colSpan={this.state.columns + 1}>Mounts
                            Needed</CustomTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.players.map((player) =>
                        <TableRow key={player.name} className="highlight">
                            <CustomTableCell>{player.name}</CustomTableCell>

                            {player.mounts.map((mount) =>
                                <CustomTableCell key={mount.id}>{mount.instance}</CustomTableCell>
                            )}

                            <CustomTableCell>
                                <RemovePlayerButton player={player}/>
                            </CustomTableCell>
                        </TableRow>)}
                    <TableRow>
                        <CustomTableCell/>
                        {this.state.players[0].mounts.map((mount) =>
                            <CustomTableCell key={mount.id} align="center">
                                <RemoveMountButton mount={mount}/>
                            </CustomTableCell>
                        )}
                        <CustomTableCell/>
                    </TableRow>
                </TableBody>
            </Table>;

            updated = <p>Last Updated: {this.state.updated}</p>;
        }

        if (isMobile) {
            result =
                <div>
                    <Paper style={{width: '100%', overflowX: 'auto'}}>
                        {table}
                    </Paper>
                    {updated}
                </div>;
        } else {
            result =
                <div>
                    {table}
                    {updated}
                </div>;
        }

        return (
            <div>
                {result}
            </div>
        );
    }
}

class Main extends React.Component {
    render() {
        let content;
        const url = window.location.href;
        const page = url.substr(url.lastIndexOf("/"));

        if (page === "/") {
            content =
                <div className="titleButtons">
                    <AddPlayer/>
                    <AddMount/>
                    <Ranks/>
                </div>;
        } else if (page === "/minions") {
            content =
                <div className="titleButtons">
                    <AddPlayer/>
                    <RemovePlayer/>
                    <Ranks/>
                </div>;
        } else {
            content = <div/>;
        }
        return (
            <div>
                <NavBar>
                    {content}
                    <VideoButtons/>
                </NavBar>
                <Switch>
                    <Route exact path="/" component={Mounts}/>
                    <Route path="/minions" component={Minions}/>
                    <Route path="/videos" component={Videos}/>
                    <Route path="/info" component={Info}/>
                </Switch>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <BrowserRouter>
        <Main/>
    </BrowserRouter>, document.getElementById("root"));