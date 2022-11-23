import { FC } from 'react';
import { Area, Line, ResponsiveContainer, XAxis, Tooltip, YAxis, CartesianGrid, AreaChart } from 'recharts';

interface Props {
  data: any;
  compareData?: any;
}

const roundTen = (num: number) => Math.round(num / 10) * 10;

const ELOChart: FC<Props> = ({ data, compareData }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart margin={{ right: 20 }}>
        <defs>
          <linearGradient id="colorView" x1="0" y1="0" x2="0" y2="1">
            <stop offset="30%" stopColor="#000" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#eee" strokeDasharray="2 2" horizontal />
        <Area
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          data={data}
          type="monotone"
          isAnimationActive={false}
          dataKey="userElo"
          stroke="#000000"
          strokeWidth="2px"
          dot={false}
          fill="url(#colorView)"
        />
        {compareData && (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <Area data={compareData} type="monotone" dataKey="userElo" stroke="#FF0000" strokeWidth="2px" dot={false} />
        )}
        <XAxis
          dataKey="unixTime"
          tick={false}
          // name="time"
          // allowDuplicatedCategory={false}
          // type="number"
          // domain={[(dataMin: number) => dataMin, (dataMax: number) => dataMax]}
        />
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
      </AreaChart>
    </ResponsiveContainer>
  );
};

const tooltipContent: FC = (tooltipProps: any) => {
  return (
    <div className="z-100 bg-black text-white rounded-md p-2">
      <p className="text-xs">
        {tooltipProps?.payload?.[1] && 'Your '}ELO: {tooltipProps?.payload?.[0]?.payload?.userElo}
      </p>
      {tooltipProps?.payload?.[1] && (
        <p className="text-xs">Their ELO: {tooltipProps?.payload?.[1]?.payload?.userElo}</p>
      )}
    </div>
  );
};

export default ELOChart;
