import React, {useContext, useState} from 'react';
import './index.css';
import Calendar from "@ericz1803/react-google-calendar";
import PageForwarder from "./pageForwarder";
import {isMobile} from "react-device-detect";
import Paper from "@material-ui/core/Paper/Paper";
import {css} from "@emotion/react";
import Button from "@material-ui/core/Button/Button";

const apiKey = process.env.REACT_APP_CALENDAR_API_KEY;

export function ScheduleButtons() {
    return (
        <div className="titleButtons">
            {/*<Button color="inherit">Actions</Button>*/}
            {/*<DSRButton/>*/}
            {/*<Button color="inherit">Savage</Button>*/}
        </div>
    );
}

function buttonClick() {
    alert();
}

function DSRButton() {
    return (
        <Button color="inherit" onClick={buttonClick}>DSR</Button>
    );
}

export default function Schedule() {
    let result;
    let calendars = [
        { calendarId: "k8jp7h31kbl6njskm9m0m5cnpc@group.calendar.google.com" },
        { calendarId: "d11e27fd36a9828c7d0a989733095ceeffb2257696e33ac222105fbc902c6522@group.calendar.google.com" }
    ]
    let styles = {
        today: css`
          /* highlight today by making the text red and giving it a red border */
          color: red;
          border: 1px solid red;
          background-color: #fff5b6;
        `,
    }

    if (isMobile) {
        result =
            <Paper style={{width: '100%', overflowX: 'auto'}}>
                <Calendar apiKey={apiKey} calendars={calendars} styles={styles} />
            </Paper>;
    } else {
        result = <Calendar apiKey={apiKey} calendars={calendars} styles={styles} />;
    }

    return (
        <div>
            {result}
            <PageForwarder/>
        </div>
    );
}