"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import type { TechStack } from "@/types"

interface TechDistributionChartProps {
  items: TechStack[]
}

const CATEGORY_COLORS: Record<string, string> = {
  Kernel: "#3b82f6",
  Driver: "#22c55e",
  RTOS: "#a855f7",
  Yocto: "#f97316",
  Other: "#94a3b8",
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "#22c55e",
  Intermediate: "#eab308",
  Advanced: "#ef4444",
}

const DIFFICULTY_LABELS: Record<string, string> = {
  Beginner: "초급",
  Intermediate: "중급",
  Advanced: "고급",
}

export function TechDistributionChart({ items }: TechDistributionChartProps) {
  if (items.length === 0) return null

  const categoryCount = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1
    return acc
  }, {})

  const categoryData = ["Kernel", "Driver", "RTOS", "Yocto", "Other"]
    .filter((cat) => categoryCount[cat] > 0)
    .map((cat) => ({ name: cat, count: categoryCount[cat] ?? 0 }))

  const difficultyCount = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.difficulty] = (acc[item.difficulty] ?? 0) + 1
    return acc
  }, {})

  const difficultyData = ["Beginner", "Intermediate", "Advanced"]
    .filter((diff) => difficultyCount[diff] > 0)
    .map((diff) => ({
      name: DIFFICULTY_LABELS[diff] ?? diff,
      key: diff,
      count: difficultyCount[diff] ?? 0,
    }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">카테고리별 기술 수</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={categoryData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              formatter={(value) => [`${value}개`, "기술 수"]}
              contentStyle={{ fontSize: 12 }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {categoryData.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] ?? "#94a3b8"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">난이도별 기술 분포</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={difficultyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              formatter={(value) => [`${value}개`, "기술 수"]}
              contentStyle={{ fontSize: 12 }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {difficultyData.map((entry) => (
                <Cell key={entry.key} fill={DIFFICULTY_COLORS[entry.key] ?? "#94a3b8"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
