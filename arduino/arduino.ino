#include <SPI.h>
#include <Ethernet.h>

// Enter a MAC address and IP address for your controller below.
// The IP address will be dependent on your local network:
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };

// Arduino IP
IPAddress ip(192, 168, 2, 15);

// Google DNS
IPAddress myDns(8, 8, 8, 8);

char serverName[] = "smart-trash.app.hackinpoa.tsuru.io";

EthernetClient sendClient;

// Variaveis que controlam o ultimo envio da porta
int sensor0 = 0;
int sensor1 = 0;
float diff = 5;

// Indica que pode ser enviado uma nova requisicao
boolean readyToSend = false;

void setup() {
  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }

  // start the Ethernet connection and the server:
  Ethernet.begin(mac, ip, myDns);
  Serial.println(Ethernet.localIP());
  readyToSend = true;
}

void loop() {

  readResponse();
  
  float s0 = analogRead(0);
  float v0 = abs(sensor0 - s0);
  
  if(v0 > diff && readyToSend == true) {
    Serial.println(String(v0));
    readyToSend = false;
    sensor0 = s0;
    httpRequest(0, sensor0);
  }
  
  float s1 = analogRead(1);
  float v1 = abs(sensor1 - s1);
  
  if(v1 > diff && readyToSend == true) {
    readyToSend = false;
    sensor1 = s1;
    httpRequest(1, sensor1);
  }

}

void readResponse() { 
  //Read http response
  if (sendClient.available()) {
    char c = sendClient.read();
    //Serial.write(c);
  }
  
  if (readyToSend == false && sendClient.connected() == false) {
    Serial.println("end of connection");
    readyToSend = true;
  }
}

// this method makes a HTTP connection to the server:
void httpRequest(int sensor, int value) {
  
  Serial.println("sending: sensor = " + String(sensor) + " - value = " + String(value) + " ...");
  
  // close any connection before send a new request.
  // This will free the socket on the WiFi shield
  sendClient.stop();

  String path = "/coleta/" + String(sensor) + "/" + String(value);

  // if there's a successful connection:
  int connected = sendClient.connect(serverName, 80);
  
  if (connected) {
    Serial.println("connected...");
    // send the HTTP PUT request:
    sendClient.println("GET " + path + " HTTP/1.1");
    sendClient.println("Host: smart-trash.app.hackinpoa.tsuru.io");
    sendClient.println("User-Agent: arduino-ethernet");
    sendClient.println("Connection: close");
    sendClient.println();
    
    Serial.println("sent...");

  }
  else {
    // if you couldn't make a connection:
    Serial.println("connection failed : error = " + String(connected));
    readyToSend = true;
  }
}

