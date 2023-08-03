import React from 'react';
import './index.css';
import YouTube from "react-youtube";
import Calendar from "@ericz1803/react-google-calendar";
import PageForwarder from "./pageForwarder";
import {isMobile} from "react-device-detect";
import Paper from "@material-ui/core/Paper/Paper";
import Button from "@material-ui/core/Button/Button";

const apiKey = process.env.REACT_APP_CALENDAR_API_KEY;

export function ScheduleButtons() {
    return (
        <div className="titleButtons">
            {/*<Button color="inherit">Actions</Button>*/}
            {/*<Button color="inherit">DSR</Button>*/}
            {/*<Button color="inherit">Savage</Button>*/}
        </div>
    );
}

export default function Schedule() {
    let result;
    let calendars = [
        { calendarId: "k8jp7h31kbl6njskm9m0m5cnpc@group.calendar.google.com" },
    ];

    if (isMobile) {
        result =
            <Paper style={{width: '100%', overflowX: 'auto'}}>
                <Calendar apiKey={apiKey} calendars={calendars} />
            </Paper>;
    } else {
        result = <Calendar apiKey={apiKey} calendars={calendars} />;
    }

    return (
        <div>
            {result}
            <PageForwarder/>
        </div>
    );
}