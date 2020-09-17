import React, { ComponentType as CT } from 'react';
import { flowRight } from 'lodash';
import { v1 } from 'uuid';
import {
  useMenuOptionUI, useRegisterSnippet, withCompoundForm, withEditFormSnippet,
} from '@bodiless/core';
import type { FormSnippet, TMenuOption } from '@bodiless/core';
import { Div } from '@bodiless/fclasses';

export enum FieldType {
  Text = 'text',
  TextArea = 'textarea',
}

export type HeaderProps = {
  title: string,
  description: string,
};

export type GTMSnippetOptions = {
  name: string,
  label: string,
  scope?: string,
  useFormElement?: Function,
  placeholder?: string,
  submitHandler?: Function,
  initalValueHandler?: Function,
};
// @todo : consider adding withHelmet snippet that takes datahanlder.
export const withGTMSnippet = (
  options: GTMSnippetOptions,
) => withEditFormSnippet({
  renderForm: () => {
    const {
      name, label, placeholder, useFormElement,
    } = options;
    const { ComponentFormLabel, ComponentFormText } = useMenuOptionUI();
    const Field = useFormElement ? useFormElement() : ComponentFormText;
    return (
      <Div key={name}>
        <ComponentFormLabel>{label}</ComponentFormLabel>
        <Field field={name} placeholder={placeholder} />
      </Div>
    );
  },
  submitValueHandler: (values: any) => {
    const { name, submitHandler: nextSubmitHandler } = options;
    const submitValues = { content: { [name]: values[name] } };
    return nextSubmitHandler ? nextSubmitHandler(submitValues) : submitValues;
  },
  initialValueHandler: (values) => {
    const { name, initalValueHandler: nextInitialValuesHandler } = options;
    const initialValues = { [name]: values.content[name] };
    return nextInitialValuesHandler ? nextInitialValuesHandler(initialValues) : initialValues;
  },
});

const withGTMFormHeader = (headerProps: HeaderProps | undefined) => (Component: CT) => {
  const gtmHeaderSnippet: FormSnippet<any> = {
    id: v1(),
    render: () => {
      if (!headerProps) return <></>;
      const { ComponentFormTitle, ComponentFormDescription } = useMenuOptionUI();
      return (
        <Div key="form-header">
          <ComponentFormTitle>{headerProps.title}</ComponentFormTitle>
          <ComponentFormDescription>{headerProps.description}</ComponentFormDescription>
        </Div>
      );
    },
  };

  const WithFormHeader = (props: any) => {
    useRegisterSnippet(gtmHeaderSnippet);
    return <Component {...props} />;
  };
  return WithFormHeader;
};

const defaultGTMFormHeader = {
  title: 'GTM Data Management',
  description: `Enter the page level data used for SEO. 
  This is gtmdata needed for SEO that will go in the page header.`,
};

const withGTMForm = (
  useMenuOptions: (props: any) => TMenuOption[],
  gtmFormHeader?: HeaderProps,
) => flowRight(
  withCompoundForm({
    useMenuOptions, name: 'GTM', peer: true, id: 'gtm',
  }),
  withGTMFormHeader(gtmFormHeader || defaultGTMFormHeader),
);

export default withGTMForm;
