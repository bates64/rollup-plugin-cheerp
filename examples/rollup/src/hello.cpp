/*
#include <cheerp/clientlib.h>

void webMain() {
  client::console.log("hello.cpp webMain() called");
}

[[cheerp::jsexport]] void hello() {
  client::console.log("Hello, Cheerp!");
}
*/

#include <iostream>

int main() {
  std::cout << "Hello from Cheerp!" << std::endl;
  return 0;
}
