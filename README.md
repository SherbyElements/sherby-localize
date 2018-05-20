[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/SherbyElements/sherby-localize)
[![Build status](https://travis-ci.org/SherbyElements/sherby-localize.svg?branch=master)](https://travis-ci.org/SherbyElements/sherby-localize)

# Sherby.LocalizeMixin
If you want to **translate**, to **localize** your application or simply only 
**regroup** all static texts, the `Sherby.LocalizeMixin` can help you.

The mixin internally use a [fork][2] of [AppLocalizeBehavior][3] to wraps the
[Format.js][4] library with [Chrome.i18n][5] translation files. The 
*Chrome.i18n* format allow to add an optional `description` associated with 
the translation (`message`), to give an additional context to translators.

By exemple, a *locales/en-CA.json* file:
```json
{
  "meat-toppings": {
    "description": "A pizza is nothing without meat.",
    "message": "Meat Toppings",
  }
}
```

If you want to have **nested** localization files, as below, you simply need
to provide all keys of the nested object, separate by **.** (delimiter by 
default). By exemple, the key `meat-toppings.bacon-pieces` will provide the 
correct translation (Bacon Pieces) for the following json file:

```json
{
  "meat-toppings": {
    "bacon-pieces": {
      "description": "Bacon is life!",
      "message": "Bacon Pieces"
    }
  }
}
```

Also, as this mixin use the *[UdeS.LanguageMixin][1]*, the localized file 
associated with the current language is dynamically loaded and the localised 
texts are automatically translated when the current language change.

## Usage
- Add the `@sherby/sherby-localize` dependency to your projet:
  ```bash
  npm install @sherby/sherby-localize
  ```

- Create the locales directory near the component you want localized
  and add the localize files:

  *locales/en-CA.json*
  ```json
  {
    "bacon-pieces": {
      "description": "Bacon is life!",
      "message": "Bacon Pieces"
    }
  }
  ```

  *locales/fr.json*
  ```json
  {
    "bacon-pieces": {
      "description": "Bacon is life!",
      "message": "Morceaux de bacon"
    }
  }
  ```

- Use it
    ```javascript
    // Import the `SherbyLocalizeMixin` inside the component you want localized
    import { SherbyLocalizeMixin } from '@sherby/sherby-localize/sherby-localize-mixin.js';
    import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

    /* eslint-disable no-unused-vars */

    // Apply the mixin to your element class
    /**
     * @customElement
     * @polymer
     * @extends {PolymerElement}
     * @appliesMixin SherbyLocalizeMixin
     */
    class MyElement extends SherbyLocalizeMixin(PolymerElement) {
      static get template() {
        // Use the `localize` function to translate all texts
        return html`
          <h2>[[localize('meat-toppings')]]</h2>
        `;
      }

      /**
       * Get the localized bacon pieces string.
       * @param {Function} localize Localize function.
       * @return {String} Localized bacon pieces.
       */
      getLocalizedBaconPieces(localize) {
        return localize('meat-toppings.bacon-pieces') || '';
      }
    }
    ```

## Demo
<!--
```
<custom-element-demo>
  <template>
    <link rel="import" href="demo/sherby-localize-demo.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<sherby-localize-demo></sherby-localize-demo>
```

## Language aware with UdeS.LanguageMixin
If you want your component to be aware of the current language only,
you should take a look on *[UdeSLanguageMixin][1]*, a mixin used by 
`SherbyLocalizeMixin`.

## Thanks
Special thanks to the [Collaborne team](https://github.com/Collaborne) for his [app-localize-chrome-i18n-mixin](https://github.com/Collaborne/app-localize-chrome-i18n-mixin) mixin that inspired me for this mixin.

[1]: https://www.webcomponents.org/element/UdeSElements/udes-language-mixin "UdeSLanguageMixin"
[2]: https://github.com/Collaborne/app-localize-behavior#fix/103 "Fix made by Collaborne team"
[3]: https://github.com/PolymerElements/app-localize-behavior "Polymer.AppLocalizeBehavior"
[4]: https://formatjs.io/ "Format.js"
[5]: https://developer.chrome.com/apps/i18n "chrome.i18n"
