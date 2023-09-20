import { AuthAPI } from '../api/AuthAPI';
import { ChatAPI } from '../api/ChatAPI';
import { MessagesAPI } from '../api/MessageAPI';
import { UserAPI } from '../api/UserAPI';
import { resourcesPath } from '../api/Resources';
import { NavigateTo } from '../utils/Navigation';
import { AuthStore, Config, Message, Store } from './Interface';
import { Reducers } from './Reducers';

// Создание стора и редьюсеров
export function createStore(get: () => DeepReadonly<Store>, set: (data: Partial<Store>, replace?: boolean) => void): AuthStore & Config & Reducers {
  const userAuth = new Promise<number>((resolve, reject) => {
    const userId = get().userId;
    if (userId) {
      // если авторизация уже пройдена: вернём id
      return resolve(userId);
    }

    new AuthAPI().userData().then((data) => {
      set(data);
      return data.userId;
    }).then(userId => resolve(userId)).catch(e => reject(e));
  });

  let chatMessages: MessagesAPI | undefined;
  const addNewMessages = (chatId: number) => (newMessages: Message[]) => {
    const messages = [ ...(get().messages || []), ...newMessages ];
    messages.sort((a, b) => a.time.getTime() - b.time.getTime());

    // обновим последнюю запись у чата:
    const chats = [ ...(get().chats || []) ];
    const chat = chats.find((chat) => chat.id == chatId);
    if (chat && messages.length) {
      const message = messages[messages.length - 1];
      chat.time = message.time;
      chat.message = message.message;
    }

    set({ messages, chats });
  };

  return {
    userAuth,
    resourcesPath,
    reducers: {
      addChat(name) {
        const chat = new ChatAPI();
        return chat.addChat(name)
          .then(data => Promise.all([ data.id, chat.list() ]))
          .then(([ currentChat, chats ]) => set({ currentChat, chats }));
      },
      addMessage(message) {
        chatMessages?.addMessage(message);
      },
      addUser(name) {
        const currentChat = get().currentChat;
        return new UserAPI().findUser(name)
          .then((userId) => new ChatAPI().addUser(currentChat, userId))
          .then(() => undefined);
      },
      destroyChat() {
        chatMessages?.disconnect();
        chatMessages = undefined;
        set({ currentChat: undefined, messages: [] });
      },
      logout() {
        new AuthAPI().logout()
          .finally(() => set({ userAuth: Promise.reject(), reducers: get().reducers }, true)) // удалить все данные, кроме редьюсеров
          .finally(() => { chatMessages?.disconnect(); chatMessages = undefined; })
          .finally(() => NavigateTo.login());
      },
      removeUser(name) {
        const currentChat = get().currentChat;
        return new UserAPI().findUser(name)
          .then((userId) => new ChatAPI().removeUser(currentChat, userId))
          .then(() => undefined);
      },
      selectChat(id) {
        if (!id || get().currentChat == id) {
          // Если уже отображаем тот же самый чат, ничего не меняем
          return;
        }

        set({ currentChat: id, messages: [] });
        chatMessages?.disconnect();
        new ChatAPI().token(id)
          .then(token => {
            chatMessages = new MessagesAPI(get().userId, token, id, addNewMessages(id));
            chatMessages.connect();
          });
      },
      signin(login, password) {
        const auth = new AuthAPI();
        return auth.signin(login, password)
          .then(() => auth.userData())
          .then(data => set(data))
          .then(() => NavigateTo.chat());
      },
      signup(data) {
        const auth = new AuthAPI();
        return auth.signup(data)
          .then(() => auth.userData())
          .then(data => set(data))
          .then(() => NavigateTo.chat());
      },
      updateAvatar(file) {
        return new UserAPI().updateAvatar(file)
          .then(data => set(data))
          .then(() => undefined);
      },
      updateChatList() {
        if (get().loading?.chats) { // Если данные по чатам уже загружаются - ничего не делаем
          return;
        }
        set({ loading: { ...get().loading, chats: true } });
        new ChatAPI().list()
          .then(chats => {
            set({ chats, loading: { ...get().loading, chats: false } });
            return get().currentChat || chats[0]?.id || 0;
          }).then((id) => get().reducers.selectChat(id));
      },
      updateProfile(data) {
        return new UserAPI().updateProfile(data)
          .then(data => set(data));
      },
      updatePassword(password, newPassword) {
        return new UserAPI().updatePassword(password, newPassword)
          .then(() => undefined);
      },
    }
  };
}
