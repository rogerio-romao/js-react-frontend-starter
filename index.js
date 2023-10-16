import React from 'react';

export default function useColor() {
    // useState call is destructured into value + setter pair, but identifier
    // names do not follow the [thing, setThing] naming convention
    const [color, setColor] = React.useState();
    return [color, setColor];
}

function Component({ content, ...props }) {
    return (
        <>
            <div>{props.content}</div>

            <a href='www.cjj.kd' target='_blank'></a>

            {Array.from([1, 2, 3], (x, index) => (
                <div key={index} {...props}>
                    {x}
                </div>
            ))}
        </>
    );
}

function Hello() {
    return <Component content='Hello' />;
}

React.render(<Component />, document.querySelector('#root'));
