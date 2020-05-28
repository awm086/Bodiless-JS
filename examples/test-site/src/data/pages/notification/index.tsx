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

import React, { useCallback } from 'react';
import { graphql } from 'gatsby';
import {
  withNode,
  withNodeKey,
  useNotifyFromNode,
  useNotifications,
} from '@bodiless/core';
import { Page } from '@bodiless/gatsby-theme-bodiless';
import { flowRight } from 'lodash';
import { observer } from 'mobx-react-lite';
// eslint-disable-next-line import/no-extraneous-dependencies
import { v1 } from 'uuid';
import Layout from '../../../components/Layout';

const asBodiless = flowRight(
  withNodeKey('notifier'),
  withNode,
  observer,
);

const AComponentWhoObservesNotify = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { notifications } = useNotifications();
  const renderCounter = React.useRef(0);
  renderCounter.current += 1;
  return (
    <div>
      Render Count:
      {renderCounter.current}
    </div>
  );
};

const NotificationViewer = () => {
  const { notifications } = useNotifications();
  return (
    <pre>{JSON.stringify(notifications, undefined, 2)}</pre>
  );
};

const ChildWithNotifications = asBodiless(() => {
  const { notifications, setNotifications } = useNotifyFromNode();
  const addRandomNotification = useCallback(
    () => {
      const id = v1();
      const message = 'Lorem Ipsum is simply dumy text of the printing and typesetting industry.';
      setNotifications([...notifications, { id, message }]);
    },
    [notifications, setNotifications],
  );
  return (
    <div className="border p-2">
      <h2 className="text-lg">I Have Notifications</h2>
      {/* <pre>{JSON.stringify(myNotifications, undefined, 2)}</pre> */}
      <button type="button" className="border p-2 m-2" onClick={addRandomNotification}>Add a notification</button>
      <button type="button" className="vborder p-2 m-2" onClick={() => setNotifications([])}>Clear All</button>

    </div>
  );
});

export default (props: any) => (
  <Page {...props}>
    <Layout>
      <h1 className="text-3xl font-bold">Notifications</h1>
      <ChildWithNotifications />
      <NotificationViewer />
      <AComponentWhoObservesNotify />
    </Layout>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
