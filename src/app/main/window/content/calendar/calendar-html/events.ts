export interface UpdateRoomplanEvent {
  name: 'updateRoomplanWindows';
}

export interface MoveToRoomplanEvent {
  name: 'moveToRoomplan';
  data: {
    arrivalDate: Date;
    id: number;
    type: string;
  };
}

export interface StartLoadingAnimationRoomplanEvent {
  name: 'startLoadingAnimationRoomplan';
}

export interface ShowRoomplanMessageEvent {
  name: 'showRoomplanMessage';
  data: string;
}

export interface SendToRoomplanEvent {
  name: 'sendToRoomplan';
  data: {
    method: string;
    object: unknown;
  };
}
