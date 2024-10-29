// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Operation = {
  "START": "START",
  "CHECK": "CHECK"
};

const UserStatus = {
  "UNVERIFIED": "UNVERIFIED",
  "INITIAL": "INITIAL",
  "AWAITING_VACCINATION": "AWAITING_VACCINATION",
  "VACCINATION_CONFIRMED": "VACCINATION_CONFIRMED",
  "IMMUNITY_CONFIRMED": "IMMUNITY_CONFIRMED"
};

const { UserDetails, SideEffects, GPList, Surgery, ChatNextOutput, TransitionOutput, SideEffect, SideEffectDialogState, Transition } = initSchema(schema);

export {
  UserDetails,
  SideEffects,
  Operation,
  UserStatus,
  GPList,
  Surgery,
  ChatNextOutput,
  TransitionOutput,
  SideEffect,
  SideEffectDialogState,
  Transition
};