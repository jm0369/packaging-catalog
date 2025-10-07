'use client';

import { StringArrayField, ObjectArrayField } from '../array-field';

interface CategoryFormProps {
  category: {
    id: string;
    name: string;
    type: 'Article' | 'Group';
    color: string;
    description?: string;
    properties?: Array<{ name: string; description: string }>;
    applications?: string[];
    formatsSpecifications?: string[];
    keyFigures?: Array<{ name: string; description: string }>;
    ordering?: Array<{ name: string; description: string }>;
    orderingNotes?: string[];
  };
  onSubmit: (formData: FormData) => Promise<void>;
}

export function CategoryForm({ category, onSubmit }: CategoryFormProps) {
  return (
    <form action={onSubmit} className="space-y-6 p-6 border rounded bg-white">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={category.name}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-1">
            Type *
          </label>
          <select
            id="type"
            name="type"
            required
            defaultValue={category.type}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="Article">Article</option>
            <option value="Group">Group</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="color" className="block text-sm font-medium mb-1">
          Color *
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            id="color"
            name="color"
            required
            defaultValue={category.color}
            className="border rounded h-10 w-20"
          />
          <span className="text-sm text-gray-600">{category.color}</span>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={category.description || ''}
          className="border rounded px-3 py-2 w-full"
          placeholder="Brief description of this category"
        />
      </div>

      <ObjectArrayField
        label="Properties"
        name="properties"
        initialValues={category.properties}
        namePlaceholder="Property name (e.g., Material, Thickness)"
        descriptionPlaceholder="Property description or value"
      />

      <StringArrayField
        label="Applications"
        name="applications"
        initialValues={category.applications}
        placeholder="Application (e.g., Food packaging, Shipping)"
      />

      <StringArrayField
        label="Formats & Specifications"
        name="formatsSpecifications"
        initialValues={category.formatsSpecifications}
        placeholder="Format or specification"
      />

      <ObjectArrayField
        label="Key Figures"
        name="keyFigures"
        initialValues={category.keyFigures}
        namePlaceholder="Key figure name (e.g., Weight, Size)"
        descriptionPlaceholder="Value or description"
      />

      <ObjectArrayField
        label="Ordering"
        name="ordering"
        initialValues={category.ordering}
        namePlaceholder="Order option (e.g., Minimum quantity)"
        descriptionPlaceholder="Order description or requirement"
      />

      <StringArrayField
        label="Ordering Notes"
        name="orderingNotes"
        initialValues={category.orderingNotes}
        placeholder="Note (e.g., Lead time information)"
      />

      <button type="submit" className="px-4 py-2 rounded bg-black text-white">
        Save Changes
      </button>
    </form>
  );
}
