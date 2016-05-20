#include <node.h>
#include <v8.h>

#include "Wire.h"

v8::Handle<v8::Value> Init(const v8::Arguments& args) {
  v8::HandleScope scope;

  double relayShieldNum = args[0]->NumberValue();

  Wire.begin();
  
  Wire.beginTransmission(0x20);
  Wire.write((byte)0x12);
  Wire.write((byte)relayShieldNum); // TODO: set this based on args
  Wire.endTransmission();
  
  Wire.beginTransmission(0x20);
  Wire.write((byte)0x00);
  Wire.write((byte) 0x00);
  Wire.endTransmission();

  return scope.Close(v8::Undefined());
}

v8::Handle<v8::Value> Enable(const v8::Arguments& args) {
  v8::HandleScope scope;

 double num = args[0]->NumberValue();

  Wire.beginTransmission(0x20);
  Wire.write((byte)0x12);
  Wire.write((byte)num); // TODO set this based on args
  Wire.endTransmission();

  return scope.Close(v8::Undefined());
}

extern "C" {
	void ___init___(v8::Handle<v8::Object> exports) {
		exports->Set(v8::String::NewSymbol("init"), v8::FunctionTemplate::New(Init)->GetFunction());
		exports->Set(v8::String::NewSymbol("enable"), v8::FunctionTemplate::New(Enable)->GetFunction());
	}
}

NODE_MODULE(pcduino_i2c, ___init___)
