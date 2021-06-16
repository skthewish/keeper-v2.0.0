import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function Reset() {
  const history = useHistory();
  const [email, setEmail] = useState("");

  function handleChange(event) {
    setEmail(event.target.value);
  }

  async function submitForm(event) {
    event.preventDefault();
    setEmail("");
    try {
      const res = await axios.post("/reset", { email });
      if (res) {
        Swal.fire("Check your email!", "");
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
            value={email}
            autoFocus
          />
          <button type="submit" className="btn btn-primary mt-3">
            Reset Password
          </button>
        </form>
      </div>
    </>
  );
}
