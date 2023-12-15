/* eslint-disable react-native/no-inline-styles */
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';

interface OrderBookData {
  bids: {price: number; qty: number; total: number}[];
  asks: {price: number; qty: number; total: number}[];
}

const App = () => {
  const [orderBookData, setOrderBookData] = useState<OrderBookData>({
    bids: [],
    asks: [],
  });
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
      console.log('isSocketConnected', isSocketConnected);
    });

    socket.on('disconnect', () => {
      setIsSocketConnected(false);
    });

    socket.on('events', data => {
      setOrderBookData(data.data);
      console.log(orderBookData);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <View style={{flex: 1, padding: 20, backgroundColor: 'white'}}>
      <Text style={{color: '#2f3030', fontSize: 40, fontWeight: '900'}}>
        Order Book
      </Text>
      {isSocketConnected ? (
        <View>
          <View>
            <Text style={{color: 'red', fontSize: 30, fontWeight: '900'}}>
              Asks
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
              <View style={{width: 120}}>
                <Text
                  style={{color: '#2f3030', fontSize: 18, fontWeight: '900'}}>
                  Price
                </Text>
              </View>
              <View style={{width: 120}}>
                <Text
                  style={{color: '#2f3030', fontSize: 18, fontWeight: '900'}}>
                  Quantity
                </Text>
              </View>
              <View style={{width: 120}}>
                <Text
                  style={{color: '#2f3030', fontSize: 18, fontWeight: '900'}}>
                  Amount
                </Text>
              </View>
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={orderBookData.asks}
              renderItem={({item}) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{width: 120}}>
                    <Text style={{color: 'red'}}>{item.price}</Text>
                  </View>
                  <View style={{width: 120}}>
                    <Text style={{color: 'red'}}>{item.qty.toFixed(5)}</Text>
                  </View>
                  <View style={{width: 120}}>
                    <Text style={{color: 'red'}}>{item.total.toFixed(5)}</Text>
                  </View>
                </View>
              )}
              ListEmptyComponent={<ActivityIndicator color={'red'} size={50} />}
            />
          </View>
          <View>
            <Text style={{color: '#34ed56', fontSize: 30, fontWeight: '900'}}>
              Bids
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
              <View style={{width: 120}}>
                <Text
                  style={{color: '#2f3030', fontSize: 18, fontWeight: '900'}}>
                  Price
                </Text>
              </View>
              <View style={{width: 120}}>
                <Text
                  style={{color: '#2f3030', fontSize: 18, fontWeight: '900'}}>
                  Quantity
                </Text>
              </View>
              <View style={{width: 120}}>
                <Text
                  style={{color: '#2f3030', fontSize: 18, fontWeight: '900'}}>
                  Amount
                </Text>
              </View>
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={orderBookData.bids}
              renderItem={({item}) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{width: 120}}>
                    <Text style={{color: '#34ed56'}}>{item.price}</Text>
                  </View>
                  <View style={{width: 120}}>
                    <Text style={{color: '#34ed56'}}>
                      {item.qty.toFixed(5)}
                    </Text>
                  </View>
                  <View style={{width: 120}}>
                    {item.total && (
                      <Text style={{color: '#34ed56'}}>
                        {item.total.toFixed(5)}
                      </Text>
                    )}
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <ActivityIndicator color={'#34ed56'} size={50} />
              }
            />
          </View>
        </View>
      ) : (
        <Text style={{color: '#2f3030'}}>Connecting to WebSocket...</Text>
      )}
    </View>
  );
};

export default App;
