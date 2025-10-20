import { useApp } from '@/store/appStore'
import { categoriaIds, totalVisible } from '@/lib/metrics'
import { categoriaLabel, fmtCLP } from '@/lib/format'
import { META_CLP } from '@/config'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'

const COLORS = ['#11e63fff', '#0a1deaff', '#fcfc1dff', '#fc04a9ff', '#f40a0aff', '#f89d00ff']

export function ChartCard() {
  const { items, chartType } = useApp()

  // Total visible global y porcentaje sobre la meta
  const total = totalVisible(items)
  const pctTotal = ((total / META_CLP) * 100).toFixed(1)

  const data = categoriaIds.map((c, idx) => ({
    key: c,
    name: categoriaLabel[c],
    value: items
      .filter(i => i.visible && i.categoria === c)
      .reduce((a, b) => a + b.montoCLP, 0),
    fill: COLORS[idx % COLORS.length]
  }))

  return (
    <section className="card p-5">
      <h2 className="font-semibold mb-3">Distribución por categoría</h2>
      <div className="h-72 flex gap-6">
        {/* 🎯 Contenedor del gráfico */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'pie' ? (
              <PieChart>
                <Pie
                  dataKey="value"
                  data={data}
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={1}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RTooltip formatter={(v: any, _n: any, p: any) => [fmtCLP(v), p?.payload?.name]} />
              </PieChart>
            ) : (
              <BarChart data={data} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tickFormatter={(v) => fmtCLP(v)} width={90} />
                {/* Tooltip con monto + porcentaje */}
                <RTooltip
                  formatter={(v: any, _n: any, p: any) => {
                    const pct = ((v / total) * 100).toFixed(1) + '%'
                    return [`${fmtCLP(v)} (${pct})`, p?.payload?.name]
                  }}
                />
                <Bar dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* 📊 Leyenda lateral fija con porcentajes */}
        {chartType === 'pie' && (
          <div className="w-48 flex flex-col justify-start text-sm text-neutral-700 dark:text-neutral-200">
            <div className="font-semibold mb-1">%</div>
            {data.map((d, i) => {
              const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : '0.0'
              return (
                <div key={d.key} className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: d.fill }}
                    ></div>
                    <span className="truncate max-w-[7rem]" title={d.name}>
                      {d.name}
                    </span>
                  </div>
                  <span>{pct}%</span>
                </div>
              )
            })}
            <div className="mt-2 pt-1 border-t border-gray-200 dark:border-neutral-700 flex justify-between font-medium">
              <span>Total</span>
              <span>{pctTotal}%</span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
