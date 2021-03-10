import React from 'react';

import '../style/App.css';

class AccessCode extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: '',
            access_token: null,
            request_token: null,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentWillMount(){
        // update this.state.access_token and this.state.request_token after receiving data from backend
    }
    handleChange(event) {
        this.setState({ value: event.target.value });
    }
    handleSubmit(event) {
        event.preventDefault();
        // make an API call to backend to create a room using this.state.value (access code) and this.state.access_token and this.state.request_token
        // ...
    }
    render() {
        return(
            <div className="AccessCodePage center">
                <div className="btn-group fromtop">
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            <input
                                className="inputbar"
                                placeholder="Access Code"
                                type="text"
                                value={this.state.value}
                                onChange={this.handleChange}
                                size="50" />
                        </label>
                        <button type="submit" id="submit_code" > Submit</button>
                    </form>
                    <p className="fromtop text_style"> Please input the access code you have obtained from us </p>
                </div>

            </div>
        )
    }
}

export default AccessCode;