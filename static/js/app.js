
d3.json("samples.json").then(function(data){
    samples = data.samples;
    names = data.names;
    metadata = data.metadata;
    console.log(names);
    console.log(samples);
    console.log(metadata);
    d3.select("select")
    .selectAll("option")
    .data(names)
    .enter()
    .append("option")
    .text(function(d){return d});
    buildplots(940);
});


          
function optionChanged(){
    var subject = d3.select("#selDataset").node().value;
    console.log(subject)
    buildplots(subject)
};

function buildplots(subject) {
    //filters the samples based on selection
    var subjectSamples = samples.filter(function(sample){
       return sample.id == subject
    });

    subjectSamples = subjectSamples[0]

    console.log(subjectSamples)

    //selects relevant categories from the subject
    var sampleValues = subjectSamples.sample_values;
    
    var otuIds = subjectSamples.otu_ids;
    

    var otuLabels = subjectSamples.otu_labels;
    

    //constructs bar plot
    var topsampleValues = sampleValues.slice(0,10);

    var topotuIds = otuIds.slice(0,10);
    topotuIds = topotuIds.map(row => 'OTU' + row)
    var topotuLabels = otuLabels.slice(0,10);

    console.log(topsampleValues)
    console.log(topotuIds)

    var data = [{
        type:'bar',
        x:topsampleValues,
        y:topotuIds,
        text:topotuLabels,
        orientation:"h"
    }];

    var layout = {
        title:`Top 10 OTUs found in ${subject}`
    }

    Plotly.newPlot("bar", data, layout);

    //contructs bubble chart
    var trace1 = {
        x: otuIds,
        y: sampleValues,
        mode: 'markers',
        marker: {
            color:otuIds,
            size: sampleValues.map(i =>i*0.5)
        },
        text:otuLabels
      };
      
      var data = [trace1];
      
      var layout = {
        title: `Bubble Chart for ${subject}`,
        showlegend: false,
        };
      
      Plotly.newPlot('bubble', data, layout);
    
    //fill dempgraphic info
    var subjectMetadata = metadata.filter(function(meta){
        return meta.id == subject
     });
     subjectMetadata = subjectMetadata[0]
     console.log(subjectMetadata)

     var metaEle = document.getElementById('sample-metadata')
     metaEle.innerHTML = `ID: ${subjectMetadata.id}<br>
                          bbtype: ${subjectMetadata.bbtype}<br>
                          age: ${subjectMetadata.age}<br>
                          ethnicity: ${subjectMetadata.ethnicity}<br>
                          gender: ${subjectMetadata.gender}<br>
                          location: ${subjectMetadata.location}<br>
                          wfreq: ${subjectMetadata.wfreq}`;
};
