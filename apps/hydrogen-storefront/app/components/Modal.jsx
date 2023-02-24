import { IconClose, Link } from "~/components";

export function Modal({ children, cancelLink }) {
  return (
    <div
      className='relative z-50'
      aria-labelledby='modal-title'
      role='dialog'
      aria-modal='true'
      id='modal-bg'
    >
      <div className='bg-primary/40 fixed inset-0 bg-opacity-75 transition-opacity'></div>
      <div className='fixed inset-0 z-50 overflow-y-auto'>
        <div className='flex min-h-full items-center justify-center p-4 text-center sm:p-0'>
          <div
            className='bg-contrast relative flex-1 transform overflow-hidden rounded px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-12 sm:w-full sm:max-w-sm sm:flex-none sm:p-6'
            role='button'
            onClick={(e) => {
              e.stopPropagation();
            }}
            onKeyPress={(e) => {
              e.stopPropagation();
            }}
            tabIndex={0}
          >
            <div className='absolute top-0 right-0 hidden pt-4 pr-4 sm:block'>
              <Link
                to={cancelLink}
                className='text-primary hover:text-primary/50 -m-4 p-4 transition'
              >
                <IconClose aria-label='Close panel' />
              </Link>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
