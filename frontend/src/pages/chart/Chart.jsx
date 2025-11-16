import React from "react";
import "./chart.css";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";

const Chart = ({ title, data, datakey }) => {
  const theme = useSelector((state) => state.theme.currentTheme);

  return (
    <div className="chart-main">
      <div
        className={`chart-container ${
          theme === "dark" && "chart-container-dark"
        }`}
      >
        <h3 className="sub-title">{title}</h3>
        <ResponsiveContainer width="95%">
          <LineChart data={data}>
            <XAxis
              dataKey="name"
              stroke={theme === "dark" ? "white" : "black"}
            />
            <Line type="monotone" dataKey={datakey} stroke="#6e73bb" />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
