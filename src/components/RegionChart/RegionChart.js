import regionalData from "../../data/regional_arms_sales_notifications.json";
import React from "react";
import { Pie, Doughnut } from "react-chartjs-2";
import { formatNumber } from "../../utils/format";

let labels = regionalData.map((el) => el["Region Arms Sales Dashboard"]);
let numbers = regionalData.map((el) =>
  el.Notifications.match(/[0-9]/g).join("")
);
// console.log(numbers);
const state = {
  labels,
  datasets: [
    {
      label: "Arms Sales",
      data: numbers, //data displayed on pie
      backgroundColor: ["#F54EA2", "#41b6e6", "#f6003c", "#7ebc59", "#8134af"],
      hoverBackgroundColor: [
        "#b9006e",
        "#005792",
        "#C1292E",
        "#2b9464",
        "#42218E",
      ],
    },
  ],
};
class RegionChart extends React.Component {
  render() {
    return (
      <div style={{ width: "700px", margin: "50px" }}>
        <Doughnut
          data={state}
          width={200}
          height={400}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            title: {
              display: true,
              text: "Arms Sales Notifications by Region",
              fontSize: 25,
            },
            legend: {
              display: true,
              position: "right",
              labels: {
                fontSize: 20, //labels font size
                fontColor: "#000",
              },
            },
            tooltips: {
              //pop up info
              bodyFontSize: 15,
              callbacks: {
                label: function (tooltipItem, data) {
                  // console.log({ tooltipItem, data });
                  const label = data.labels[tooltipItem.index]; //tooltipItem.index gives the index of this data item in the dataset
                  const value = formatNumber(
                    data.datasets[tooltipItem.datasetIndex].data[
                      tooltipItem.index
                    ] //finds the matching data item in dataset
                  );
                  return `${label}: $${value}`;
                },
              },
            },
          }}
        />
      </div>
    );
  }
}
export default RegionChart;
