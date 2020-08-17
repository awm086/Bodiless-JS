import React, { useEffect, useState } from 'react';
import { FormApi, FormState } from 'informed';

import { getUI, useEditContext } from '@bodiless/core';
import { ComponentFormSpinner } from '@bodiless/ui';
import { AxiosError } from 'axios';
import { GitClient } from './types';

enum ResetState {
  Init,
  Pending,
  Complete,
  Errored,
}

type ResetStatus = {
  status: ResetState;
  errorMessage?: string;
};

type Props = {
  ui: any,
  formState: FormState,
  formApi: FormApi,
  client: GitClient
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @todo remove.
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const reset = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));

/**
 * Form component for reverting local changes.
 *
 * @component
 * @param props Props
 * @constructor
 */
const Reset = (props: Props) => {
  const context = useEditContext();
  const {
    ui, formState, formApi, client,
  } = props;
  console.log(client);
  const {
    ComponentFormTitle,
    ComponentFormLabel,
    ComponentFormError,
    ComponentFormDescription,
  } = getUI(ui);
  const { submits, invalid } = formState;
  const [state, setState] = useState<ResetStatus>({
    status: ResetState.Init,
  });
  useEffect(() => {
    // If the form is submitted and valid then lets try reset.
    if (submits && invalid === false) {
      context.showPageOverlay({ hasSpinner: false });
      setState({ status: ResetState.Pending });
      client.reset()
        .then(() => {
          setState({ status: ResetState.Complete });
        })
        .catch((error : AxiosError) => {
          setState({ status: ResetState.Errored, errorMessage: error.message });
        })
        .finally(() => {
          context.hidePageOverlay();
          formApi.setValue('keepOpen', false);
        });
    }
  }, [submits]);

  const { status, errorMessage } = state;

  switch (status) {
    case ResetState.Pending:
      return (
        <>
          <ComponentFormTitle>Resetting...</ComponentFormTitle>
          <ComponentFormSpinner />
        </>
      );
    case ResetState.Complete:
      return (
        <>
          <ComponentFormTitle>Operation complete.</ComponentFormTitle>
          <ComponentFormDescription>Local changes were discarded.</ComponentFormDescription>
        </>
      );
    case ResetState.Errored:
      return (
        <>
          <ComponentFormError>{errorMessage}</ComponentFormError>
        </>
      );
    case ResetState.Init: {
      return (
        <>
          <ComponentFormTitle>Revert to saved</ComponentFormTitle>
          <ComponentFormLabel htmlFor="reset-txt">
            Discard local changes
          </ComponentFormLabel>
        </>
      );
    }
    default:
      return <></>;
  }
};

export default Reset;