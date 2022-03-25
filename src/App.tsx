import React, { Suspense } from 'react';
import { TestChildComponent } from './TestChildComponent';

const RemoteApp = React.lazy(() => import("testRemoteApp/App"));

export const App = () => {
    return (
        <div>
            <h1>Hello World!</h1>
            <TestChildComponent />

            <Suspense fallback={"loading..."}>
                <RemoteApp />
            </Suspense>
        </div>
    );
};
