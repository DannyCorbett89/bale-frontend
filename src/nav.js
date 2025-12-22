import './nav.css';
import MountsTable from "./mounts/mounts-table";
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import MinionsTable from "./minions/minions-table";
import Videos from "./videos";
import Logs from "./logs";
import Schedule from "./schedule";

function Nav() {
    return (
        <BrowserRouter>
            <div id="mySidenav" className="sidenav">
                <a href="#" className="closebtn" onClick={closeNav}>&times;</a>
                <Link to="/">Mounts</Link>
                <Link to="/minions">Minions</Link>
                <Link to="/schedule">Schedule</Link>
                <Link to="/videos">Videos</Link>
                <Link to="/logs">Logs</Link>
            </div>


            <div id="main">
                <div className="topnav">
                    <a onClick={openNav}>&#9776;</a>
                </div>
                <Routes>
                    <Route path="/" element={<MountsTable/>}/>
                    <Route path="/minions" element={<MinionsTable/>}/>
                    <Route path="/schedule" element={<Schedule/>}/>
                    <Route path="/videos" element={<Videos/>}/>
                    <Route path="/logs" element={<Logs/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

function openNav() {
    document.getElementById("mySidenav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "200px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

export default Nav;
