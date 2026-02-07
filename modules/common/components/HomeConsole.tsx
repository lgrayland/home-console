import React from "react";

interface HomeConsoleProps {
  className?: string;
}

export const HomeConsole: React.FC<HomeConsoleProps> = ({
  className = "h-6 w-6",
}) => {
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      stroke: "currentColor",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: "2",
      viewBox: "0 0 24 24",
      className,
    },
    React.createElement("path", { d: "m2 10 10-7 10 7" }),
    React.createElement("rect", {
      width: "14",
      height: "11",
      x: "5",
      y: "10",
      rx: "2.5",
    }),
    React.createElement("path", { d: "m8 13.5 2.5 2.5L8 18.5M13 18.5h3" }),
  );
};

export default HomeConsole;
