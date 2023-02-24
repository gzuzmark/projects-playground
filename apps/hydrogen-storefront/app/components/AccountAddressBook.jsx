import { Form } from "@remix-run/react";
import { Button, Link, Text } from "~/components";

export function AccountAddressBook({ customer, addresses }) {
  return (
    <>
      <div className='grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12'>
        <h3 className='text-lead font-bold'>Address Book</h3>
        <div>
          {!addresses?.length && (
            <Text className='mb-1' width='narrow' as='p' size='copy'>
              You haven&apos;t saved any addresses yet.
            </Text>
          )}
          <div className='w-48'>
            <Button
              to='address/add'
              className='mt-2 mb-6 w-full text-sm'
              variant='secondary'
            >
              Add an Address
            </Button>
          </div>
          {Boolean(addresses?.length) && (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3'>
              {customer.defaultAddress && (
                <Address address={customer.defaultAddress} defaultAddress />
              )}
              {addresses
                .filter((address) => address.id !== customer.defaultAddress?.id)
                .map((address) => (
                  <Address key={address.id} address={address} />
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Address({ address, defaultAddress }) {
  return (
    <div className='flex flex-col rounded border border-gray-200 p-6 lg:p-8'>
      {defaultAddress && (
        <div className='mb-3 flex flex-row'>
          <span className='bg-primary/20 text-primary/50 rounded-full px-3 py-1 text-xs font-medium'>
            Default
          </span>
        </div>
      )}
      <ul className='flex-1 flex-row'>
        {(address.firstName || address.lastName) && (
          <li>
            {"" +
              (address.firstName && address.firstName + " ") +
              address?.lastName}
          </li>
        )}
        {address.formatted &&
          address.formatted.map((line) => <li key={line}>{line}</li>)}
      </ul>

      <div className='mt-6 flex flex-row items-baseline font-medium'>
        <Link
          to={`/account/address/${encodeURIComponent(address.id)}`}
          className='text-left text-sm underline'
          prefetch='intent'
        >
          Edit
        </Link>
        <Form action='address/delete' method='delete'>
          <input type='hidden' name='addressId' value={address.id} />
          <button className='text-primary/50 ml-6 text-left text-sm'>
            Remove
          </button>
        </Form>
      </div>
    </div>
  );
}
