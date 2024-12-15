"use client";
import React from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
function Loader({ color = "#fff", height = 20, width = 3 }) {
  return <ScaleLoader color={color} height={height} width={width} />;
}

export default Loader;
