// Custom directive for focusing on an element when it's mounted
// Can be used like v-focus or v-focus.delay where delay adds a small timeout

import type { DirectiveBinding } from 'vue'

export const focus = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // If directive has .delay modifier, focus after a short delay (useful for elements in transitions)
    if (binding.modifiers.delay) {
      setTimeout(() => {
        el.focus()
      }, 100)
    } else {
      // Focus immediately
      el.focus()
    }
  }
}