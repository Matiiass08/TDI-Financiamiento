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
    <section className="card p-4 sm:p-5">
      <h2 className="font-semibold mb-3">Distribución por categoría</h2>
      <div className="flex flex-col gap-4 sm:h-72 sm:flex-row sm:gap-6">
        <div className="h-64 flex-1 sm:h-auto">
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

        {chartType === 'pie' && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-neutral-700 dark:text-neutral-200 sm:flex sm:w-48 sm:flex-col sm:justify-start sm:gap-0">
            <div className="font-semibold mb-1">%</div>
            {data.map((d, i) => {
              const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : '0.0'
              return (
                <div key={d.key} className="flex items-center justify-between gap-2 sm:mb-1">
                  <div className="flex min-w-0 items-center gap-1">
                    <div
                      className="h-3 w-3 shrink-0 rounded-sm"
                      style={{ backgroundColor: d.fill }}
                    ></div>
                    <span className="truncate" title={d.name}>
                      {d.name}
                    </span>
                  </div>
                  <span className="shrink-0">{pct}%</span>
                </div>
              )
            })}
            <div className="col-span-2 mt-2 flex justify-between border-t border-gray-200 pt-1 font-medium dark:border-neutral-700">
              <span>Total</span>
              <span>{pctTotal}%</span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
