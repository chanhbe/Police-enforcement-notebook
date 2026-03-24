import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface MultiLineChartProps {
  data: any[];
  keys: string[];
}

const COLORS = ['#2563eb','#059669','#d97706','#dc2626','#7c3aed','#0891b2','#be185d','#65a30d'];

export default function MultiLineChart({ data, keys }: MultiLineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef       = useRef<SVGSVGElement>(null);
  const tooltipRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length || !keys.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const W = containerRef.current?.clientWidth ?? 480;
    const margin = { top: 16, right: 80, bottom: 36, left: 50 };
    const width  = W - margin.left - margin.right;
    const height = 280 - margin.top - margin.bottom;

    svg.attr('width', W).attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // ── Scales ──────────────────────────────────────────────
    const allYears = data.map(d => d.year as number);
    const x = d3.scaleLinear()
      .domain([d3.min(allYears)!, d3.max(allYears)!])
      .range([0, width]);

    const allVals = data.flatMap(d => keys.map(k => d[k] ?? 0));
    const y = d3.scaleLinear()
      .domain([0, d3.max(allVals)! * 1.1 || 1])
      .nice()
      .range([height, 0]);

    // ── Grid ────────────────────────────────────────────────
    g.append('g').attr('class', 'grid')
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => '').ticks(4))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('line').attr('stroke', '#e9ecef').attr('stroke-dasharray', '3,4'));

    // ── Axes ────────────────────────────────────────────────
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')).ticks(6).tickSize(0))
      .call(g => g.select('.domain').attr('stroke', '#dee2e6'))
      .call(g => g.selectAll('text').attr('fill', '#9ca3af').attr('font-size', '11px').attr('dy', '1.4em'));

    g.append('g')
      .call(d3.axisLeft(y).ticks(4).tickFormat(d => `${d}%`))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('text').attr('fill', '#6b7280').attr('font-size', '11px'))
      .call(g => g.selectAll('.tick line').remove());

    // ── Lines + Areas ────────────────────────────────────────
    const lineGen = d3.line<any>()
      .defined(d => d.value != null)
      .x(d => x(d.year))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    const areaGen = d3.area<any>()
      .defined(d => d.value != null)
      .x(d => x(d.year))
      .y0(height).y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    keys.forEach((key, i) => {
      const lineData = data.map(d => ({ year: d.year, value: d[key] ?? null }));
      const color    = COLORS[i % COLORS.length];

      g.append('path').datum(lineData)
        .attr('fill', color).attr('fill-opacity', 0.05)
        .attr('d', areaGen);

      g.append('path').datum(lineData)
        .attr('fill', 'none').attr('stroke', color)
        .attr('stroke-width', 2).attr('stroke-linejoin', 'round')
        .attr('d', lineGen);
    });

    // ── Legend (right side) ──────────────────────────────────
    const legX = width + 8;
    keys.forEach((key, i) => {
      const ly = i * 18;
      g.append('rect').attr('x', legX).attr('y', ly).attr('width', 10).attr('height', 3)
        .attr('rx', 2).attr('fill', COLORS[i % COLORS.length]);
      g.append('text').attr('x', legX + 14).attr('y', ly + 5)
        .attr('fill', '#6b7280').attr('font-size', '10px').text(key);
    });

    // ── Crosshair tooltip ────────────────────────────────────
    const tooltip = d3.select(tooltipRef.current);
    const vLine   = g.append('line')
      .attr('y1', 0).attr('y2', height)
      .attr('stroke', '#dee2e6').attr('stroke-width', 1).attr('stroke-dasharray', '4,3')
      .style('opacity', 0);

    g.append('rect')
      .attr('width', width).attr('height', height)
      .attr('fill', 'none').attr('pointer-events', 'all')
      .style('cursor', 'crosshair')
      .on('mousemove', function (event) {
        const [mx] = d3.pointer(event);
        const yr   = Math.round(x.invert(mx));
        const pt   = data.find(d => d.year === yr);
        if (!pt) return;

        vLine.attr('x1', x(yr)).attr('x2', x(yr)).style('opacity', 1);

        const rows = keys.map((key, i) => `
          <div style="display:flex;align-items:center;gap:6px;margin-top:4px">
            <span style="width:7px;height:7px;border-radius:50%;background:${COLORS[i % COLORS.length]};display:inline-block;flex-shrink:0"></span>
            <span style="color:rgba(255,255,255,0.55);min-width:32px;font-size:11px">${key}</span>
            <span style="margin-left:auto;font-weight:600;font-size:12px;color:#fff">${(pt[key] ?? 0).toFixed(2)}%</span>
          </div>`).join('');

        tooltip.style('opacity', '1').html(`
          <div style="font-size:10px;color:rgba(255,255,255,0.4);margin-bottom:2px;text-transform:uppercase;letter-spacing:.06em">Year ${yr}</div>
          ${rows}
        `);

        const absX = x(yr) + margin.left;
        const tipW = 160;
        tooltip
          .style('left', `${absX + 12 + tipW > W ? absX - tipW - 8 : absX + 12}px`)
          .style('top', '20px');
      })
      .on('mouseout', () => {
        vLine.style('opacity', 0);
        tooltip.style('opacity', '0');
      });

  }, [data, keys]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <svg ref={svgRef} style={{ display: 'block', width: '100%' }} />
      <div ref={tooltipRef} className="d3-tooltip" style={{ minWidth: 140 }} />
    </div>
  );
}