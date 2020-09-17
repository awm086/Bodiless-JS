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

import React, { ComponentType as CT, PropsWithChildren } from 'react';
import { stripIndent } from 'common-tags';
import {
  ifEditable,
  withData,
  withNode,
  withNodeDataHandlers,
  withNodeKey,
  WithNodeKeyProps,
  withoutProps,
  withSidecarNodes,
} from '@bodiless/core';
import * as _ from 'lodash';
import { HelmetProps } from 'react-helmet';
import { withGTMSnippet } from './withGTMForm';
import { ifHasTypeDeclarations } from 'typedoc-plugin-markdown/dist/resources/helpers/if-has-type-declarations';

type GtmEventData = {
  content: string;
};

type DataLayer = {
  name: string;
  event: string;
  page: object;
};

type BaseProps = PropsWithChildren<HelmetProps>;

type Data = {
  content: string;
};
type Props = BaseProps & Data;

type BasicOptions = {
  defaultDataLayer: DataLayer;
  editableDataLayer?: any;
};

const generateDataLayer = (dataLayer: any, dataLayerName: string) => {
  let result = `window.${dataLayerName} = window.${dataLayerName} || [];`;

  if (dataLayer !== undefined) {
    result += `window.${dataLayerName}.push(${JSON.stringify(dataLayer)});`;
  }

  return stripIndent`${result}`;
};

const tagManagerEnabled = (process.env.GOOGLE_TAGMANAGER_ENABLED || '1') === '1';

const withGTMEvent$ = (options: BasicOptions) => (
  HelmetComponent: CT<BaseProps>,
) => ({ children, content, ...rest }: Props) => {
  const { defaultDataLayer, editableDataLayer } = options;
  // @fixme: remove (|| 1) added   for testing.
  if ((process.env.NODE_ENV === 'production' && tagManagerEnabled) || 1) {
    // @todo: how to merge product vs page info?
    // Build the data structure based on the scope and value form content.
    let data = {};
    // Get the datalyer name to be used in the script.
    const { name } = defaultDataLayer;
    // do we have editable datalayer snippet?
    if (editableDataLayer) {
      const { scope } = editableDataLayer;
      // Build the data object i.e. { page: {pageType: 'myType'}}
      data = { [scope]: content };
    }
    // Merge the data into the default datalayer data.
    const merged = _.merge({}, options.defaultDataLayer, data);
    return (
      <HelmetComponent {...rest}>
        {children}
        <script>{generateDataLayer(merged, name)}</script>
      </HelmetComponent>
    );
  }
  return <></>;
};

const withHeadElement = (renderHoc: Function) => (options: BasicOptions) => (
  nodeKey?: WithNodeKeyProps, defaultContent?: string,
) => {
  const { editableDataLayer } = options;
  return withSidecarNodes(
    withNodeKey(nodeKey),
    withNode,
    withNodeDataHandlers({ content: defaultContent }),
    ifEditable(withGTMSnippet({ ...editableDataLayer })),
    withoutProps('setComponentData'),
    withData,
    renderHoc(options),
  );
};
const withEvent = withHeadElement(withGTMEvent$);

export default withEvent;
