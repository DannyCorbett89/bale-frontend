import {backendUrl} from "./config";
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import NavBar from './NavBar'
import Videos, {VideoButtons} from './videos'
import Minions from './minions'
import Info, {InfoButtons} from './info'
import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Paper from "@material-ui/core/Paper/Paper";
import {isMobile} from "react-device-detect";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Avatar from "@material-ui/core/Avatar/Avatar";
import ReactDataGrid from "react-data-grid";

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

class Mounts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            players: [{mounts: []}],
            numRows: 0
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
                    columns: data.columns,
                    players: data.players,
                    numRows: data.numRows
                });
                console.log("listMounts", this.state.players);
            })
    }

    render() {
        let table;
        let result;
        let updated;

        if (this.state.updated == null) {
            table = <div className="maincontent">
                <p align="center">Loading mounts...</p>
                <LinearProgress/>
            </div>
        } else if (this.state.players.length === 0) {
            table = <p align="center">No Players are being tracked</p>
        } else {
            table = <ReactDataGrid columns={this.state.columns}
                                   rowGetter={i => this.state.players[i]}
                                   rowsCount={this.state.numRows}
                                   enableCellSelect={true}/>;

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
                    <br/>
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

class MountButtons extends React.Component {
    render() {
        return (
            <div className="titleButtons">
                <AddPlayer/>
                <RemovePlayer/>
                <Ranks/>
            </div>
        );
    }
}

class MinionButtons extends React.Component {
    render() {
        return (
            <div className="titleButtons">
                 <AddPlayer/>
                 <RemovePlayer/>
                 <Ranks/>
            </div>
        );
    }
}

class Main extends React.Component {
    render() {
        return (
            <div>
                <NavBar>
                    <Switch>
                        <Route exact path="/" component={MountButtons}/>
                        <Route exact path="/minions" component={MinionButtons}/>
                        <Route exact path="/videos" component={VideoButtons}/>
                        <Route exact path="/info" component={InfoButtons}/>
                    </Switch>
                </NavBar>
                <Switch>
                    <Route exact path="/" component={Mounts}/>
                    <Route exact path="/minions" component={Minions}/>
                    <Route exact path="/videos" component={Videos}/>
                    <Route exact path="/info" component={Info}/>
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