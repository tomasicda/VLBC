INCLUDES = -I . -I arduino -I Wire

CFLAGS = -fPIC
#CFLAGS += -march=armv7-a -mfpu=neon

all: i2c.o
	make -C node/
	make -C Wire/

i2c.o: i2c.cpp
	g++ $(INCLUDES) -c i2c.cpp

clean:
	rm -rf *.o
	make -C node/ clean
	make -C Wire/ clean
