// third-party libraries
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { Provider } from 'react-redux'
import AOS from 'aos'
import 'aos/dist/aos.css'

// custom libraries
import { TopNav, Drawer } from './components'
import { Firebase, FirebaseContext } from './firebase'
import { history } from './cores/history'
import { Homepage, Error, Login, Signup, App } from './pages'
import store from './redux/store'
import { ReduxState } from './redux/types'
import { AppRoute, PublicRoute } from './routes'
import * as serviceWorker from './serviceWorker'
import setupSocket from './sockets/sockets'
import { useWindowWidth } from './utilities'
import './index.css'

interface Props {
  userId: string
}

class ErrorHandler extends React.PureComponent {
  componentDidCatch() {
    window.localStorage.clear()
    // window.location.reload()
  }

  render() {
    return this.props.children
  }
}

const Routes: React.FC<Props> = props => {
  const windowWidth = useWindowWidth()
  const [isSidebarCollapsed, setSidebarCollapse] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(
    window.location.pathname
  )
  const { userId } = props
  const FirebaseInstance = new Firebase()

  useEffect(() => {
    AOS.init({ offset: 200, duration: 300, easing: 'ease-in-sine', delay: 100 })
    history.listen(location => setCurrentLocation(location.pathname))
    userId && setupSocket(userId)
  }, [userId])

  useEffect(() => {
    windowWidth > 768 ? setSidebarCollapse(false) : setSidebarCollapse(true)
  }, [windowWidth])

  return (
    <FirebaseContext.Provider value={FirebaseInstance}>
      <Router history={history}>
        <TopNav
          {...{
            history,
            currentLocation,
            isSidebarCollapsed,
            setSidebarCollapse
          }}
        />
        <Drawer />
        <Switch>
          <AppRoute
            exact
            path="/"
            render={() => <App isSidebarCollapsed={isSidebarCollapsed} />}
          />
          <Route path="/home" component={Homepage} />
          <PublicRoute
            path="/login"
            render={() => <Login history={history} />}
          />
          <PublicRoute
            path="/signup"
            render={() => <Signup history={history} />}
          />
          <Route render={() => <Error history={history} />} />
        </Switch>
      </Router>
    </FirebaseContext.Provider>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  userId: state.profile.id
})

const ConnectedRoutes = connect(mapStateToProps)(Routes)

ReactDOM.render(
  <ErrorHandler>
    <Provider store={store}>
      <ConnectedRoutes />
    </Provider>
  </ErrorHandler>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
