import React, { FC } from 'react';
import { FieldArray, useFormikContext } from 'formik';
import { DraggableList } from '../../editors/components';
import { TextInputFormik } from './text-input-formik';

interface TextListFormikProps {
  name: string;
  label: string;
  addButtonLabel?: string;
}

export const TextListFormik: FC<TextListFormikProps> = (props: TextListFormikProps) => {
  const { name, label } = props;
  const { values } = useFormikContext();

  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <DraggableList
          label={label}
          id={name}
          addButtonLabel={props.addButtonLabel}
          onChange={() => null}
          customDragEnd={(indexA, indexB) => arrayHelpers.swap(indexA, indexB)}
          customRemove={(index) => arrayHelpers.remove(index)}
          list={Array.isArray((values as any)?.value) ? (values as any)?.value : []}
          addItem={() => arrayHelpers.insert((values as any)?.value?.length, '')}
          child={(item, index) => <TextInputFormik style={{ flexGrow: '1' }} name={`${name}[${index}]`} />}
          useIndex
        />
      )}
    />
  );
};
