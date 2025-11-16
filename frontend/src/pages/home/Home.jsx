import React from "react";
import FeatureInfo from "../featureInfo/FeatureInfo";
import "./home.css";
import Chart from "../chart/Chart";
import { userData } from "../../UserData";
import WidgetSm from "../../components/widgetsm/WidgetSm";
import WidgetLg from "../../components/widgetlg/WidgetLg";

const Home = () => {
  return (
    <>
      <div className="home-page-info">
        <FeatureInfo />
        <Chart
          title="Active User Details"
          data={userData}
          datakey="Active User"
        />
        <div className="new-joinee-tab">
          <WidgetSm />
          <WidgetLg />
        </div>
      </div>
    </>
  );
};

export default Home;
