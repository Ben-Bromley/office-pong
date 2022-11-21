import { Match } from '@prisma/client';
import { FC, useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip, YAxis, CartesianGrid, TooltipProps } from 'recharts';

interface Props {
  data: Match[] | undefined;
}

const roundTen = (num: number) => Math.round(num / 10) * 10;

const ELOChart: FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ right: 20 }}>
        <CartesianGrid stroke="#eee" strokeDasharray="2 2" horizontal />
        <Line type="monotone" dataKey="userElo" stroke="#000000" strokeWidth="2px" />
        <XAxis tick={false} />
        <YAxis
          tickCount={15}
          tick={{ fill: '#000000' }}
          domain={[(dataMin: number) => roundTen(dataMin) - 10, (dataMax: number) => roundTen(dataMax) + 10]}
        />
        <Tooltip
          labelFormatter={() => 'ELO'}
          cursor={false}
          content={tooltipContent}
          wrapperStyle={{ outline: 'none' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const tooltipContent: FC = (tooltipProps: any) => {
  return (
    <div className="z-100 bg-black text-white rounded-md p-2">
      <p className="text-xs">ELO: {tooltipProps?.payload?.[0]?.payload?.userElo ?? 'Unknown'}</p>
    </div>
  );
};

export default ELOChart;
