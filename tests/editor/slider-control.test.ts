import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { CustomizePanel } from '@/components/editor/CustomizePanel';
import { SliderControl } from '@/components/editor/SliderControl';
import type { TemplateField } from '@/templates/types';

describe('SliderControl and CustomizePanel number fields', () => {
  it('inputs exist with correct min/max and accessible names', () => {
    const fields: TemplateField[] = [
      { key: 'rating', label: 'Star Rating', type: 'number', defaultValue: 4, min: 1, max: 5 },
    ];
    const html = renderToString(
      React.createElement(CustomizePanel, {
        fields,
        params: { rating: 4 },
        onParamChange: () => {},
        onReset: () => {},
      })
    );

    // Number input exists with min/max and accessible name
    expect(html).toMatch(/<input[^>]*type="number"[^>]*min="1"[^>]*max="5"/);
    expect(html).toMatch(/<input[^>]*type="number"[^>]*aria-label="Star Rating"/);

    // Range slider exists with min/max and accessible name
    expect(html).toMatch(/<input[^>]*type="range"[^>]*min="1"[^>]*max="5"/);
    expect(html).toMatch(/<input[^>]*type="range"[^>]*aria-label="Star Rating slider"/);
  });

  it('slider hidden when range > 10000, shown for small ranges', () => {
    const smallRangeFields: TemplateField[] = [
      { key: 'rating', label: 'Rating', type: 'number', defaultValue: 3, min: 1, max: 5 },
    ];
    const bigRangeFields: TemplateField[] = [
      { key: 'value1', label: 'Value 1', type: 'number', defaultValue: 112000, min: 0, max: 1_000_000_000 },
    ];

    const smallHtml = renderToString(
      React.createElement(CustomizePanel, {
        fields: smallRangeFields,
        params: { rating: 3 },
        onParamChange: () => {},
        onReset: () => {},
      })
    );
    expect(smallHtml).toContain('type="range"');
    expect(smallHtml).toContain('type="number"');

    const bigHtml = renderToString(
      React.createElement(CustomizePanel, {
        fields: bigRangeFields,
        params: { value1: 112000 },
        onParamChange: () => {},
        onReset: () => {},
      })
    );
    expect(bigHtml).not.toContain('type="range"');
    expect(bigHtml).toContain('type="number"');
  });

  it('Benchmark Value 4 starts empty and can be emptied again', () => {
    const benchmarkFields: TemplateField[] = [
      { key: 'value4', label: 'Value 4', type: 'number', defaultValue: '', min: 0, max: 1_000_000_000 },
    ];

    // Starts empty
    const initialHtml = renderToString(
      React.createElement(CustomizePanel, {
        fields: benchmarkFields,
        params: { value4: '' },
        onParamChange: () => {},
        onReset: () => {},
      })
    );
    const valueMatch = initialHtml.match(/<input[^>]*type="number"[^>]*value="([^"]*)"/);
    expect(valueMatch?.[1]).toBe('');

    // When value is provided
    const filledHtml = renderToString(
      React.createElement(CustomizePanel, {
        fields: benchmarkFields,
        params: { value4: 5000 },
        onParamChange: () => {},
        onReset: () => {},
      })
    );
    const filledMatch = filledHtml.match(/<input[^>]*type="number"[^>]*value="([^"]*)"/);
    expect(filledMatch?.[1]).toBe('5000');
  });

  it('slider and box stay in sync both directions', () => {
    const onChange = vi.fn();
    const element = React.createElement(SliderControl, {
      label: 'Rating',
      value: 3,
      min: 1,
      max: 5,
      onChange,
    });
    const html = renderToString(element);
    expect(html).toContain('value="3"');

    // Both range slider and number input have value="3"
    const rangeMatch = html.match(/<input[^>]*type="range"[^>]*value="([^"]*)"/);
    const numberMatch = html.match(/<input[^>]*type="number"[^>]*value="([^"]*)"/);
    expect(rangeMatch?.[1]).toBe('3');
    expect(numberMatch?.[1]).toBe('3');
  });

  it('interceptor harness captures event handlers and validates sync & boundaries', () => {
    let capturedSliderProps: any;
    let capturedNumberProps: any;

    const onChange = vi.fn();

    // A test wrapper that intercepts rendered props
    function TestWrapper({ allowEmpty }: { allowEmpty?: boolean }) {
      const v = SliderControl({
        label: 'Rating',
        value: 3,
        min: 1,
        max: 5,
        onChange,
        allowEmpty,
      });
      // The second child is the div.editor-slider-row
      const row = v.props.children[1];
      capturedSliderProps = row.props.children[0]?.props;
      capturedNumberProps = row.props.children[1]?.props;
      return v;
    }

    renderToString(React.createElement(TestWrapper));

    expect(capturedSliderProps).toBeDefined();
    expect(capturedNumberProps).toBeDefined();

    // 1. Slider change triggers onChange and updates value
    capturedSliderProps.onChange({ target: { value: '4' } });
    expect(onChange).toHaveBeenLastCalledWith(4);

    // 2. Number input valid change triggers onChange
    capturedNumberProps.onChange({ target: { value: '5' } });
    expect(onChange).toHaveBeenLastCalledWith(5);

    // 3. Out-of-range never committed
    onChange.mockClear();
    capturedNumberProps.onChange({ target: { value: '10' } });
    expect(onChange).not.toHaveBeenCalled();

    capturedNumberProps.onChange({ target: { value: '0' } });
    expect(onChange).not.toHaveBeenCalled();

    // 4. Non-numeric or mid-edit never committed
    onChange.mockClear();
    capturedNumberProps.onChange({ target: { value: '-' } });
    expect(onChange).not.toHaveBeenCalled();

    capturedNumberProps.onChange({ target: { value: 'abc' } });
    expect(onChange).not.toHaveBeenCalled();

    // 5. Empty on non-allowEmpty does not commit ''
    onChange.mockClear();
    capturedNumberProps.onChange({ target: { value: '' } });
    expect(onChange).not.toHaveBeenCalled();

    // 6. Empty on allowEmpty commits ''
    renderToString(React.createElement(TestWrapper, { allowEmpty: true }));
    onChange.mockClear();
    capturedNumberProps.onChange({ target: { value: '' } });
    expect(onChange).toHaveBeenLastCalledWith('');
  });
});
