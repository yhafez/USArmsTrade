import React from "react";
import DropDown from "./DropDown";
import "./FilterUI.css";

export default function FilterUI({ setDataType, setStartYear, setEndYear }) {
    function handleChange(e) {
        setDataType(e.target.value);
    }
    return (
        <div id="filter-ui" styling="width: 100%">
            <h3 id="filter-header"> Filter </h3>
            <div className="filter-options">
                <div id="data-type-filter">
                    <h3 id="data-type-header">Data Type</h3>
                    <div className="data-type-options">
                        <div>
                            <input
                                type="radio"
                                className="data-radio"
                                id="authorizations-radio"
                                name="data-type"
                                value="authorizations"
                                onChange={handleChange}
                            />
                            <label htmlFor="data-type" className="radio-labels">
                                Authorizations
                            </label>
                        </div>

                        <div>
                            <input
                                type="radio"
                                className="data-radio"
                                id="deliveries-radio"
                                name="data-type"
                                value="deliveries"
                                defaultChecked
                                onChange={handleChange}
                            />
                            <label htmlFor="data-type" className="radio-labels">
                                Deliveries
                            </label>
                        </div>
                    </div>
                </div>

                <div id="date-range">
                    <h3 id="date-range-header">Date Range</h3>
                    <div id="date-range-options">
                        <DropDown
                            label="From: "
                            name="Start-Date"
                            setYear={setStartYear}
                        />
                        <DropDown
                            label="To: "
                            name="End-Date"
                            setYear={setEndYear}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
