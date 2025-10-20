import { useApp } from '@/store/appStore'
import { categoriaIds } from '@/lib/metrics'
import { categoriaLabel, fmtCLP } from '@/lib/format'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const COLORS = ['#11e63fff', '#fcfc1dff', '#0aea3bff', '#fc04a9ff', '#f40a0aff', '#f89d00ff']

export function ChartCard() {
  const { items, chartType } = useApp()

  const data = categoriaIds.map((c, idx) => ({
    key: c,
    name: categoriaLabel[c],
    value: items.filter(i => i.visible && i.categoria === c).reduce((a, b) => a + b.montoCLP, 0),
    fill: COLORS[idx % COLORS.length]
  }))

  return (
    <section className="card p-5">
      <h2 className="font-semibold mb-3">Distribución por categoría</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie dataKey="value" data={data} nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={1}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <RTooltip formatter={(v: any, _n: any, p: any) => [fmtCLP(v), p?.payload?.name]} />
              <Legend />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis tickFormatter={(v) => fmtCLP(v)} width={90} />
              <RTooltip formatter={(v: any, _n: any, p: any) => [fmtCLP(v), p?.payload?.name]} />
              <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  )}