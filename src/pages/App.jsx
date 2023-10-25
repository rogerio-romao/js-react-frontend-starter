// packages
import { useState } from 'react';

// components
import Test from '@/components/Test';

// styles
import styles from '@/css/app.module.css';

export default function App() {
    const [count, setCount] = useState(0);

    return (
        <div className='App'>
            <h1 className={styles.mainpage_title}>React App</h1>

            <p>Count: {count}</p>

            <button onClick={() => setCount(count + 1)}>Increment</button>

            <Test />
        </div>
    );
}
