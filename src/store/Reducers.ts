import { SignupData } from '../api/AuthAPI';
import { ProfileData } from '../api/UserAPI';

export type Reducers = {
  reducers: {
    addChat(name: string): void;
    addMessage(text: string): void;
    addUser(name: string): Promise<void>;
    destroyChat(): void; // Разрушить инфраструктуру чата
    logout(): void;
    removeUser(name: string): Promise<void>;
    selectChat(id: number): void;
    signin(login: string, password: string): Promise<void>;
    signup(data: SignupData): Promise<void>;
    updateAvatar(file: File): Promise<void>;
    updatePassword(password: string, newPassword: string): Promise<void>;
    updateProfile(data: ProfileData): Promise<void>;
    updateChatList(): void;
  }
};
