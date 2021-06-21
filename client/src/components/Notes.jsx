import React, { useState, useEffect } from "react";
import Note from "./sub-comp/Note";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

export default function Notes() {
  const history = useHistory();
  const [notes, setNotes] = useState([]);

  function deleteNote(id) {
    axios
      .post("/notes", { id })
      .then((res) => {
        if (res.status === 201) {
          console.log("Note deleted successfully");
          Swal.fire("Deleted Successfully! ", "", "warning");
          callInputNotePage();
        }
      })
      .catch((error) => {
        Swal.fire(`${error.response.data.error}`, "", "warning");
      });
  }
  function callInputNotePage() {
    axios
      .get("/notes", { withCredentials: true })
      .then((res) => {
        const data = res.data;
        console.log(data);
        setNotes(data);
      })
      .catch((error) => {
        Swal.fire(`${error.response.data.error}`, "", "warning");
        history.push("/login");
      });
  }
  useEffect(() => {
    callInputNotePage();
  }, []);
  if (notes.length === 0) {
    return (
      <>
        <div className="center-container home text-center">
          <div>
            <p className="m-0" style={{ fontSize: "1.5rem" }}>
              Save your secrets here
            </p>
            <p style={{ color: "gray" }}>click '+' to add note</p>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="container-fluid">
        <div className="row">
          {notes.map((notesItem, index) => (
            <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
              <Note
                key={index}
                id={notesItem._id}
                title={notesItem.title}
                content={notesItem.content}
                onDelete={deleteNote}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
