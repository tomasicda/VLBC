INCLUDES = -I . -I ../arduino

CFLAGS = -fPIC
#CFLAGS += -march=armv7-a -mfpu=neon

all: *.o

*.o: *.cpp
	g++ $(INCLUDES) -c *.cpp

clean:
	rm -f *.o


