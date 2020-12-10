import React from "react";
import "./DropDown.css";

export default function DropDown({ label, name, setYear }) {
    function handleSelection(e) {
        if (e.target.value === "NaN") setYear(NaN);
        else setYear(e.target.value);
    }

    return (
        <div className="filter-dropdown">
            <label className="filter-label" htmlFor={name}>
                {label}
            </label>
            <select
                className="filter-selector"
                id={name}
                name={name}
                onChange={(e) => handleSelection(e)}
            >
                <option value="NaN">Date</option>
                <option value="1996">1996</option>
                <option value="1997">1997</option>
                <option value="1998">1998</option>
                <option value="1999">1999</option>
                <option value="2000">2000</option>
                <option value="2001">2001</option>
                <option value="2002">2002</option>
                <option value="2003">2003</option>
                <option value="2004">2004</option>
                <option value="2005">2005</option>
                <option value="2006">2006</option>
                <option value="2007">2007</option>
                <option value="2008">2008</option>
                <option value="2009">2009</option>
                <option value="2010">2010</option>
                <option value="2011">2011</option>
                <option value="2012">2012</option>
                <option value="2013">2013</option>
                <option value="2014">2014</option>
                <option value="2015">2015</option>
                <option value="2016">2016</option>
                <option value="2017">2017</option>
                <option value="2018">2018</option>
                <option value="2019">2019</option>
                <option value="2020">2020</option>
            </select>
        </div>
    );
}
