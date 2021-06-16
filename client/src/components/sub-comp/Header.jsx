import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import Swal from "sweetalert2";
import { context } from "../App";

function Navbar() {
  // const history = useHistory();
  const { state, dispatch } = useContext(context);
  useEffect(() => {
    axios
      .get("/auth")
      .then((res) => {
        if (res) {
          dispatch({ type: "auth", payload: true });
        }
      })
      .catch((error) => {
        if (error) {
          dispatch({ type: "auth", payload: false });
        }
      });
  });
  if (state) {
    return (
      <>
        <Link to="/notes">
          <button className={`nav-btn  btn`}>Notes</button>
        </Link>
        <Link to="/logout">
          <button className={`nav-btn btn`}>Logout</button>
        </Link>
      </>
    );
  } else {
    return (
      <>
        <Link to="/login">
          <button className={`nav-btn btn`}>Login</button>
        </Link>
        <Link to="/register">
          <button className={`nav-btn btn`}>Register</button>
        </Link>
      </>
    );
  }
}

export default function Header() {
  const history = useHistory();
  const { state, dispatch } = useContext(context);

  function handleClick() {
    axios
      .get("/inputnote", { withCredentials: true })
      .then((res) => {
        if (!res) {
          throw new Error("User not authenticated");
        } else {
          dispatch({ type: "auth", payload: true });
          history.push("/inputnote");
        }
      })
      .catch((error) => {
        if (error) {
          console.log(error);
          Swal.fire({
            title: "Log in First",
            icon: "warning",
          }).then(() => {
            history.push("/login");
          });
        }
      });
  }
  return (
    <header>
      <h1> Keeper</h1>
      <button className="addNoteHeaderBtn btn" onClick={handleClick}>
        <AddIcon fontSize="medium" />
      </button>
      <nav className="navbar navbar-expand-lg navbar-light">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <Navbar />
          </ul>
        </div>
      </nav>
      {/* <Navbar /> */}
    </header>
  );
}
