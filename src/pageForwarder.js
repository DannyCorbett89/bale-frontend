import React from 'react';
import './index.css';

function PageForwarder() {
    if(window.location.href.startsWith("http://dc-minecraft.com/")) {
        window.location.href = "http://dc-minecraft:20000/";
    }

    return (
        <div/>
    );
}

export default PageForwarder;
