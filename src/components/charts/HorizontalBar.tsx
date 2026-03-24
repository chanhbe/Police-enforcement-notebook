import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface HorizontalBarProps {
  data: { label: string; value: number }[];
}

export default function HorizontalBar({ data }: HorizontalBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef       = useRef<SVGSVGElement>(null);
  const tooltipRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg  = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const W      = containerRef.current?.clientWidth ?? 420;
    const rowH   = 34;
    const margin = { top: 4, right: 72, bottom: 16, left: 40 };
    const width  = W - margin.left - margin.right;
    const height = data.length * rowH;

    svg.attr('width', W).attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)! * 1.12])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, height])
      .padding(0.3);

    g.append('g')
      .call(d3.axisLeft(y).tickSize(0))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('text')
        .attr('fill', '#6b7280').attr('font-size', '12px').attr('dx', '-4px'));

    const tooltip = d3.select(tooltipRef.current);
    const maxVal  = d3.max(data, d => d.value) ?? 1;

    g.selectAll('.hbar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'hbar')
      .attr('y',      d => y(d.label)!)
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('width',  d => x(d.value))
      .attr('fill',   d => d3.interpolateBlues(0.35 + 0.55 * (d.value / maxVal)))
      .attr('rx', 3)
      .style('cursor', 'pointer')
      .on('mouseover', function (_, d) {
        d3.select(this).attr('opacity', 0.8);
        tooltip.style('opacity', '1').html(`
          <div style="font-size:10px;color:rgba(255,255,255,0.5);margin-bottom:3px">${d.label}</div>
          <div style="font-size:13px;font-weight:600;color:#fff">${d3.format(',.0f')(d.value)}</div>
        `);
      })
      .on('mousemove', function (event) {
        const [mx, my] = d3.pointer(event, svgRef.current);
        tooltip.style('left', `${mx + 10}px`).style('top', `${my - 28}px`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
        tooltip.style('opacity', '0');
      });

    g.selectAll('.val-label')
      .data(data)
      .enter().append('text')
      .attr('x',  d => x(d.value) + 5)
      .attr('y',  d => (y(d.label) ?? 0) + y.bandwidth() / 2 + 4)
      .attr('fill', '#6b7280').attr('font-size', '11px')
      .attr('font-family', 'Inter, sans-serif')
      .text(d => d3.format(',.0f')(d.value));

  }, [data]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <svg ref={svgRef} style={{ display: 'block', width: '100%' }} />
      <div ref={tooltipRef} className="d3-tooltip" />
    </div>
  );
}