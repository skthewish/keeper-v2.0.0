import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { context } from "../App";
import Swal from "sweetalert2";

export default function Logout() {
  const { state, dispatch } = useContext(context);
  const history = useHistory();
  async function call() {
    try {
      const res = await axios.get("/logout", { withCredentials: true });
      //   console.log(res);
      if (res) {
        dispatch({ type: "auth", payload: false });
        Swal.fire("Logged out Successfully! ", "", "success");
        history.push("/home");
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    call();
  }, []);
  return <></>;
}
