// Select dropdown menu
var dropdownMenu = d3.select("#selDataset");
dropdownMenu.on("change", updatePlotly);

// 1. Set up the dropdown menu
function setOptions() {

    // Fetch data
    d3.json("samples.json").then(data => {

        // Append each persons' id name
        data.names.forEach(name => {
            var option = dropdownMenu.append("option")
                .attr("value", name).text(name);
        });
    });
};

// 2. demographic table function
function demoTable(name) {

    // Fetch data
    d3.json("samples.json").then(data => {

        // select metadata
        var demographics = d3.select("#sample-metadata");

        // clear demo data
        demographics.html("");

        // fill table with demo data
        data.metadata.forEach(person => {
            if (parseInt(person.id) === parseInt(name)) {
                demographics.append("p").html(`
                    id: ${person.id}<br>
                    age: ${person.age}<br>
                    gender: ${person.gender}<br>
                    ethnicity: ${person.ethnicity}<br>
                    location: ${person.location}<br>
                    bbtype: ${person.bbtype}<br>
                    wfreq: ${person.wfreq}<br>
                `);
            };
        });
    });
};

// 3. chart by name function
function plotCharts(name) {

    // demographic table 
    demoTable(name);

    // Fetch data
    d3.json("samples.json").then(data => {

        // for each by name
        data.samples.forEach(sample => {
            if (parseInt(sample.id) === parseInt(name)) {
                
                // bar chart
                var topIds = sample.otu_ids.slice(0,10);
                var topValues = sample.sample_values.slice(0,10);
                var topLabels = sample.otu_labels.slice(0,10);

                var topIdsStr = topIds.map(id => `OTU ${id}`);

                var barData = [{
                    y: topIdsStr,
                    x: topValues,
                    text: topLabels,
                    type: "bar", 
                    orientation: "h",
                    transforms: [{
                        type: 'sort',
                        target: 'y',
                        order: 'descending'
                    }]
                }];

                var barLayout = {
                    height: 300,
                    margin: { t: 60, b: 30 }
                }

                Plotly.newPlot("bar", barData, barLayout);    

                // bubble chart
                var ids = sample.otu_ids;
                var values = sample.sample_values;
                var labels = sample.otu_labels;

                var bubbleData = [{
                    x: ids,
                    y: values,
                    text: labels, 
                    mode: "markers",
                    marker: {
                        color: ids,
                        size: values,
                        colorscale: "Earth"
                    }
                }];

                var bubbleLayout = {
                    xaxis: {title: "OTU ID"},
                    hovermode: "closest", 
                    margin: { t: 80 }
                };

                Plotly.newPlot("bubble", bubbleData, bubbleLayout);                
            };   
        });

    
            
        
    });    
};

// Initial data on page
function init() {
    setOptions();
    plotCharts(940);
};
  
// update plots on name change
function updatePlotly() {
    // change on selected name
    var name = dropdownMenu.property("value");

    // reload plots
    plotCharts(name);
};    

init();