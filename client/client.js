import React from 'react';
import ReactDom from 'react-dom';
import Main from './views/Main';

import MainVM from 'client/viewmodels/Main';

async function start() {
    ReactDom.render(<Main vm={new MainVM()}/>,
        document.getElementById('root'));
}

start();