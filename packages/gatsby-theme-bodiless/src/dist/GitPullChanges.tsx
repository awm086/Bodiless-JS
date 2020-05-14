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

import React, {
  useState, useEffect, FC, useCallback,
} from 'react';
// @ts-ignore
import { useEditContext, ContextMenuForm } from '@bodiless/core';
import { Spinner } from '@bodiless/ui';
import { isEmpty } from 'lodash';
import { AxiosResponse } from 'axios';

enum States {
  Initial,
  GettingStatus,
  GotStatus,
  Submitted,
  Pulling,
  Pulled,
}

type State = {
  current: States,
  data?: any,
};

enum ChangeStatus {
  CanBePulled,
  CannotBePulled,
  NoneAvailable,
  Unknown,
}

type Upstream = {
  branch: string;
  commits: [string];
  files: [string];
};

const analyzeChanges: (s: State) => ChangeStatus = (state: State) => {
  const { commits, files } = state.data.upstream as Upstream;
  if (isEmpty(commits)) {
    return ChangeStatus.NoneAvailable;
  }
  if (files.some(file => file.includes('package-lock.json'))) {
    return ChangeStatus.CannotBePulled;
  }
  return ChangeStatus.CanBePulled;
};

const Status: FC<{state: State}> = ({ state }) => {
  switch (analyzeChanges(state)) {
    case ChangeStatus.CanBePulled:
      return <>There are changes ready to be pulled. Click check (✓) to initiate.</>;
    case ChangeStatus.NoneAvailable:
      return <>No changes available</>;
    default:
      return <>Upstream changes are available but cannot be fetched via the UI</>;
  }
};

const Pulled: FC<{state: State}> = ({ state }) => (
  state.data.error
    ? (<>{state.data.error.msg}</>)
    : (<>Operation Successful</>)
);

const Wrapper = () => (
  <div className="bl-pt-3">
    <Spinner color="bl-bg-white" />
  </div>
);

const Content: FC<{state: State}> = ({ state }) => {
  switch (state.current) {
    case States.GotStatus:
      return <Status state={state} />;
    case States.Pulled:
      return <Pulled state={state} />;
    default:
      return <Wrapper />;
  }
};

const useApiOnEffect = ({
  state, setState, client, context,
}: any) => useEffect(() => {
  switch (state.current) {
    case States.Initial:
      context.showPageOverlay({
        hasSpinner: false,
        maxTimeoutInSeconds: 10,
      });
      client.getChanges().then(
        (response: AxiosResponse) => {
          const { data } = response;
          setState({ current: States.GotStatus, data });
          context.hidePageOverlay();
        },
      );
      // @Todo catch error.
      setState({ current: States.GettingStatus });
      break;
    case States.Submitted:
      client.getChanges().then(
        (data: any) => setState({ current: States.Pulled, data }),
      );
      setState({ current: States.Pulling });
      break;
    default:
      break;
  }
}, [state, setState]);

type Props = {
  client: any;
};

const PullChangesForm = ({ client } : Props) => {
  const context = useEditContext();
  const [state, setState] = useState<State>({
    current: States.Initial,
  });
  useApiOnEffect({
    state, setState, client, context,
  });

  const submitValues = useCallback(() => {
    console.log('in inner submitValues', state.data);
    if (analyzeChanges(state.data) === ChangeStatus.CanBePulled) {
      setState({ current: States.Submitted });
      return true;
    }
    return false;
  }, [state]);

  return (
    <ContextMenuForm submitValues={submitValues} closeForm={() => {}}>
      {() => <Content state={state} />}
    </ContextMenuForm>
  );
};

export default PullChangesForm;
