import React, { Component } from "react";
import Datamap from "datamaps/dist/datamaps.world.min.js";
import d3 from "d3";
import "../HeatMap/HeatMap.css";
import armsSalesTotals from "../../data/arms_sales_totals.json";
import * as Countries from "i18n-iso-countries";
import { formatNumber } from "../../utils/format";

// Required configuration to convert country names to their three digit country codes
Countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

export default class Heatmap extends Component {
    componentDidMount() {
        /*----------------------------------------------- Variables -----------------------------------------------*/

        const startYear = this.props.startYear;
        const endYear = this.props.endYear;
        const dataType = this.props.dataType;

        if (startYear > endYear) {
            alert("The start year can't be greater than the end year");
            this.props.setStartYear(NaN);
            this.props.setEndYear(NaN);
            return;
        }

        const hasStartYear = Boolean(startYear);
        const hasEndYear = Boolean(endYear);

        // If a start and end date are specified in filter settings, store the range as a string to use as key and in to validate that a date range has been specified
        let dateRangeString;
        if (hasStartYear && hasEndYear)
            dateRangeString = `${startYear}-${endYear}`;

        // Tracks largest authorization and dollar amounts based on filter settings
        let maxAuthorization = 0;
        let maxDelivery = 0;

        // Define selectedData based on filter settings; default to total
        let selectedData;
        dateRangeString
            ? (selectedData = dateRangeString)
            : hasStartYear
            ? (selectedData = startYear)
            : (selectedData = "total");

        /*----------------------------------------------- Dataset -----------------------------------------------*/

        // Loop over dataset, remove trailing spaces from country names, and create object "formattedData" containing country name, total delivery amounts, and authorization amounts, and yearly delivery amounts, and authorization amounts
        const formattedData = armsSalesTotals.reduce((dataSet, yearlySale) => {
            const countryCode = Countries.getAlpha3Code(
                yearlySale.country.trim(),
                "en"
            );
            const countryName = yearlySale.country.trim();
            const year = yearlySale.year;

            // Somaliland doesn't have a 3 letter country code as required by Datamaps, but appears in datamaps rendered globe, so assign it a custom 3 letter code
            if (countryName === "Somaliland") {
                dataSet["SML"] = {
                    country: countryName,
                    total: {
                        authorizations: JSON.parse(yearlySale.authorizations),
                        deliveries: JSON.parse(yearlySale.deliveries),
                    },
                };
                if (!dateRangeString) adjustMaxValues(yearlySale);
            }
            // If country isn't yet stored in totalVals, identify its Alpha-3 code (for compatability with Datamaps) to use as key, and store object containing country name, authorization amount, and delivery amount; else, increment authorization and delivery amounts to yield total amounts across all years
            else if (!dataSet[countryCode]) {
                dataSet[countryCode] = {
                    country: countryName,
                    total: {
                        countryCode,
                        authorizations: JSON.parse(yearlySale.authorizations),
                        deliveries: JSON.parse(yearlySale.deliveries),
                    },
                };
                if (!dateRangeString) adjustMaxValues(yearlySale);

                // If year is not-empty, store authorization and delivery values for that year, else store them as $0
                dataSet[countryCode][year] = {
                    authorizations: JSON.parse(yearlySale.authorizations),
                    deliveries: JSON.parse(yearlySale.deliveries),
                };
            } else {
                dataSet[countryCode].total.authorizations += JSON.parse(
                    yearlySale.authorizations
                );
                dataSet[countryCode].total.deliveries += JSON.parse(
                    yearlySale.deliveries
                );
                if (!dateRangeString) adjustMaxValues(yearlySale);

                dataSet[countryCode][year] = {
                    authorizations: JSON.parse(yearlySale.authorizations),
                    deliveries: JSON.parse(yearlySale.deliveries),
                };
            }
            return dataSet;
        }, {});

        // Fill in missing data with values of $0 for deliveries and amoutns
        for (let country in formattedData) {
            for (let year = 1996; year <= 2020; ++year) {
                if (!formattedData[country][year]) {
                    formattedData[country][year] = {
                        authorizations: 0,
                        deliveries: 0,
                    };
                }
            }
        }

        // If a date range is specified in the filter settings, check the first item to see if there is a stored total value for that date range in the dataset and, if not, calculate the totals for that date range and store/memoize them
        if (dateRangeString) {
            if (
                !formattedData[Object.keys(formattedData)[0]][dateRangeString]
            ) {
                for (let year = startYear; year <= endYear; ++year) {
                    for (let country in formattedData) {
                        if (!formattedData[country][dateRangeString]) {
                            formattedData[country][dateRangeString] = {
                                authorizations:
                                    formattedData[country][year].authorizations,
                                deliveries:
                                    formattedData[country][year].deliveries,
                            };
                        } else {
                            formattedData[country][
                                dateRangeString
                            ].authorizations +=
                                formattedData[country][year].authorizations;
                            formattedData[country][
                                dateRangeString
                            ].authorizations +=
                                formattedData[country][year].deliveries;
                            adjustMaxValues(
                                formattedData[country][dateRangeString]
                            );
                        }
                    }
                }
            }
        }

        // Set color scale for both deliveries and authorizations
        let paletteScaleDeliveries = d3.scale
            .linear()
            .domain([0, maxDelivery])
            .range(["rgb(159, 142, 173)", "rgb(128, 0, 255)"]);

        let paletteScaleAuthorizations = d3.scale
            .linear()
            .domain([0, maxAuthorization])
            .range(["rgb(159, 142, 173)", "rgb(128, 0, 255)"]);

        // Assign color weight to each country and fill in missing years in formattedData
        for (let country in formattedData) {
            if (dataType === "deliveries") {
                if (formattedData[country][selectedData].deliveries === 0) {
                    formattedData[country].fillColor = "#aaaaaa";
                } else {
                    formattedData[country].fillColor = paletteScaleDeliveries(
                        formattedData[country][selectedData].deliveries
                    );
                }
            } else if (dataType === "authorizations") {
                if (formattedData[country][selectedData].authorizations === 0) {
                    formattedData[country].fillColor = "#aaaaaa";
                } else {
                    formattedData[
                        country
                    ].fillColor = paletteScaleAuthorizations(
                        formattedData[country][selectedData].authorizations
                    );
                }
            }
        }

        /*----------------------------------------------- Helper Functions -----------------------------------------------*/

        // Helper function to adjust value of maxAuthorization and maxDelivery if those values in the item being processed are larger than currently set value appropriately based on selected filters
        function adjustMaxValues({ authorizations, deliveries }) {
            // If a start date and end date are set, then maxAuthorization and maxDelivery are set to represent the values of the countries with the highest sum of authorization and delivery amounts in that date range
            if (hasStartYear) {
                if (+authorizations > maxAuthorization)
                    maxAuthorization = authorizations;
                if (+deliveries > maxDelivery) maxDelivery = deliveries;
            }
            // If only a start date is set, then maxAuthorization and maxDelivery are set to represent the values of the countries with the highest authorization and delivery amounts for that year only
            else if (hasStartYear) {
                if (+authorizations > maxAuthorization)
                    maxAuthorization = authorizations;
                if (+deliveries > maxDelivery) maxDelivery = deliveries;
            }
            // If no start date or end date are set, maxAuthorization and maxDelivery defaults to representing the values of the countries with the highest sum of authorization and delivery amounts across all years
            else {
                if (+authorizations > maxAuthorization)
                    maxAuthorization = authorizations;
                if (+deliveries > maxDelivery) maxDelivery = deliveries;
            }
        }

        /*----------------------------------------------- Datamaps Config -----------------------------------------------*/

        // Creates and configures the world map and its styles, as well as popups on hover
        new Datamap({
            element: document.getElementById("heat_map"),
            done: function (datamap) {
                datamap.svg
                    .selectAll(".datamaps-subunit")
                    .on("click", (country) => {
                        let countryCode = country.id;
                        let countryName = country.properties.name;
                        let countryTotalDeliveries =
                            countryCode !== "USA"
                                ? formattedData[country.id].total.deliveries
                                : 0;
                        let countryTotalAuthorizations =
                            countryCode !== "USA"
                                ? formattedData[country.id].total.authorizations
                                : 0;
                        alert(`
            ${countryName}, ${countryCode}
            Total Authorizations: $${formatNumber(countryTotalAuthorizations)}
            Total Deliveries: $${formatNumber(countryTotalDeliveries)}`);
                    });
            },
            scope: "world",
            //Default color if no fillColor is specified
            fills: { defaultFill: "rgb(170, 170, 170)" },
            // Specifies formattedData as data source for popup data and populating weighted color
            data: formattedData,
            dataType: "json",
            geographyConfig: {
                dataUrl: "./world.topo.json",
                popupOnHover: true,
                borderColor: "#000",
                borderWidth: "0.5",
                highlightOnHover: true,
                highlightBorderWidth: 3.5,
                highlightBorderColor: "#D8D835",
                // Matches highlight color to fill color, so color doesn't change on hover
                highlightFillColor: function (geo) {
                    return geo["fillColor"] || "rgb(170, 170, 170)";
                },
                // Defines template of popup that appears when country is hovered over based on filter settings
                popupTemplate: function (geo, data) {
                    if (!data) {
                        return;
                    }
                    if (selectedData === "total") {
                        return [
                            '<div class="hoverinfo">',
                            "<strong>",
                            geo.properties.name + " (1996 - 2020)",
                            "</strong>",
                            "<br>Authorizations: <strong>$",
                            formatNumber(data.total.authorizations),
                            "</strong>",
                            "<br>Deliveries: <strong>$",
                            formatNumber(data.total.deliveries),
                            "</strong>",
                            "</div>",
                        ].join("");
                    } else if (selectedData === dateRangeString) {
                        return [
                            '<div class="hoverinfo">',
                            "<strong>",
                            geo.properties.name +
                                " (" +
                                startYear +
                                " - " +
                                endYear +
                                ")",
                            "</strong>",
                            "<br>Authorizations: <strong>$",
                            formatNumber(data[dateRangeString].authorizations),
                            "</strong>",
                            "<br>Deliveries: <strong>$",
                            formatNumber(data[dateRangeString].deliveries),
                            "</strong>",
                            "</div>",
                        ].join("");
                    } else {
                        return [
                            '<div class="hoverinfo">',
                            "<strong>",
                            geo.properties.name + " (" + startYear + ")",
                            "</strong>",
                            "<br>Authorizations: <strong>$",
                            formatNumber(data[startYear].authorizations),
                            "</strong>",
                            "<br>Deliveries: <strong>$",
                            formatNumber(data[startYear].deliveries),
                            "</strong>",
                            "</div>",
                        ].join("");
                    }
                },
            },
            // Defines template of popup that appears when country is hovered over based on filter settings
            popupTemplate: function (geo, data) {
                if (!data) {
                    return;
                }
                if (selectedData === "total") {
                    return [
                        '<div class="hoverinfo">',
                        "<strong>",
                        geo.properties.name + " (1996 - 2020)",
                        "</strong>",
                        "<br>Authorizations: <strong>",
                        formatNumber(data.total.authorizations),
                        "</strong>",
                        "<br>Deliveries: <strong>",
                        formatNumber(data.total.deliveries),
                        "</strong>",
                        "</div>",
                    ].join("");
                } else if (selectedData === dateRangeString) {
                    return [
                        '<div class="hoverinfo">',
                        "<strong>",
                        geo.properties.name +
                            " (" +
                            startYear +
                            " - " +
                            endYear +
                            ")",
                        "</strong>",
                        "<br>Authorizations: <strong>",
                        formatNumber(data[dateRangeString].authorizations),
                        "</strong>",
                        "<br>Deliveries: <strong>",
                        formatNumber(data[dateRangeString].deliveries),
                        "</strong>",
                        "</div>",
                    ].join("");
                } else {
                    return [
                        '<div class="hoverinfo">',
                        "<strong>",
                        geo.properties.name + " (" + startYear + ")",
                        "</strong>",
                        "<br>Authorizations: <strong>",
                        formatNumber(data[startYear].authorizations),
                        "</strong>",
                        "<br>Deliveries: <strong>",
                        formatNumber(data[startYear].deliveries),
                        "</strong>",
                        "</div>",
                    ].join("");
                }
            },
        });
    }

    /*----------------------------------------------- Component Render -----------------------------------------------*/

    // Creates div React component which is used by Datamaps above as the container for the map
    render() {
        return <div id="heat_map"></div>;
    }
}
