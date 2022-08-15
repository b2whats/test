# Observable

Наблюдаемая сущность на которую можно подписаться и получать последовательность событий, сущность является синхронной

Для создания подписки необходимо создать наблюдаемый объект и подписаться на него

```ts
type Event = {
  type: string
  payload: number
}

const observable = new Observable<Event>()

observable.subscribe((event) => {
  console.log(event.type, event.payload)
})

// Создаем событие
observable.emit({
  type: 'change',
  payload: 10
})
```

Типизация конструктора поддерживает вариативныое количество аргументов до `3`
```ts
new Observable<string, string, string>()
new Observable<string, number>()
```

Это позволяет создавать подписку на событие с разным количеством аргументов
```ts
observable.subscribe((arg1, arg2,arg3) => { ... })
```

Очень важно, так как typescript не поддерживает распространение универсальных аргументов, тип создаваемого события имеет другой тип, вариативность достигается за счет кортежей
```ts
const observable3 = new Observable<string, string, string>() // Observable<[string, string, string]>
const observable1 = new Observable<string>() // // Observable<[string]>
```

Будьте внимательный когда типизируете методы которые должны принимать наблюдаемую сущность, обязательно указывайте универсальный аргумент в виде кортежа
```ts
function action(observable: Observable<[string]>) {}
```

