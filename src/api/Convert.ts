// Тип для краткости описания прототипа стора
type StoreBase = Record<string | number, string | number>;

// Конвертер данных из формата данных API в формат стора
export function convertFromAPI<Store extends StoreBase>() {
  // Что тут происходит?
  // Есть три типа:
  // - Store - внутреннее хранилище данных
  // - Resp - данные, которые пришли в ответе сервера
  // - Conv - таблица перекодирования ключей из серверного ответа в ключи для Store.
  // Мы рассчитываем, что типы данных в Store и в Resp совпадают, отличаются только ключи (проверки на совпадение типов сейчас нет, чтобы ещё тут не усложнять)
  // Проверяем только:
  // - в типе Conv описаны ключи из Resp и им сопоставлены ключи из Store. При несовпадении ключей-значений в Conv будет ошибка сборки.
  //
  // Почему вложенная функция: чтобы можно было передать только один аргумент для Store в дженерик, а два других чтобы вывелись сами из аргументов.
  // В TS нельзя передавать только часть типов для дженерика - или все, или ничего (или значение по умолчанию).
  return function<Resp extends object, Conv extends { [keys in keyof Resp]: keyof Store }>(response: Resp, converter: Conv): Store {
    return (Object.entries(response) as [ [keyof Resp, Store[Conv[keyof Resp]]] ]).reduce((store, [ key, value ]) => {
      const storeKey = converter[key];
      if (storeKey) {
        store[storeKey] = value;
      }
      return store;
    }, {} as Store);
  };
}

// Конвертер данных из формата стора в формат API
export function convertToAPI<Resp extends object>() {
  // Тот же самый конвертер с теми же проверками, но в обратную сторону
  return function<Store extends StoreBase, Conv extends { [keys in keyof Resp]: keyof Store }>(store: Store, converter: Conv): Resp {

    const reverseConverter = (Object.entries(converter) as [ [keyof Resp, Conv[keyof Conv] ] ]).reduce((acc, [key, value]) => {
      acc[value] = key;
      return acc;
    }, {} as { [K in Conv[keyof Conv]]: keyof Resp });

    return (Object.entries(store) as [ [Conv[keyof Conv], Resp[keyof Resp] ] ]).reduce((resp, [ key, value ]) => {
      const respKey = reverseConverter[key];
      if (respKey) {
        resp[respKey] = value;
      }
      return resp;
    }, {} as Resp);
  };
}
