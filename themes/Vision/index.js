import osjs from 'osjs';
import {name } from './metadata.json';
import {register} from './src/theme.js';
// Our launcher

osjs.register(name, register);
