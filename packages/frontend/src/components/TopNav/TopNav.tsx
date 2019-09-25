import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Menu, Icon, Avatar, Badge } from 'antd'
import { History } from 'history'
import { showDrawer as openDrawer } from 'src/redux/actions/drawer/drawerActions'
import { ReduxState, UserProfile, SocialState } from 'src/redux/types'
import Logo from 'src/assets/logo.svg'
import { isLoggedIn } from 'src/utilities'

export interface Props {
  history: History
  currentLocation: string
  userProfile: UserProfile
  social: SocialState
  isSidebarCollapsed: boolean
  setSidebarCollapse: Function
  showDrawer: () => void
}

interface State {
  current: string
}

export class TopNav extends React.Component<Props, State> {
  state = { current: this.props.currentLocation }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.currentLocation !== this.props.currentLocation) {
      this.setState({ current: this.props.currentLocation })
    }
  }

  handleLogoClick = () => {
    !this.props.userProfile.id
      ? this.props.history.push('/')
      : this.props.setSidebarCollapse(!this.props.isSidebarCollapsed)
  }

  handleClick = (e: any): void => this.setState({ current: e.key })

  renderLinks = (): ReactElement[] | ReactElement => {
    const { userProfile, social } = this.props

    const menuLinks = [
      <Menu.Item key="/signup">
        <Link to="/signup" style={{ color: 'green' }}>
          <Icon type="rocket" />
          Signup
        </Link>
      </Menu.Item>,

      <Menu.Item key="/login">
        <Link to="/login">
          <Icon type="login" />
          Login
        </Link>
      </Menu.Item>
    ]

    if (!isLoggedIn()) return menuLinks

    return (
      <Menu.Item
        onClick={this.props.showDrawer}
        key="/"
        style={{ float: 'right' }}
      >
        <Badge count={social.receivedInvites.length}>
          <Avatar className="avatar-img" src={userProfile.avatar}>
            {userProfile.name}
          </Avatar>
        </Badge>
      </Menu.Item>
    )
  }

  render() {
    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          paddingTop: 5
        }}
      >
        <Menu.Item key="/home">
          <img
            src={Logo}
            alt="Venni Logo"
            style={{ width: '30px' }}
            onClick={this.handleLogoClick}
          />
        </Menu.Item>

        {this.renderLinks()}
      </Menu>
    )
  }
}

/* istanbul ignore next */
const mapStateToProps = (state: ReduxState) => ({
  userProfile: state.profile,
  social: state.social
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  showDrawer: () => dispatch(openDrawer())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopNav)
