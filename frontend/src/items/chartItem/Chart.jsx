import React, { useEffect, useContext, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ConsoleContext, InputObjectContext } from './ChartItem';
import * as d3 from 'd3';
import './chartItem.css';

const Chart = () => {
    const { consoleProps } = useContext(ConsoleContext);
    const { inputObject } = useContext(InputObjectContext);
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
            .attr('height', height);

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

        svg.selectAll('.data-line').remove();
        svg.selectAll('.data-point').remove();

        const points = inputObject.points.map((point) => ({
            x: parseFloat(point.x * 100),
            y: parseFloat(point.y * 100)
        })) || [];

        svg.append('g')
            .selectAll('line')
            .data(points.slice(1))
            .enter()
            .append('line')
            .attr('class', 'data-line')
            .attr('x1', (d, i) => xScale(points[i].x))
            .attr('y1', (d, i) => yScale(points[i].y))
            .attr('x2', (d) => xScale(d.x))
            .attr('y2', (d) => yScale(d.y))
            .attr('stroke', '#003366')
            .attr('stroke-width', 2);

        svg.append('g')
            .selectAll('circle')
            .data(points)
            .enter()
            .append('circle')
            .attr('class', 'data-point')
            .attr('cx', (d) => xScale(d.x))
            .attr('cy', (d) => yScale(d.y))
            .attr('r', 5)
            .attr('fill', '#003366');

    }, [dimensions, inputObject]);

    useEffect(() => {
        if (!consoleProps.position) return;

        let { angle } = consoleProps;
        if(!angle) angle = 0;
        const angleInRadians = angle * (Math.PI / 180);
        const { width, height } = dimensions;
        const margin = 40;

        const xScale = d3.scaleLinear()
            .domain([-500, 500])
            .range([margin, width - margin]);

        const yScale = d3.scaleLinear()
            .domain([-500, 500])
            .range([height - margin, margin]);

        const svg = d3.select(chartRef.current);

        let sensorPoint = svg.select('.sensor-point');
        let sensorLine = svg.select('.sensor-line');

        if (sensorPoint.empty()) {
            sensorPoint = svg.append('circle')
                .attr('class', 'sensor-point')
                .attr('r', 5)
                .attr('fill', 'red');
        }

        if (sensorLine.empty()) {
            sensorLine = svg.append('line')
                .attr('class', 'sensor-line')
                .attr('stroke', 'red')
                .attr('stroke-width', 2);
        }

        sensorPoint
            .transition()
            .duration(300)
            .attr('cx', xScale(consoleProps.position.x))
            .attr('cy', yScale(consoleProps.position.y));

        sensorLine
            .transition()
            .duration(300)
            .attr('x1', xScale(consoleProps.position.x))
            .attr('y1', yScale(consoleProps.position.y))
            .attr('x2', xScale(consoleProps.position.x + 40 * Math.cos(angleInRadians)))
            .attr('y2', yScale(consoleProps.position.y + 40 * Math.sin(angleInRadians)));

    }, [consoleProps, dimensions]);

    return (
        <div
            ref={containerRef}
            style={{
                width: 'calc(100% - 0.25em)',
                height: `${dimensions.height}px`,
                borderRadius: '0.5em',
            }}
            className="chart-container"
        >
            <svg ref={chartRef}>
                <g className="x-axis"></g>
                <g className="y-axis"></g>
            </svg>
        </div>
    );
};

export default Chart;
