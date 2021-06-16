import React from "react";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

export default function Note(props) {
  function clickhandle() {
    props.onDelete(props.id);
  }

  return (
    <div className="note">
      <h3>{props.title}</h3>
      <div>
        <p>{props.content}</p>
      </div>
      <IconButton
        style={{
          color: "#f5ba13",
          float: "right",
          position: "sticky",
          bottom: "0px",
          top: "150px",
        }}
        size="small"
        onClick={clickhandle}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
}
