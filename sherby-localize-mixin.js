import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { SherbyNestedPropertyMixin } from '@sherby/sherby-nested-property/sherby-nested-property-mixin.js';
import { UdeSLanguageMixin } from '@udeselements/udes-language-mixin/udes-language-mixin.js';

/**
 * A Polymer 3 mixin.
 * @polymer
 * @mixinFunction
 * @param {Class} superClass The super class.
 * @return {Class} Class.
 */
export const SherbyLocalizeMixin = superClass =>
  class extends SherbyNestedPropertyMixin(UdeSLanguageMixin(
    mixinBehaviors([AppLocalizeBehavior], superClass))
  ) {
    /**
     * Return the properties.
     * @static
     * @return {Object} Properties.
     */
    static get properties() {
      return {
        language: {
          type: String,
          computed: '__computeLanguageFromLang(lang)',
        },

        /**
        * Translates a string to the current `language`. Any parameters to
        * the string should be passed in order, as follows:
        * `localize(stringKey, param1Name, param1Value, ...)`
        *
        * If you want to use the nested localize file,
        * the `stringKey` parameter must use the `delimiterTranslation`.
        *
        * By exemple, if you want the *cheese* message, in the following
        * localized file, you must use the `pizza_cheese` key:
        *
        * {
        *  "pizza": {
        *   "cheese": {
        *     "description": "The primary ingredient of a pizza.",
        *     "message": "Fromage"
        *     }
        *   }
        * }
        *
        * Note: this property come from Polymer.AppLocalizeBehavior
        * and is declared here only to satisfy the Polymer Analyzer.
        * @public
        */
        localize: {
          type: Function,
        },

        /**
         * Sherby localize function.
         * The result function is copied to the `localize` function, as
         * I'm unable to override it with Polymer 3 with a computed function.
         * @public
        */
        sherbyLocalize: {
          type: Function,
          computed: '__computeLocalizeFunction(lang, resources, formats, extractTranslation)',
        },

        /**
         * If true, will use the provided key when
         * the translation does not exist for that key.
         * @public
         * @override from Polymer.AppLocalizeBehavior
         */
        useKeyIfMissing: {
          type: Boolean,
          value: false,
        },

        /**
         * The boundary string that will be use to explode
         * the provided key of the `localize` function.
         *
         * It is use to support nested localized files.
         * @public
         */
        delimiterTranslation: {
          type: String,
          value: '.',
        },

        /**
         * The path to the locales files.
         * @public
         */
        pathToLocales: {
          type: String,
          value: 'locales/',
        },

        /**
         * The function used to extract the translation from
         * yor localized files.
         * @public
         */
        extractTranslation: {
          type: Function,
          computed: '__computeExtractTranslation(getNestedPropertyOf, delimiterTranslation)',
        },
      };
    }

    /**
     * Return the observers.
     * @static
     * @return {Array<String>} Observers.
     */
    static get observers() {
      return [
        '_loadResourcesOnLanguageChanged(pathToLocales, lang)',
        '__updateLocalizeFunction(sherbyLocalize)',
      ];
    }

    /**
     * Load the resources file when the language change.
     * @protected
     * @param {String} pathToLocales Path to the locales files.
     * @param {String} lang Current language.
     */
    _loadResourcesOnLanguageChanged(pathToLocales, lang) {
      if (pathToLocales && lang) {
        const path = this.resolveUrl(`${pathToLocales}${lang}.json`);
        this.loadResources(path);
      }
    }

    /**
     * Compute the extract translation.
     * @param {Function} getNestedPropertyOf Function to obtain the nested property.
     * @param {String} delimiterTranslation The string to delimitate the translation.
     * @return {Function} Extract translation function.
     */
    __computeExtractTranslation(getNestedPropertyOf, delimiterTranslation) {
      let returnFunction;

      if (getNestedPropertyOf && delimiterTranslation) {
        returnFunction = (resources, lang, key) => {
          const translation = getNestedPropertyOf(resources, key, null, delimiterTranslation);
          return translation ? translation.message : null;
        };
      } else {
        returnFunction = (resources, lang, key) => {
          return resources ? resources[key] : null;
        };
      }

      return returnFunction;
    }

    __computeLanguageFromLang(lang) {
      return lang;
    }

    /**
     * Returns a computed `localize` method, based on the current `lang`.
     * @param {String} lang Current language.
     * @param {Object} resources Resources.
     * @param {Object} formats Formats.
     * @param {Function} extractTranslation Extract translation function.
     * @return {Function} Localize function.
     */
    __computeLocalizeFunction(lang, resources, formats, extractTranslation) {
      const proto = this.constructor.prototype;

      // Check if localCache exist just in case.
      this.__checkLocalizationCache(proto);

      // Everytime any of the parameters change, invalidate the strings cache.
      if (!proto.__localizationCache) {
        proto['__localizationCache'] = { requests: {}, messages: {}, ajax: null };
      }
      proto.__localizationCache.messages = {};

      return (...args) => {
        const key = args[0];

        if (!key || !resources || !lang || !extractTranslation) {
          return;
        }

        // Cache the key/value pairs for the same language, so that we don't
        // do extra work if we're just reusing strings across an application.
        const translatedValue = extractTranslation(resources, lang, key);

        if (!translatedValue) {
          return this.useKeyIfMissing ? key : '';
        }

        const messageKey = key + translatedValue;
        let translatedMessage = proto.__localizationCache.messages[messageKey];

        if (!translatedMessage) {
          translatedMessage = new IntlMessageFormat(translatedValue, lang, formats);
          proto.__localizationCache.messages[messageKey] = translatedMessage;
        }

        const formatArgs = {};
        for (let i = 1; i < args.length; i += 2) {
          formatArgs[args[i]] = args[i + 1];
        }

        return translatedMessage.format(formatArgs);
      };
    }

    /**
     * Update the `localize` function with the new computed localize function.
     * @param {Function} sherbyLocalize Sherby localize function.
     * @private
     */
    __updateLocalizeFunction(sherbyLocalize) {
      this.setProperties({
        localize: sherbyLocalize,
      }, true);
    }
  };
