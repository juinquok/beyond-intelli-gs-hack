import React from 'react';
import { useController } from 'react-hook-form';

export default function FileInput({ control, name }) {
  const { field } = useController({ control, name });
  const [value, setValue] = React.useState('');
  return (
    <input
      type="file"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        field.onChange(e.target.files);
      }}
    />
  );
}
