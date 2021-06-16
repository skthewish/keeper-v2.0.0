import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import Swal from "sweetalert2";
import { context } from "./App";

export default function InputNote(props) {
  const { state, dispatch } = useContext(context);
  const history = useHistory();
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  async function addNote(event) {
    event.preventDefault();

    try {
      const res = await axios.post("/inputnote", note);
      if (res) {
        dispatch({ type: "auth", payload: true });
        history.push("/notes");
      }
    } catch (error) {
      if (error.response.status === 422) {
        Swal.fire("Please fill the data", "", "warning");
      } else {
        history.push("/login");
      }
    }
  }

  return (
    <div className="center-container">
      <div className="input-div">
        <form id="inputNote">
          <input
            type="text"
            name="title"
            onChange={handleChange}
            placeholder="Title"
            value={note.title}
            autoFocus
          />
          <textarea
            rows={10}
            name="content"
            onChange={handleChange}
            placeholder="Write your note...."
            value={note.content}
          />

          <button className="addBtn btn-warning" onClick={addNote}>
            <AddIcon className="addicon" fontSize="small" />
          </button>
        </form>
      </div>
    </div>
  );
}
