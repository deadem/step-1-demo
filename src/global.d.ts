// Модуль, импортированный через ?raw импортируется в виде строки
declare module '*?raw' {
  const content: string;
  export default content;
}

// Импорт картинок
declare module '*.svg' {
  const content: string;
  export default content;
}

// Хелпер для декларации конструктора
// Тут должен быть именно any: TS не умеет выводить конструкторы миксинов для других типов
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

// Хелпер для декларации неизменяемых свойств классов-массивов
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Promise ? T[P] : DeepReadonly<T[P]>
}

// Декларация функции для статических проверок. Сама функция нигде не реализована и никогда не вызывается
declare function staticAssert<T extends true>(): never & T;

// Хелпер, который делает все поля в классе существующими и без undefined/null значений
type NonPartial<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

// Хелпер для описания пустого объекта
type EmptyObject = Record<string, never>;
