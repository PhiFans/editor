import { Card, FormGroup, Intent } from '@blueprintjs/core';

type SettingsItemProps = {
  label: string,
  children: React.ReactNode,
  labelInfo?: string,
  helperText?: string,
  intent?: Intent,
  disabled?: boolean,
};

const SettingsItem = ({
  label,
  children,
  labelInfo,
  helperText,
  intent,
  disabled,
}: SettingsItemProps) => {
  return (
    <Card>
      <FormGroup
        label={label}
        labelInfo={labelInfo}
        helperText={helperText}
        intent={intent}
        disabled={disabled}
        fill
      >
        {children}
      </FormGroup>
    </Card>
  );
};

export default SettingsItem;
