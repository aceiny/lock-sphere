"use client";

import React from "react";
import {
  PulseLoader,
  ClipLoader,
  BeatLoader,
  RingLoader,
  HashLoader,
} from "react-spinners";

type LoaderType = "pulse" | "clip" | "beat" | "ring" | "hash";

interface LoadingScreenProps {
  type?: LoaderType;
  color?: string;
  size?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  type = "ring",
  color = "#0070f3",
  size = 20,
}) => {
  const getLoader = () => {
    switch (type) {
      case "pulse":
        return <PulseLoader color={color} size={size} />;
      case "clip":
        return <ClipLoader color={color} size={size * 2} />;
      case "beat":
        return <BeatLoader color={color} size={size} />;
      case "ring":
        return <RingLoader color={color} size={size * 3} />;
      case "hash":
        return <HashLoader color={color} size={size * 3} />;
      default:
        return <PulseLoader color={color} size={size} />;
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {getLoader()}
    </div>
  );
};

export default LoadingScreen;
