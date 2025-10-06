'use client';

import { useState } from 'react';

interface StringArrayFieldProps {
  label: string;
  name: string;
  initialValues?: string[];
  placeholder?: string;
}

export function StringArrayField({ label, name, initialValues = [], placeholder }: StringArrayFieldProps) {
  const [items, setItems] = useState<string[]>(initialValues && initialValues.length > 0 ? initialValues : ['']);

  const addItem = () => {
    setItems([...items, '']);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      setItems(['']);
    } else {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              name={`${name}[${index}]`}
              placeholder={placeholder || `Item ${index + 1}`}
              className="border rounded px-3 py-2 flex-1"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="px-3 py-2 border rounded text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="px-3 py-2 border rounded text-sm hover:bg-gray-50"
        >
          + Add {label}
        </button>
      </div>
    </div>
  );
}

interface ObjectArrayFieldProps {
  label: string;
  name: string;
  initialValues?: Array<{ name: string; description: string }>;
  namePlaceholder?: string;
  descriptionPlaceholder?: string;
}

export function ObjectArrayField({ 
  label, 
  name, 
  initialValues = [], 
  namePlaceholder = 'Name',
  descriptionPlaceholder = 'Description'
}: ObjectArrayFieldProps) {
  const [items, setItems] = useState<Array<{ name: string; description: string }>>(
    initialValues && initialValues.length > 0 ? initialValues : [{ name: '', description: '' }]
  );

  const addItem = () => {
    setItems([...items, { name: '', description: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      setItems([{ name: '', description: '' }]);
    } else {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: 'name' | 'description', value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="border rounded p-3 space-y-2 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Item {index + 1}</span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-xs px-2 py-1 border rounded text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(index, 'name', e.target.value)}
              name={`${name}[${index}].name`}
              placeholder={namePlaceholder}
              className="border rounded px-3 py-2 w-full bg-white"
            />
            <textarea
              value={item.description}
              onChange={(e) => updateItem(index, 'description', e.target.value)}
              name={`${name}[${index}].description`}
              placeholder={descriptionPlaceholder}
              rows={2}
              className="border rounded px-3 py-2 w-full bg-white"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="px-3 py-2 border rounded text-sm hover:bg-gray-50"
        >
          + Add {label}
        </button>
      </div>
    </div>
  );
}
