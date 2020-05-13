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
  useState, useEffect, FC, useCallback, SetStateAction, Dispatch,
} from 'react';
import { useEditContext, ContextMenuForm } from '@bodiless/core';
import { Spinner } from '@bodiless/ui';


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

const analyzeChanges: (s: State) => ChangeStatus = (state: State) => {
  if (state.current !== States.GotStatus) return ChangeStatus.Unknown;
  // @TODO Do a real analysis of the changes.
  console.log(state.data);
  return state.data.upstream ? ChangeStatus.CanBePulled : ChangeStatus.NoneAvailable;
};

const GotStatus: FC<{state: State}> = ({ state }) => {
  switch (analyzeChanges(state)) {
    case ChangeStatus.CanBePulled:
      return <>Changes available.  Check to continue.</>;
    case ChangeStatus.NoneAvailable:
      return <>No changes available</>;
    default:
      return <>Changes available but they can't be pulled</>;
  }
};

const Pulled: FC<{state: State}> = ({ state }) => (
  state.data.error
    ? (<>{state.data.error.msg}</>)
    : (<>Operation Successful</>)
);

const Content: FC<{state: State}> = ({ state }) => {
  switch (state.current) {
    case States.GotStatus:
      return <GotStatus state={state} />;
    case States.Pulled:
      return <Pulled state={state} />;
    default:
      return <Spinner />;
  }
};

const useApiOnEffect = ({
  state, setState, client, context,
}) => useEffect(() => {
  switch (state.current) {
    case States.Initial:
      context.showPageOverlay({
        hasSpinner: false,
        maxTimeoutInSeconds: 10,
      });
      client.getChanges().then(
        data => {
          setState({ current: States.GotStatus, data });
          context.hidePageOverlay();
        },
      );
      setState({ current: States.GettingStatus });
      break;
    case States.Submitted:
      pullChangesViaAPI().then(
        data => setState({ current: States.Pulled, data }),
      );
      setState({ current: States.Pulling });
      break;
  }
}, [state, setState]);

const pullChangesViaAPI = () => Promise.resolve({});

const PullChangesForm = ({ client }) => {
  const context = useEditContext();
  const [state, setState] = useState<State>({
    current: States.Initial,
  });
  useApiOnEffect({
    state, setState, client, context,
  });

  const submitValues = useCallback(() => {
    if (analyzeChanges(state.data) === ChangeStatus.CanBePulled) {
      setState({ current: States.Submitted });
      return true;
    }
  }, [state]);

  return (
    <ContextMenuForm submitValues={submitValues}>
      {() => <Content state={state} />}
    </ContextMenuForm>
  );
};

export default PullChangesForm;
