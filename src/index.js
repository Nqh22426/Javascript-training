import './styles.css';
import { greet } from './app.js';
import _ from 'lodash';

const user = { name: 'Hưng', role: 'Student' };
const out = document.getElementById('output');

out.innerHTML = `
  <p>${greet(user.name)}</p>
  <p>Role: ${user.role}</p>
  <p>lodash says: ${_.join(['Hello','from','lodash'], ' ')}</p>
`;

console.log('App started');
