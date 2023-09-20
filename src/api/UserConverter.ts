// Поля в конвертере должны совпадать с полями в API, а значения - с полями в приложении
// Проверка на соответствие происходит в момент конвертации
export const userConverter = {
  id: 'userId',
  first_name: 'name',
  second_name: 'surname',
  display_name: 'nick',
  login: 'login',
  avatar: 'avatar',
  email: 'email',
  phone: 'phone',
  password: 'password',
} as const;
