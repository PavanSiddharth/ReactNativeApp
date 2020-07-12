<script src="http://localhost:8097"></script>
import React from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import { PersistGate } from 'redux-persist/es/integration/react'
import { Loading } from './components/LoadingComponent';

const store = ConfigureStore();

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
          <Main />
      </Provider>
    );
  }
}