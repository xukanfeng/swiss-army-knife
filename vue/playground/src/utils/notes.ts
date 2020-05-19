console.log('[ enter notes.ts... ]')

let x: [string, number]
x = ['hello', 10]
// x[2] = 'world'
console.log(x)

// 返回 never 的函数必须存在无法到达的终点
/*
function error(message: string): never {
  throw new Error(message)
}

function infiniedLoop(): never {
  while(true) {}
}
*/

// 类型断言
/*
let someValue: any = 'this is a string'
let strLength: number = (someValue as string).length
*/

type C = {a: string, b?: number}
let c: C = {a: 'hello'}
console.log(c)

interface SquareConfig {
  color?: string;
  width?: number;
  [propsName: string]: any; // 字符串索引签名，处理额外属性检查
}
function createSquare(config: SquareConfig): {color: string; area: number} {
  let square = {color: 'white', area: 100}
  if( config.color ) {
    square.color = config.color
  }
  if( config.width ) {
    square.area = config.width * config.width
  }
  return square
}
let square = createSquare({ width: 20, opacity: 0.5 })
console.log(square)

// 函数类型
interface SearchFunc {
  (source: string, subString: string): boolean;
}
let mySearch: SearchFunc = function(src: string, sub: string): boolean {
  let result = src.search(sub)
  return result > -1
}
mySearch('hello world', 'hello')

// 可索引的类型
interface StringArray {
  readonly [index: number]: string;
}
let myArray: StringArray = ['hello', 'world']
console.log(myArray[1])

interface NumberDictionary {
  [index: string]: number;
  boo: number;
  // boo: string; // error
}
let dic: NumberDictionary = { a: 1, b: 2, boo: 5}
console.log(dic.boo)

// 类类型
interface ClockConstructor{
  new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
  hour: number;
  minute: number;
  tick(): void;
}
function createClock(clockConstructor: ClockConstructor, h: number, m: number): ClockInterface {
  return new clockConstructor(h, m)
}
class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) {
    this.hour = h
    this.minute = m
  }
  hour: number
  minute: number
  tick() {
    console.log('beep beep ' + this.hour + ':' + this.minute)
  }
}
class AnalogClock implements ClockInterface {
  constructor(h: number, m: number) {
    this.hour = h
    this.minute = m
  }
  hour: number
  minute: number
  tick() {
    console.log('tick tock ' + this.hour + ':' + this.minute)
  }
}
createClock(DigitalClock, 11, 11).tick() // 不懂
createClock(AnalogClock, 22, 22).tick()

// 继承接口
// 混合类型
// 接口继承类

class Greeter {
  static standardGreeting = "Hello, there"
  greeting: string
  constructor(greeting: string) {
    this.greeting = greeting
  }
  greet() {
    if (this.greeting) {
      return 'Hello, ' + this.greeting
    }
    else {
      return Greeter.standardGreeting
    }
  }
}
let greeter1: Greeter = new Greeter('world')
console.log(greeter1.greet())

console.log(typeof Greeter)
let greetMaker: typeof Greeter = Greeter
greetMaker.standardGreeting = "Hey there"

let greeter2: Greeter = new greetMaker('aaa')
console.log(greeter2.greet())


interface Card {
  suit: string;
  card: number;
}

interface Deck {
  suits: string[];
  cards: number[];
  createCard(this: Deck): () => Card;
}

let deck: Deck = {
  suits: ['heart', 'spade', 'clubs', 'diamond'],
  cards: Array(52),
  createCard(this: Deck) {
    return () => {
      let suit = this.suits[Math.floor(Math.random() * 4)]
      let card = this.cards[Math.floor(Math.random() * 13) * 4]
      return {suit, card}
    }
  }
}
let picker = deck.createCard()
console.log(picker())

function extend<T, U>(first: T, second: U): T & U {
  let result = <T & U>{}
  for (let id in first) {
    (<any>result)[id] = (<any>first)[id]
  }
  for (let id in second) {
    // if (!(result as Object).hasOwnProperty(id)) {
      (<any>result)[id] = (<any>second)[id]
    // }
  }
  return result
}

class Person {
  name: string
  constructor(name: string) { this.name = name }
}
interface Loggeable {
  log(): void;
}
class ConsoleLogger implements Loggeable {
  log() {
    console.log('console log')
  }
}
var jim = extend(new Person('jim'), new ConsoleLogger())
var n = jim.name
console.log(n)
jim.log()


console.log('[ leaving notes.ts... ]')

export default {}
