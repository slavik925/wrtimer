import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, BackHandler, TouchableOpacity } from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import useStopWatch from './useStopWatch';

const IconPowerOff = <FontAwesome5 name={'power-off'} size={40} color={'#FFF'} />;
const IconRefresh = <FontAwesome5 name={'redo-alt'} size={40} color={'#FFF'} />;

const format = (times: number[]): string =>
  `${times[0].toString().padStart(2, '0')}:${times[1].toString().padStart(2, '0')}:${Math.floor(times[2]).toString().padStart(2, '0')}`;

const getColor = (appState: StopWatchState) => appState === StopWatchState.RUNNING ? '#ef6c00' : '#2196f3';
const getStatusText = (appState: StopWatchState) => {
  if (appState === StopWatchState.INITIAL) {
    return 'TOUCH';
  } else if (appState === StopWatchState.REST) {
    return 'REST TIME';
  } else if (appState === StopWatchState.RUNNING) {
    return 'WORK TIME';
  } else {
    return '';
  }
}

enum StopWatchState {
  INITIAL,
  RUNNING,
  REST
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'blue'
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 50,
    marginRight: 50,
    marginLeft: 50
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    flex: 1
  },
  stopwatchText: {
    fontSize: 80,
    textAlign: 'center',
    color: '#FFF'
  },
  stopwatchTextMedium: {
    fontSize: 30,
    textAlign: 'center',
    color: '#FFF'
  },
  stopwatchStatus: {
    fontSize: 45,
    textAlign: 'center',
    color: '#FFF'
  }
});

const toggleAppState = (appState: StopWatchState, setAppState, setRounds, startStopWatch) => () => {
  if (appState === StopWatchState.INITIAL || appState === StopWatchState.REST) {
    setAppState(StopWatchState.RUNNING);
    setRounds((rounds: number) => rounds + 1);
  } else {
    setAppState(StopWatchState.REST);
  }
  startStopWatch();
};

const stopAndReset = (setAppState, setRounds, timerStop) => () => {
  timerStop();
  setAppState(StopWatchState.INITIAL);
  setRounds(0);
}

const App: React.FC = () => {
  useKeepAwake();

  const { start, stop, times } = useStopWatch();
  const [rounds, setRounds] = useState(0);
  const [appState, setAppState] = useState(StopWatchState.INITIAL);

  return (
    <TouchableHighlight onPress={toggleAppState(appState, setAppState, setRounds, start)} underlayColor="white">
      <View style={{ ...styles.container, backgroundColor: getColor(appState) }} >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={BackHandler.exitApp}>
            {IconPowerOff}
          </TouchableOpacity>
          <TouchableOpacity onPress={stopAndReset(setAppState, setRounds, stop)}>
            {IconRefresh}
          </TouchableOpacity>
        </View>
        <View style={styles.stats}>
          <Text style={styles.stopwatchTextMedium}>Round: {rounds}</Text>
          <Text style={styles.stopwatchText}>{format(times)}</Text>
          <Text style={styles.stopwatchStatus}>{getStatusText(appState)}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

export default App;
