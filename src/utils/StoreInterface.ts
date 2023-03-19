// Описание типов в сторе
export type Store = UserStore & ChatsStore & Loading;

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

export type ChatsStore = {
  currentChat: number;
  messages: Array<{
    message: string;
    time: Date;
    userId: number;
  }>;
  chats: Array<{
    id: number;
    name: string;
    avatar: string;
    unread: number;
    message: string | undefined;
    time: Date | undefined;
  }>;
};

export type Loading = {
  loading: {
    chats: boolean;
  }
};