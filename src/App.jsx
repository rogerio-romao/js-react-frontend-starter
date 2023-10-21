import { useState } from 'react';

import './css/App.css';

export default function App() {
    const [count, setCount] = useState(0);

    return (
        <div className='App'>
            <h1>React App</h1>

            <p>Count: {count}</p>

            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}
