import * as React from "react"
import Svg, { Path } from "react-native-svg"

const Home = ({ color, ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{
      enableBackground: "new 0 0 122.88 104.81",
    }}
    viewBox="0 0 122.88 104.81"
    {...props}
  >
    <Path
      d="M11.51 102.9v-44c-2.34.9-4.53.92-6.35.3a7.521 7.521 0 0 1-3.5-2.45A7.721 7.721 0 0 1 .05 52.8c-.26-2.31.43-4.92 2.4-7.37.1-.12.21-.24.34-.34L59.85.55c.74-.68 1.88-.75 2.7-.11l57.19 44.46c.09.07.17.14.25.23 2.65 2.85 3.31 6.01 2.67 8.68-.32 1.32-.95 2.5-1.82 3.48-.87.98-1.98 1.74-3.24 2.19-2 .72-4.38.7-6.79-.44v43.74h-5.6v-46.2c0-1.01-39.23-32.02-43.56-35.39-4.59 3.49-44.54 34.25-44.54 35.55v46.18l-5.6-.02zm51.83-47.21v17.99h16.14v-.05c0-4.96-2.03-9.47-5.3-12.74-2.85-2.85-6.64-4.76-10.84-5.2zm0 21.79V93.1h16.14V77.48H63.34zm-3.8 15.61V77.48H43.4V93.1h16.14v-.01zm0-19.41V55.69a18.02 18.02 0 0 0-10.84 5.2c-3.27 3.27-5.3 7.78-5.3 12.74v.05h16.14zm-23.95 27.34h51.69v3.8H35.59v-3.8zm25.85-49.23c6.01 0 11.47 2.46 15.42 6.41 3.96 3.96 6.41 9.42 6.41 15.42v23.26H39.6V73.62c0-6.01 2.46-11.47 6.41-15.42 3.96-3.95 9.42-6.41 15.43-6.41zM93.76 3.55l17.17.7v23.19L93.76 16.11V3.55z"
      style={{
        fill: color, // Apply color dynamically
        fillRule: "evenodd",
        clipRule: "evenodd",
      }}
    />
  </Svg>
)

export default Home;