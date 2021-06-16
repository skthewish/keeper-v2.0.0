import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function ChgPwd() {
  const history = useHistory();
  const { token } = useParams();

  const [pwd, setPwd] = useState({
    newpwd: "",
    newcpwd: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setPwd((prevUser) => {
      return {
        ...prevUser,
        [name]: value,
      };
    });
  }

  async function submitForm(event) {
    event.preventDefault();
    try {
      const res = await axios.post(`/chgpwd/${token}`, { pwd, token });
      if (res) {
        Swal.fire("Password changed Successfully! ", "", "success");
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
            type="txt"
            name="newpwd"
            className="form-control"
            onChange={handleChange}
            placeholder="New Password"
            value={pwd.newpwd}
            autoFocus
          />
          <input
            type="text"
            name="newcpwd"
            className="form-control"
            onChange={handleChange}
            placeholder="Confirm New Password"
            value={pwd.newcpwd}
          />
          <button type="submit" className="btn btn-primary mt-3">
            Update Password
          </button>
        </form>
      </div>
    </>
  );
}
