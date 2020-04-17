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

import {
  withEditButton,
  getUI,
  useEditContext,
} from '@bodiless/core';
import React from 'react';

// Options used to create an edit button.
export const tagButtonOptions = {
    icon: 'local_offer',
    name: 'Tag',
    renderForm: ({ui, props}) => {
      const {
        ComponentFormTitle,
        ComponentFormLabel,
        ComponentFormUnwrapButton,
        ReactTags,
      } = getUI(ui);

      const {
        getSuggestions = () => [],
        placeholder = 'Select Tags',
        noSuggestionsText = 'No maching tags found.',
        minQueryLength = 1,
        allowNew = true,
        allowMultipleTags = true,
        inputAttributes = {name:'react-tags-input'}
      } = props;

      const suggestions = getSuggestions();

      const context = useEditContext();
      const displayListOfTags = () =>
        context.showPageOverlay({
          message: suggestions
            .slice()
            .reduce((acc, _tag) => `${acc}\n${_tag.name}`, ''),
          hasSpinner: false,
          hasCloseButton: true,
        });

      return (
        <>
          <ComponentFormTitle>Tags: </ComponentFormTitle>
          <ComponentFormLabel>Select from available tags:</ComponentFormLabel>
          <ReactTags
            suggestions={suggestions}
            placeholder={placeholder}
            noSuggestionsText={noSuggestionsText}
            minQueryLength={minQueryLength}
            allowNew={allowNew}
            allowMultipleTags={allowMultipleTags}
            inputAttributes={inputAttributes}
          />
          <ComponentFormUnwrapButton type="button" onClick={displayListOfTags}>
            See All Tags
          </ComponentFormUnwrapButton>
        </>
      );
    },

    global: false,
    local: true,

};
const withTagButton = () => withEditButton(tagButtonOptions);
export default withTagButton;
