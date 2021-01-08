import {Injectable} from '@angular/core';

@Injectable()
export class FlashTools {
  private listeners: {[key: string]: FlashMessageListener[]};
  private _functionName: string | null = null;
  private messagesToSend: any[] = [];

  constructor() {
    this.functionName = 'ngRoomplanMessage';
    this.listeners = {};
    if (window.addEventListener) {
      window.addEventListener('message', this.onMessage.bind(this), false);
    } else {
      (window as any).attachEvent('onmessage', this.onMessage.bind(this));
    }
  }

  get functionName(): string {
    return this._functionName || '';
  }

  set functionName(functionName: string) {
    this._functionName = functionName;
    while (this.messagesToSend.length > 0) {
      const data: any = this.messagesToSend.shift();
      this.postMessage(data);
    }
  }

  /**
   * Sends a message to flex
   * @param {any} data Data to be sent
   * @param {string} functionName Used functionName parameter, if null, it will use the default
   */
  postMessage(data: any, functionName: string | null = null) {
    if (!functionName && !this.functionName) {
      this.messagesToSend.push(data);
    } else {
      if (!functionName) {
        functionName = this.functionName;
      }
      const obj: { functionName: string, data: any } = {
        functionName,
        data
      };
      parent.postMessage(obj, '*');
    }
  }

  /**
   * PostMessage event handler
   * @param {GeneralObject} message Message object
   */
  onMessage(message) {
    const msgData = message.data;
    if (msgData.method in this.listeners) {
      const permanentListeners: FlashMessageListener[] = [];
      this.listeners[msgData.method].forEach((funcObj) => {
        funcObj.callback(msgData.data);
        if (funcObj.permanent) {
          permanentListeners.push(funcObj);
        }
      });
      this.listeners[msgData.method] = permanentListeners;
    }
  }

  /**
   * Add event listeners to a specified type of message
   * @param {string} eventType Message type
   * @param {Function} callback Callback function
   * @param {boolean} permanent If the listener should stay after the first message
   */
  listenTo(eventType: string, callback: Function, permanent: boolean = false) {
    if (!(eventType in this.listeners)) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push({
      callback,
      permanent
    });
  }
}

export interface FlashMessageListener {
  callback: Function;
  permanent: boolean;
}
