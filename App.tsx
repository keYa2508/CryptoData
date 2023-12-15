import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import io, {Socket} from 'socket.io-client';

const App = () => {
  const [orderBookData, setOrderBookData] = useState<any>([]);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);

  useEffect(() => {
    const url = 'https://staging-websocket.pibase.io';
    const symbol = 'USDTUSD';

    const socket = io(`${url}/feeder-${symbol}`, {
      path: '/feeder',
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      setIsSocketConnected(true);
    });

    socket.on('disconnect', () => {
      setIsSocketConnected(false);
    });

    socket.on('event', data => {
      setOrderBookData(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <View>
      <Text>App</Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
