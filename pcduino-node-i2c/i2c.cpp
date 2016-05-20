#include "Arduino.h"
#include "Wire.h"

void setup() {
  // put your setup code here, to run once:

  Wire.begin();
  
  Wire.beginTransmission(0x20);
  Wire.write((byte)0x12);
  Wire.write((byte) 0x20);
  Wire.endTransmission();
  
  Wire.beginTransmission(0x20);
  Wire.write((byte)0x00);
  Wire.write((byte) 0x00);
  Wire.endTransmission();
}

byte relay = 0;

void loop() {
  Wire.beginTransmission(0x20);
  Wire.write((byte)0x12);
  Wire.write(relay);
  Wire.endTransmission();

  switch (relay) {
    case 0:
      relay = 1;
      break;
  
    default:
      relay = relay << 1;
  }
  delay(100);
}

int main(int argc, char** argv) {
	setup();
	while (true) loop();
}
