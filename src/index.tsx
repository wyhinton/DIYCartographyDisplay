import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ThemeProvider} from "@material-ui/core/styles";
import {theme} from './theme';
import {StoreProvider} from 'easy-peasy';

import store from './store';
ReactDOM.render(
    <ThemeProvider theme = {theme} >
      <StoreProvider store = {store}>
      <App />
     </StoreProvider>
    </ThemeProvider>,
  document.getElementById('root')
);

reportWebVitals();
