![](https://raw.githubusercontent.com/flufy3d/DigitTrak-Interface-Protocol/master/image/digitgolf.png)
##DigitTrak Interface Protocol

This document provides a description of the communication between 'DigitTrak' Hardware Device
and the simulation software on PC. The middleware we adopt is the 'WebSocket' and the port is 8000.
You can access to the detail below.

* ###Initialization statement

  * 'S' is short for Server, Here the Server is 'DigitTrak' Hardware Device';
  * 'C' is short for Client, Here the Client is the simulation software you need to work on;
  * The messages or events between 'S' and 'C' are divided into two classes:'S2C' and 'C2S';
  * The middleware API is 'WebSocket',the port is 8000;
  * message data formate is JSON;

* ###C2S
  The messages or events that Client sends to Server are simple.when we lanuch the Client,
  it should connect to Server automatically,it's not until the Client receive a message
  (key is 'device_status' and value is '0',see below) that Client can sends message to Server.

  * #####Client command messages
This type of message is used to control 'DigitTrak'.

   * ######message type:
    ```
      {
        cmd : 0    // value can be 0 or 1 or 2 or 3 or 4
      }
    ```
  * ######explanation:

      cmd : short for command.
       0  : setting the 'DigitTrak' to Standby state,the device begins to detect golf ball and monitor
       spiking motion.
       1  : suspend 'DigitTrak'.
       2  : shutdown 'DigitTrak'.
       3  : set putt mode.
       4  : set swing mode.

* ###S2C
  The messages or events that Server sends to Client may be a little bit complex,but we can divide them into
  three classes:device connections status messages,spiking motion related messages and hit ball data messages.

  * #####device connections status messages
When Client connects to Server automatically,it need an ACK to know the device status and whether the connection
is successful or not.

   * ######message type:
    ```
    {
       device_status : 0   // value can be 0 or 1 or 2
    }
    ```
     * ######explanation:

      device_status : the status of 'DigitTrak' hardware device.
      0 : the initialization of 'DigitTrak' is ok and the connection is successful.
      1 : the initialization of 'DigitTrak' is underway.
      2 : inner exception

  * #####spiking motion related messages
These messages descript the process of hitting a golf ball

   * ######message type:
    ```
    {
       state : 0   // value can be 0 or 1 or 2 or 3
    }
    ```
     * ######explanation:

      state : the state of 'DigitTrak' monitoring spiking motion.
      0 : 'DigitTrak' is waiting to detect a golf ball.
      1 : 'DigitTrak' has already detected a golf ball and it's stable and effective.
      2 : hit golf ball message.
      3 : accomplish hitting motion message.

  * #####hit golf ball data messages
This message includes golf ball's 'velocity','yaw','pitch' and so on. This message is sent to Client during the period between 'hit golf ball message' and 'accomplish hitting motion message'

    * ######ball data message type
    ```
    {
       type:0,
       data:
           {
             backspin : 7888,
             sidespin : -333,
             pitch : 17.0,
             yaw : -5.2,
             velocity : 78.12,
             confidence : 0.9
            }
    }
    ```
     * ######explanation:

      type : the value is fixed at 0,indicating it's a ball data message.
      data : it's permanent.
      backspin : the value of back spin,Unit is 'rpm'(short for round per minute).
      sidespin : the value of side spin,Unit is 'rpm'.
      pitch : the anle that flying trajectory with ground when ball rising up,Unit is '°'.
      yaw : yaw angle,Unit is also '°'. when left ,the value is negative and when right,the value is positive.
      velocity : flying speed of ball ,Unit is 'm/s'.
      confidence : The reliability of the value of 'backspin' and 'sidespin',if we use a ball with mark,the confidence maybe 0.9,otherwise the confidence  may be less.

     * ######club data message type
  ```
   {
      type:1,
      data:
           {
            club_velocity : 13.2,
            club_horiz : 0.54,
            club_vert : 10.20,
            ball_offset : 10.214
          }
   }
  ```
     * ######explanation:

      this message includes golf club's property, this message is sent to Client after sending 'accomplish hitting motion message',and       the delay time is 1s accurately.

      type : the value is fixed at 1,indicating it's a club data message.
      data : it's permanent.
      club_velocity : flying speed of club, Unit is 'm/s'.
      club_horiz : the offset in horizontal
      club_vert : the offset in vertical
      ball_offset : the vector of the above two parameters

***we assume the club surface as a coordinate system, the origin is the center of club surface(see figure below)***

![](https://raw.githubusercontent.com/flufy3d/DigitTrak-Interface-Protocol/master/image/coordinate.png)





