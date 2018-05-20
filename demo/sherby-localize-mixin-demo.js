import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { SherbyLocalizeMixin } from '../sherby-localize-mixin.js';

/**
 * Demo element for the SherbyLocalizeMixin.
 * @polymer
 * @customElement
 * @extends {PolymerElement}
 * @appliesMixin SherbyLocalizeMixin
 */
class SherbyLocalizeMixinDemo extends SherbyLocalizeMixin(PolymerElement) {
  static get template() {
    return html`
      <h1>[[language]] ([[lang]])</h1>
      <h2>[[sherbyLocalize('meat-toppings')]]</h2>
      <ul>
        <li>[[localize('meat-toppings.bacon-pieces')]]</li>
        <li>[[localize('meat-toppings.pepperoni')]]</li>
      </ul>
    `;
  }
}

window.customElements.define('sherby-localize-mixin-demo', SherbyLocalizeMixinDemo);
