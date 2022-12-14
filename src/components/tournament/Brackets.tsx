import { FC } from 'react';
import { Bracket, IRoundProps, Seed, SeedItem, SeedTeam, IRenderSeedProps } from 'react-brackets';

const rounds: IRoundProps[] = [
  {
    title: 'Round 1',
    seeds: [
      {
        id: '1',
        teams: [
          {
            id: '0970127390123',
            name: 'Magnus Allison'
          },
          {
            id: '070091823908123',
            name: 'Ben Bromley'
          }
        ]
      },
      {
        id: '2',
        teams: [
          {
            id: '0970127390123',
            name: 'John Doe'
          },
          {
            id: '070091823908123',
            name: 'Paul Walkie'
          }
        ]
      }
    ]
  },
  {
    title: 'Round 2',
    seeds: [
      {
        id: '3',
        teams: [
          {
            id: '0970127390123',
            name: 'Magnus Allison'
          },
          {
            id: '070091823908123',
            name: 'Ben Bromley'
          }
        ]
      }
    ]
  }
];

const CustomSeed = ({ seed, breakpoint, roundIndex, seedIndex }: IRenderSeedProps) => {
  // breakpoint passed to Bracket component
  // to check if mobile view is triggered or not

  // mobileBreakpoint is required to be passed down to a seed
  return (
    <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 12 }}>
      <SeedItem>
        <div>
          <SeedTeam style={{ color: 'red' }}>{seed.teams[0]?.name || 'NO TEAM '}</SeedTeam>
          <SeedTeam>{seed.teams[1]?.name || 'NO TEAM '}</SeedTeam>
        </div>
      </SeedItem>
    </Seed>
  );
};

const Brackets: FC = () => {
  return <Bracket rounds={rounds} renderSeedComponent={CustomSeed} />;
};

export default Brackets;
