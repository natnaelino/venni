import React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import { Profile } from './Profile'

describe('Profile tests', () => {
  let wrapper: ShallowWrapper
  const props: any = {
    user: {
      name: 'Buzz Lightyear',
      email: 'buzz@lightyear.com',
      avatar: 'someurl',
      friendInvites: [],
      sentInvites: []
    },
    social: {
      friends: [],
      receivedInvites: [],
      sentInvites: []
    },
    logout: jest.fn()
  }

  beforeEach(() => {
    wrapper = shallow(<Profile {...props} />)
  })

  it('renders without crashing', () => {
    expect(wrapper.find('.profile').exists()).toBe(true)
  })
})
