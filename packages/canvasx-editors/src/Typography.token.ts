/**
 * Copyright © 2021 Johnson & Johnson
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
import { addClasses, asToken } from '@bodiless/fclasses';

const asBold = asToken(
  addClasses('font-bold'),
  {
    categories: {
      Category: ['Typography'],
      Attribute: ['Font Weight', 'Style'],
      Component: ['Element'],
    },
  },
);

const withItalic = asToken(
  addClasses('italic'),
  {
    categories: {
      Category: ['Typography'],
      Attribute: ['Font Style', 'Style'],
      Component: ['Element'],
    },
  },
);

const withRichTextLinkStyle = asToken(
  addClasses('underline'),
  {
    categories: {
      Category: ['Typography'],
      Attribute: ['Link', 'Font Color', 'Font Decoration', 'Style'],
      Component: ['Element'],
    },
  },
);

const withLinkStyle = asToken(
  addClasses('underline'),
  {
    categories: {
      Category: ['Typography'],
      Attribute: ['Link', 'Font Color', 'Font Decoration', 'Style'],
      Component: ['Element'],
    },
  },
);

const asUnderline = asToken(
  addClasses('underline'),
  {
    categories: {
      Category: ['Typography'],
      Attribute: ['Font Decoration', 'Style'],
      Component: ['Element'],
    },
  },
);

const withTextAlignLeft = asToken(
  addClasses('text-left'),
  {
    categories: {
      Category: ['Typography'],
      Attribute: ['Text Align', 'Style'],
      Component: ['Element'],
    },
  },
);

const withTextAlignRight = asToken(
  addClasses('text-right'),
  {
    categories: {
      Category: ['Typography'],
      Attribute: ['Text Align', 'Style'],
      Component: ['Element'],
    },
  },
);

const withTextAlignCenter = asToken(
  addClasses('text-center'),
  {
    categories: {
      Category: ['Typography'],
      Attribute: ['Text Align', 'Style'],
      Component: ['Element'],
    },
  },
);

const withTextAlignJustify = asToken(
  addClasses('text-justify'),
  {
    categories: {
      Category: ['Typography'],
      Attribute: ['Text Align', 'Style'],
      Component: ['Element'],
    },
  },
);

const asSuperScript = asToken(
  addClasses(''),
  {
    categories: {
      Category: ['Typography'],
      Attribute: ['', 'Style'],
      Component: ['Element'],
    },
  },
);

const asHeader1 = asToken(
  addClasses('text-2xl'),
  {
    categories: {
      Category: ['Typography'],
      Attribute: ['Header', 'Font Size', 'Font Color', 'Style'],
      Component: ['Element'],
    },
  },
);

const asHeader2 = asToken(
  addClasses('text-xl'),
  {
    categories: {
      Category: ['Typography'],
      Attribute: ['Header', 'Font Size', 'Font Color', 'Style'],
      Component: ['Element'],
    },
  },
);

const asHeader3 = asToken(
  addClasses('text-lg'),
  {
    categories: {
      Category: ['Typography'],
      Attribute: ['Header', 'Font Size', 'Font Color', 'Style'],
      Component: ['Element'],
    },
  },
);

const withIndent = asToken(
  addClasses('pl-3'),
  {
    categories: {
      Category: ['Typography'],
      Attribute: ['Header', 'Font Size', 'Font Color', 'Style'],
      Component: ['Element'],
    },
  },
);

export {
  asBold,
  withItalic,
  withRichTextLinkStyle,
  withLinkStyle,
  asUnderline,
  withTextAlignLeft,
  withTextAlignRight,
  withTextAlignCenter,
  withTextAlignJustify,
  asSuperScript,
  asHeader1,
  asHeader2,
  asHeader3,
  withIndent,
};
