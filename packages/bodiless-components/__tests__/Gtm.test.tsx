/**
 * Copyright © 2019 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { flowRight } from 'lodash';
import { shallow } from 'enzyme';
import { withEvent } from '../src/GTM/gtm';

const core = require('@bodiless/core');

jest.mock('@bodiless/core');

const setMockNode = (items: any) => {
  const node = {
    child: (key: string) => ({
      data: items[key],
    }),
  };
  core.useNode.mockReturnValue({ node });
  return node;
};

const DataLayer = flowRight(withEvent('globalDataLayer', 'view-product', ''))(
  Helmet,
);

describe('withEvent', () => {
  it('add a Event data in the Helmet component', () => {
    const mockItem = {
      'view-product': {
        value: {
          event: 'view product Y',
          page: {
            pageType: 'pageType',
          },
        },
      },
    };
    setMockNode(mockItem);
    let wrapper = shallow(<DataLayer />);
    expect(wrapper.childAt(0).type()).toEqual('script');
    expect(wrapper.childAt(0).text()).toEqual('test-title');

    // @Todo check window.datalayer value.

    // Test empty values will generate emtpy tag:
    const emptyMockItem = {
      'view-product': {
        value: '',
      },
    };
    setMockNode(emptyMockItem);
    wrapper = shallow(<script />);
    expect(wrapper.childAt(0).type()).toEqual('script');
    expect(wrapper.childAt(0).text()).toHaveLength(0);
  });
});
