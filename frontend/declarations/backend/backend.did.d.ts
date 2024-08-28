import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface LeaderboardEntry { 'id' : string, 'time' : bigint }
export type Result = { 'ok' : null } |
  { 'err' : string };
export interface _SERVICE {
  'endRace' : ActorMethod<[string, bigint], Result>,
  'getLeaderboard' : ActorMethod<[], Array<LeaderboardEntry>>,
  'startRace' : ActorMethod<[], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
