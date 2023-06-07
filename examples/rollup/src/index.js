import instanciate from "./hello.cpp"

const { factorial } = await instanciate() // Prints "Hello from Cheerp!"
console.log(`factorial(5) = ${factorial(5)}`)
