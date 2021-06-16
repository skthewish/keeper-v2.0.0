import React, { useReducer, createContext } from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Header from "./sub-comp/Header";
import Footer from "./sub-comp/Footer";
import Notes from "./Notes";
import InputNote from "./InputNote";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import ChgPwd from "./ChgPwd";
import Reset from "./Reset";
import Logout from "./sub-comp/Logout";
import reducer, { initialState } from "../Reducer/reducer";

export const context = createContext();

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Router basename={process.env.BASE_URL}>
      <context.Provider value={{ state, dispatch }}>
        <div className="vh-100">
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route exact path="/reset" component={Reset} />
            <Route exact path="/chgpwd/:token" component={ChgPwd} />
            <Route path="/inputnote" component={InputNote} />
            <Route path="/notes" component={Notes} />
            <Route path="/logout" component={Logout} />
            <Route component={Home} />
          </Switch>
          <Footer />
        </div>
      </context.Provider>
    </Router>
  );
}
