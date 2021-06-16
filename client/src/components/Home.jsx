import React from "react";

export default function Home() {
  return (
    <>
      <div className="center-container home text-center">
        <div>
          <h1 style={{ fontSize: "4rem" }}>
            <span role="img" aria-label="cofetti ball">
              🎊
            </span>
          </h1>
        </div>
        <div className="title">
          <h2 style={{ fontSize: "3rem", color: "red" }}>
            Love To See You Here
          </h2>
        </div>
        <div>
          <p className="m-0" style={{ fontSize: "1.5rem" }}>
            Save your secrets here
          </p>
          <p style={{ color: "gray" }}>click '+' to add note</p>
        </div>
      </div>
    </>
  );
}
