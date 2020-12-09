import React from 'react';
import './Instructions.css';

function Instructions () {
  return (
    <section className="insructions">
      <h1 className="instructions-title">About This Map</h1>
      <p className="instructions-info">
        This map shows where the US has sold arms from 2000 to 2020. Data for Latin America is available backt to 1996. Hover over a country to see the dollar value of the arms that those countries were approved for (authorizations), the value of the arms that were actually delivered (deliveries), and the amount of authorized sales that were formally notified to the U.S. congress (notifications).
      </p>
      <p className="instructions-info">
        The color of the countries visually represent the amounts of authorizations, deliveries, or notifications depending on the filter settings. Light gray/purple represent a lower value, and dark purple/blue represent a higher value. Solid grey represents the U.S. (the arms exporter in this data), as well as any countries that have not received arms from the U.S. based on the data used.
      </p>
      <p className="instructions-info">
        All data represents publicly accessible data from the Security Assistance Monitor Arms Sales <a target="_blank" href="https://securityassistance.org/arm-sales/" alt="Opens the Security Assistance Monitor Arms Sales database in a new tab"> database</a> accessed on December 4th, 2020. As such, countries indicated as receiving no arms from the U.S. may or may not have received arms whose value has not yet been disclosed or declassified to the public, and actual figures across the data may be higher than what is shown.
      </p>
    </section>
  )
}

export default Instructions;
