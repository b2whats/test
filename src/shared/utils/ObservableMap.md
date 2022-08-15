# ObservableMap

Наблюдаемый `Map`
Интерфейс такой же как у нативной реализации, но имеет дополнительные методы


## subscribe
```ts
subscribe(cb: (event: ObservableMapEvent) => void, deps: string[])
```

Позволяет подписаться на изменение сущности
```ts
const entity = new ObservableMap()

const unsubscribe = entity.subscribe((event) => console.log(event.type))
```

При изменении сущности будут вызваны все наблюдатели, в аргументы придет объект содержащий следующие поля в зависимости от произошедшего события:
```ts
type SetEvent<K, V> = {
  key: K
  type: 'set'
  oldValue: V | undefined
  value: V
}

type DeleteEvent<K, V> = {
  key: K
  type: 'delete'
  oldValue: V | undefined
}

type ClearEvent<K> = {
  keys: K[]
  type: 'clear'
}
```

Метод возвращает функцию позволяющую отписаться от наблюдаемой сущности

Если вторым аргументом переданы зависимости от ключей, событие будет вызываться только тогда, когда измененные ключи будут соответствовать массиву зависимостей
```ts
const entity = new ObservableMap()

const unsubscribe = entity.subscribe((event) => console.log(event.type), ['a', 'b'])
```


## unsubscribe
```ts
unsubscribe(cb: (event: ObservableMapEvent) => void)
```

Отмена подписки, важно передавать ссылку на наблюдателя с помощью которого происходила подписка
```ts
const entity = new ObservableMap()
const observer = (event: ObservableMapEvent) => console.log(event.type)
entity.subscribe(observer)
entity.unsubscribe(observer)
```

## toJson
```ts
toJson()
```

Сериализует сущность в массив с типом `IterableIterator<[K, V]>`
```ts
const entity = new ObservableMap()
entity.set(1,1)
entity.set(2,2)
entity.toJson() // --> [[1,1], [2,2]]
```

## toString
```ts
toString()
```
Сериализует сущность в строку, вызывая перед этим метод `toJson`

## fromString
```ts
fromString(data: string)
```
Позволяет заполнить объект значениями из строки, структура десирализованной строки должна иметь вид `Iterable<[K, V]>`
```ts
const entity = new ObservableMap()
entity.fromString('[[1,1], [2,2]]')
```
