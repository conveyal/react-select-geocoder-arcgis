// @flow

import {autocomplete, reverse, search} from '@conveyal/geocoder-arcgis-geojson'
import React, {Component} from 'react'
import GeocodeSelect from 'react-select-geocoder'

type Props = {
  boundary?: {
    rect: {
      minLat: number,
      minLon: number,
      maxLat: number,
      maxLon: number
    }
  },
  featureToLabel?: () => void,
  featureToValue?: () => void,
  findingLocationText?: string,
  focusPoint?: any,
  forStorage?: boolean,
  geolocate?: boolean,
  onChange?: () => void,
  placeholder?: string,
  rateLimit?: number,
  reverseSearch?: () => void,
  search?: () => void,
  useLocationText?: string,
  value?: any
}

export default class Geocoder extends Component {
  props: Props

  static defaultProps = {
    featureToLabel: (feature) => feature.text,
    featureToValue: (feature) => `${feature.text}-${feature.magicKey}`,
    reverseSearch: reverse,
    search: autocomplete
  }

  _onChange = (value: any) => {
    const {forStorage, onChange} = this.props

    console.log(value)

    // check to see if value is a geolocate result or autocomplete value
    if (value.feature) {
      onChange && onChange(value.feature)
    } else {
      // result is autocomplete result without address or coordinate data
      // do geocode to get info
      search({
        magicKey: value.magicKey,
        forStorage,
        text: value.text
      }).then(result => {
        console.log(result)
        onChange && onChange(result.features[0])
      })
      .catch(err => {
        // not quite sure what to do with error here
        console.error(err)
      })
    }
  }

  render () {
    return (
      <GeocodeSelect
        {...this.props}
        apiKey='dummy' // include because it's a required propType in react-select-geocoder
        onChange={this._onChange}
        />
    )
  }
}
