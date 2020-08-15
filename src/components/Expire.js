import React from 'react';

class Expire extends React.Component {
    render() {
        return (
            <div className="homePage center btn-group fromtop">
                <h1 className="text_style">
                    Your session has ended, please go back to our home page
                </h1>
                <form action='/'>
                    <button type="submit" >OK</button>
                </form>
            </div>
        )
    }

}

export default Expire;