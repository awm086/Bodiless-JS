// @ts-nocheck
/**
 * Copyright © 2020 Johnson & Johnson
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

import { flowRight } from 'lodash';
import Helmet from 'react-helmet';
import {
  asBodilessHelmet,
  withEvent,
  withGTMForm,
} from '@bodiless/components';
import { useEditContext } from '@bodiless/core';

const useGetMenuOptions = () => {
  const context = useEditContext();
  return [
    {
      name: 'gtm',
      isHidden: () => !context.isEdit,
      icon: 'local_offer',
      label: 'GTM',
    },
  ];
};

const withGTMEvent = withEvent(
  {
    defaultDataLayer: {
      name: 'digitalData',
      event: 'Page Loaded',
      page: {
        country: 'US',
        language: 'EN',
        hostname: 'bodilessjs.com',
      },
    },
    editableDataLayer: {
      scope: 'page',
      name: 'pageType',
      label: 'Page Type',
    },
    // editableDataLayer: [{
    //   scope: 'page',
    //   name: 'pageType',
    //   label: 'Page Type',
    // },
    // {
    //   scope: 'page',
    //   name: 'pageType',
    //   label: 'Page Type',
    // },
    // ],
  },
);

const GTMFormHeader = {
  title: 'GTM Data Management',
  description: `Enter the page level data used for GTM.
  This is data needed for GTM that will go in the page header.`,
};

const GTMHelmetWithForm = flowRight(
  asBodilessHelmet('datalayer'),
  withGTMForm(useGetMenuOptions, GTMFormHeader),
  withGTMEvent('page-loaded', ''),
)(Helmet);

const SiteGTMHelmetEvent = GTMHelmetWithForm;
export default SiteGTMHelmetEvent;
