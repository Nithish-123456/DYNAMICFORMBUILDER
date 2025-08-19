# Form Components System

This directory contains a comprehensive form component system that follows the pattern from your original example but uses current packages and structure. The system is designed to be extensible and maintainable.

## Structure

```
FormComponents/
├── PropertyPanel/          # Property panel components for editing element properties
│   ├── PropertyGeneralTextbox.tsx
│   ├── PropertyDropdown.tsx
│   ├── PropertyCheckbox.tsx
│   └── PropertyTextarea.tsx
├── Preview/                # Preview components for rendering elements
│   ├── PreviewTextbox.tsx
│   ├── PreviewDropdown.tsx
│   ├── PreviewCheckbox.tsx
│   └── PreviewTextarea.tsx
├── ComponentFactory.tsx    # Factory pattern for component resolution
├── index.ts               # Main exports
└── README.md              # This file
```

## Key Features

### 1. Consistent Pattern
All components follow the same pattern as your original example:
- Use React hooks (useState, useEffect, useRef)
- Redux integration for state management
- Alias name uniqueness validation
- Property validation and error handling
- Consistent UI with Tailwind CSS

### 2. Component Factory Pattern
The `ComponentFactory.tsx` provides a centralized way to resolve components:
- `getPropertyPanelComponent()` - Returns the appropriate property panel component
- `getPreviewComponent()` - Returns the appropriate preview component
- `PropertyPanelFactory` - React component that renders the correct property panel
- `PreviewFactory` - React component that renders the correct preview

### 3. Current Package Usage
- **React 18** with hooks
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **TypeScript** for type safety
- No external UI libraries (pure HTML/CSS)

## Usage

### Basic Usage

```tsx
import { PropertyPanelFactory, PreviewFactory } from './components/FormComponents';

// In your property panel
<PropertyPanelFactory 
  element={selectedElement} 
  onSave={(saved) => console.log('Saved:', saved)} 
/>

// In your preview/form
<PreviewFactory
  element={element}
  value={formValues[element.id]}
  onChange={(value) => updateFormValue(element.id, value)}
  errors={formErrors}
  disabled={false}
  readOnly={false}
/>
```

### Adding New Components

1. **Create Property Panel Component**:
```tsx
// PropertyPanel/PropertyNewComponent.tsx
export const PropertyNewComponent: React.FC<PropertyNewComponentProps> = ({ element, onSave }) => {
  // Follow the same pattern as existing components
  // Use useRef, useState, useEffect, Redux dispatch
  // Include alias name validation
  // Handle all property changes
};
```

2. **Create Preview Component**:
```tsx
// Preview/PreviewNewComponent.tsx
export const PreviewNewComponent: React.FC<PreviewNewComponentProps> = ({ element, value, onChange, errors, disabled, readOnly }) => {
  // Render the component with proper styling
  // Handle value changes
  // Show validation errors
};
```

3. **Update ComponentFactory**:
```tsx
// Add to getPropertyPanelComponent
case "newcomponent":
  return PropertyNewComponent;

// Add to getPreviewComponent
case "newcomponent":
  return PreviewNewComponent;
```

4. **Update index.ts**:
```tsx
export { PropertyNewComponent } from './PropertyPanel/PropertyNewComponent';
export { PreviewNewComponent } from './Preview/PreviewNewComponent';
```

## Component Properties

### Common Properties
All components support these common properties:
- `label` - Display label
- `aliasName` - Unique identifier (validated for uniqueness)
- `placeholder` - Placeholder text
- `required` - Required field validation
- `disable` - Disable the field
- `showInMainList` - Show in main list view

### Component-Specific Properties

#### Textbox/Input
- `minLength` - Minimum character length
- `maxLength` - Maximum character length
- `minWords` - Minimum word count
- `maxWords` - Maximum word count

#### Dropdown
- `options` - Array of {label, value} objects
- `multiple` - Allow multiple selection
- `searchable` - Enable search functionality

#### Checkbox
- `value` - Checkbox value
- `checked` - Default checked state

#### Textarea
- `rows` - Number of rows
- `resize` - Resize behavior (both, vertical, horizontal, none)
- `minLength` - Minimum character length
- `maxLength` - Maximum character length

## Validation

The system includes built-in validation:
- **Alias Name Uniqueness**: Ensures no duplicate alias names across elements
- **Required Field Validation**: Visual indicators for required fields
- **Error Display**: Shows validation errors below components
- **Disabled State**: Proper handling of disabled/readonly states

## Styling

All components use Tailwind CSS classes for consistent styling:
- Responsive design
- Focus states with blue ring
- Error states with red border
- Disabled states with gray styling
- Hover effects

## State Management

Components integrate with Redux for state management:
- Use `useDispatch` and `useSelector` hooks
- Update element properties through Redux actions
- Maintain form state consistency
- Support undo/redo functionality

## Error Handling

Comprehensive error handling:
- Alias name conflicts
- Validation errors
- Network errors (if applicable)
- User feedback through console logs and UI indicators

## Performance

Optimized for performance:
- Use `useRef` for expensive operations
- Conditional rendering based on state
- Memoization where appropriate
- Efficient re-renders

## Testing

Components are designed to be testable:
- Pure functions where possible
- Clear input/output contracts
- Isolated state management
- Mockable dependencies

## Future Enhancements

Potential improvements:
- Form validation library integration
- Advanced field types (date picker, file upload, etc.)
- Conditional field visibility
- Field dependencies
- Custom validation rules
- Theme support
- Accessibility improvements
