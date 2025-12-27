import { render } from 'preact';
import { App } from './App';
import './style.css'; // ← Make sure this line exists

render(<App />, document.getElementById('blogs-ibtwil-app'));