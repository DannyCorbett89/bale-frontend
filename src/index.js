import {backendUrl} from "./config";
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavBar from './NavBar'
import Videos, {VideoButtons} from './videos'
import Logs, {LogsButtons} from './logs'
import Minions from './minions'
import Info, {InfoButtons} from './info'
import Button from "@mui/material/Button/Button";
import Dialog from "@mui/material/Dialog/Dialog";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import DialogActions from "@mui/material/DialogActions/DialogActions";
import Paper from "@mui/material/Paper/Paper";
import {isMobile} from "react-device-detect";
import LinearProgress from "@mui/material/LinearProgress/LinearProgress";
import DialogContentText from "@mui/material/DialogContentText/DialogContentText";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem/ListItem";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import Avatar from "@mui/material/Avatar/Avatar";
import ReactDataGrid from "react-data-grid";
import Table from "@mui/material/Table";
import {TableRow} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import PageForwarder from "./pageForwarder";
import Schedule, {ScheduleButtons} from "./schedule";
import { ThemeProvider, createMuiTheme, makeStyles } from '@mui/material/styles';

const theme = createMuiTheme();

class AddPlayerForMounts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            players: [],
            filteredPlayers: [],
            ranks: [],
            enabledRanks: [],
            buttonEnabled: false
        };
    }

    componentDidMount() {
        fetch(backendUrl + '/ranks')
            .then(results => {
                return results.json();
            })
            .then(rankData => {
                if(rankData.length > 0) {
                    fetch(backendUrl + '/mounts/players')
                        .then(results => {
                            return results.json();
                        })
                        .then(playerData => {
                            if(playerData.length > 0) {
                                let filteredRanks = rankData.filter((rank) => rank.enabled === true).map((rank) => rank.id);
                                let filteredPlayers = playerData.filter((player) => filteredRanks.filter((rank) => rank === player.rank.id).length > 0);
                                this.setState({
                                    players: playerData,
                                    filteredPlayers: filteredPlayers,
                                    ranks: rankData,
                                    enabledRanks: filteredRanks
                                });
                            }
                            console.log("players that can be added", this.state.filteredPlayers);
                            console.log("visible ranks", this.state.enabledRanks);
                            console.log("ranks", this.state.ranks);
                        });
                }
            });
    }

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleToggleRank = rank => () => {
        let newRanks = this.state.ranks;
        const index = newRanks.indexOf(rank);

        newRanks[index].enabled = !newRanks[index].enabled;

        let filteredRanks = newRanks.filter((rank) => rank.enabled === true).map((rank) => rank.id);

        this.setState({
            ranks: newRanks,
            enabledRanks: filteredRanks,
            filteredPlayers: this.state.players.filter((player) => filteredRanks.filter((rank) => rank === player.rank.id).length > 0)
        });
    };

    handleTogglePlayer = player => () => {
        let newPlayers = this.state.filteredPlayers;
        const index = newPlayers.indexOf(player);

        newPlayers[index].mountsVisible = !newPlayers[index].mountsVisible;
        let anyVisiblePlayers = newPlayers.filter((player) => player.mountsVisible).length > 0;

        this.setState({
            filteredPlayers: newPlayers,
            buttonEnabled: anyVisiblePlayers
        });
    };

    render() {
        return (
            <div className="titleButton">
                <Button color="inherit" onClick={this.handleClickOpen}>Add Players</Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Add Player</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Players that are visible here can be filtered down by rank, to make it easier to find people
                        </DialogContentText>
                    </DialogContent>
                    <DialogContent>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell style={{ verticalAlign: 'top'}}>
                                        <List>
                                            {this.state.ranks.map((rank) =>
                                                <ListItem key={rank.id} dense button onClick={this.handleToggleRank(rank)}>
                                                    <Avatar alt={rank.name} src={rank.icon} style={{width: 20, height: 20}}/>
                                                    <ListItemText primary={rank.name}/>
                                                    <Checkbox checked={this.state.ranks[this.state.ranks.indexOf(rank)].enabled === true}/>
                                                </ListItem>
                                            )}
                                        </List>
                                    </TableCell>
                                    <TableCell style={{ verticalAlign: 'top'}}>
                                        <List>
                                            {this.state.filteredPlayers.map((player) =>
                                                <ListItem key={player.id} dense button onClick={this.handleTogglePlayer(player)}>
                                                    <Avatar alt={player.name} src={player.icon} style={{width: 50, height: 50}}/>
                                                    <ListItemText primary={player.name}/>
                                                    <Checkbox checked={this.state.filteredPlayers[this.state.filteredPlayers.indexOf(player)].mountsVisible === true}/>
                                                </ListItem>
                                            )}
                                        </List>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </DialogContent>
                    <DialogActions>
                        <AddPlayerForMountsButton players={this.state.filteredPlayers} ranks={this.state.ranks} enabled={this.state.buttonEnabled} callback={this.props.callback}/>
                        <Button onClick={this.handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

class RemovePlayerForMounts extends React.Component {
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
        fetch(backendUrl + '/mounts/players/visible')
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

        newPlayers[index].mountsVisible = !newPlayers[index].mountsVisible;
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
                        <Avatar alt={player.name} src={player.icon} style={{width: 50, height: 50}}/>
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
                <Button color="inherit" onClick={this.handleClickOpen}>Remove Players</Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Remove Players</DialogTitle>
                    <DialogContent>
                        {dropdown}
                    </DialogContent>
                    <DialogActions>
                        <RemovePlayerForMountsButton players={this.state.players} callback={this.props.callback}/>
                        <Button onClick={this.handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

class AddPlayerForMountsButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "Add"
        };
    }

    addPlayer() {
        this.setState({
            disabled: true,
            text: "Adding Player..."
        });
        fetch(backendUrl + "/mounts/players/add?ids=" + this.props.players.filter((player) => player.mountsVisible).map((player) => player.id), {method: 'POST'})
            .then(() => {
                fetch(backendUrl + "/ranks/enable", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.props.ranks)
                })
                    .then(() => {
                        this.props.callback();
                    });
            });

    }

    render() {
        return (
            <Button id={this.props.players[0]}
                    color="primary"
                    onClick={() => this.addPlayer()}
                    disabled={!this.props.enabled}>{this.state.text}</Button>
        );
    }
}

class RemovePlayerForMountsButton extends React.Component {
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
        fetch(backendUrl + "/mounts/players/visible", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.props.players)
        })
            .then(() => {
                this.props.callback();
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

class AddPlayerForMinions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            players: [],
            filteredPlayers: [],
            ranks: [],
            enabledRanks: [],
            buttonEnabled: false
        };
    }

    componentDidMount() {
        fetch(backendUrl + '/ranks')
            .then(results => {
                return results.json();
            })
            .then(rankData => {
                if(rankData.length > 0) {
                    fetch(backendUrl + '/minions/players')
                        .then(results => {
                            return results.json();
                        })
                        .then(playerData => {
                            if(playerData.length > 0) {
                                let filteredRanks = rankData.filter((rank) => rank.enabled === true).map((rank) => rank.id);
                                let filteredPlayers = playerData.filter((player) => filteredRanks.filter((rank) => rank === player.rank.id).length > 0);
                                this.setState({
                                    players: playerData,
                                    filteredPlayers: filteredPlayers,
                                    ranks: rankData,
                                    enabledRanks: filteredRanks
                                });
                            }
                            console.log("players that can be added", this.state.filteredPlayers);
                            console.log("visible ranks", this.state.enabledRanks);
                            console.log("ranks", this.state.ranks);
                        });
                }
            });
    }

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleToggleRank = rank => () => {
        let newRanks = this.state.ranks;
        const index = newRanks.indexOf(rank);

        newRanks[index].enabled = !newRanks[index].enabled;

        let filteredRanks = newRanks.filter((rank) => rank.enabled === true).map((rank) => rank.id);

        this.setState({
            ranks: newRanks,
            enabledRanks: filteredRanks,
            filteredPlayers: this.state.players.filter((player) => filteredRanks.filter((rank) => rank === player.rank.id).length > 0)
        });
    };

    handleTogglePlayer = player => () => {
        let newPlayers = this.state.filteredPlayers;
        const index = newPlayers.indexOf(player);

        newPlayers[index].minionsVisible = !newPlayers[index].minionsVisible;
        let anyVisiblePlayers = newPlayers.filter((player) => player.minionsVisible).length > 0;

        this.setState({
            filteredPlayers: newPlayers,
            buttonEnabled: anyVisiblePlayers
        });
    };

    render() {
        return (
            <div className="titleButton">
                <Button color="inherit" onClick={this.handleClickOpen}>Add Players</Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Add Player</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Players that are visible here can be filtered down by rank, to make it easier to find people
                        </DialogContentText>
                    </DialogContent>
                    <DialogContent>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell style={{ verticalAlign: 'top'}}>
                                        <List>
                                            {this.state.ranks.map((rank) =>
                                                <ListItem key={rank.id} dense button onClick={this.handleToggleRank(rank)}>
                                                    <Avatar alt={rank.name} src={rank.icon} style={{width: 20, height: 20}}/>
                                                    <ListItemText primary={rank.name}/>
                                                    <Checkbox checked={this.state.ranks[this.state.ranks.indexOf(rank)].enabled === true}/>
                                                </ListItem>
                                            )}
                                        </List>
                                    </TableCell>
                                    <TableCell style={{ verticalAlign: 'top'}}>
                                        <List>
                                            {this.state.filteredPlayers.map((player) =>
                                                <ListItem key={player.id} dense button onClick={this.handleTogglePlayer(player)}>
                                                    <Avatar alt={player.name} src={player.icon} style={{width: 50, height: 50}}/>
                                                    <ListItemText primary={player.name}/>
                                                    <Checkbox checked={this.state.filteredPlayers[this.state.filteredPlayers.indexOf(player)].minionsVisible === true}/>
                                                </ListItem>
                                            )}
                                        </List>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </DialogContent>
                    <DialogActions>
                        <AddPlayerForMinionsButton players={this.state.filteredPlayers} ranks={this.state.ranks} enabled={this.state.buttonEnabled} callback={this.props.callback}/>
                        <Button onClick={this.handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

class RemovePlayerForMinions extends React.Component {
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
        fetch(backendUrl + '/minions/players/visible')
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

        newPlayers[index].minionsVisible = !newPlayers[index].minionsVisible;
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
                        <Avatar alt={player.name} src={player.icon} style={{width: 50, height: 50}}/>
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
                <Button color="inherit" onClick={this.handleClickOpen}>Remove Players</Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Remove Players</DialogTitle>
                    <DialogContent>
                        {dropdown}
                    </DialogContent>
                    <DialogActions>
                        <RemovePlayerForMinionsButton players={this.state.players} callback={this.props.callback}/>
                        <Button onClick={this.handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

class AddPlayerForMinionsButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "Add"
        };
    }

    addPlayer() {
        this.setState({
            disabled: true,
            text: "Adding Player..."
        });
        fetch(backendUrl + "/minions/players/add?ids=" + this.props.players.filter((player) => player.minionsVisible).map((player) => player.id), {method: 'POST'})
            .then(() => {
                fetch(backendUrl + "/ranks/enable", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.props.ranks)
                })
                    .then(() => {
                        this.props.callback();
                    });
            });

    }

    render() {
        return (
            <Button id={this.props.players[0]}
                    color="primary"
                    onClick={() => this.addPlayer()}
                    disabled={!this.props.enabled}>{this.state.text}</Button>
        );
    }
}

class RemovePlayerForMinionsButton extends React.Component {
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
        fetch(backendUrl + "/minions/players/visible", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.props.players)
        })
            .then(() => {
                this.props.callback();
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

class Mounts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            players: [{mounts: []}],
            numRows: 0,
            trigger: props.trigger
        };
    }

    componentWillMount() {
        console.log("loading mounts");
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
                <PageForwarder/>
            </div>
        );
    }
}

class MountButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            triggerRender: 0
        };
    }
    render() {
        return (
            <div className="titleButtons">
                <AddPlayerForMounts callback={this.props.callback}/>
                <RemovePlayerForMounts callback={this.props.callback}/>
            </div>
        );
    }
}

class MinionButtons extends React.Component {
    render() {
        return (
            <div className="titleButtons">
                 <AddPlayerForMinions callback={this.props.callback}/>
                 <RemovePlayerForMinions callback={this.props.callback}/>
            </div>
        );
    }
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            triggerRender: 0
        };
    }

    handleCallback = () => {
        this.setState({
            triggerRender: this.state.triggerRender + 1
        });
        console.log("callback triggered");
    };

    render() {
        return (
            <div>
                <NavBar>
                    <Routes>
                        <Route exact path="/" element={<MountButtons callback={this.handleCallback}/>}/>
                        <Route exact path="/minions" element={<MinionButtons callback={this.handleCallback}/>}/>
                        <Route exact path="/videos" element={<VideoButtons/>}/>
                        <Route exact path="/schedule" element={<ScheduleButtons/>}/>
                        <Route exact path="/logs" element={<LogsButtons/>}/>
                        <Route exact path="/info" element={<InfoButtons/>}/>
                    </Routes>
                </NavBar>
                <Routes>
                    <Route exact path="/" element={<Mounts trigger={this.state.triggerRender}/>}/>
                    <Route exact path="/minions" element={<Minions trigger={this.state.triggerRender}/>}/>
                    <Route exact path="/videos" element={<Videos/>}/>
                    <Route exact path="/schedule" element={<Schedule/>}/>
                    <Route exact path="/logs" element={<Logs/>}/>
                    <Route exact path="/info" element={<Info/>}/>
                </Routes>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <BrowserRouter>
        <ThemeProvider theme={theme}>
            <Main/>
        </ThemeProvider>
    </BrowserRouter>, document.getElementById("root"));