import { describe, it, expect, vi, beforeEach } from 'vitest';
import { focus } from '../../../directives/focus';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';

describe('focus directive', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('focuses the element immediately when mounted', () => {
    // Create a test component that uses the focus directive
    const TestComponent = defineComponent({
      template: '<input v-focus />',
      directives: { focus }
    });

    // Create a spy on the focus method before mounting
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
    
    // Clear any previous calls
    focusSpy.mockClear();
    
    // Mount the component
    mount(TestComponent);

    // Check that focus was called immediately
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('focuses the element with delay when delay modifier is used', () => {
    // Create a test component with the delay modifier
    const TestComponent = defineComponent({
      template: '<input v-focus.delay />',
      directives: { focus }
    });

    // Create a spy on the focus method before mounting
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
    
    // Clear any previous calls
    focusSpy.mockClear();
    
    // Mount the component
    mount(TestComponent);

    // Check that focus wasn't called immediately
    expect(focusSpy).not.toHaveBeenCalled();

    // Fast-forward time by 100ms
    vi.advanceTimersByTime(100);

    // Now focus should have been called
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });
});