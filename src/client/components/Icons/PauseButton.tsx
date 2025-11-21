import * as React from "react";
import { JSX } from "react/jsx-runtime";
const PauseButton = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  <svg
    width="512px"
    height="512px"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill="#000"
      d="M120.16 45A20.162 20.162 0 0 0 100 65.16v381.68A20.162 20.162 0 0 0 120.16 467h65.68A20.162 20.162 0 0 0 206 446.84V65.16A20.162 20.162 0 0 0 185.84 45h-65.68zm206 0A20.162 20.162 0 0 0 306 65.16v381.68A20.162 20.162 0 0 0 326.16 467h65.68A20.162 20.162 0 0 0 412 446.84V65.16A20.162 20.162 0 0 0 391.84 45h-65.68z"
    />
  </svg>
);
export default PauseButton;
