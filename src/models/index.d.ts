import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum Operation {
  START = "START",
  CHECK = "CHECK"
}

export enum UserStatus {
  UNVERIFIED = "UNVERIFIED",
  INITIAL = "INITIAL",
  AWAITING_VACCINATION = "AWAITING_VACCINATION",
  VACCINATION_CONFIRMED = "VACCINATION_CONFIRMED",
  IMMUNITY_CONFIRMED = "IMMUNITY_CONFIRMED"
}

export declare class GPList {
  readonly StatusCode?: number;
  readonly Result?: (Surgery | null)[];
  constructor(init: ModelInit<GPList>);
}

export declare class Surgery {
  readonly Name?: string;
  readonly Details?: string;
  readonly Link?: string;
  constructor(init: ModelInit<Surgery>);
}

export declare class ChatNextOutput {
  readonly inputText?: string;
  readonly outputText?: string;
  readonly intentName?: string;
  readonly transitions?: (TransitionOutput | null)[];
  readonly action?: string;
  readonly modelField?: string;
  constructor(init: ModelInit<ChatNextOutput>);
}

export declare class TransitionOutput {
  readonly input?: string;
  readonly next?: string;
  constructor(init: ModelInit<TransitionOutput>);
}

export declare class SideEffect {
  readonly createdAt?: string;
  readonly outputText?: string;
  readonly user?: string;
  constructor(init: ModelInit<SideEffect>);
}

export declare class SideEffectDialogState {
  readonly inputText?: string;
  readonly intentName?: string;
  readonly outputText?: string;
  readonly modelField?: string;
  readonly action?: string;
  readonly transitions?: (Transition | null)[];
  constructor(init: ModelInit<SideEffectDialogState>);
}

export declare class Transition {
  readonly input?: string;
  readonly next?: string;
  constructor(init: ModelInit<Transition>);
}

export declare class UserDetails {
  readonly id: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email: string;
  readonly dateOfBirth?: string;
  readonly vaccinationDate?: string;
  readonly postCode?: string;
  readonly typeOfDocument?: string;
  readonly nationality?: string;
  readonly photoUrl?: string;
  readonly userStatus?: UserStatus | keyof typeof UserStatus;
  readonly chatState?: string;
  readonly lastChatDate?: string;
  readonly pushNotificationToken?: string;
  readonly sideEffects?: (SideEffect | null)[];
  readonly sideEffectsDialogState?: SideEffectDialogState;
  readonly isSideEffectScenarioCompleted?: boolean;
  constructor(init: ModelInit<UserDetails>);
  static copyOf(source: UserDetails, mutator: (draft: MutableModel<UserDetails>) => MutableModel<UserDetails> | void): UserDetails;
}

export declare class SideEffects {
  readonly id: string;
  readonly email: string;
  readonly symptomType: string;
  readonly dateTime: string;
  readonly symptomDetails?: string;
  readonly degreeType?: string;
  readonly degreeTypeDetails?: string;
  readonly symptomTime?: string;
  readonly symptomProgress?: string;
  readonly symptomProgressDetails?: string;
  readonly moreDetails?: string;
  readonly isCompleted?: boolean;
  constructor(init: ModelInit<SideEffects>);
  static copyOf(source: SideEffects, mutator: (draft: MutableModel<SideEffects>) => MutableModel<SideEffects> | void): SideEffects;
}