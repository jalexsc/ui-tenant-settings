import { useIntl } from 'react-intl';

/**
 * Hook to return translation tag function
 *
 * Usage example:
 *   const t = useT();
 *   return <div>{t`example.key`}</div>
 */
export const useT = prefix => {
  const { formatMessage } = useIntl();

  return tagged => formatMessage({ id: `${prefix}.${tagged[0]}` });
};
