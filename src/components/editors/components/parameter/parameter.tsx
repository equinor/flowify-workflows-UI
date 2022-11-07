import React, { FC, useState } from 'react';
import { Icon, Typography } from '@equinor/eds-core-react';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import { Brick, Data, Edge, Graph } from '@models/v2';
import { Stack } from '@ui';
import { ParameterWrapper } from './styles';
import { ParameterProps, TYPE_ICONS } from './types';
import { updateArgs, updateParameter, updateResults } from './helpers';
import { ParameterEditor } from './parameter-editor/parameter-editor';

export const Parameter: FC<ParameterProps> = (props: ParameterProps) => {
  const { index, setComponent, type, onlyEditableValue, editableValue, parameter, names } = props;
  const [open, setOpen] = useState<boolean>(false);

  const validationSchema = yup.object({
    name: yup
      .string()
      .required('Parameter name is required')
      .startsWithLetter('Parameter name nees to start with alpabetical letters [a…z]')
      .noWhitespace('Whitespace is not allowed in parameter names')
      .noDuplicateValues(names || [], props.parameter?.name, `An ${type} parameter with this name already exists.`),
  });

  const parameterType = type === 'input' ? 'inputs' : 'outputs';
  const parameterMappings = type === 'input' ? 'inputMappings' : 'outputMappings';

  async function onParameterUpdate(values: Data) {
    setComponent((prev) =>
      prev?.implementation?.type === 'brick'
        ? {
            ...prev,
            [parameterType]: updateParameter(prev[parameterType], index, props.parameter, values),
            implementation: {
              ...prev?.implementation,
              args: updateArgs((prev?.implementation as Brick)?.args, props?.parameter?.name || '', type, values),
              results: updateResults(
                (prev?.implementation as Brick)?.results,
                props?.parameter?.name || '',
                type,
                values,
              ),
            },
          }
        : {
            ...prev,
            [parameterType]: updateParameter(prev?.[parameterType], index, props.parameter, values),
            implementation: {
              ...prev?.implementation,
              [parameterMappings]: (prev?.implementation as Graph)[parameterMappings]?.map((mapping: Edge) =>
                mapping.source.port !== props.parameter.name ? mapping : { ...mapping, source: { port: values.name } },
              ),
            },
          },
    );
    setOpen(false);
  }

  function removeInput() {
    setComponent((prev) => ({
      ...prev,
      [parameterType]: [
        ...(prev?.[parameterType]!.slice(0, index) || []),
        ...(prev?.[parameterType]!.slice(index + 1, prev?.[parameterType]!.length) || []),
      ],
      implementation: {
        ...prev?.implementation,
        [parameterMappings]: (prev?.implementation as Graph)?.[parameterMappings]?.filter((mapping: Edge) =>
          parameterMappings === 'inputMappings'
            ? mapping?.source?.port !== props.parameter?.name
            : mapping?.target?.port !== props?.parameter?.name,
        ),
      },
    }));
    setOpen(false);
  }

  return (
    <Stack spacing={0.5}>
      <ParameterWrapper onClick={() => setOpen(true)}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Icon color="#007079" name={TYPE_ICONS[parameter.type as keyof typeof TYPE_ICONS]} />
          <div style={{ flexGrow: '2' }}>
            <Typography variant="h5">{parameter.name}</Typography>
            <Typography variant="body_short">{parameter.userdata?.description}</Typography>
            {editableValue && type === 'input' && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                style={{ paddingLeft: '0.25rem', paddingTop: '0.25rem' }}
              >
                <Icon name="subdirectory_arrow_right" color="#007079" size={16} />
                <Typography variant="caption">
                  {Array.isArray(parameter?.userdata?.value)
                    ? parameter?.userdata?.value.join(', ')
                    : parameter?.userdata?.value || 'undefined'}
                </Typography>
              </Stack>
            )}
          </div>
        </Stack>
        <Formik
          initialValues={{
            ...props.parameter,
            value: props?.parameter?.userdata?.value || '',
            description: props?.parameter?.userdata?.description || '',
          }}
          onSubmit={onParameterUpdate}
          validationSchema={validationSchema}
          validateOnBlur
        >
          <Form>
            <ParameterEditor
              open={open}
              onlyEditableValue={onlyEditableValue}
              editableValue={editableValue}
              secret={props.secret}
              volume={props.volume}
              onClose={() => setOpen(false)}
              removeInput={removeInput}
              type={type}
            />
          </Form>
        </Formik>
      </ParameterWrapper>
    </Stack>
  );
};
