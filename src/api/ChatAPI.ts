import { APIChatsData } from './Interface';
import { API } from './API';

export class ChatAPI extends API {
  constructor() {
    super('/chats');
  }

  public addChat(name: string) {
    return this.transport().post<{ id: number }>('', { data: { title: name } });
  }

  public addUser(chatId: number, userId: number) {
    return this.transport().put('/users', { data: { users: [ userId ], chatId } });
  }

  public removeUser(chatId: number, userId: number) {
    return this.transport().delete('/users', { data: { users: [ userId ], chatId } });
  }

  public list() {
    return this.transport().get<APIChatsData>('').then(data => {
      return data.map(chat => ({
        id: chat.id,
        name: chat.title,
        avatar: chat.avatar,
        unread: chat.unread_count,
        message: chat.last_message?.content,
        time: chat.last_message ? new Date(chat.last_message.time) : undefined,
      }));
    });
  }

  public token(chatId: number) {
    return this.transport().post<{ token: string}>(`/token/${chatId}`).then(({ token }) => token);
  }
}
