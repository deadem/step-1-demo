import { UserStore } from '../store/Interface';
import { API } from './API';
import { convertFromAPI, convertToAPI } from './Convert';
import { APIUserData } from './Interface';
import { userConverter } from './UserConverter';

export type ProfileData = {
  name: string;
  surname: string;
  nick: string;
  login: string;
  email: string;
  phone: string;
};

export class UserAPI extends API {
  constructor() {
    super('/user');
  }

  updateAvatar(file: File) {
    const data = new FormData();
    data.append('avatar', file);
    return this.transport().put<APIUserData>('/profile/avatar', { data }).then(data => this.convert(data));
  }

  updateProfile(props: ProfileData) {
    const data = convertToAPI<Omit<APIUserData, 'id' | 'avatar'>>()(props, userConverter);
    return this.transport().put<APIUserData>('/profile', { data }).then(data => this.convert(data));
  }

  updatePassword(password: string, newPassword: string) {
    return this.transport().put('/password', { data: { oldPassword: password, newPassword } });
  }

  findUser(name: string) {
    return this.transport().post<Array<{ id: number; login: string; }>>('/search', { data: { login: name } }).then((list) => {
      const user = list.find(value => value.login == name);
      if (!user) {
        throw new Error('Can\'t find user');
      }
      return user.id;
    });
  }

  private convert(data: APIUserData) {
    return convertFromAPI<UserStore>()(data, userConverter);
  }
}
