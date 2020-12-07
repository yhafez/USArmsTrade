import React, { Component } from "react";
import Datamap from "datamaps/dist/datamaps.world.min.js";
import d3 from "d3";
import worldJson from "./world.topo.json";
import armsSalesTotals from "./arms_sales_totals.json";
import * as Countries from "i18n-iso-countries";
import { formatNumber } from "./utils/format";

Countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
export default class Heatmap extends Component {
  componentDidMount() {
    // Tracks largest authorization and dollar amounts
    let maxAuthorization = 0;
    let maxDelivery = 0;

    // Helper function to adjust value of maxAuthorization and maxDelivery if those values in the item being processed are larger
    const adjustMaxValues = (authorizationAmount, deliveriesAmount) => {
      if (+authorizationAmount > maxAuthorization)
        maxAuthorization = authorizationAmount;
      if (+deliveriesAmount > maxDelivery) maxDelivery = deliveriesAmount;
    };

    // Loop over dataset, remove trailing spaces, and create object "totalVals" containing country name, delivery amounts, and authorization amounts
    let totalVals = armsSalesTotals.reduce((total, yearlySale, index) => {
      // TODO: Logs portions of data that aren't rendered on the map; need to figure out what to do with this
      // if(Countries.getAlpha3Code(yearlySale.country.trim(), "en") === undefined) console.log(yearlySale.country.trim(), yearlySale.country.trim().length );

      // Somaliland doesn't have a 3 letter country code as required by Datamaps, but appears in the dataset, so assign it a custom 3 letter code
      if (yearlySale.country.trim() === "Somaliland") {
        total["SML"] = {
          country: yearlySale.country.trim(),
          authorizations: JSON.parse(yearlySale.authorizations),
          deliveries: JSON.parse(yearlySale.deliveries),
        };
        adjustMaxValues(yearlySale.authorizations, yearlySale.deliveries);
      }
      // If country isn't yet stored in totalVals, identify its Alpha-3 code (for compatability with Datamaps) to use as key, and store object containing country name, authorization amount, and delivery amount; else, increment authorization and delivery amounts to yield total amounts across all years
      else if (
        !total[Countries.getAlpha3Code(yearlySale.country.trim(), "en")]
      ) {
        total[Countries.getAlpha3Code(yearlySale.country.trim(), "en")] = {
          country: yearlySale.country.trim(),
          authorizations: JSON.parse(yearlySale.authorizations),
          deliveries: JSON.parse(yearlySale.deliveries),
        };
        adjustMaxValues(yearlySale.authorizations, yearlySale.deliveries);
      } else {
        total[
          Countries.getAlpha3Code(yearlySale.country.trim(), "en")
        ].authorizations += JSON.parse(yearlySale.authorizations);
        total[
          Countries.getAlpha3Code(yearlySale.country.trim(), "en")
        ].deliveries += JSON.parse(yearlySale.deliveries);
        adjustMaxValues(yearlySale.authorizations, yearlySale.deliveries);
      }
      return total;
    }, {});

    // Set color scale for both deliveries and authorizations
    let paletteScaleDeliveries = d3.scale
      .linear()
      .domain([0, maxDelivery])
      .range(["rgb(170, 170, 170)", "rgb(128, 0, 255)"]);

    let paletteScaleAuthorizations = d3.scale
      .linear()
      .domain([0, maxAuthorization])
      .range(["rgb(170, 170, 170)", "rgb(128, 0, 255)"]);

    // Assign color weight to each country
    // TODO: Weight is currently based off deliveries; should we make it a button to toggle between weighing by deliveries and alternatively weighing by authorizations?
    for (let country in totalVals) {
      totalVals[country].fillColor = paletteScaleDeliveries(
        totalVals[country].deliveries
      );
    }

    console.table(totalVals);

    // Creates and configures the world map and its styles, as well as popups on hover
    const map = new Datamap({
      element: document.getElementById("heat_map"),
      scope: "world",
      fills: { defaultFill: "rgb(170, 170, 170)" }, //Default color if no fillColor is specified
      data: totalVals, // Specifies totalVals as data source for popups and weighted color fills
      dataType: "json",
      geographyConfig: {
        dataUrl: "./world.topo.json",
        popupOnHover: true,
        borderColor: "#000",
        borderWidth: "0.5",
        highlightOnHover: true,
        highlightBorderWidth: 1.5,
        highlightBorderColor: "#03fc5a",
        highlightFillColor: function (geo) {
          return geo["fillColor"] || "rgb(170, 170, 170)";
        }, // Matches highlight color to fill color, so color doesn't change on hover
        /// Defines template of popup that appears when country is hovered over
        popupTemplate: function (geo, data) {
          let authorizations = data.authorizations;
          let deliveries = data.deliveries;
          if (!data) {
            return;
          }
          return `
          <div class="hoverinfo">
            <strong>${geo.properties.name}</strong> <br/>
              Total Authorizations: <strong> $${formatNumber(
                authorizations
              )}</strong> <br/>
              Total Deliveries: <strong>$${formatNumber(deliveries)}</strong>
          </div> `;
        },
      },
      // Creates the map and default behavior such as centering and scale
      // setProjection: function (element) {
      //     let projection = d3.geo.mercator()
      //         .center([0, 0])
      //         .scale(200)
      //         .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
      //     let path = d3.geo.path().projection(projection);
      //     return { path: path, projection: projection };
      // },
    });
  }

  // Creates div React component which is used by Datamaps above as the container for the map
  render() {
    return (
      <div
        id="heat_map"
        style={{
          height: "100%",
          width: "100%",
        }}
      ></div>
    );
  }
}
