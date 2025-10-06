import Stack from '@/components/icon/stack';
import { Link } from 'react-router-dom';

interface Props {
  iconOnly?: boolean;
}

const Logo = ({ iconOnly }: Props) => {
  return (
    <Link className="flex items-center font-logo" to="/">
      <Stack className="mr-2 h-6 w-6 text-black dark:text-white md:h-6 md:w-6" />
      {!iconOnly && (
        <p className={'mt-[3px] text-[20px] md:text-[20px] uppercase'}>
          <span className={'mr-[1px] text-black opacity-60 dark:text-white dark:opacity-70'}>DAN</span>
          <span className={'text-black opacity-70 dark:text-white dark:opacity-100'}>BYRNE</span>
        </p>
      )}
    </Link>
  );
};

export default Logo;
