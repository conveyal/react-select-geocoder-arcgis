// @flow

import React from 'react'
import {render} from 'react-dom'

import Geocoder from './index'

const div = document.createElement('div')
if (!document.body) {
  throw new Error('document not found, is this running in a web-like environment?')
}
document.body.appendChild(div)

render(
  <Geocoder
    apiKey={process.env.MAPZEN_KEY}
    onChange={(value) => console.log(value)}
    geolocate
    />,
  div
)
