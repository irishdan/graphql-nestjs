interface Props {
  message?: string;
}

export const FormError = ({ message }: Props) => {
  return <span className={'text-sm text-[#e33] px-2'}>{message ?? 'Error'}</span>;
};
