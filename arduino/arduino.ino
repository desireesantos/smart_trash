/*
  Web Server

 A simple web server that shows the value of the analog input pins.
 using an Arduino Wiznet Ethernet shield.

 Circuit:
 * Ethernet shield attached to pins 10, 11, 12, 13
 * Analog inputs attached to pins A0 through A5 (optional)

 created 18 Dec 2009
 by David A. Mellis
 modified 9 Apr 2012
 by Tom Igoe

 */

#include <SPI.h>
#include <Ethernet.h>

// Enter a MAC address and IP address for your controller below.
// The IP address will be dependent on your local network:
byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED
};
IPAddress ip(192, 168, 2, 15);

// Google DNS
IPAddress myDns(8, 8, 8, 8);

// Initialize the Ethernet server library
// with the IP address and port you want to use
// (port 80 is default for HTTP):
// EthernetServer server(80);

//
char serverName[] = "smart-trash.app.hackinpoa.tsuru.io";    // name address for Google (using DNS)

EthernetClient sendClient;

unsigned long lastConnectionTime = 0;             // last time you connected to the server, in milliseconds
const unsigned long postingInterval = 1L * 1000L; // Every second (10000)

String postData;

void setup() {
  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }


  // start the Ethernet connection and the server:
  Ethernet.begin(mac, ip, myDns);
  //server.begin();
  //Serial.print("server is at ");
  Serial.println(Ethernet.localIP());
}


void loop() {

  readResponse();

  // listen for incoming clients
  /*
  EthernetClient client = server.available();
  if (client) {
    Serial.println("new client");
    // an http request ends with a blank line
    boolean currentLineIsBlank = true;
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        Serial.write(c);
        // if you've gotten to the end of the line (received a newline
        // character) and the line is blank, the http request has ended,
        // so you can send a reply
        if (c == '\n' && currentLineIsBlank) {
          // send a standard http response header
          client.println("HTTP/1.1 200 OK");
          client.println("Content-Type: text/html");
          client.println("Connection: close");  // the connection will be closed after completion of the response
          client.println("Refresh: 5");  // refresh the page automatically every 5 sec
          client.println();
          client.println("<!DOCTYPE HTML>");
          client.println("<html>");
          // output the value of each analog input pin
          for (int analogChannel = 0; analogChannel < 6; analogChannel++) {
            int sensorReading = analogRead(analogChannel);
            client.print("analog input ");
            client.print(analogChannel);
            client.print(" is ");
            client.print(sensorReading);
            client.println("<br />");
          }
          client.println("</html>");
          break;
        }
        if (c == '\n') {
          // you're starting a new line
          currentLineIsBlank = true;
        }
        else if (c != '\r') {
          // you've gotten a character on the current line
          currentLineIsBlank = false;
        }
      }
    }
    // give the web browser time to receive the data
    delay(1);
    // close the connection:
    client.stop();
    Serial.println("client disconnected");
  }
  */

  // if ten seconds have passed since your last connection,
  // then connect again and send data:
  if (millis() - lastConnectionTime > postingInterval) {
    httpRequest(0, analogRead(0));
  }
}

void readResponse() { 
  //Read http response
  if (sendClient.available()) {
    char c = sendClient.read();
    Serial.write(c);
  }
}

// this method makes a HTTP connection to the server:
void httpRequest(int sensor, int value) {
  // close any connection before send a new request.
  // This will free the socket on the WiFi shield
  sendClient.stop();

  String path = "/coleta/" + String(sensor) + "/" + String(value);

  // if there's a successful connection:
  if (sendClient.connect(serverName, 80)) {
    Serial.println("connecting...");
    // send the HTTP PUT request:
    sendClient.println("GET " + path + " HTTP/1.1");
    sendClient.println("Host: smart-trash.app.hackinpoa.tsuru.io");
    sendClient.println("User-Agent: arduino-ethernet");
    sendClient.println("Connection: close");
    sendClient.println();

    //sendClient.print("Content-Length: ");
    //sendClient.println(postData.length());
    //sendClient.println();
    //sendClient.println(postData);
    
    sendClient.println();

    // note the time that the connection was made:
    lastConnectionTime = millis();
  }
  else {
    // if you couldn't make a connection:
    Serial.println("connection failed");
  }
}

