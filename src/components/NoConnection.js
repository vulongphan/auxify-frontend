import React from 'react';
import server from '../server';

const server_uri = server.frontend;

function NoConection(props) {
        return (
            <div className="noConnectionPage center btn-group">
                <h1 className="text_style fromtop" id="noConnection">
                    You just lost your internet connection. Please connect your device to the internet and reload
                </h1>
            </div>
        )
    }

export default NoConection;