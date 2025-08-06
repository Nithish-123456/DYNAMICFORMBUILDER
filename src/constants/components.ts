import { ComponentDefinition } from '../types/form';

export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
  // Fields
  { 
    type: 'autocomplete', 
    category: 'fields', 
    name: 'Autocomplete', 
    icon: '🔍', 
    defaultProps: { label: 'Autocomplete', options: [], placeholder: 'Type to search...', multiple: false }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 2 },
    advancedProps: ['multiple', 'minChars', 'maxResults', 'apiUrl'],
    availableActions: ['onChange', 'onSelect', 'onSearch']
  },
  { 
    type: 'calendar', 
    category: 'fields', 
    name: 'Calendar', 
    icon: '📅', 
    defaultProps: { label: 'Calendar', format: 'YYYY-MM-DD', minDate: '', maxDate: '' }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 4 },
    advancedProps: ['format', 'minDate', 'maxDate', 'disabledDates'],
    availableActions: ['onChange', 'onDateSelect']
  },
  { 
    type: 'datepicker', 
    category: 'fields', 
    name: 'Date Picker', 
    icon: '📆', 
    defaultProps: { label: 'Date Picker', format: 'YYYY-MM-DD', placeholder: 'Select date' }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 2 },
    advancedProps: ['format', 'minDate', 'maxDate', 'showTime'],
    availableActions: ['onChange', 'onOpen', 'onClose']
  },
  { 
    type: 'checkbox', 
    category: 'fields', 
    name: 'Checkbox', 
    icon: '☑️', 
    defaultProps: { label: 'Checkbox', checked: false, value: 'true' }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 1 },
    advancedProps: ['value', 'indeterminate'],
    availableActions: ['onChange', 'onClick']
  },
  { 
    type: 'dropdown', 
    category: 'fields', 
    name: 'Dropdown', 
    icon: '⬇️', 
    defaultProps: { 
      label: 'Dropdown', 
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' }
      ], 
      placeholder: 'Select an option',
      multiple: false,
      searchable: false,
      optionSource: 'static'
    }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 2 },
    advancedProps: ['multiple', 'searchable', 'clearable', 'optionSource', 'apiUrl', 'labelField', 'valueField'],
    availableActions: ['onChange', 'onOpen', 'onClose', 'onSearch']
  },
  { 
    type: 'googlemap', 
    category: 'fields', 
    name: 'Google Map', 
    icon: '🗺️', 
    defaultProps: { label: 'Map', zoom: 10, center: { lat: 0, lng: 0 }, markers: [] }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 12, h: 6 },
    advancedProps: ['zoom', 'center', 'markers', 'mapType', 'controls'],
    availableActions: ['onMapClick', 'onMarkerClick', 'onZoomChange']
  },
  { 
    type: 'input', 
    category: 'fields', 
    name: 'Input', 
    icon: '📝', 
    defaultProps: { label: 'Input', placeholder: 'Enter text', type: 'text', maxLength: '' }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 2 },
    advancedProps: ['type', 'maxLength', 'minLength', 'pattern', 'autocomplete'],
    availableActions: ['onChange', 'onFocus', 'onBlur', 'onKeyPress']
  },
  { 
    type: 'numberformat', 
    category: 'fields', 
    name: 'Number Format', 
    icon: '🔢', 
    defaultProps: { label: 'Number', format: '#,##0.00', prefix: '', suffix: '', min: '', max: '' }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 2 },
    advancedProps: ['format', 'prefix', 'suffix', 'min', 'max', 'step', 'decimalScale'],
    availableActions: ['onChange', 'onFocus', 'onBlur']
  },
  { 
    type: 'patternformat', 
    category: 'fields', 
    name: 'Pattern Format', 
    icon: '🎭', 
    defaultProps: { label: 'Pattern', format: '###-###-####', mask: '_', placeholder: 'Enter pattern' }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 2 },
    advancedProps: ['format', 'mask', 'allowEmptyFormatting'],
    availableActions: ['onChange', 'onFocus', 'onBlur']
  },
  { 
    type: 'radiogroup', 
    category: 'fields', 
    name: 'Radio Group', 
    icon: '⭕', 
    defaultProps: { 
      label: 'Radio Group', 
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' }
      ],
      layout: 'vertical'
    }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 3 },
    advancedProps: ['layout', 'optionSource', 'apiUrl'],
    availableActions: ['onChange']
  },
  { 
    type: 'richtexteditor', 
    category: 'fields', 
    name: 'Rich Text Editor', 
    icon: '📄', 
    defaultProps: { label: 'Rich Text', toolbar: 'basic', height: 200 }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 12, h: 6 },
    advancedProps: ['toolbar', 'height', 'plugins', 'formats'],
    availableActions: ['onChange', 'onFocus', 'onBlur']
  },
  { 
    type: 'search', 
    category: 'fields', 
    name: 'Search', 
    icon: '🔍', 
    defaultProps: { label: 'Search', placeholder: 'Search...', debounce: 300 }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 2 },
    advancedProps: ['debounce', 'minChars', 'searchUrl'],
    availableActions: ['onSearch', 'onChange', 'onClear']
  },
  { 
    type: 'signature', 
    category: 'fields', 
    name: 'Signature', 
    icon: '✍️', 
    defaultProps: { label: 'Signature', width: 400, height: 200, penColor: '#000000' }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 8, h: 4 },
    advancedProps: ['width', 'height', 'penColor', 'backgroundColor'],
    availableActions: ['onChange', 'onClear', 'onEnd']
  },
  { 
    type: 'tagpicker', 
    category: 'fields', 
    name: 'Tag Picker', 
    icon: '🏷️', 
    defaultProps: { label: 'Tags', options: [], allowCustom: true, maxTags: 0 }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 2 },
    advancedProps: ['allowCustom', 'maxTags', 'separator', 'apiUrl'],
    availableActions: ['onChange', 'onAdd', 'onRemove']
  },
  { 
    type: 'textarea', 
    category: 'fields', 
    name: 'Textarea', 
    icon: '📃', 
    defaultProps: { label: 'Textarea', placeholder: 'Enter text', rows: 4, maxLength: '' }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 3 },
    advancedProps: ['rows', 'maxLength', 'minLength', 'resize'],
    availableActions: ['onChange', 'onFocus', 'onBlur']
  },
  { 
    type: 'timepicker', 
    category: 'fields', 
    name: 'Time Picker', 
    icon: '⏰', 
    defaultProps: { label: 'Time', format: 'HH:mm', step: 15 }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 2 },
    advancedProps: ['format', 'step', 'minTime', 'maxTime'],
    availableActions: ['onChange', 'onOpen', 'onClose']
  },
  { 
    type: 'toggle', 
    category: 'fields', 
    name: 'Toggle', 
    icon: '🔄', 
    defaultProps: { label: 'Toggle', checked: false, size: 'medium' }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 1 },
    advancedProps: ['size', 'color', 'disabled'],
    availableActions: ['onChange', 'onClick']
  },
  { 
    type: 'uploader', 
    category: 'fields', 
    name: 'Uploader', 
    icon: '📤', 
    defaultProps: { label: 'Upload File', accept: '*', multiple: false, maxSize: 10 }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 3 },
    advancedProps: ['accept', 'multiple', 'maxSize', 'uploadUrl', 'dragDrop'],
    availableActions: ['onChange', 'onUpload', 'onError', 'onProgress']
  },

  // Static
  { 
    type: 'button', 
    category: 'static', 
    name: 'Button', 
    icon: '🔘', 
    defaultProps: { text: 'Button', variant: 'primary', size: 'medium', disabled: false }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 3, h: 1 },
    advancedProps: ['variant', 'size', 'disabled', 'loading', 'icon'],
    availableActions: ['onClick', 'onMouseEnter', 'onMouseLeave']
  },
  { 
    type: 'divider', 
    category: 'static', 
    name: 'Divider', 
    icon: '➖', 
    defaultProps: { orientation: 'horizontal', thickness: 1, color: '#e5e7eb' }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 12, h: 1 },
    advancedProps: ['orientation', 'thickness', 'color', 'dashed'],
    availableActions: []
  },
  { 
    type: 'errormessage', 
    category: 'static', 
    name: 'Error Message', 
    icon: '❌', 
    defaultProps: { message: 'Error message', type: 'error', dismissible: false }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 1 },
    advancedProps: ['type', 'dismissible', 'autoHide', 'duration'],
    availableActions: ['onDismiss']
  },
  { 
    type: 'header', 
    category: 'static', 
    name: 'Header', 
    icon: '📋', 
    defaultProps: { text: 'Header', level: 1, align: 'left' }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 12, h: 2 },
    advancedProps: ['level', 'align', 'underline', 'color'],
    availableActions: ['onClick']
  },
  { 
    type: 'image', 
    category: 'static', 
    name: 'Image', 
    icon: '🖼️', 
    defaultProps: { src: '', alt: 'Image', fit: 'cover', lazy: true }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 4 },
    advancedProps: ['fit', 'lazy', 'fallback', 'preview'],
    availableActions: ['onClick', 'onLoad', 'onError']
  },
  { 
    type: 'label', 
    category: 'static', 
    name: 'Label', 
    icon: '🏷️', 
    defaultProps: { text: 'Label', size: 'medium', weight: 'normal' }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 3, h: 1 },
    advancedProps: ['size', 'weight', 'color', 'italic'],
    availableActions: ['onClick']
  },
  { 
    type: 'link', 
    category: 'static', 
    name: 'Link', 
    icon: '🔗', 
    defaultProps: { text: 'Link', href: '#', target: '_self', underline: true }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 3, h: 1 },
    advancedProps: ['target', 'underline', 'color', 'visited'],
    availableActions: ['onClick', 'onMouseEnter', 'onMouseLeave']
  },
  { 
    type: 'menu', 
    category: 'static', 
    name: 'Menu', 
    icon: '📋', 
    defaultProps: { 
      items: [
        { label: 'Item 1', value: 'item1' },
        { label: 'Item 2', value: 'item2' }
      ], 
      orientation: 'vertical' 
    }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 3 },
    advancedProps: ['orientation', 'selectable', 'multiple'],
    availableActions: ['onSelect', 'onItemClick']
  },
  { 
    type: 'message', 
    category: 'static', 
    name: 'Message', 
    icon: '💬', 
    defaultProps: { text: 'Message', type: 'info', closable: false }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 2 },
    advancedProps: ['type', 'closable', 'showIcon', 'banner'],
    availableActions: ['onClose']
  },
  { 
    type: 'placeholdergraph', 
    category: 'static', 
    name: 'Placeholder Graph', 
    icon: '📊', 
    defaultProps: { type: 'bar', animated: true }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 8, h: 4 },
    advancedProps: ['type', 'animated', 'color', 'showGrid'],
    availableActions: []
  },
  { 
    type: 'placeholdergrid', 
    category: 'static', 
    name: 'Placeholder Grid', 
    icon: '🔲', 
    defaultProps: { rows: 3, columns: 3, animated: true }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 8, h: 4 },
    advancedProps: ['rows', 'columns', 'animated', 'spacing'],
    availableActions: []
  },
  { 
    type: 'progressline', 
    category: 'static', 
    name: 'Progress Line', 
    icon: '📶', 
    defaultProps: { value: 50, max: 100, showText: true, color: '#3b82f6' }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 1 },
    advancedProps: ['max', 'showText', 'color', 'striped', 'animated'],
    availableActions: ['onChange']
  },
  { 
    type: 'progresscircle', 
    category: 'static', 
    name: 'Progress Circle', 
    icon: '⭕', 
    defaultProps: { value: 50, max: 100, size: 120, strokeWidth: 8 }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 4, h: 4 },
    advancedProps: ['max', 'size', 'strokeWidth', 'color', 'showText'],
    availableActions: ['onChange']
  },
  { 
    type: 'qrcode', 
    category: 'static', 
    name: 'QR Code', 
    icon: '📱', 
    defaultProps: { value: 'QR Code', size: 128, level: 'M' }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 4, h: 4 },
    advancedProps: ['size', 'level', 'includeMargin', 'fgColor', 'bgColor'],
    availableActions: ['onClick']
  },
  { 
    type: 'staticcontent', 
    category: 'static', 
    name: 'Static Content', 
    icon: '📄', 
    defaultProps: { content: 'Static content', format: 'text' }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 2 },
    advancedProps: ['format', 'sanitize', 'linkify'],
    availableActions: ['onClick']
  },

  // Structure
  { 
    type: 'breadcrumb', 
    category: 'structure', 
    name: 'Breadcrumb', 
    icon: '🍞', 
    defaultProps: { 
      items: [
        { label: 'Home', href: '/' },
        { label: 'Current Page', href: '#' }
      ], 
      separator: '/' 
    }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 12, h: 1 },
    advancedProps: ['separator', 'maxItems'],
    availableActions: ['onItemClick']
  },
  { 
    type: 'card', 
    category: 'structure', 
    name: 'Card', 
    icon: '🃏', 
    defaultProps: { title: 'Card Title', bordered: true, hoverable: false }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 4 },
    advancedProps: ['bordered', 'hoverable', 'loading', 'size'],
    availableActions: ['onClick', 'onMouseEnter', 'onMouseLeave']
  },
  { 
    type: 'container', 
    category: 'structure', 
    name: 'Container', 
    icon: '📦', 
    defaultProps: { fluid: false, centered: true }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 12, h: 6 },
    advancedProps: ['fluid', 'centered', 'maxWidth'],
    availableActions: []
  },
  { 
    type: 'repeater', 
    category: 'structure', 
    name: 'Repeater', 
    icon: '🔄', 
    defaultProps: { dataSource: 'static', minItems: 1, maxItems: 10 }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 12, h: 6 },
    advancedProps: ['dataSource', 'minItems', 'maxItems', 'addButton', 'removeButton'],
    availableActions: ['onAdd', 'onRemove', 'onChange']
  },
  { 
    type: 'tab', 
    category: 'structure', 
    name: 'Tab', 
    icon: '📑', 
    defaultProps: { 
      tabs: [
        { key: 'tab1', label: 'Tab 1', content: 'Content 1' },
        { key: 'tab2', label: 'Tab 2', content: 'Content 2' }
      ], 
      position: 'top' 
    }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 12, h: 6 },
    advancedProps: ['position', 'type', 'size', 'closable'],
    availableActions: ['onChange', 'onTabClick', 'onEdit']
  },
  { 
    type: 'wizard', 
    category: 'structure', 
    name: 'Wizard', 
    icon: '🧙', 
    defaultProps: { 
      steps: [
        { title: 'Step 1', description: 'First step' },
        { title: 'Step 2', description: 'Second step' }
      ], 
      current: 0 
    }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 12, h: 8 },
    advancedProps: ['direction', 'size', 'status', 'progressDot'],
    availableActions: ['onChange', 'onNext', 'onPrev', 'onFinish']
  },
  { 
    type: 'wizardstep', 
    category: 'structure', 
    name: 'Wizard Step', 
    icon: '👣', 
    defaultProps: { title: 'Step', description: 'Step description', status: 'wait' }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 12, h: 6 },
    advancedProps: ['status', 'icon', 'disabled'],
    availableActions: ['onClick']
  },

  // Templates
  { 
    type: 'slot', 
    category: 'templates', 
    name: 'Slot', 
    icon: '🎰', 
    defaultProps: { name: 'default', fallback: 'No content' }, 
    defaultStyle: {}, 
    defaultGridProps: { w: 6, h: 4 },
    advancedProps: ['name', 'fallback'],
    availableActions: []
  },
];

export const getComponentsByCategory = (category: string) => {
  return COMPONENT_DEFINITIONS.filter(comp => comp.category === category);
};

export const getComponentDefinition = (type: string) => {
  return COMPONENT_DEFINITIONS.find(comp => comp.type === type);
};