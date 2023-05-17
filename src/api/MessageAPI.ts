const webSocketAPI = 'wss://ya-praktikum.tech/ws/chats/';

import { WSTransport, WSTransportEvents } from '../utils/WSTransport';
import { APIMessageData } from './Interface';
import { Message } from '../store/Interface';

export class MessagesAPI {
  private wsTransport: WSTransport<APIMessageData | APIMessageData[]>;
  private callback: (messages: Message[]) => void;
  private unbindMessages?: () => void;

  constructor(user: number, token: string, chat: number, callback: (messages: Message[]) => void) {
    this.wsTransport = new WSTransport(`${webSocketAPI}${user}/${chat}/${token}`);
    this.callback = callback;
  }

  public connect() {
    const messagesHandler = this.receiveMessages.bind(this);
    this.wsTransport.on(WSTransportEvents.Message, messagesHandler);
    this.unbindMessages = () => {
      // регистрируем "отписывалку" от сообщений
      this.wsTransport.off(WSTransportEvents.Message, messagesHandler);
    };

    return this.wsTransport.connect().then(() => {
      this.wsTransport.send({ content: '0', type: 'get old' });
    }).catch((e) => {
      // Пока что никак не обрабыватываем сообщения об ошибках
      console.error(e);
    });
  }

  public disconnect() {
    this.unbindMessages?.();
    this.wsTransport.close();
  }

  public addMessage(message: string) {
    this.wsTransport.send({ content: message, type: 'message' });
  }

  private receiveMessages(data: APIMessageData | APIMessageData[]) {
    const convert = (message: APIMessageData) => ({
      message: message.content,
      time: new Date(message.time),
      textTime: new Date(message.time).toLocaleString(),
      userId: message.user_id,
    });

    const messages = Array.isArray(data)
      ? data.map(message => convert(message))
      : [ convert(data) ];

    this.callback(messages);
  }
}
