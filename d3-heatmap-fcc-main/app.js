const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
let data=[]
let baseTemperature;
const width = 1200;
const height = 600;
const padding = 70;
let xScale;
let yScale;
let minYear;
let maxYear;
let svg = d3.select('svg').attr('width',width).attr('height',height);
let tooltip = d3.select('#tooltip')
const fetchData = async () => {
    try{
        const res = await fetch(url);
        const result = await res.json();
        data = result.monthlyVariance;
        baseTemperature=result.baseTemperature;
        console.log('try block',data)
        console.log(baseTemperature)
        
    }catch(error){
        console.log('ERROR',error)
    }
    scales()
    axis()
    plotHeatMap()
    plotLegend()
}

const scales = ()=>{
    xScale=d3.scaleLinear()
    .domain([d3.min(data,d=>d.year),d3.max(data,d=>d.year)+1])
    .range([padding,width-padding]);
    yScale=d3.scaleTime()
           .domain([new Date(0,0,0,0,0,0,0),new Date(0,12,0,0,0,0,0)]).range([padding,height-padding])
}

const axis = () =>{
    let xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format('d'))//convert to integer
    let yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.timeFormat('%B'))
    svg.append('g').call(xAxis).attr('id','x-axis').attr('transform',`translate(0,${height-padding})`)
    svg.append('g').call(yAxis).attr('id','y-axis').attr('transform',`translate(${padding},0)`)
}

const plotHeatMap = () =>{
    console.log('plot block',data)
    svg.selectAll('rect').data(data).enter().append('rect').attr('class','cell')
        .attr('fill',d=>d.variance<=-1?'#118ab2':d.variance<=0?'#06d6a0':d.variance<=1?'#ffd166':'#ef476f')
        .attr('data-year',d=>d.year).attr('data-month',d=>d.month-1).attr('data-temp',d=>d.variance+baseTemperature)
        .attr('height',(height-2*padding)/12)
        .attr('y',d=>yScale(new Date(0,d.month-1,0,0,0,0,0)))
        .attr('width',(width-2*padding)/(d3.max(data,d=>d.year)-d3.min(data,d=>d.year)))//(width-2*padding)/number of years
        .attr('x',d=>xScale(d.year))
        .on('mouseover',d=>{
            tooltip.transition().style('visibility', 'visible')
            const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December']
            tooltip.text(`${monthNames[d.month-1]}, ${d.year}, ${(d.variance+baseTemperature).toFixed(2)}℃`)
            tooltip.attr('data-year',d.year)
        })
        .on('mouseout',d=>{
            tooltip.transition().style('visibility', 'hidden')
        })
    }

const plotLegend = () =>{
    d3.select('#legend').append('rect').attr('x',0).attr('y',0).attr('width',60).attr('height',40).attr('fill','#118ab2')
    d3.select('#legend').append('text').attr('x',0).attr('y',60).text('<7.66℃')
    d3.select('#legend').append('rect').attr('x',60).attr('y',0).attr('width',60).attr('height',40).attr('fill','#06d6a0')
    d3.select('#legend').append('text').attr('x',60).attr('y',60).text('<8.66℃')
    d3.select('#legend').append('rect').attr('x',120).attr('y',0).attr('width',60).attr('height',40).attr('fill','#ffd166')
    d3.select('#legend').append('text').attr('x',120).attr('y',60).text('<9.66℃')
    d3.select('#legend').append('rect').attr('x',180).attr('y',0).attr('width',60).attr('height',40).attr('fill','#ef476f')
    d3.select('#legend').append('text').attr('x',180).attr('y',60).text('>9.66℃')
}
fetchData()



