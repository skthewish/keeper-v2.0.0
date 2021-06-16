import React, { useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { context } from "./App";

export default function Login() {
  const { state, dispatch } = useContext(context);
  const history = useHistory();
  const [user, setUser] = useState({
    email: "",
    pwd: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setUser((prevUser) => {
      return {
        ...prevUser,
        [name]: value,
      };
    });
  }

  async function submitForm(event) {
    event.preventDefault();
    try {
      const res = await axios.post("/login", user);
      if (res) {
        if (res.status === 201) {
          dispatch({ type: "auth", payload: true });
          Swal.fire({ title: "Logged in Successfully!", icon: "success" }).then(
            () => {
              history.push("/notes");
            }
          );
        }
      }
    } catch (error) {
      Swal.fire(`${error.response.data.error}`, "", "warning");
    }
  }

  return (
    <>
      <div className="center-container input-div w-25 text-center">
        <form onSubmit={submitForm}>
          <input
            type="email"
            name="email"
            className="form-control"
            onChange={handleChange}
            placeholder="email"
            value={user.email}
            autoFocus
          />
          <input
            type="text"
            name="pwd"
            className="form-control"
            onChange={handleChange}
            placeholder="password"
            value={user.pwd}
          />
          <button type="submit" className="btn btn-primary mt-3">
            Log in
          </button>
          <div>
            <Link
              to="/reset"
              style={{ textDecoration: "none", fontSize: "0.8rem" }}
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
