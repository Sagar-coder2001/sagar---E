import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, ShoppingCartIcon, UserIcon, UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectCartItems } from '../../../Features/Cartslice'
import { selectLoggedInUser } from '../../../Features/Authslice'
import { useEffect, useState } from 'react'
import { UsersIcon } from '@heroicons/react/16/solid'
import { dark, white } from '../../../Features/Themslice'
import { MoonIcon, SunIcon } from '@heroicons/react/20/solid'

const navigation = [
  { name: 'Adminhome', link: '/Adminhomepage', user: true },
  { name: 'AdminOrders', link: '/Adminorderpage', user: true },
  // { name: 'Products', link: '/Adminhomepage', admin: true },
  // { name: 'Orders', link: '/Adminorderpage', admin: true },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const cartitem = useSelector(selectCartItems)
  const [changeicon, setChangeicon] = useState(true)
  const bgcolor = useSelector((state) => state.theme.navbar)
  const textcolors = useSelector((state) => state.theme.textcolor)


  const dispatch = useDispatch();

  const role = JSON.parse(localStorage.getItem('role'));

  const changeTheme = () => {
    if (bgcolor == 'black') {
      dispatch(white());
      localStorage.removeItem('theme');
      setChangeicon(false)
    }
    else {
      dispatch(dark())
      setChangeicon(true)
    }
  }


  return (
    <Disclosure as="nav" >
      <div className='fixed top-0 left-0  right-0 z-50' style={{ backgroundColor: '#FAF1E6' }}>

        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between z-300">
            {/* <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            Mobile menu button
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div> */}
            <div className="flex flex-1 items-center ">
              <div className="flex shrink-0 items-center">
                <Link to={'/'}>
                  <img
                    alt="Your Company"
                    src="https://marketplace.canva.com/EAFzjXx_i5w/1/0/1600w/canva-blue-illustrative-e-commerce-online-shop-logo-fZejT2DpGCw.jpg"
                    className="h-10 w-auto rounded-full"
                  />
                </Link>

              </div>
              <div className='ml-3 p-2 text-gray-900 hover:bg-gray-700 hover:text-black rounded' style={{ backgroundColor: '#FDFAF6' }}>
                Ecommerce
              </div>

              {/* <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
              {navigation.map((item) => (
                  // Check if the user is allowed to see this link based on their role
                    <Link
                      key={item.name}
                      to={item.link}
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )}
                    >
                      {item.name}
                    </Link>
                  
                ))}
              </div>
            </div> */}
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <Link to={'/Cartpage'}>
                {
                  role === 'user' && (
                    <button
                      type="button"
                      className="relative rounded-ful p-1 text-gray-800 hover:text-black focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden rounded-full" style={{ backgroundColor: '#FDFAF6' }}
                    >
                      <ShoppingCartIcon aria-hidden="true" className="size-6" />
                      <span className='absolute -top-2.5 right-0 text-black'>{cartitem.length}</span>
                    </button>
                  )
                }


              </Link>
              {
                role !== 'user' && (
                  <>

                    <Link to={'Loginpage'}>
                      <button
                        type="button"
                        className="rounded px-3 py-2 text-sm font-medium text-black cursor-pointer ml-2"
                        style={{ backgroundColor: '#FDFAF6' }}
                      >
                        Login
                      </button>
                    </Link>
                    {changeicon ? (
                      <MoonIcon
                        onClick={changeTheme}
                        className="h-5 w-5 text-gray-800 cursor-pointer mx-2"
                      />
                    ) : (
                      <SunIcon
                        onClick={changeTheme}
                        className="h-5 w-5 text-yellow-500 cursor-pointer mx-2"
                      />
                    )}
                  </>
                )
              }


              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden cursor-pointer" style={{ backgroundColor: '#FDFAF6' }}>
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src='https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg'
                      className="size-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <MenuItem>
                    <Link
                      to={'/Userprofilepage'}
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Your Profile
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      to={'/Orderpage.jsx'}
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      My Orders
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      to={'/Logoutpage'}
                      className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                    >
                      Sign out
                    </Link>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        {/* <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel> */}

      </div>

    </Disclosure>
  )
}
