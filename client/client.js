import React from 'react';
import ReactDom from 'react-dom';
import Main from './views/Main.jsx';

async function start() {
    ReactDom.render(<Main />,
        document.getElementById('root'));
}

start();