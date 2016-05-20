{
  "targets": [
    {
      "target_name": "pcduino-i2c",
      "sources": [  "pcduino-i2c.cc"],
      "include_dirs": [".","../Wire", "../arduino"],
      "libraries": ['./libWire.so']
    }
  ]
}
