import { useFetcher, useLocation, useMatches } from "@remix-run/react";
import { Heading, Button, IconCheck } from "~/components";
import { useCallback, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { CartAction } from "~/lib/type";
import { DEFAULT_LOCALE } from "~/lib/utils";
import clsx from "clsx";

export function CountrySelector() {
  const [root] = useMatches();
  const fetcher = useFetcher();
  const closeRef = useRef(null);
  const selectedLocale = root.data?.selectedLocale ?? DEFAULT_LOCALE;
  const { pathname, search } = useLocation();
  const pathWithoutLocale = `${pathname.replace(
    selectedLocale.pathPrefix,
    "",
  )}${search}`;

  const countries = fetcher.data ?? {};
  const defaultLocale = countries?.["default"];
  const defaultLocalePrefix = defaultLocale
    ? `${defaultLocale?.language}-${defaultLocale?.country}`
    : "";

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const observerRef = useRef(null);
  useEffect(() => {
    ref(observerRef.current);
  }, [ref, observerRef]);

  // Get available countries list when in view
  useEffect(() => {
    if (!inView || fetcher.data || fetcher.state === "loading") return;
    fetcher.load("/api/countries");
  }, [inView, fetcher]);

  const closeDropdown = useCallback(() => {
    closeRef.current?.removeAttribute("open");
  }, []);

  return (
    <section
      ref={observerRef}
      className='grid w-full gap-4 md:ml-auto md:max-w-xs'
      onMouseLeave={closeDropdown}
    >
      <Heading size='lead' className='cursor-default' as='h3'>
        Country
      </Heading>
      <div className='relative'>
        <details
          className='border-contrast/30 open:round-b-none absolute w-full overflow-clip rounded border dark:border-white'
          ref={closeRef}
        >
          <summary className='flex w-full cursor-pointer items-center justify-between px-4 py-3'>
            {selectedLocale.label}
          </summary>
          <div className='border-contrast/30 bg-contrast/30 max-h-36 w-full overflow-auto border-t dark:border-white'>
            {countries &&
              Object.keys(countries).map((countryPath) => {
                const countryLocale = countries[countryPath];
                const isSelected =
                  countryLocale.language === selectedLocale.language &&
                  countryLocale.country === selectedLocale.country;

                const countryUrlPath = getCountryUrlPath({
                  countryLocale,
                  defaultLocalePrefix,
                  pathWithoutLocale,
                });

                return (
                  <Country
                    key={countryPath}
                    closeDropdown={closeDropdown}
                    countryUrlPath={countryUrlPath}
                    isSelected={isSelected}
                    countryLocale={countryLocale}
                  />
                );
              })}
          </div>
        </details>
      </div>
    </section>
  );
}

function Country({ closeDropdown, countryLocale, countryUrlPath, isSelected }) {
  return (
    <ChangeLocaleForm
      key={countryLocale.country}
      redirectTo={countryUrlPath}
      buyerIdentity={{
        countryCode: countryLocale.country,
      }}
    >
      <Button
        className={clsx([
          "text-contrast dark:text-primary",
          "bg-primary dark:bg-contrast flex w-full justify-start rounded p-2 transition",
          "cursor-pointer items-center py-2 px-4 text-left",
        ])}
        type='submit'
        variant='primary'
        onClick={closeDropdown}
      >
        {countryLocale.label}
        {isSelected ? (
          <span className='ml-2'>
            <IconCheck />
          </span>
        ) : null}
      </Button>
    </ChangeLocaleForm>
  );
}

function ChangeLocaleForm({ children, buyerIdentity, redirectTo }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form action='/cart' method='post'>
      <input
        type='hidden'
        name='cartAction'
        value={CartAction.UPDATE_BUYER_IDENTITY}
      />
      <input
        type='hidden'
        name='buyerIdentity'
        value={JSON.stringify(buyerIdentity)}
      />
      <input type='hidden' name='redirectTo' value={redirectTo} />
      {children}
    </fetcher.Form>
  );
}

function getCountryUrlPath({
  countryLocale,
  defaultLocalePrefix,
  pathWithoutLocale,
}) {
  let countryPrefixPath = "";
  const countryLocalePrefix = `${countryLocale.language}-${countryLocale.country}`;

  if (countryLocalePrefix !== defaultLocalePrefix) {
    countryPrefixPath = `/${countryLocalePrefix.toLowerCase()}`;
  }
  return `${countryPrefixPath}${pathWithoutLocale}`;
}