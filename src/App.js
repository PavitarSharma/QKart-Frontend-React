import { ThemeProvider } from "@emotion/react";
import Login from "./components/Login";
import { Switch, Route } from "react-router-dom";
import Register from "./components/Register";
import Product from "./components/Products"
import ipConfig from "./ipConfig.json";
import theme from "./theme";
// eslint-disable-next-line
import React, { useEffect, useState } from "react"


export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <div className="App">

          <Switch>
            <Route exact path="/" component={Product} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
          </Switch>
        </div>
      </ThemeProvider>
    </React.StrictMode>



  );
}

export default App;
