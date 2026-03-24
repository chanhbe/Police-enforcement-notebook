import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BarChartProps {
  data: any[];
  dataKey: string;
}

export default function BarChart({ data, dataKey }: BarChartProps) {
  const svgRef     = useRef<SVGSVGElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapRef.current || !data.length) return;

    const totalW = wrapRef.current.clientWidth || 600;
    const margin = { top: 16, right: 24, bottom: 36, left: 64 };
    const width  = totalW - margin.left - margin.right;
    const height = 280 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', totalW)
      .attr('height', height + margin.top + margin.bottom);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.year.toString()))
      .range([0, width])
      .padding(0.22);

    const y = d3.scaleLinear()
      .domain([0, (d3.max(data, d => d[dataKey]) ?? 1) * 1.08])
      .nice()
      .range([height, 0]);

    // Grid
    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(() => ''))
      .call(gg => gg.select('.domain').remove())
      .call(gg => gg.selectAll('line').attr('stroke', '#e8ecf0').attr('stroke-dasharray', '3,3'));

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call(gg => gg.select('.domain').attr('stroke', '#e2e6ed'))
      .call(gg => gg.selectAll('text')
        .attr('font-family', 'Inter,sans-serif').attr('font-size', 11)
        .attr('fill', '#8a97a8').attr('dy', '1.4em'));

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => d3.format(',.0f')(d as number)))
      .call(gg => gg.select('.domain').remove())
      .call(gg => gg.selectAll('.tick line').remove())
      .call(gg => gg.selectAll('text')
        .attr('font-family', 'Inter,sans-serif').attr('font-size', 11).attr('fill', '#8a97a8'));

    const tooltip = d3.select(tooltipRef.current);

    // Bars
    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('x', d => x(d.year.toString())!)
      .attr('y', d => y(d[dataKey]))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d[dataKey]))
      .attr('fill', '#1e40af')
      .attr('rx', 3)
      .attr('opacity', 0.82)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('opacity', 1).attr('fill', '#2563eb');
        tooltip.style('opacity', '1').html(`
          <div style="font-weight:600;color:#0f1923;margin-bottom:3px;">${d.year}</div>
          <div style="color:#4b5a6e;font-size:0.78rem;">
            ${dataKey.replace(/_/g, ' ')}: <b style="color:#0f1923">${d3.format(',.0f')(d[dataKey])}</b>
          </div>
        `);
        const [mx, my] = d3.pointer(event, svgRef.current);
        tooltip.style('left', `${mx + margin.left + 10}px`).style('top', `${my + margin.top - 10}px`);
      })
      .on('mousemove', function (event) {
        const [mx, my] = d3.pointer(event, svgRef.current);
        tooltip.style('left', `${mx + margin.left + 10}px`).style('top', `${my + margin.top - 10}px`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 0.82).attr('fill', '#1e40af');
        tooltip.style('opacity', '0');
      });

  }, [data, dataKey]);

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%' }}>
      <svg ref={svgRef} style={{ display: 'block', width: '100%' }} />
      <div ref={tooltipRef} style={{
        position: 'absolute', opacity: '0', transition: 'opacity 0.12s',
        background: '#fff', border: '1px solid #e2e6ed', borderRadius: 8,
        padding: '8px 12px', pointerEvents: 'none', whiteSpace: 'nowrap',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 10, fontSize: '0.82rem',
      }} />
    </div>
  );
}