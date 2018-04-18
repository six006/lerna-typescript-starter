import test from 'ava';
import { add } from './';

test('should add two numbers', t => {
    t.is(add(1, 2), 3);
});
