import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

export default function Register() {
  const history = useHistory();
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    email: "",
    pwd: "",
    cpwd: "",
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
      const res = await axios.post("/register", user);
      if (res) {
        Swal.fire("Registered Successfully! ", "", "success");
        history.push("/login");
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
            type="text"
            name="fname"
            className="form-control"
            onChange={handleChange}
            placeholder="fname"
            value={user.fname}
            autoFocus
          />
          <input
            type="text"
            name="lname"
            className="form-control"
            onChange={handleChange}
            placeholder="lname"
            value={user.lname}
          />
          <input
            type="email"
            name="email"
            className="form-control"
            onChange={handleChange}
            placeholder="email"
            value={user.email}
          />
          <input
            type="text"
            name="pwd"
            className="form-control"
            onChange={handleChange}
            placeholder="password"
            value={user.pwd}
          />
          <input
            type="text"
            name="cpwd"
            className="form-control"
            onChange={handleChange}
            placeholder="confirm password"
            value={user.cpwd}
          />

          <button type="submit" className="btn btn-primary mt-3">
            Register
          </button>
        </form>
      </div>
    </>
  );
}
