'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tooltip } from '@/components/ui/tooltip'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { DASHBOARD_STATS } from './utils/config'

export default function Home() {
  return (
    <div className="w-full flex flex-col px-4 md:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <Label htmlFor="Dashboard" className="text-lg font-semibold tracking-tight text-primary">
          Dashboard
        </Label>
      </div>

      <div className="flex flex-col gap-4">
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grid-flow-row auto-rows-min">
          <>
            {DASHBOARD_STATS.stats.map((eachStat, index: number) => (
              <Card key={index}>
                <CardHeader className="px-4">
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-sm">{eachStat.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4">
                  <CardTitle className="text-xl">{eachStat.value}</CardTitle>
                  <CardDescription>{eachStat.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Detailed Analytics</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer height={300}>
              <BarChart
                data={DASHBOARD_STATS.detailedStats.data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="2 2" stroke="var(--border)" />{' '}
                <XAxis dataKey="name" stroke="var(--foreground)" />{' '}
                <YAxis stroke="var(--foreground)" />
                <Tooltip />
                <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
                <Bar dataKey="Revenue" fill="#000000" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
