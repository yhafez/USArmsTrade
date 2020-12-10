import React from "react";
import "./Instructions.css";

function Instructions() {
    return (
        <section className="insructions">
            <h2 className="instructions-title">About This Map</h2>
            <p className="instructions-info">
                This map shows where the US has sold arms from 2000 to 2020.
                Data for Latin America is also available back until 1996. The
                motivation for this application is to represent data regarding
                U.S. arms exports in a simple, intuitive, and flexible format to
                help inform action and activism around U.S. imperialism and
                global militarism, as well as to raise awareness regarding the
                central role of the U.S. in enabling the global arms trade.
            </p>
            <p className="instructions-info">
                All data represents publicly accessible data from the Security
                Assistance Monitor Arms Sales{" "}
                <a
                    target="_blank"
                    href="https://securityassistance.org/arm-sales/"
                    alt="Opens the Security Assistance Monitor Arms Sales database in a new tab"
                >
                    {" "}
                    database
                </a>{" "}
                accessed on December 4th, 2020. As such, countries indicated as
                receiving no arms from the U.S. may or may not have received
                arms whose value has not yet been disclosed or declassified to
                the public, and actual figures across the data may be higher
                than what is shown.
            </p>
            <p className="instructions-info">
                The doughnut chart below shows notifications data divided by
                region rather than country. As opposed to authorizations and
                deliveries, notifications are the amount of sales reported to
                the U.S. congress prior to issuing permits authorizing the
                specified amount of sales.
            </p>
            <h2 className="instructions-title">Using the Map</h2>
            <p className="instructions-info">
                Hover over a country to see the dollar value of the arms that
                those countries were approved for (authorizations) and the value
                of the arms that were actually delivered (deliveries). Clicking
                on a country will also show the data in an alert message. On
                mobile, the data can only be viewed by tapping the country.
            </p>
            <p className="instructions-info">
                The color of the countries visually represent either the amount
                of authorizations or deliveries depending on the "Data Type"
                filter setting. Light gray/purple represent a lower value, and
                dark purple/blue represent a higher value. Solid grey represents
                the U.S. (the arms exporter in this data), as well as any
                countries that have not received arms from the U.S. based on the
                data used.
            </p>
            <p className="instructions-info">
                The "Date Range" filter options can be used to arms export data
                for a particulare date range. To view data for a single year,
                simply select that year in the "From" filter and leave the "To"
                filter on "Date".
            </p>
            <h2 className="instructions-title">Using the Doughnut Chart</h2>
            <p className="instructions-info">
                Hovering over a section of the doughnut chart displays the name
                of the region along with the total value of arms exported by the
                U.S. to that region. Clicking on the name of a region in the key
                will update the graph to display without the data for that
                region and clicking again will restore it. On mobile, viewing
                the data and filtering the regions displayed can be achieved by
                tapping the region on the chart and key respectively.
            </p>
        </section>
    );
}

export default Instructions;
