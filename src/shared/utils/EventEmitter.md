# Event Emitter

Менеджер событий, аналог https://nodejs.org/api/events.html

Текущая реализация имеет минимально необходимый api для работы с событиями

```ts
interface EventEmitter<Events extends Record<string, Function>> {
  on(event: keyof Events, fn: (...args: any[]): void): this
  once(event: keyof Events, fn: (...args: any[]): void): this
  off(event: keyof Events, fn: (...args: any[]): void): this
  emit(event: keyof Events, ...args: any[]): void
}
```

## Простое использование

Для начала нужно создать тип событий, который будет использован при дальнейшей инициализации Event Emitter

```ts
type Events = {
  'module.change': (key: string, value: any) => void
  'module.delete': (key: string) => void
}
```

Далее инициализируем класс
```ts
const emitter = new EventEmitter<Events>()
```

Теперь мы можем подписываться на события, система типов не даст нам подписаться на неправильное событие

```ts
emitter.on('module.change', (key, value) => { console.log(key, value)})
emitter.on('module.delete', (key) => { console.log(key, value)})

emitter.emit('module.change', 'prop', 'value')
emitter.emit('module.delete', 'prop')
```

При вызове метода `emit` будут обработаны все слушатели данного события и вызваны все функции относящиеся к событию, вызов происходит асинхронно.
Если необходим асинхронный вызов не блокирующий поток, можно обернуть вызов в `requestAnimationFrame` или `setTimeout`

```ts
emitter.on('module.change', (key, value) => {
  setTimeout(() => {
    console.log(key, value)
  }, 1000)
})
```

## События по маске
События можно группировать используя разделитель -  `.`
В случае когда нам нужно подписаться на несколько событий из группы мы должны использовать сопоставление по маске `*`, но тогда сигнатура подписки меняется, первым аргументом всегда будет имя произошедшего события, далее все остальные параметры

```ts
emitter.on('module.change', (key, value) => { console.log(key, value)})
emitter.on('module.delete', (key) => { console.log(key, value)})

// Подписка по маске
emitter.on('module.*', (event, key, value) => { console.log(event, key, value)})
```
В данном случае мы подписываемся на все события которые начинаются на `module` и содержат один любой последующий сегмент
Подписки на события `module.change.type`, `module` вызваны не будут

Для того что бы подписаться на все события в определенной группе можно использовать мульти-маску

```ts
emitter.on('module.**', (event, key, value) => { console.log(event, key, value)})
```
Будут обработаны все события входящие в сегмент `module`, с любым уровнем вложенности, такие как `module.change.type`, `module.change.another.level`