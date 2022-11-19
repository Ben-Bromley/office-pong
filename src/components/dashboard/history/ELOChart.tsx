import { Match } from '@prisma/client';
import { FC, useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip, YAxis, CartesianGrid } from 'recharts';

interface Props {
  data: Match[] | undefined;
}

const ELOChart: FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ right: 20 }}>
        <CartesianGrid stroke="#eee" strokeDasharray="2 2" horizontal />
        <Line type="monotone" dataKey="userElo" stroke="#000000" strokeWidth="2px" />
        <XAxis tick={false} />
        <YAxis
          tickCount={15}
          // Slate 400
          tick={{ fill: '#000000' }}
          domain={[(dataMin: number) => dataMin - 25, (dataMax: number) => dataMax + 25]}
        />
        <Tooltip labelFormatter={() => 'ELO'} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ELOChart;
