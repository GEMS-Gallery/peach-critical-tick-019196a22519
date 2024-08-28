export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const LeaderboardEntry = IDL.Record({ 'id' : IDL.Text, 'time' : IDL.Nat });
  return IDL.Service({
    'endRace' : IDL.Func([IDL.Text, IDL.Nat], [Result], []),
    'getLeaderboard' : IDL.Func([], [IDL.Vec(LeaderboardEntry)], ['query']),
    'startRace' : IDL.Func([], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
