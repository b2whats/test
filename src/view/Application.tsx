import React, { Suspense } from 'react'

const RemoteApp = React.lazy(() => import('testRemoteApp/App'))

type TestChildComponentProps = {
};

export const TestChildComponent = (props: TestChildComponentProps) => {
    return (
        <div>
            <input type="text" />
        </div>
    )
}


export const App = () => {
    return (
        <div>
            <h1>Hello World!</h1>
            <TestChildComponent />

            <Suspense fallback={'loading...'}>
                <RemoteApp />
            </Suspense>
        </div>
    )
}
