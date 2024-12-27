import React, { useState } from 'react';

const BluetoothConnect = () => {
  const [deviceName, setDeviceName] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectToBoatDevice = async () => {
    try {
      // Request to connect to a Bluetooth device
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true, // Accept all devices (or use filters specific to your Boat device)
        optionalServices: ['battery_service'], // Replace with relevant services if known
      });

      // Connect to the device's GATT server
      const server = await device.gatt.connect();
      setDeviceName(device.name || 'Unknown Boat Device');
      setIsConnected(true);

      console.log(`Connected to: ${device.name}`);

      // Access the Battery Level (example service)
      const batteryService = await server.getPrimaryService('battery_service');
      const batteryLevelCharacteristic = await batteryService.getCharacteristic('battery_level');
      const value = await batteryLevelCharacteristic.readValue();
      const battery = value.getUint8(0); // Battery level as percentage

      setBatteryLevel(battery);
      console.log('Battery Level:', battery);
    } catch (error) {
      console.error('Error connecting to Bluetooth device:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Boat Device Connection</h1>
      <button onClick={connectToBoatDevice} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Connect to Boat Device
      </button>
      {isConnected && (
        <div>
          <p>Connected to: {deviceName}</p>
          {batteryLevel !== null && <p>Battery Level: {batteryLevel}%</p>}
        </div>
      )}
    </div>
  );
};

export default BluetoothConnect;
