// Описание типов в сторе
import { Reducers } from './Reducers';

export type Store = AuthStore & Config & UserStore & ChatsStore & Loading & Reducers;

export type AuthStore = {
  userAuth: Promise<number>;
};

export type Config = {
  resourcesPath: string; // Путь к статическим API-ресурсам (файлы, картинки)
}

export type UserStore = {
  userId: number;
  email: string;
  login: string;
  name: string;
  surname: string;
  nick: string;
  avatar: string;
  phone: string;
};

export type Chat = {
  id: number;
  name: string;
  avatar: string;
  unread: number;
  message: string | undefined;
  time: Date | undefined;
};

export type Message = {
  message: string;
  time: Date;
  userId: number;
};

export type ChatsStore = {
  currentChat: number;
  messages: Message[];
  chats: Chat[];
};

export type Loading = {
  loading: {
    chats: boolean;
  }
};
