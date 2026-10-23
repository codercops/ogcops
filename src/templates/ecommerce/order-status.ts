import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, contrastText, isLightColor, mixColors, truncate } from '../utils';

const steps = ['Ordered', 'Shipped', 'Out for delivery', 'Delivered'];

const template: TemplateDefinition = {
  id: 'ecommerce-order-status',
  name: 'Order Status',
  category: 'ecommerce',
  description: 'Product order update with a four-step delivery tracker',
  tags: ['ecommerce', 'order', 'shipping', 'delivery', 'status'],
  fields: [
    commonFields.siteName,
    commonFields.title,
    { key: 'orderNumber', label: 'Order Number', type: 'text', defaultValue: '#10482', placeholder: '#10482', group: 'Content' },
    { key: 'currentStep', label: 'Current Step (1-4)', type: 'number', defaultValue: 2, min: 1, max: 4, group: 'Content' },
    { key: 'estimate', label: 'Estimated Delivery', type: 'text', defaultValue: 'Arrives Friday, Oct 24', placeholder: 'Arrives Friday, Oct 24', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    siteName: 'Northstar Supply',
    title: 'Classic Canvas Weekender Bag',
    orderNumber: '#10482',
    currentStep: 2,
    estimate: 'Arrives Friday, Oct 24',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your order'), 72);
    const titleSize = autoFontSize(title, [
      { maxLen: 28, size: 48 },
      { maxLen: 44, size: 40 },
      { maxLen: 60, size: 34 },
      { maxLen: 72, size: 30 },
    ]);
    const siteName = String(params.siteName || '');
    const orderNumber = String(params.orderNumber || '').trim();
    const estimate = String(params.estimate || '').trim();
    const stepValue = String(params.currentStep ?? '').trim();
    const parsedStep = stepValue ? Number(stepValue) : Number.NaN;
    const currentStep = Number.isFinite(parsedStep)
      ? Math.min(4, Math.max(1, Math.round(parsedStep)))
      : 2;
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const progressColor = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const mutedColor = mixColors(bgColor, textColor, 0.68);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          padding: '56px 72px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '30px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '18px', fontWeight: 700, color: textColor, letterSpacing: '0.04em' },
                    children: siteName,
                  },
                },
                ...(orderNumber
                  ? [{
                      type: 'span',
                      props: {
                        style: {
                          display: 'flex',
                          fontSize: '17px',
                          fontWeight: 600,
                          color: mutedColor,
                        },
                        children: `Order ${orderNumber}`,
                      },
                    }]
                  : []),
              ],
            },
          },
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.15,
                margin: 0,
                marginBottom: '56px',
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'relative',
                width: '100%',
                marginBottom: '28px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      position: 'absolute',
                      left: '12.5%',
                      right: '12.5%',
                      top: '21px',
                      height: '4px',
                      backgroundColor: `${progressColor}40`,
                      borderRadius: '4px',
                    },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      position: 'absolute',
                      left: '12.5%',
                      top: '21px',
                      width: `${((currentStep - 1) / 3) * 75}%`,
                      height: '4px',
                      backgroundColor: progressColor,
                      borderRadius: '4px',
                    },
                  },
                },
                ...steps.map((step, index) => {
                  const isComplete = index + 1 <= currentStep;
                  return {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                      },
                      children: [
                        {
                          type: 'div',
                          props: {
                            style: {
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '46px',
                              height: '46px',
                              borderRadius: '50%',
                              border: `3px solid ${isComplete ? progressColor : `${textColor}55`}`,
                              backgroundColor: isComplete ? progressColor : bgColor,
                              color: isComplete ? contrastText(progressColor) : mutedColor,
                              fontSize: '18px',
                              fontWeight: 700,
                            },
                            children: `${index + 1}`,
                          },
                        },
                        {
                          type: 'span',
                          props: {
                            style: {
                              display: 'flex',
                              justifyContent: 'center',
                              width: '100%',
                              marginTop: '16px',
                              textAlign: 'center',
                              fontSize: '16px',
                              fontWeight: isComplete ? 600 : 500,
                              color: isComplete ? progressColor : mutedColor,
                              lineHeight: 1.25,
                            },
                            children: step,
                          },
                        },
                      ],
                    },
                  };
                }),
              ],
            },
          },
          ...(estimate
            ? [{
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '10px',
                  },
                  children: {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '20px',
                        fontWeight: 600,
                        color: textColor,
                      },
                      children: estimate,
                    },
                  },
                },
              }]
            : []),
        ],
      },
    };
  },
};

export default template;
