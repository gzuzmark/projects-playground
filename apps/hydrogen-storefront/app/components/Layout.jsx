import { useIsHomePath } from "~/lib/utils";
import {
  Drawer,
  useDrawer,
  Text,
  Input,
  IconAccount,
  IconBag,
  IconSearch,
  Heading,
  IconMenu,
  IconCaret,
  Section,
  CountrySelector,
  Cart,
  CartLoading,
  Link,
} from "~/components";
import { useParams, Form, Await, useMatches } from "@remix-run/react";
import { useWindowScroll } from "react-use";
import { Disclosure } from "@headlessui/react";
import { Suspense, useEffect, useMemo } from "react";
import { useIsHydrated } from "~/hooks/useIsHydrated";
import { useCartFetchers } from "~/hooks/useCartFetchers";

export function Layout({ children, layout }) {
  return (
    <>
      <div className='flex min-h-screen flex-col'>
        <div className=''>
          <a href='#mainContent' className='sr-only'>
            Skip to content
          </a>
        </div>
        <Header
          title={layout?.shop.name ?? "Hydrogen"}
          menu={layout?.headerMenu}
        />
        <main role='main' id='mainContent' className='flex-grow'>
          {children}
        </main>
      </div>
      <Footer menu={layout?.footerMenu} />
    </>
  );
}

function Header({ title, menu }) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers("ADD_TO_CART");

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        openCart={openCart}
      />
      <MobileHeader
        isHome={isHome}
        title={title}
        openCart={openCart}
        openMenu={openMenu}
      />
    </>
  );
}

function CartDrawer({ isOpen, onClose }) {
  const [root] = useMatches();

  return (
    <Drawer open={isOpen} onClose={onClose} heading='Cart' openFrom='right'>
      <div className='grid'>
        <Suspense fallback={<CartLoading />}>
          <Await resolve={root.data?.cart}>
            {(cart) => <Cart layout='drawer' onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({ isOpen, onClose, menu }) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom='left' heading='Menu'>
      <div className='grid'>
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({ menu, onClose }) {
  return (
    <nav className='grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8'>
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <span key={item.id} className='block'>
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? "-mb-px border-b pb-1" : "pb-1"
            }
          >
            <Text as='span' size='copy'>
              {item.title}
            </Text>
          </Link>
        </span>
      ))}
    </nav>
  );
}

function MobileHeader({ title, isHome, openCart, openMenu }) {
  // useHeaderStyleFix(containerStyle, setContainerStyle, isHome);

  const params = useParams();

  return (
    <header
      role='banner'
      className={`${
        isHome
          ? "bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader"
          : "bg-contrast/80 text-primary"
      } h-nav sticky top-0 z-40 flex w-full items-center justify-between gap-4 px-4 leading-none backdrop-blur-lg md:px-8 lg:hidden`}
    >
      <div className='flex w-full items-center justify-start gap-4'>
        <button
          onClick={openMenu}
          className='relative flex h-8 w-8 items-center justify-center'
        >
          <IconMenu />
        </button>
        <Form
          method='get'
          action={params.lang ? `/${params.lang}/search` : "/search"}
          className='items-center gap-2 sm:flex'
        >
          <button
            type='submit'
            className='relative flex h-8 w-8 items-center justify-center'
          >
            <IconSearch />
          </button>
          <Input
            className={
              isHome
                ? "focus:border-contrast/20 dark:focus:border-primary/20"
                : "focus:border-primary/20"
            }
            type='search'
            variant='minisearch'
            placeholder='Search'
            name='q'
          />
        </Form>
      </div>

      <Link
        className='flex h-full w-full flex-grow items-center justify-center self-stretch leading-[3rem] md:leading-[4rem]'
        to='/'
      >
        <Heading className='text-center font-bold' as={isHome ? "h1" : "h2"}>
          {title}
        </Heading>
      </Link>

      <div className='flex w-full items-center justify-end gap-4'>
        <Link
          to='/account'
          className='relative flex h-8 w-8 items-center justify-center'
        >
          <IconAccount />
        </Link>
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function DesktopHeader({ isHome, menu, openCart, title }) {
  const params = useParams();
  const { y } = useWindowScroll();
  return (
    <header
      role='banner'
      className={`${
        isHome
          ? "bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader"
          : "bg-contrast/80 text-primary"
      } ${
        !isHome && y > 50 && " shadow-lightHeader"
      } h-nav sticky top-0 z-40 hidden w-full items-center justify-between gap-8 px-12 py-8 leading-none backdrop-blur-lg transition duration-300 lg:flex`}
    >
      <div className='flex gap-12'>
        <Link className='font-bold' to='/' prefetch='intent'>
          {title}
        </Link>
        <nav className='flex gap-8'>
          {/* Top level menu items */}
          {(menu?.items || []).map((item) => (
            <Link
              key={item.id}
              to={item.to}
              target={item.target}
              prefetch='intent'
              className={({ isActive }) =>
                isActive ? "-mb-px border-b pb-1" : "pb-1"
              }
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className='flex items-center gap-1'>
        <Form
          method='get'
          action={params.lang ? `/${params.lang}/search` : "/search"}
          className='flex items-center gap-2'
        >
          <Input
            className={
              isHome
                ? "focus:border-contrast/20 dark:focus:border-primary/20"
                : "focus:border-primary/20"
            }
            type='search'
            variant='minisearch'
            placeholder='Search'
            name='q'
          />
          <button
            type='submit'
            className='focus:ring-primary/5 relative flex h-8 w-8 items-center justify-center'
          >
            <IconSearch />
          </button>
        </Form>
        <Link
          to='/account'
          className='focus:ring-primary/5 relative flex h-8 w-8 items-center justify-center'
        >
          <IconAccount />
        </Link>
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function CartCount({ isHome, openCart }) {
  const [root] = useMatches();

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={root.data?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({ openCart, dark, count }) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag />
        <div
          className={`${
            dark
              ? "text-primary bg-contrast dark:text-contrast dark:bg-primary"
              : "text-contrast bg-primary"
          } absolute bottom-1 right-1 flex h-3 w-auto min-w-[0.75rem] items-center justify-center rounded-full px-[0.125rem] pb-px text-center text-[0.625rem] font-medium leading-none subpixel-antialiased`}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className='focus:ring-primary/5 relative flex h-8 w-8 items-center justify-center'
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to='/cart'
      className='focus:ring-primary/5 relative flex h-8 w-8 items-center justify-center'
    >
      {BadgeCounter}
    </Link>
  );
}

function Footer({ menu }) {
  const isHome = useIsHomePath();
  const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : [];

  return (
    <Section
      divider={isHome ? "none" : "top"}
      as='footer'
      role='contentinfo'
      className={`grid min-h-[25rem] w-full grid-flow-row grid-cols-1 items-start gap-6 py-8 px-6 md:grid-cols-2 md:gap-8 md:px-8 lg:gap-12 lg:px-12 lg:grid-cols-${itemsCount}
        bg-primary dark:bg-contrast dark:text-primary text-contrast overflow-hidden`}
    >
      <FooterMenu menu={menu} />
      <CountrySelector />
      <div
        className={`self-end pt-8 opacity-50 md:col-span-2 lg:col-span-${itemsCount}`}
      >
        &copy; {new Date().getFullYear()} / Shopify, Inc. Hydrogen is an MIT
        Licensed Open Source project.
      </div>
    </Section>
  );
}

const FooterLink = ({ item }) => {
  if (item.to.startsWith("http")) {
    return (
      <a href={item.to} target={item.target} rel='noopener noreferrer'>
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch='intent'>
      {item.title}
    </Link>
  );
};

function FooterMenu({ menu }) {
  const styles = {
    section: "grid gap-4",
    nav: "grid gap-2 pb-6",
  };

  return (
    <>
      {(menu?.items || []).map((item) => (
        <section key={item.id} className={styles.section}>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className='text-left md:cursor-default'>
                  <Heading className='flex justify-between' size='lead' as='h3'>
                    {item.title}
                    {item?.items?.length > 0 && (
                      <span className='md:hidden'>
                        <IconCaret direction={open ? "up" : "down"} />
                      </span>
                    )}
                  </Heading>
                </Disclosure.Button>
                {item?.items?.length > 0 ? (
                  <div
                    className={`${
                      open ? `h-fit max-h-48` : `max-h-0 md:max-h-fit`
                    } overflow-hidden transition-all duration-300`}
                  >
                    <Suspense data-comment='This suspense fixes a hydration bug in Disclosure.Panel with static prop'>
                      <Disclosure.Panel static>
                        <nav className={styles.nav}>
                          {item.items.map((subItem) => (
                            <FooterLink key={subItem.id} item={subItem} />
                          ))}
                        </nav>
                      </Disclosure.Panel>
                    </Suspense>
                  </div>
                ) : null}
              </>
            )}
          </Disclosure>
        </section>
      ))}
    </>
  );
}
