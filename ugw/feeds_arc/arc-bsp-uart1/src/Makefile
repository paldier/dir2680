
TARGET=arc-iserial

SRCS    :=$(wildcard *.c)
OBJS    :=$(patsubst %.c, %.o,$(SRCS))

$(warning #########################################################)
$(warning CC=$(CC))
$(warning CFLAGS=$(CFLAGS))
$(warning LDFLAGS=$(LDFLAGS))
$(warning #########################################################)

EXT_CFLAGS	= $(CFLAGS)
EXT_LDFLAGS	= $(LDFLAGS)

all: depend ${TARGET}

${TARGET}: $(OBJS)
	$(CC) ${EXT_LDFLAGS} -o $@ $^

.c.o:
	$(CC) ${EXT_CFLAGS} -c $< -o $@

clean:
	-$(RM) -f *.o ${TARGET}
	-$(RM) -f .depend

depend:
	$(CC) -MM $(CFLAGS) $(SRCS) 1>.depend

.PHONY: clean depend