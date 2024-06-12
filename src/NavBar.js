import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from "@mui/material/Drawer/Drawer";
import List from "@mui/material/List/List";
import ListItem from "@mui/material/ListItem/ListItem";
import {Link} from "react-router-dom";

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerOpen: false
        };
    }

    toggleDrawer = () => {
        this.setState({drawerOpen: !this.state.drawerOpen});
    };

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="fixed">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu"
                                    onClick={this.toggleDrawer}>
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            {/* TODO: Dynamic text label which displays current page */} {/* Bahamut's Legion */}
                            {this.props.children}
                        </Typography>
                        <Drawer open={this.state.drawerOpen} onClose={this.toggleDrawer}>
                            <div
                                tabIndex={0}
                                role="button"
                                onClick={this.toggleDrawer}
                            >
                                <div className={classes.list}>
                                    <List component="nav">
                                        {/*<ListItem button>*/}
                                        {/*    <Link to="/info">Information</Link>*/}
                                        {/*</ListItem>*/}
                                        <ListItem button>
                                            <Link to="/">Mounts</Link>
                                        </ListItem>
                                        <ListItem button>
                                            <Link to="/minions">Minions</Link>
                                        </ListItem>
                                        <ListItem button>
                                            <Link to="/schedule">Schedule</Link>
                                        </ListItem>
                                        <ListItem button>
                                            <Link to="/videos">Videos</Link>
                                        </ListItem>
                                        <ListItem button>
                                            <Link to="/logs">Logs</Link>
                                        </ListItem>
                                    </List>
                                </div>
                            </div>
                        </Drawer>
                    </Toolbar>
                </AppBar>
                <div style={{paddingTop: 64}}/>
            </div>
        );
    }
}

NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);