import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ComboChartProps {
  data: any[];
  valueKey: string;    // bar = total tests
  rateKey?: string;    // line = positivity % (optional)
}

export default function ComboChart({ data, valueKey, rateKey }: ComboChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef       = useRef<SVGSVGElement>(null);
  const tooltipRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Aggregate by year (sum across jurisdictions)
    const byYear = new Map<number, { total: number; positive: number }>();
    data.forEach(d => {
      const y = d.year as number;
      const prev = byYear.get(y) ?? { total: 0, positive: 0 };
      byYear.set(y, {
        total:    prev.total    + (d[valueKey] ?? 0),
        positive: prev.positive + (d.positive_breath_tests ?? d.positive_drug_tests ?? 0),
      });
    });

    const agg = Array.from(byYear.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([year, v]) => ({
        year,
        total:    v.total,
        rate:     v.total > 0 ? (v.positive / v.total) * 100 : 0,
      }));

    if (!agg.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const W = containerRef.current?.clientWidth ?? 700;
    const margin = { top: 24, right: 56, bottom: 36, left: 64 };
    const width  = W - margin.left - margin.right;
    const height = 320 - margin.top - margin.bottom;

    svg.attr('width', W).attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // ── Scales ──────────────────────────────────────────────
    const x = d3.scaleBand()
      .domain(agg.map(d => d.year.toString()))
      .range([0, width])
      .padding(0.25);

    const yLeft = d3.scaleLinear()
      .domain([0, d3.max(agg, d => d.total)! * 1.1])
      .nice()
      .range([height, 0]);

    const yRight = d3.scaleLinear()
      .domain([0, d3.max(agg, d => d.rate)! * 1.3 || 1])
      .nice()
      .range([height, 0]);

    // ── Grid (left axis) ────────────────────────────────────
    g.append('g').attr('class', 'grid')
      .call(d3.axisLeft(yLeft).tickSize(-width).tickFormat(() => '').ticks(5))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('line').attr('stroke', '#e9ecef').attr('stroke-dasharray', '3,4'));

    // ── Axes ────────────────────────────────────────────────
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call(g => g.select('.domain').attr('stroke', '#dee2e6'))
      .call(g => g.selectAll('text').attr('fill', '#9ca3af').attr('font-size', '11px').attr('dy', '1.4em'));

    g.append('g')
      .call(d3.axisLeft(yLeft).ticks(5).tickFormat(d => d3.format('~s')(d as number)))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('text').attr('fill', '#6b7280').attr('font-size', '11px'))
      .call(g => g.selectAll('.tick line').remove());

    if (rateKey !== undefined || true) {
      g.append('g')
        .attr('transform', `translate(${width},0)`)
        .call(d3.axisRight(yRight).ticks(5).tickFormat(d => `${(d as number).toFixed(1)}%`))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('text').attr('fill', '#2563eb').attr('font-size', '11px'))
        .call(g => g.selectAll('.tick line').remove());
    }

    // ── Tooltip ─────────────────────────────────────────────
    const tooltip = d3.select(tooltipRef.current);

    // ── Bars ────────────────────────────────────────────────
    g.selectAll('.bar')
      .data(agg)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x',      d => x(d.year.toString())!)
      .attr('y',      d => yLeft(d.total))
      .attr('width',  x.bandwidth())
      .attr('height', d => height - yLeft(d.total))
      .attr('fill', '#1a2b4a')
      .attr('rx', 3)
      .attr('opacity', 0.85)
      .style('cursor', 'pointer')
      .on('mouseover', function (_, d) {
        d3.select(this).attr('opacity', 1).attr('fill', '#2563eb');
        tooltip.style('opacity', '1').html(`
          <div style="font-size:10px;color:rgba(255,255,255,0.5);margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em">Year ${d.year}</div>
          <div style="font-size:13px;font-weight:600;color:#fff">${d3.format(',.0f')(d.total)}</div>
          <div style="font-size:11px;color:#93c5fd;margin-top:2px">Positive rate: ${d.rate.toFixed(2)}%</div>
        `);
      })
      .on('mousemove', function (event) {
        const [mx, my] = d3.pointer(event, svgRef.current);
        tooltip.style('left', `${mx + 12}px`).style('top', `${my - 36}px`);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 0.85).attr('fill', '#1a2b4a');
        tooltip.style('opacity', '0');
      });

    // ── Line (positivity rate) ───────────────────────────────
    const lineGen = d3.line<typeof agg[0]>()
      .x(d => x(d.year.toString())! + x.bandwidth() / 2)
      .y(d => yRight(d.rate))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(agg)
      .attr('fill', 'none')
      .attr('stroke', '#38bdf8')
      .attr('stroke-width', 2)
      .attr('stroke-linejoin', 'round')
      .attr('d', lineGen);

    // Dots on line
    g.selectAll('.dot')
      .data(agg)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => x(d.year.toString())! + x.bandwidth() / 2)
      .attr('cy', d => yRight(d.rate))
      .attr('r', 3.5)
      .attr('fill', '#38bdf8')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);

    // ── Legend ───────────────────────────────────────────────
    const leg = svg.append('g').attr('transform', `translate(${margin.left + 8}, 10)`);
    // Bar legend
    leg.append('rect').attr('width', 10).attr('height', 10).attr('rx', 2).attr('fill', '#1a2b4a');
    leg.append('text').attr('x', 14).attr('y', 9).attr('fill', '#374151').attr('font-size', '11px')
      .text('Breath tests');
    // Line legend
    leg.append('line').attr('x1', 100).attr('x2', 116).attr('y1', 5).attr('y2', 5)
      .attr('stroke', '#38bdf8').attr('stroke-width', 2);
    leg.append('circle').attr('cx', 108).attr('cy', 5).attr('r', 3).attr('fill', '#38bdf8');
    leg.append('text').attr('x', 120).attr('y', 9).attr('fill', '#374151').attr('font-size', '11px')
      .text('% positive results');

  }, [data, valueKey]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <svg ref={svgRef} style={{ display: 'block', width: '100%' }} />
      <div ref={tooltipRef} className="d3-tooltip" />
    </div>
  );
}