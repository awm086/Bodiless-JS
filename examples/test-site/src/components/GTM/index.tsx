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

/**
 * @file Example definition of a global GTM Datalayer Component with editable
 * fields.
 */

import { flowRight } from 'lodash';
import { HOC } from '@bodiless/fclasses';
import {
  withDataLayerItem,
  withDefaultDataLayer,
  asBodilessHelmet,
  withDataLayerScript,
  withMetaForm,
} from '@bodiless/components';
import Helmet from 'react-helmet';

// Define the global dataLayer default data.
export const defaultDataLayer = {
  dataLayerName: 'DigitalData',
  dataLayerData: {
    firstObject: {
      foo: 'foo value',
      bar: {
        bat: 'baz value',
      },
    },
    secondObject: {
      event: 'Page Loaded',
      page: {
        country: 'US',
        language: 'en',
        hostname: 'www.example.com',
      },
    },
  },
};

// Define the global dataLayer default data.

// Add a page type editable field which value will be injected in the default
// dataLayer defined above at a given path.
const withDataLayerPageType = withDataLayerItem({
  name: 'pagetype',
  label: 'Page Type',
  path: 'secondObject.page.pageType',
});

// Define the menu item that shows when the site is in edit mode.
const useMenuOptions = () => [
  {
    name: 'gtm',
    icon: 'local_offer',
    label: 'GTM',
  },
];

// Define the form Title and description.
export const gtmFormHeader = {
  title: 'Google Tag Manager',
  description: 'Enter the page level metadata that will be used with Google Tag Manager.',
};

/**
*
 * Utility hoc to add a reusable global GTM/DataLayer form and data to a helmet
 * component.
 *
 * @param hocs array
 *   An array of HOCs to act on the helmet component before it renders.
 *
 * @return An HOC which will add the the DataLayer properties.
 */
const withGlobalGTMForm = (...hocs: HOC[]) => flowRight(
  withMetaForm(useMenuOptions, gtmFormHeader),
  asBodilessHelmet('datalayer'),
  withDefaultDataLayer(defaultDataLayer),
  withDataLayerPageType('page-type', 'foo'),
  ...hocs,
  withDataLayerScript,
);

const DefaultPageGTMDataLayerHelmet = withGlobalGTMForm()(Helmet);

export { withGlobalGTMForm };
export default DefaultPageGTMDataLayerHelmet;