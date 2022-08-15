import React, { useState, useEffect, useLayoutEffect, Suspense } from 'react'
import localforage from 'localforage'
import { sendUpdateMfStore } from './worker/changeVersion'
import { TTLCache } from '../shared/services/cache/TTLCache'
import { useFeatureToggle, featureToggle } from '../shared/services/featureToggle'




const store = localforage.createInstance({
  name: 'mf'
})

const RemoteApp = React.lazy(() => import('@rb-mf/web-wlb-remote/App'))

type TestChildComponentProps = {
}

let ii = 0

const Feature = () => {
  const toggle = useFeatureToggle()



  const [isAEnabled, isBEnabled] = useFeatureToggle(['a', 'b'])

if (isAEnabled) {

}

if (toggle('a')) {

}



  const aa = toggle('test-on')
  const bb = toggle('test-on')
  







  
  const [s, us] = useState(true)
  useEffect(() => {
    console.log('effect start')

    return () => {
      console.log('effect end')
    }
  })

  console.log('ren', ii++, aa)
  return (
    <div>
      <div>{aa + ''}</div>
      {toggle('test-on') && <input type="checkbox" name='test-on' checked={toggle('test-on')} onChange={() => featureToggle.toggle('test-on')}/>
      <input type="checkbox" name='MESSENGER_SIGNUP' checked={featureToggle.get('MESSENGER_SIGNUP')} onChange={() => featureToggle.toggle('MESSENGER_SIGNUP')}/>
      {toggle('test-on') && <button type='button' onClick={() => us(ss => !ss)}>{s + ''}</button>
    </div>
  )
}

export const TestChildComponent = (props: TestChildComponentProps) => {
  const [state, setState] = useState({})
  const onSubmit = (event: any) => {
    event.preventDefault()
    // const elements = event.target.elements
    // setState((state) => ({
    //   ...state,
    //   [elements.module.value]: elements.version.value
    // }))

    // store.setItem(elements.module.value, elements.version.value).then(() => sendUpdateMfStore())

    fetch('/oauth2/token', {
      'headers': {
        'authorization': 'Basic QzJWWXYzYjZSSEVpZzJuXzU2YmZubjNHZkk0YTpWaXFLSG9fTXRSYm05bFNTeVJGQ1hmTnRDblFh',
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'x-finger-print': 'eyJvc0NwdSI6eyJkdXJhdGlvbiI6MH0sImxhbmd1YWdlcyI6eyJ2YWx1ZSI6W1sicnUtUlUiXV0sImR1cmF0aW9uIjowfSwiY29sb3JEZXB0aCI6eyJ2YWx1ZSI6MzAsImR1cmF0aW9uIjowfSwiZGV2aWNlTWVtb3J5Ijp7InZhbHVlIjo4LCJkdXJhdGlvbiI6MH0sInNjcmVlblJlc29sdXRpb24iOnsidmFsdWUiOlsxNzkyLDExMjBdLCJkdXJhdGlvbiI6MH0sImF2YWlsYWJsZVNjcmVlblJlc29sdXRpb24iOnsidmFsdWUiOlsxNzkyLDEwMjFdLCJkdXJhdGlvbiI6MH0sImhhcmR3YXJlQ29uY3VycmVuY3kiOnsidmFsdWUiOjEyLCJkdXJhdGlvbiI6MH0sInRpbWV6b25lT2Zmc2V0Ijp7InZhbHVlIjotMTgwLCJkdXJhdGlvbiI6MH0sInRpbWV6b25lIjp7InZhbHVlIjoiRXVyb3BlL01vc2NvdyIsImR1cmF0aW9uIjoxfSwic2Vzc2lvblN0b3JhZ2UiOnsidmFsdWUiOnRydWUsImR1cmF0aW9uIjowfSwibG9jYWxTdG9yYWdlIjp7InZhbHVlIjp0cnVlLCJkdXJhdGlvbiI6MH0sImluZGV4ZWREQiI6eyJ2YWx1ZSI6dHJ1ZSwiZHVyYXRpb24iOjB9LCJvcGVuRGF0YWJhc2UiOnsidmFsdWUiOnRydWUsImR1cmF0aW9uIjowfSwiY3B1Q2xhc3MiOnsiZHVyYXRpb24iOjB9LCJwbGF0Zm9ybSI6eyJ2YWx1ZSI6Ik1hY0ludGVsIiwiZHVyYXRpb24iOjB9LCJwbHVnaW5zIjp7InZhbHVlIjpbeyJuYW1lIjoiUERGIFZpZXdlciIsImRlc2NyaXB0aW9uIjoiUG9ydGFibGUgRG9jdW1lbnQgRm9ybWF0IiwibWltZVR5cGVzIjpbeyJ0eXBlIjoiYXBwbGljYXRpb24vcGRmIiwic3VmZml4ZXMiOiJwZGYifSx7InR5cGUiOiJ0ZXh0L3BkZiIsInN1ZmZpeGVzIjoicGRmIn1dfSx7Im5hbWUiOiJDaHJvbWUgUERGIFZpZXdlciIsImRlc2NyaXB0aW9uIjoiUG9ydGFibGUgRG9jdW1lbnQgRm9ybWF0IiwibWltZVR5cGVzIjpbeyJ0eXBlIjoiYXBwbGljYXRpb24vcGRmIiwic3VmZml4ZXMiOiJwZGYifSx7InR5cGUiOiJ0ZXh0L3BkZiIsInN1ZmZpeGVzIjoicGRmIn1dfSx7Im5hbWUiOiJDaHJvbWl1bSBQREYgVmlld2VyIiwiZGVzY3JpcHRpb24iOiJQb3J0YWJsZSBEb2N1bWVudCBGb3JtYXQiLCJtaW1lVHlwZXMiOlt7InR5cGUiOiJhcHBsaWNhdGlvbi9wZGYiLCJzdWZmaXhlcyI6InBkZiJ9LHsidHlwZSI6InRleHQvcGRmIiwic3VmZml4ZXMiOiJwZGYifV19LHsibmFtZSI6Ik1pY3Jvc29mdCBFZGdlIFBERiBWaWV3ZXIiLCJkZXNjcmlwdGlvbiI6IlBvcnRhYmxlIERvY3VtZW50IEZvcm1hdCIsIm1pbWVUeXBlcyI6W3sidHlwZSI6ImFwcGxpY2F0aW9uL3BkZiIsInN1ZmZpeGVzIjoicGRmIn0seyJ0eXBlIjoidGV4dC9wZGYiLCJzdWZmaXhlcyI6InBkZiJ9XX0seyJuYW1lIjoiV2ViS2l0IGJ1aWx0LWluIFBERiIsImRlc2NyaXB0aW9uIjoiUG9ydGFibGUgRG9jdW1lbnQgRm9ybWF0IiwibWltZVR5cGVzIjpbeyJ0eXBlIjoiYXBwbGljYXRpb24vcGRmIiwic3VmZml4ZXMiOiJwZGYifSx7InR5cGUiOiJ0ZXh0L3BkZiIsInN1ZmZpeGVzIjoicGRmIn1dfV0sImR1cmF0aW9uIjoxfSwidG91Y2hTdXBwb3J0Ijp7InZhbHVlIjp7Im1heFRvdWNoUG9pbnRzIjowLCJ0b3VjaEV2ZW50IjpmYWxzZSwidG91Y2hTdGFydCI6ZmFsc2V9LCJkdXJhdGlvbiI6MH0sImZvbnRzIjp7InZhbHVlIjpbIkFyaWFsIFVuaWNvZGUgTVMiLCJHaWxsIFNhbnMiLCJIZWx2ZXRpY2EgTmV1ZSIsIk1lbmxvIl0sImR1cmF0aW9uIjo5fSwiYXVkaW8iOnsidmFsdWUiOjEyNC4wNDM0NzY1NzgwODEwMywiZHVyYXRpb24iOjh9LCJwbHVnaW5zU3VwcG9ydCI6eyJ2YWx1ZSI6dHJ1ZSwiZHVyYXRpb24iOjB9LCJwcm9kdWN0U3ViIjp7InZhbHVlIjoiMjAwMzAxMDciLCJkdXJhdGlvbiI6MH0sImVtcHR5RXZhbExlbmd0aCI6eyJ2YWx1ZSI6MzMsImR1cmF0aW9uIjowfSwiZXJyb3JGRiI6eyJ2YWx1ZSI6ZmFsc2UsImR1cmF0aW9uIjowfSwidmVuZG9yIjp7InZhbHVlIjoiR29vZ2xlIEluYy4iLCJkdXJhdGlvbiI6MH0sImNocm9tZSI6eyJ2YWx1ZSI6dHJ1ZSwiZHVyYXRpb24iOjB9LCJjb29raWVzRW5hYmxlZCI6eyJ2YWx1ZSI6dHJ1ZSwiZHVyYXRpb24iOjB9fQ=='
      },
      'body': 'grant_type=login&login=20068815s&password=123123Qw%21&scope=openid',
      'method': 'POST',
      'credentials': 'include'
    })
      .then(async (response) => {
        if(response.ok){
          return response.json()
        }
        const result = await response.json()
        return Promise.reject(result)
      })
      .catch(err => {
        console.log(22222, err)
        console.log({err})
      })
  }
  const onClick = (event: any) => {
    const key = event.currentTarget.value
    store.removeItem(key).then(() => {
      setState((state) => {
        const s = {...state}
        delete s[key]

        return s
      })

      sendUpdateMfStore()
    })
        
  }
  useEffect(() => {
    const result = {}
    store.iterate(() => {
      store.iterate((value: string, key) => {
        result[key] = value
      }).then(() => {
        setState(result)
      })
    })
  }, [])
  return (
    <div>
      <form onSubmit={onSubmit}  name='version'>
        <input type="text" name='module' />
        <input type="text" name='version' />
        <button type='submit'>save</button>
      </form>
      <div>
        {Object.entries(state).map((field, index) => <div key={index}>
          {field[0]} - {field[1]}
          <button type='button' value={field[0]} onClick={onClick}>X</button>
        </div>)}
      </div>
            
    </div>
  )
}


export const App = () => {
  return (
    <div>
      <h1>Hello World!</h1>
      <TestChildComponent />
      <Feature />

      {/* <Suspense fallback={'loading...'}>
        <RemoteApp />
      </Suspense> */}
    </div>
  )
}
