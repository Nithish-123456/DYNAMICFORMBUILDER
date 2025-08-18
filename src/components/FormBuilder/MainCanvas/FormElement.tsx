import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { selectElement, removeElement, duplicateElement } from '../../../store/slices/formBuilderSlice';
import { FormElement as FormElementType } from '../../../types/form';
import { getComponentDefinition } from '../../../constants/components';
import { Trash2, Copy, Upload, X, Calendar, Clock, Search, Tag, Palette, Eye, EyeOff } from 'lucide-react';
import QRCode from 'react-qr-code';

// Autocomplete Component
const AutocompleteComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (inputValue: string) => {
    setValue(inputValue);
    if (inputValue.length >= (element.properties.minChars || 1)) {
      const filtered = (element.properties.options || [])
        .filter((option: any) => option.label.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, element.properties.maxResults || 10);
      setSuggestions(filtered.map((opt: any) => opt.label));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="h-full relative">
      {element.properties.label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {element.properties.label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={element.properties.placeholder || 'Type to search...'}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!isPreview}
        />
        {showSuggestions && suggestions.length > 0 && isPreview && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  setValue(suggestion);
                  setShowSuggestions(false);
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Calendar Component
const CalendarComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <div className="h-full">
      {element.properties.label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {element.properties.label}
        </label>
      )}
      <div className="border border-gray-300 rounded-md p-3 bg-white">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={!isPreview}
          >
            ←
          </button>
          <h3 className="text-sm font-medium">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={!isPreview}
          >
            →
          </button>
        </div>
        
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-xs text-gray-500 text-center p-1 font-medium">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => day && isPreview && setSelectedDate(day)}
              disabled={!day || !isPreview}
              className={`text-xs p-1 rounded ${
                day
                  ? selectedDate && day.toDateString() === selectedDate.toDateString()
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
                  : ''
              }`}
            >
              {day ? day.getDate() : ''}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Date Picker Component
const DatePickerComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const [value, setValue] = useState('');

  return (
    <div className="h-full">
      {element.properties.label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {element.properties.label}
        </label>
      )}
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          min={element.properties.minDate}
          max={element.properties.maxDate}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!isPreview}
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

// Time Picker Component
const TimePickerComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const [value, setValue] = useState('');

  return (
    <div className="h-full">
      {element.properties.label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {element.properties.label}
        </label>
      )}
      <div className="relative">
        <input
          type="time"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          step={element.properties.step ? element.properties.step * 60 : undefined}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!isPreview}
        />
        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

// Search Component
const SearchComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const [value, setValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (searchValue: string) => {
    setValue(searchValue);
    if (searchValue.length >= (element.properties.minChars || 1)) {
      setIsSearching(true);
      // Simulate search delay
      setTimeout(() => setIsSearching(false), 1000);
    }
  };

  return (
    <div className="h-full">
      {element.properties.label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {element.properties.label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={element.properties.placeholder || 'Search...'}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!isPreview}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

// Signature Component (canvas-based)
const SignatureComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  const width = element.properties.width || 400;
  const height = element.properties.height || 200;
  const penColor = element.properties.penColor || '#000000';
  const backgroundColor = element.properties.backgroundColor || '#ffffff';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [backgroundColor, width, height]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const drawLine = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isPreview) return;
    e.preventDefault();
    const pos = getPos(e);
    setIsDrawing(true);
    setLastPoint(pos);
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isPreview || !isDrawing || !lastPoint) return;
    e.preventDefault();
    const pos = getPos(e);
    drawLine(lastPoint, pos);
    setLastPoint(pos);
  };

  const handleEnd = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isPreview) return;
    e.preventDefault();
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="h-full">
      {element.properties.label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {element.properties.label}
        </label>
      )}
      <div className="border border-gray-300 rounded-md bg-white p-2">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={`w-full border border-dashed rounded ${!isPreview ? 'opacity-60 cursor-not-allowed' : 'cursor-crosshair'}`}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
        {isPreview && (
          <div className="mt-2 flex justify-end">
            <button onClick={clear} className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Clear</button>
          </div>
        )}
      </div>
    </div>
  );
};

// Tag Picker Component
const TagPickerComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      const maxTags = element.properties.maxTags || 0;
      if (maxTags === 0 || tags.length < maxTags) {
        setTags([...tags, tag.trim()]);
        setInputValue('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  return (
    <div className="h-full">
      {element.properties.label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {element.properties.label}
        </label>
      )}
      <div className="border border-gray-300 rounded-md p-2 min-h-[40px] focus-within:ring-2 focus-within:ring-blue-500">
        <div className="flex flex-wrap gap-1 mb-1">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
              {isPreview && (
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-blue-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={tags.length === 0 ? "Type and press Enter to add tags" : ""}
          className="w-full border-none outline-none text-sm"
          disabled={!isPreview}
        />
      </div>
    </div>
  );
};

// Toggle Component
const ToggleComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const [checked, setChecked] = useState(element.properties.checked || false);

  return (
    <div className="h-full flex items-center">
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="sr-only"
            disabled={!isPreview}
          />
          <div className={`block w-14 h-8 rounded-full transition-colors ${
            checked ? 'bg-blue-600' : 'bg-gray-300'
          }`}>
            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
              checked ? 'transform translate-x-6' : ''
            }`}></div>
          </div>
        </div>
        {element.properties.label && (
          <span className="ml-3 text-sm text-gray-700">{element.properties.label}</span>
        )}
      </label>
    </div>
  );
};

// Uploader Component
const UploaderComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      if (element.properties.multiple) {
        setFiles([...files, ...fileArray]);
      } else {
        setFiles([fileArray[0]]);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full">
      {element.properties.label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {element.properties.label}
        </label>
      )}
      <div
        className={`border-2 border-dashed rounded-md p-4 text-center transition-colors ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (isPreview) {
            handleFileSelect(e.dataTransfer.files);
          }
        }}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-2">
          {element.properties.dragDrop ? 'Drag files here or click to browse' : 'Click to browse files'}
        </p>
        <input
          type="file"
          multiple={element.properties.multiple}
          accept={element.properties.accept}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id={`file-${element.id}`}
          disabled={!isPreview}
        />
        <label
          htmlFor={`file-${element.id}`}
          className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 cursor-pointer text-sm"
        >
          Choose Files
        </label>
        {element.properties.maxSize && (
          <p className="text-xs text-gray-500 mt-1">
            Max size: {element.properties.maxSize}MB
          </p>
        )}
      </div>
      
      {files.length > 0 && (
        <div className="mt-2 space-y-1">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
              <span className="truncate">{file.name}</span>
              {isPreview && (
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Pattern Format Component
const PatternFormatComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const [value, setValue] = useState('');

  const formatValue = (inputValue: string) => {
    const format = element.properties.format || '###-###-####';
    const mask = element.properties.mask || '_';
    let formatted = '';
    let valueIndex = 0;

    for (let i = 0; i < format.length && valueIndex < inputValue.length; i++) {
      if (format[i] === '#') {
        formatted += inputValue[valueIndex];
        valueIndex++;
      } else {
        formatted += format[i];
      }
    }

    return formatted;
  };

  return (
    <div className="h-full">
      {element.properties.label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {element.properties.label}
        </label>
      )}
      <input
        type="text"
        value={formatValue(value)}
        onChange={(e) => {
          const rawValue = e.target.value.replace(/[^0-9]/g, '');
          setValue(rawValue);
        }}
        placeholder={element.properties.placeholder || element.properties.format}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={!isPreview}
      />
    </div>
  );
};

// Rich Text Editor Component (contenteditable + basic toolbar)
const RichTextEditorComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const exec = (command: string) => {
    if (!isPreview) return;
    document.execCommand(command);
    editorRef.current?.focus();
  };

  return (
    <div className="h-full">
      {element.properties.label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {element.properties.label}
        </label>
      )}
      <div className="border border-gray-300 rounded-md">
        <div className="border-b border-gray-300 p-2 flex space-x-2">
          <button onClick={() => exec('bold')} className="px-2 py-1 text-sm rounded hover:bg-gray-100" disabled={!isPreview}><strong>B</strong></button>
          <button onClick={() => exec('italic')} className="px-2 py-1 text-sm rounded hover:bg-gray-100" disabled={!isPreview}><em>I</em></button>
          <button onClick={() => exec('underline')} className="px-2 py-1 text-sm rounded hover:bg-gray-100" disabled={!isPreview}>U</button>
        </div>
        <div
          ref={editorRef}
          contentEditable={isPreview}
          className="w-full p-3 outline-none min-h-[120px]"
          style={{ height: element.properties.height || 200 }}
          data-placeholder="Start typing..."
        />
      </div>
    </div>
  );
};

// Map Component (OpenStreetMap embed)
const GoogleMapComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>(element.properties.markers || []);
  const center = element.properties.center || { lat: 0, lng: 0 };
  const zoom = element.properties.zoom || 10;
  const firstMarker = markers[0] || center;

  // Simple OSM embed with a single marker (first marker)
  const lat = firstMarker.lat;
  const lon = firstMarker.lng;
  const delta = 0.02; // bbox size based on zoom (very simplified)
  const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(lat)},${encodeURIComponent(lon)}`;

  return (
    <div className="h-full">
      {element.properties.label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {element.properties.label}
        </label>
      )}
      <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
        <div className="relative" style={{ height: Math.max(200, (element.gridProps?.h || 4) * 60) }}>
          <iframe title="map" className="w-full h-full" src={src} />
          {isPreview && (
            <div className="absolute bottom-2 right-2 flex gap-2">
              <button
                onClick={() => setMarkers([{ lat: center.lat + Math.random() * 0.01, lng: center.lng + Math.random() * 0.01 }])}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
              >
                Add Marker
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Input Component
const InputComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const [value, setValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-full">
      {element.properties.label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {element.properties.label}
        </label>
      )}
      <div className="relative">
        <input
          type={element.properties.type === 'password' && showPassword ? 'text' : element.properties.type || 'text'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={element.properties.placeholder || ''}
          maxLength={element.properties.maxLength || undefined}
          minLength={element.properties.minLength || undefined}
          pattern={element.properties.pattern || undefined}
          autoComplete={element.properties.autocomplete || undefined}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!isPreview}
        />
        {element.properties.type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={!isPreview}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};

// Dropdown Component
const DropdownComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const options = element.properties.options || [];
  const filteredOptions = element.properties.searchable 
    ? options.filter((option: any) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  const handleSelect = (value: string) => {
    if (element.properties.multiple) {
      setSelectedValues(prev => 
        prev.includes(value) 
          ? prev.filter(v => v !== value)
          : [...prev, value]
      );
    } else {
      setSelectedValues([value]);
      setIsOpen(false);
    }
  };

  return (
    <div className="h-full">
      {element.properties.label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {element.properties.label}
        </label>
      )}
      <div className="relative">
        <button
          onClick={() => isPreview && setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left bg-white"
          disabled={!isPreview}
        >
          {selectedValues.length > 0 
            ? selectedValues.join(', ')
            : element.properties.placeholder || 'Select an option'
          }
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2">▼</span>
        </button>
        
        {isOpen && isPreview && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {element.properties.searchable && (
              <div className="p-2 border-b">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search options..."
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            )}
            {filteredOptions.map((option: any, index: number) => (
              <div
                key={index}
                onClick={() => handleSelect(option.value)}
                className={`px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm ${
                  selectedValues.includes(option.value) ? 'bg-blue-50 text-blue-700' : ''
                } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {element.properties.multiple && (
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => {}}
                    className="mr-2"
                  />
                )}
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Radio Group Component
const RadioGroupComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <div className="h-full">
      {element.properties.label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {element.properties.label}
        </label>
      )}
      <div className={`space-${element.properties.layout === 'horizontal' ? 'x' : 'y'}-2 ${element.properties.layout === 'horizontal' ? 'flex flex-wrap' : ''}`}>
        {(element.properties.options || []).map((option: any, index: number) => (
          <label key={index} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={element.id}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={(e) => setSelectedValue(e.target.value)}
              className="text-blue-600 focus:ring-blue-500"
              disabled={!isPreview || option.disabled}
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// Number Format Component
const NumberFormatComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const [value, setValue] = useState('');

  const formatNumber = (num: string) => {
    if (!num) return '';
    const number = parseFloat(num.replace(/[^0-9.-]/g, ''));
    if (isNaN(number)) return '';
    
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: element.properties.decimalScale || 2,
      maximumFractionDigits: element.properties.decimalScale || 2,
    }).format(number);
    
    return `${element.properties.prefix || ''}${formatted}${element.properties.suffix || ''}`;
  };

  return (
    <div className="h-full">
      {element.properties.label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {element.properties.label}
        </label>
      )}
      <input
        type="text"
        value={formatNumber(value)}
        onChange={(e) => {
          const rawValue = e.target.value.replace(/[^0-9.-]/g, '');
          setValue(rawValue);
        }}
        min={element.properties.min || undefined}
        max={element.properties.max || undefined}
        step={element.properties.step || undefined}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={!isPreview}
        placeholder="0.00"
      />
    </div>
  );
};

// Progress Line Component
const ProgressLineComponent: React.FC<{ element: FormElementType }> = ({ element }) => (
  <div className="h-full flex flex-col justify-center">
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="h-2 rounded-full transition-all duration-300"
        style={{
          width: `${Math.min(100, Math.max(0, (element.properties.value / element.properties.max) * 100))}%`,
          backgroundColor: element.properties.color || '#3b82f6',
        }}
      />
    </div>
    {element.properties.showText && (
      <div className="text-center text-sm text-gray-600 mt-1">
        {element.properties.value}%
      </div>
    )}
  </div>
);

// Progress Circle Component
const ProgressCircleComponent: React.FC<{ element: FormElementType }> = ({ element }) => {
  const radius = (element.properties.size - element.properties.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (element.properties.value / element.properties.max) * 100;
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

  return (
    <div className="h-full flex items-center justify-center">
      <div className="relative">
        <svg
          width={element.properties.size}
          height={element.properties.size}
          className="transform -rotate-90"
        >
          <circle
            cx={element.properties.size / 2}
            cy={element.properties.size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={element.properties.strokeWidth}
            fill="transparent"
          />
          <circle
            cx={element.properties.size / 2}
            cy={element.properties.size / 2}
            r={radius}
            stroke={element.properties.color || '#3b82f6'}
            strokeWidth={element.properties.strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        {element.properties.showText && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {element.properties.value}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// QR Code Component (using react-qr-code)
const QRCodeComponent: React.FC<{ element: FormElementType }> = ({ element }) => (
  <div className="h-full flex items-center justify-center">
    <QRCode
      value={String(element.properties.value || '')}
      size={Number(element.properties.size || 128)}
      level={element.properties.level || 'M'}
      bgColor={element.properties.bgColor || '#ffffff'}
      fgColor={element.properties.fgColor || '#000000'}
    />
  </div>
);

// Divider Component
const DividerComponent: React.FC<{ element: FormElementType }> = ({ element }) => {
  const orientation = element.properties.orientation || 'horizontal';
  const thickness = element.properties.thickness || 1;
  const color = element.properties.color || '#e5e7eb';
  if (orientation === 'vertical') {
    return <div style={{ width: thickness, backgroundColor: color, height: '100%' }} />;
  }
  return <div style={{ height: thickness, backgroundColor: color, width: '100%' }} />;
};

// Image Component
const ImageComponent: React.FC<{ element: FormElementType }> = ({ element }) => {
  const fit = element.properties.fit || 'cover';
  const src = element.properties.src || '';
  const alt = element.properties.alt || 'Image';
  return (
    <div className="w-full h-full overflow-hidden bg-gray-100 flex items-center justify-center">
      {src ? (
        <img src={src} alt={alt} loading={element.properties.lazy ? 'lazy' : undefined} style={{ width: '100%', height: '100%', objectFit: fit }} />
      ) : (
        <span className="text-gray-400 text-sm">No Image</span>
      )}
    </div>
  );
};

// Label Component
const LabelComponent: React.FC<{ element: FormElementType }> = ({ element }) => {
  const size = element.properties.size || 'medium';
  const weight = element.properties.weight || 'normal';
  const italic = element.properties.italic ? 'italic' : '';
  const sizeClass = size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base';
  const weightClass = weight === 'bold' ? 'font-bold' : weight === 'semibold' ? 'font-semibold' : 'font-normal';
  return (
    <span className={`${sizeClass} ${weightClass} ${italic}`} style={{ color: element.properties.color || undefined }}>
      {element.properties.text || 'Label'}
    </span>
  );
};

// Link Component
const LinkComponent: React.FC<{ element: FormElementType }> = ({ element }) => {
  const underline = element.properties.underline ? 'underline' : '';
  return (
    <a href={element.properties.href || '#'} target={element.properties.target || '_self'} rel={element.properties.target === '_blank' ? 'noreferrer' : undefined} className={`${underline}`} style={{ color: element.properties.color || '#2563eb' }}>
      {element.properties.text || 'Link'}
    </a>
  );
};

// Menu Component
const MenuComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const orientation = element.properties.orientation || 'vertical';
  const items = element.properties.items || [];
  return (
    <div className={`${orientation === 'horizontal' ? 'flex space-x-4' : 'space-y-2'}`}>
      {items.map((item: any, idx: number) => (
        <button key={idx} className="text-sm text-gray-700 hover:text-blue-600" disabled={!isPreview}>
          {item.label}
        </button>
      ))}
    </div>
  );
};

// Message Components
const MessageBase: React.FC<{ type: 'info' | 'success' | 'warning' | 'error'; text: string; closable?: boolean }> = ({ type, text, closable }) => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  const colorMap: any = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };
  return (
    <div className={`w-full p-3 border rounded ${colorMap[type]}`}> 
      <div className="flex items-start justify-between">
        <div className="text-sm">{text}</div>
        {closable && (
          <button onClick={() => setVisible(false)} className="text-xs text-current opacity-70 hover:opacity-100">✕</button>
        )}
      </div>
    </div>
  );
};

const MessageComponent: React.FC<{ element: FormElementType }> = ({ element }) => (
  <MessageBase type={element.properties.type || 'info'} text={element.properties.text || 'Message'} closable={element.properties.closable} />
);

const ErrorMessageComponent: React.FC<{ element: FormElementType }> = ({ element }) => (
  <MessageBase type={(element.properties.type || 'error') as any} text={element.properties.message || 'Error message'} closable={element.properties.dismissible} />
);

// Breadcrumb Component
const BreadcrumbComponent: React.FC<{ element: FormElementType }> = ({ element }) => {
  const items = element.properties.items || [];
  const separator = element.properties.separator || '/';
  return (
    <nav className="text-sm text-gray-600">
      {items.map((item: any, idx: number) => (
        <span key={idx}>
          <a href={item.href} className="hover:underline text-blue-600">{item.label}</a>
          {idx < items.length - 1 && <span className="mx-2 text-gray-400">{separator}</span>}
        </span>
      ))}
    </nav>
  );
};

// Card Component
const CardComponent: React.FC<{ element: FormElementType }> = ({ element }) => {
  const bordered = element.properties.bordered !== false;
  const hoverable = element.properties.hoverable;
  return (
    <div className={`w-full h-full ${bordered ? 'border border-gray-200' : ''} rounded-md bg-white ${hoverable ? 'hover:shadow-md transition-shadow' : ''} p-4`}>
      <div className="font-medium text-gray-800 mb-2">{element.properties.title || 'Card Title'}</div>
      <div className="text-sm text-gray-600">Card content</div>
    </div>
  );
};

// Container Component
const ContainerComponent: React.FC<{ element: FormElementType }> = ({ element }) => {
  const fluid = element.properties.fluid;
  const centered = element.properties.centered !== false;
  const maxWidth = element.properties.maxWidth || 1024;
  return (
    <div className={`${centered ? 'mx-auto' : ''}`} style={{ maxWidth: fluid ? '100%' : maxWidth }}>
      <div className="text-gray-500 text-sm">Container</div>
    </div>
  );
};

// Repeater Component (simple counter)
const RepeaterComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const minItems = element.properties.minItems || 1;
  const maxItems = element.properties.maxItems || 10;
  const [count, setCount] = useState(minItems);
  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600">Items: {count}</div>
      {isPreview && (
        <div className="flex gap-2">
          <button onClick={() => setCount(Math.max(minItems, count - 1))} className="px-2 py-1 text-xs bg-gray-100 rounded">Remove</button>
          <button onClick={() => setCount(Math.min(maxItems, count + 1))} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">Add</button>
        </div>
      )}
      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-2 border rounded text-xs text-gray-500">Item {i + 1}</div>
        ))}
      </div>
    </div>
  );
};

// Tabs Component
const TabsComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const tabs = element.properties.tabs || [];
  const [activeKey, setActiveKey] = useState(tabs[0]?.key || 'tab1');
  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b">
        {tabs.map((t: any) => (
          <button key={t.key} onClick={() => isPreview && setActiveKey(t.key)} className={`px-3 py-2 text-sm ${activeKey === t.key ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'} mr-2`} disabled={!isPreview}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 p-3 text-sm text-gray-700">{tabs.find((t: any) => t.key === activeKey)?.content || 'Tab content'}</div>
    </div>
  );
};

// Wizard Component
const WizardComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const steps = element.properties.steps || [];
  const [current, setCurrent] = useState(element.properties.current || 0);
  const next = () => setCurrent((c) => Math.min(c + 1, steps.length - 1));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-3">
        {steps.map((s: any, idx: number) => (
          <div key={idx} className="flex items-center">
            <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center ${idx <= current ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{idx + 1}</div>
            {idx < steps.length - 1 && <div className="w-8 h-px bg-gray-300 mx-2" />}
          </div>
        ))}
      </div>
      <div className="flex-1 p-3 border rounded mb-3">
        <div className="font-medium mb-1">{steps[current]?.title || 'Step'}</div>
        <div className="text-sm text-gray-600">{steps[current]?.description || 'Description'}</div>
      </div>
      {isPreview && (
        <div className="flex gap-2">
          <button onClick={prev} disabled={current === 0} className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50">Previous</button>
          <button onClick={next} disabled={current === steps.length - 1} className="px-3 py-1 text-sm bg-blue-600 text-white rounded disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
};

// Wizard Step (standalone display)
const WizardStepComponent: React.FC<{ element: FormElementType }> = ({ element }) => (
  <div className="p-3 border rounded">
    <div className="font-medium">{element.properties.title || 'Step'}</div>
    <div className="text-sm text-gray-600">{element.properties.description || 'Step description'}</div>
  </div>
);

// Placeholder Graph
const PlaceholderGraphComponent: React.FC<{ element: FormElementType }> = ({ element }) => (
  <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-dashed text-gray-400">Placeholder Graph ({element.properties.type || 'bar'})</div>
);

// Placeholder Grid
const PlaceholderGridComponent: React.FC<{ element: FormElementType }> = ({ element }) => {
  const rows = element.properties.rows || 3;
  const columns = element.properties.columns || 3;
  return (
    <div className="w-full h-full grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {Array.from({ length: rows * columns }).map((_, i) => (
        <div key={i} className="bg-gray-200 animate-pulse rounded h-8" />
      ))}
    </div>
  );
};

// Slot Component
const SlotComponent: React.FC<{ element: FormElementType }> = ({ element }) => (
  <div className="w-full h-full border border-dashed rounded text-gray-400 flex items-center justify-center">Slot: {element.properties.name || 'default'} (no content)</div>
);

// Textarea Component
const TextareaComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const [value, setValue] = useState('');

  return (
    <div className="h-full">
      {element.properties.label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {element.properties.label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={element.properties.placeholder || ''}
        rows={element.properties.rows || 4}
        maxLength={element.properties.maxLength || undefined}
        minLength={element.properties.minLength || undefined}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        disabled={!isPreview}
        style={{ height: 'calc(100% - 24px)' }}
      />
    </div>
  );
};

// Button Component
const ButtonComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element }) => (
  <button
    disabled={element.properties.disabled}
    className={`px-4 py-2 rounded-md font-medium transition-colors h-full w-full ${
      element.properties.variant === 'primary'
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : element.properties.variant === 'secondary'
        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        : 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50'
    } ${element.properties.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${
      element.properties.size === 'small' ? 'text-sm px-3 py-1' :
      element.properties.size === 'large' ? 'text-lg px-6 py-3' : ''
    }`}
  >
    {element.properties.text || 'Button'}
  </button>
);

// Checkbox Component
const CheckboxComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => {
  const [checked, setChecked] = useState(element.properties.checked || false);

  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        value={element.properties.value}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        disabled={!isPreview}
      />
      <span className="text-sm text-gray-700">{element.properties.label || 'Checkbox'}</span>
    </label>
  );
};

// Header Component
const HeaderComponent: React.FC<{ element: FormElementType }> = ({ element }) => {
  const HeaderTag = `h${element.properties.level || 1}` as keyof JSX.IntrinsicElements;
  return (
    <HeaderTag 
      className={`font-bold text-gray-800 ${
      element.properties.level === 1 ? 'text-2xl' :
      element.properties.level === 2 ? 'text-xl' :
      element.properties.level === 3 ? 'text-lg' : 'text-base'
    } ${
      element.properties.align === 'center' ? 'text-center' :
      element.properties.align === 'right' ? 'text-right' : 'text-left'
    } ${element.properties.underline ? 'underline' : ''}`}
      style={{ color: element.properties.color || undefined }}
    >
      {element.properties.text || 'Header'}
    </HeaderTag>
  );
};

// Static Content Component
const StaticContentComponent: React.FC<{ element: FormElementType }> = ({ element }) => (
  <div className="h-full">
    <div className={`${
      element.properties.format === 'html' ? 'prose' : ''
    }`}>
      {element.properties.format === 'html' ? (
        <div dangerouslySetInnerHTML={{ __html: element.properties.content || 'Static content' }} />
      ) : (
        <p className="text-gray-700">{element.properties.content || 'Static content'}</p>
      )}
    </div>
  </div>
);

// Generic Component for unsupported types
const GenericComponent: React.FC<{ element: FormElementType }> = ({ element }) => {
  const componentDef = getComponentDefinition(element.type);
  return (
    <div className="flex items-center justify-center h-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-md">
      <div className="text-center">
        <span className="text-2xl mb-2 block">{componentDef?.icon}</span>
        <span className="text-sm font-medium text-gray-600">{componentDef?.name}</span>
      </div>
    </div>
  );
};

// Component renderer mapping
const componentRenderers: Record<string, React.FC<any>> = {
  autocomplete: AutocompleteComponent,
  calendar: CalendarComponent,
  datepicker: DatePickerComponent,
  timepicker: TimePickerComponent,
  search: SearchComponent,
  signature: SignatureComponent,
  tagpicker: TagPickerComponent,
  toggle: ToggleComponent,
  uploader: UploaderComponent,
  patternformat: PatternFormatComponent,
  richtexteditor: RichTextEditorComponent,
  googlemap: GoogleMapComponent,
  input: InputComponent,
  dropdown: DropdownComponent,
  radiogroup: RadioGroupComponent,
  numberformat: NumberFormatComponent,
  progressline: ProgressLineComponent,
  progresscircle: ProgressCircleComponent,
  qrcode: QRCodeComponent,
  textarea: TextareaComponent,
  button: ButtonComponent,
  checkbox: CheckboxComponent,
  header: HeaderComponent,
  staticcontent: StaticContentComponent,
  divider: DividerComponent,
  image: ImageComponent,
  label: LabelComponent,
  link: LinkComponent,
  menu: MenuComponent,
  message: MessageComponent,
  errormessage: ErrorMessageComponent,
  breadcrumb: BreadcrumbComponent,
  card: CardComponent,
  container: ContainerComponent,
  repeater: RepeaterComponent,
  tab: TabsComponent,
  wizard: WizardComponent,
  wizardstep: WizardStepComponent,
  placeholdergraph: PlaceholderGraphComponent,
  placeholdergrid: PlaceholderGridComponent,
  slot: SlotComponent,
};

interface FormElementProps {
  element: FormElementType;
  isPreview: boolean;
}

const FormElement: React.FC<FormElementProps> = ({ element, isPreview }) => {
  const dispatch = useDispatch();
  const selectedElement = useSelector((state: RootState) => state.formBuilder.selectedElement);
  
  const isSelected = selectedElement === element.id && !isPreview;
  const ComponentRenderer = componentRenderers[element.type] || GenericComponent;

  const handleClick = (e: React.MouseEvent) => {
    if (!isPreview) {
      e.stopPropagation();
      dispatch(selectElement(element.id));
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeElement(element.id));
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(duplicateElement(element.id));
  };

  return (
    <div
      onClick={handleClick}
      className={`h-full p-2 rounded-md transition-all ${
        isSelected
          ? 'ring-2 ring-blue-500 bg-blue-50'
          : isPreview
          ? ''
          : 'hover:ring-1 hover:ring-gray-300 cursor-pointer'
      }`}
      style={element.style}
    >
      {isSelected && !isPreview && (
        <div className="absolute -top-2 -right-2 flex space-x-1 z-10">
          <button
            onClick={handleDuplicate}
            className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition-colors"
            title="Duplicate"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
      <ComponentRenderer element={element} isPreview={isPreview} />
    </div>
  );
};

export default FormElement;