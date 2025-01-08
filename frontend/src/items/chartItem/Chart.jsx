// * React and Redux:
import React, { useEffect, useContext, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ConsoleContext } from './ChartItem';
import * as d3 from 'd3';
import './chartItem.css';

const Chart = () => {
    const { consoleProps } = useContext(ConsoleContext);
    const chartRef = useRef(null); 
    const containerRef = useRef(null); 
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const deviceType = useSelector((state) => state.deviceType.deviceType);

    const calculateDimensions = () => {
        if (containerRef.current) {
            const { clientWidth } = containerRef.current;
            setDimensions({
                width: clientWidth,
                height: clientWidth,
            });
        }
    };

    useEffect(() => {
        calculateDimensions();
        window.addEventListener('resize', calculateDimensions); 

        return () => {
            window.removeEventListener('resize', calculateDimensions);
        };
    }, [deviceType]);

    useEffect(() => {
        if (dimensions.width === 0 || dimensions.height === 0) return;

        const { width, height } = dimensions;
        const margin = 40;

        const svg = d3.select(chartRef.current)
            .attr('width', width)
            .attr('height', height)

        const xScale = d3.scaleLinear()
            .domain([-500, 500]) 
            .range([margin, width - margin]);

        const yScale = d3.scaleLinear()
            .domain([-500, 500]) 
            .range([height - margin, margin]); 

        const xAxis = d3.axisBottom(xScale).ticks(10); 
        const yAxis = d3.axisLeft(yScale).ticks(10);  

        svg.select('.x-axis')
            .attr('transform', `translate(0, ${yScale(0)})`) 
            .call(xAxis);

        svg.select('.y-axis')
            .attr('transform', `translate(${xScale(0)}, 0)`) 
            .call(yAxis);

        if (!svg.select('.data-point').node()) {
            svg.append('circle')
                .attr('class', 'data-point')
                .attr('r', 5)
                .attr('fill', '#003366');
        }
    }, [dimensions]);

    useEffect(() => {
        const { width, height } = dimensions;
        const margin = 40;

        if (consoleProps.position) {
            const { x, y } = consoleProps.position;

            const xScale = d3.scaleLinear()
                .domain([-500, 500])
                .range([margin, width - margin]);

            const yScale = d3.scaleLinear()
                .domain([-500, 500])
                .range([height - margin, margin]);

            d3.select(chartRef.current)
                .select('.data-point')
                .transition()
                .duration(300)
                .attr('cx', xScale(x)) 
                .attr('cy', yScale(y)); 
        }
    }, [consoleProps, dimensions]);


    return (
        <div
            ref={containerRef}
            style={{
                width: 'calc(100% - 0.25em)', // 20px to zapas na scrollbar
                height: `${dimensions.height}px`, // Dynamiczna wysokość
                borderRadius: '0.5em',
            }}
            className="chart-container"
        >
            <svg ref={chartRef}>
                {/* Oś X */}
                <g className="x-axis"></g>
                {/* Oś Y */}
                <g className="y-axis"></g>
            </svg>
        </div>
    );
};

export default Chart;
