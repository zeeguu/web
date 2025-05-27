import { PieChart, Pie, Cell, Tooltip } from 'recharts';

import {zeeguuOrange, zeeguuLightYellow, zeeguuVeryLightOrange} from "../../components/colors"

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
];

const COLORS = [zeeguuOrange, zeeguuLightYellow, zeeguuVeryLightOrange];

export default function PieChartForModal() {
  return (
    <PieChart width={200} height={200}>
      <Pie data={data} dataKey="value" outerRadius={80} fill="#8884d8">
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}