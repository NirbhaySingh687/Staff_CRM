import React, { Component } from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CalculateSalary from "./CalculateSalary";

class App extends Component {
  render() {
    return (
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div className="App">
            <CalculateSalary />
          </div>
        </MuiThemeProvider>
    );
  }
}

export default App;
