export type APIUserData = {
  avatar: string,
  display_name: string,
  email: string,
  first_name: string,
  id: number,
  login: string,
  phone: string,
  second_name: string,
};

export type APISignupData = {
  email: string,
  first_name: string,
  login: string,
  password: string,
  phone: string,
  second_name: string,
};

export type APIChatsData = Array<{
  id: number,
  title: string,
  avatar: string,
  unread_count: number,
  last_message?: {
    user: {
      first_name: string,
      second_name: string,
      avatar: string;
      email: string;
      login: string;
      phone: string;
    },
    time: string;
    content: string;
  }
}>;

export type APIMessageData = {
  content: string;
  time: string;
  user_id: number;
};
