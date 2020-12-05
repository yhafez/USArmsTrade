import React, {Component} from "react";
import Datamap from 'datamaps/dist/datamaps.world.min.js';
import d3 from 'd3';
import worldJson from './world.topo.json';
import armsSalesTotals from './arms_sales_totals.json';

export default class Heatmap extends Component {


    /*
    totalVAls = [
        {
            "countryName": country,
            "authorization": someNum,
            "deliveries": someNum
            GOAL "fillColor": color
        },
        "countryName":{
            "authorization": someNum,
            "deliveries": someNum
        }
    ]

    dataset = {
        "USA": {
            numberOfThings: value,
            fillColor: paletteScale(value)
        },
    }

    */

    componentDidMount(){

        let maxAuthorizationAmount = 0;
        let maxDeliveryAmount = 0;

        // Loop over dataset, and create object with country name, delivery amount, and authorization amount; find maximum authorization and deliery amount in dataset
        
        let totalVals = armsSalesTotals.reduce((total, yearlySale, index) => {
        
            if (!total[yearlySale.country]){
                const countryName = yearlySale.country;
                total[yearlySale.country] = {"authorizations": JSON.parse(yearlySale.authorizations), "deliveries": JSON.parse(yearlySale.deliveries)};

                if (+yearlySale.authorizations > maxAuthorizationAmount)maxAuthorizationAmount = +yearlySale.authorizations;
                if (+yearlySale.deliveries > maxDeliveryAmount) maxDeliveryAmount = +yearlySale.deliveries;
            }
            else {
                
                total[yearlySale.country].authorizations += JSON.parse(yearlySale.authorizations);
                total[yearlySale.country].deliveries += JSON.parse(yearlySale.deliveries);
                
                if (+yearlySale.authorizations > maxAuthorizationAmount)maxAuthorizationAmount = +yearlySale.authorizations;
                if (+yearlySale.authorizations > maxDeliveryAmount) maxDeliveryAmount = +yearlySale.deliveries;
            }
            return total;
            }, {});

        // Set color scale
        let paletteScaleDeliveries = d3.scale.linear()
            .domain([0, maxDeliveryAmount])
            .range(["rgba(62, 34, 177, 0.05)", "rgba(62, 34, 177, 1)"]);

        let paletteScaleAuthorizations = d3.scale.linear()
        .domain([0, maxAuthorizationAmount])
        .range(["rgba(62, 34, 177, 0.05)", "rgba(62, 34, 177, 1)"]);
    

        // Assign color weight to each country
        for (let country in totalVals){
            
            totalVals[country].deliveryColorValue = paletteScaleDeliveries(totalVals[country].deliveries);
            totalVals[country].authorizationColoration = paletteScaleDeliveries(totalVals[country].authorizations);
        }

        let map = new Datamap({
            element: document.getElementById('heat_map'),
            scope: 'world',
            geographyConfig: {
                popupOnHover: true,
                highlightOnHover: true,
                highlightBorderWidth: 1,
                borderColor: '444',
                dataJson: worldJson,
                populateTemplate: function (geo, data){
                    if(!data){ return; }
                    return [
                        '<div class="hoverinfo">',
                        '<strong>', geo.properties.name, '</strong>',
                        '<br>Total Deliveries: <strong>', data.deliveries, '</strong>',
                        '</div>'].join('')
                }
            },
            fills: {
                HIGH: '#afafaf',
                LOW: '#123456',
                MEDIUM: 'blue',
                UNKNOWN: 'rgb(0,0,0)',
                defaultFill: '#eee'
            },
            data: totalVals,
            setProjection: function (element) {
                let projection = d3.geo.mercator()
                    .center([-106.3468, 68.1304]) // always in [East Latitude, North Longitude]
                    .scale(200)
                    .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
                    
                let path = d3.geo.path().projection(projection);

                return { path: path, projection: projection };
            }
        });
        
    }
    

    render(){
        return(
            <div id="heat_map" style={{
                height: "100%",
                width: "100%",
            }}></div>
        )
    }
}

    //"rgba(62, 34, 177, 0.05)", "rgba(62, 34, 177, 1)"

