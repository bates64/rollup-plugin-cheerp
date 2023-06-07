#include <cheerp/clientlib.h>
#include <iostream>

[[cheerp::jsexport]] int factorial(int n) {
  if (n < 2)
    return 1;
  return n * factorial(n-1);
}

int main() {
  std::cout << "Hello from Cheerp!" << std::endl;
  return 0;
}
