import { Link } from "~/components";

export function AccountDetails({ customer }) {
  const { firstName, lastName, email, phone } = customer;

  return (
    <>
      <div className='grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12'>
        <h3 className='text-lead font-bold'>Account Details</h3>
        <div className='rounded border border-gray-200 p-6 lg:p-8'>
          <div className='flex'>
            <h3 className='flex-1 text-base font-bold'>Profile & Security</h3>
            <Link
              prefetch='intent'
              className='text-sm font-normal underline'
              to='/account/edit'
            >
              Edit
            </Link>
          </div>
          <div className='text-primary/50 mt-4 text-sm'>Name</div>
          <p className='mt-1'>
            {firstName || lastName
              ? (firstName ? firstName + " " : "") + lastName
              : "Add name"}{" "}
          </p>

          <div className='text-primary/50 mt-4 text-sm'>Contact</div>
          <p className='mt-1'>{phone ?? "Add mobile"}</p>

          <div className='text-primary/50 mt-4 text-sm'>Email address</div>
          <p className='mt-1'>{email}</p>

          <div className='text-primary/50 mt-4 text-sm'>Password</div>
          <p className='mt-1'>**************</p>
        </div>
      </div>
    </>
  );
}
