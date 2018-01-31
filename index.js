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
  clientId?: string,
  clientSecret?: string,
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
    featureToLabel: (feature) => {
      // feature can be either an autocomplete result or a reverse result
      // return the proper label based on what the object looks like
      return feature.magicKey
        ? feature.text
        : feature.properties.label
    },
    featureToValue: (feature) => `${feature.text}-${feature.magicKey}`,
    search: autocomplete
  }

  _onChange = (value: any) => {
    const {clientId, clientSecret, forStorage, onChange} = this.props

    // check to see if value is a geolocate result or autocomplete value
    if (value.feature) {
      onChange && onChange(value.feature)
    } else {
      // result is autocomplete result without address or coordinate data
      // do geocode to get info
      search({
        clientId,
        clientSecret,
        magicKey: value.magicKey,
        forStorage,
        text: value.text
      }).then(result => {
        onChange && onChange(result.features[0])
      })
      .catch(err => {
        // not quite sure what to do with error here
        console.error(err)
      })
    }
  }

  _getReverseSearch () {
    if (this.props.reverseSearch) {
      return this.props.reverseSearch
    } else {
      const {clientId, clientSecret, forStorage} = this.props
      return (query: any) => {
        query.clientId = clientId
        query.clientSecret = clientSecret
        query.forStorage = forStorage
        return reverse(query)
      }
    }
  }

  render () {
    return (
      <GeocodeSelect
        {...this.props}
        apiKey='dummy' // include because it's a required propType in react-select-geocoder
        onChange={this._onChange}
        reverseSearch={this._getReverseSearch()}
        />
    )
  }
}
