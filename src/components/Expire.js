import React from 'react';

class Expire extends React.Component {
    render() {
        return (
            <div className="expirePage center btn-group">
                <h1 className="text_style fromtop" id = "Expire">
                    Oooops... You have lost connection or Your session has ended.
                </h1>
                <form className = "fromtop" action='/'>
                    <button type="submit" className = "roomAction" >OK</button>
                </form>
            </div>
        )
    }

}

export default Expire;