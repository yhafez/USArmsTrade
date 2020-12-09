import React from 'react';
import './Instructions.css';

function Instructions () {
  return (
    <section className="insructions">
      <h1 className="instructions-title">About This Map</h1>
      <p className="instructions-info">This map shows where the US has sold arms from 2000 to now. Hover over a country to see how much those countries were approved for and how much was actually delivered. The color of the country shows how much has been delivered, with light gray/purple having lesser deliveries, and dark purple/blue having more.</p>
    </section>
  )
}

export default Instructions;
