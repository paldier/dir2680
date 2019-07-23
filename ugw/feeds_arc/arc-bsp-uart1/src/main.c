#include <errno.h>
#include <fcntl.h>
#include <string.h>
#include <termios.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

//#define DEBUG
#define error_message printf

#ifdef DEBUG
#define debug_message printf
#else
#define debug_message
#endif

int set_interface_attribs (int fd, int speed, int parity)
{
	struct termios tty;
	memset (&tty, 0, sizeof tty);
	if (tcgetattr (fd, &tty) != 0)
	{
		error_message ("error %d from tcgetattr", errno);
		return -1;
	}

	cfsetospeed (&tty, speed);
	cfsetispeed (&tty, speed);

	tty.c_cflag = (tty.c_cflag & ~CSIZE) | CS8;	 // 8-bit chars
	// disable IGNBRK for mismatched speed tests; otherwise receive break
	// as \000 chars
	tty.c_iflag &= ~IGNBRK;		 // disable break processing
	tty.c_lflag = 0;				// no signaling chars, no echo,
	// no canonical processing
	tty.c_oflag = 0;				// no remapping, no delays
	tty.c_cc[VMIN]  = 0;			// read doesn't block
	tty.c_cc[VTIME] = 5;			// 0.5 seconds read timeout

	tty.c_iflag &= ~(IXON | IXOFF | IXANY); // shut off xon/xoff ctrl

	tty.c_cflag |= (CLOCAL | CREAD);// ignore modem controls,
	// enable reading
	tty.c_cflag &= ~(PARENB | PARODD);	  // shut off parity
	tty.c_cflag |= parity;
	tty.c_cflag &= ~CSTOPB;
	tty.c_cflag &= ~CRTSCTS;

	if (tcsetattr (fd, TCSANOW, &tty) != 0)
	{
		error_message ("error %d from tcsetattr", errno);
		return -1;
	}
	return 0;
}

void set_blocking (int fd, int should_block)
{
	struct termios tty;
	memset (&tty, 0, sizeof tty);
	if (tcgetattr (fd, &tty) != 0)
	{
		error_message ("error %d from tggetattr", errno);
		return;
	}

	tty.c_cc[VMIN]  = should_block ? 1 : 0;
	tty.c_cc[VTIME] = 5;			// 0.5 seconds read timeout

	if (tcsetattr (fd, TCSANOW, &tty) != 0)
		error_message ("error %d setting term attributes", errno);
}

char * trim(char *src,char target,char *dst){

        int i=0;
        if(src==NULL)
                return NULL;
        while(*src != target){
                *(dst+i)=*src;
                src++;
                i++;
        }
        debug_message("%s\n",dst);
        return dst;
}


char * parse_buf(char *buffer,int size,char * command)
{
	if(buffer==NULL) {
		return NULL;
	}

	debug_message("command=%s buf=%s\n",command,buffer);

	char test[256];
	memset(test,0,sizeof(test));
	char *buf = buffer;
	int i=0;
	while(*buf != '\0') {
		if(*buf == '\r' || *buf == '\n') {
			if(!strncmp(test,command,strlen(command))) {
				memset(test,0,sizeof(test));
				debug_message("memset\n");
				i=0;
			}else{
				test[i]=' ';
				i++;
			}
		} else {
			test[i] = *buf;
			i++;
		}
		buf++;
	}

	printf("result=%s\n",test);
	return test;

}

int main(int argc, char *argv[])
{
	char *portname = argv[1];
	char cmd[64]="";
	char buf [256];
	char bbb[1];
	int i=0;

	if(argc<2) {
		perror("Usage: ./a.out  com_port");
		exit(-1);
	}

	int fd = open (portname, O_RDWR | O_NOCTTY | O_SYNC);
	int size=0;

	if (fd < 0)
	{
		error_message ("error %d opening %s: %s", errno, portname, strerror (errno));
		return;
	}

	set_interface_attribs (fd, B115200, 0); // set speed to 115,200 bps, 8n1 (no parity)
	set_blocking (fd, 0); // set no blocking
	//printf("before while\n");

	while(fgets(cmd, 100 , stdin)) {

		memset(buf,0,sizeof(buf));
		i=0;

		write (fd, cmd,strlen(cmd));		   // send 7 character greeting
		write (fd, "\r\n",strlen("\r\n"));

		//printf("write\n");
		memset(buf,0,sizeof(buf));
		//printf("before read\n");

		while(read(fd,bbb,1)>0) {

			buf[i]=bbb[0];
			printf("%c",bbb[0]);
			i++;
		}

		//printf("after read\n");

		buf[i]='\0';

		//printf("cmd = %s\n",cmd);
		char buf2[128];
		memset(buf2,0,sizeof(buf2));
		trim(cmd,'\n',buf2);
		parse_buf(buf,i,buf2);

		fflush(stdin);
	}

	close(fd);

	return 0;
}

