import React from 'react';

function NavigationBar() {
    return (
        <div className="navcontainer">
            <div id="brand"><a href="/">Auxify</a></div>
            <div className="nav" role="navigation">
                {/*<li className="brand"><a href="/">Auxify</a></li>*/}
                <a href="/about">About</a>
                <a href="/instruction">Instruction</a>
                <a href="https://forms.gle/NsMB5L5Ge5THb6Hj7">Feedback</a>
            </div>
        </div>
    )
}

export default NavigationBar;