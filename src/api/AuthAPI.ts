import { UserStore } from '../store/Interface';
import { APISignupData, APIUserData } from './Interface';
import { API } from './API';
import { convertFromAPI, convertToAPI } from './Convert';
import { userConverter } from './UserConverter';

export type SignupData = {
  name: string;
  surname: string;
  login: string;
  email: string;
  phone: string;
  password: string;
};

export class AuthAPI extends API {
  constructor() {
    super('/auth');
  }

  public userData() {
    return this.transport().get<APIUserData>('/user').then(data => convertFromAPI<UserStore>()(data, userConverter));
  }

  public signup(data: SignupData) {
    return this.transport().post<{ id: number }>('/signup', { data: convertToAPI<APISignupData>()(data, userConverter) });
  }

  public signin(login: string, password: string) {
    return this.transport().post('/signin', { data: { login, password } });
  }

  public logout() {
    return this.transport().post('/logout');
  }
}
