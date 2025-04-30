
import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import Layout from '../../Components/Client/Layout/Layout'
import { Link, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectallproducts, fetchallproductfilterasync, categories, brands, fetchcategoryasync, fetchbrandasync, selectTotalItems, selectstatus } from '../../Features/Productslice'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Protected from './Protected'
import { GridLoader } from 'react-spinners'
import Carousle from './Carousle'
import { selectLoggedInUser } from '../../Features/Authslice'
import ScrollTop from '../../Components/Client/Common/Scolltop'
import Serivespage from './Serivespage'

const sortOptions = [
  { name: 'Best Rating', sort: 'rating', order: 'desc', current: false },
  { name: 'Price: Low to High', sort: 'price', order: 'asc', current: false },
  { name: 'Price: High to Low', sort: 'price', order: 'desc', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Homepage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({})
  const [sort, SetSort] = useState('')
  const user = useSelector(selectLoggedInUser);
  const bgcolor = useSelector((state) => state.theme.value)
  const txtcolor = useSelector((state) => state.theme.textcolor)

  const products = useSelector(selectallproducts);
  const category = useSelector(categories);
  const brand = useSelector(brands);

  const [page, setPage] = useState(1)
  const [itemsPerPage] = useState(9)
  const totalItems = products && products.totalItems ? products.totalItems : 0

  const productStatus = useSelector(selectstatus);

  // Get current products for the current page
  const indexOfLastProduct = page * itemsPerPage
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage
  const currentProducts = products && products.products ? products.products.slice(indexOfFirstProduct, indexOfLastProduct) : []


  const filters = [
    {
      id: 'category',
      name: 'Category',
      options: category
    },
    {
      id: 'Brand',
      name: 'Brand',
      options: brand
    },
  ]

  const handleFilter = (e, section, option) => {
    const newFilter = { ...filter };
    if (e.target.checked) {
      newFilter[section.id] = option.value;
    } else {
      delete newFilter(section.id);
    }

    setFilter(newFilter);
  };

  const handleSort = (e, option) => {
    const sort = { _sort: option.sort, _order: option.order };
    SetSort(sort);
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (user) {
        dispatch(fetchallproductfilterasync(filter, sort));
      }
    }
  }, [dispatch, filter, sort, user]);


  useEffect(() => {
    dispatch(fetchcategoryasync());
    dispatch(fetchbrandasync());
  }, [dispatch])


  const handlePage = (_, pageNumber) => {
    // Validate page number to prevent going below 1 or above max pages
    const maxPage = Math.ceil(totalItems / itemsPerPage)
    if (pageNumber < 1 || pageNumber > maxPage) return

    window.scrollTo({ top: 10, behavior: 'smooth' });
    setPage(pageNumber)
  }

  // const role = JSON.parse(localStorage.getItem('role'));
  // if (role === 'admin') {
  //   return <Navigate to="/Adminhomepage" />;
  // } else if (role === 'user') {
  //   return <Navigate to="/" />;
  // } 
  // else{
  //   return <Navigate to="/Loginpage" />;
  // }

  // if (productStatus === 'loading') {

  //   return (
  //     <>
  //       <div className="flex items-center justify-center h-screen">
  //         <GridLoader />
  //       </div>
  //     </>
  //   )
  // }

  return (
    <Layout>
      <Protected>

        <div className="mt-1" style={{ backgroundColor: bgcolor, color: txtcolor }}>
          <div>

            <Carousle />

            {/* Mobile filter dialog */}
            <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40">
              <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
              />

              <div className="fixed inset-0 z-40 flex">
                <DialogPanel
                  transition
                  className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
                >
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium">Filters</h2>
                    <button
                      type="button"
                      onClick={() => setMobileFiltersOpen(false)}
                      className="-mr-2 flex size-10 items-center justify-center rounded-md p-2"
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon aria-hidden="true" className="size-6" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 mx-4 rounded-xl bg-gradient-to-br from-[#f0f4ff] via-white to-[#d6e4ff] shadow-md px-4 py-6 space-y-4">
                    {filters.map((section) => (
                      <Disclosure key={section.id} as="div" className="border-b border-gray-300 pb-4">
                        <h3 className="-mx-2 -my-3 flow-root">
                          <DisclosureButton className="group flex w-full items-center justify-between px-2 py-3 text-gray-700 font-medium rounded-md hover:bg-indigo-50 transition">
                            <span>{section.name}</span>
                            <span className="ml-6 flex items-center">
                              <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden text-indigo-500 transition-transform" />
                              <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden text-indigo-500 transition-transform" />
                            </span>
                          </DisclosureButton>
                        </h3>
                        <DisclosurePanel className="pt-3">
                          <div className="space-y-3">
                            {section.options.map((option, optionIdx) => (
                              <div key={option.value} className="flex items-center gap-3">
                                <input
                                  defaultValue={option.value}
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  type="checkbox"
                                  onChange={(e) => handleFilter(e, section, option)}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                  className="text-sm text-gray-700"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </DisclosurePanel>
                      </Disclosure>
                    ))}
                  </form>

                </DialogPanel>
              </div>
            </Dialog>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-baseline justify-between border-b border-gray-200 pt-10 pb-6">
                <h1 className="text-4xl font-bold tracking-tight">All Products</h1>

                <div className="flex items-center">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <MenuButton className="group inline-flex justify-center text-sm font-medium">
                        Sort
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="-mr-1 ml-1 size-5 shrink-0"
                        />
                      </MenuButton>
                    </div>

                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md ring-1 shadow-2xl ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                      <div className="py-1">
                        {sortOptions.map((option) => (
                          <MenuItem key={option.name}>
                            <p
                              onClick={(e) => handleSort(e, option)}
                              className={classNames(
                                option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                'block px-4 py-2 text-sm data-focus:bg-gray-100 data-focus:outline-hidden',
                              )}
                            >
                              {option.name}
                            </p>
                          </MenuItem>
                        ))}
                      </div>
                    </MenuItems>
                  </Menu>

                  <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                    <span className="sr-only">View grid</span>
                    <Squares2X2Icon aria-hidden="true" className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(true)}
                    className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6"
                  >
                    <span className="sr-only">Filters</span>
                    <FunnelIcon aria-hidden="true" className="size-5" />
                  </button>
                </div>
              </div>

              <section aria-labelledby="products-heading" className="pt-6 pb-10">
                <h2 id="products-heading" className="sr-only">
                  Products
                </h2>

                <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                  {/* Filters */}
                  {/* <form className="hidden rounded-xl bg-gradient-to-br from-[#f9f9f9] via-white to-[#e3f2fd] p-6 shadow-xl">
                    {filters.map((section) => (
                      <Disclosure key={section.id} as="div" className="border-b border-gray-300 py-4">
                        <h3 className="-my-3 flow-root">
                          <DisclosureButton className="group flex w-full items-center justify-between py-3 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-300">
                            <span>{section.name}</span>
                            <span className="ml-6 flex items-center">
                              <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden transition-transform duration-300" />
                              <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden transition-transform duration-300" />
                            </span>
                          </DisclosureButton>
                        </h3>
                        <DisclosurePanel className="pt-4">
                          <div className="space-y-4 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100">
                            {section.options.map((option, optionIdx) => (
                              <div key={option.value} className="flex items-center gap-3">
                                <div className="relative flex h-5 items-center">
                                  <input
                                    defaultValue={option.value}
                                    defaultChecked={option.checked}
                                    id={`filter-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    type="checkbox"
                                    onChange={(e) => handleFilter(e, section, option)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition"
                                  />
                                </div>
                                <label htmlFor={`filter-${section.id}-${optionIdx}`} className="text-sm text-gray-700 hover:text-indigo-600 cursor-pointer">
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </DisclosurePanel>
                      </Disclosure>
                    ))}
                  </form> */}


                  {/* Product grid */}
                  <div className="lg:col-span-4">
                    {
                      <div>
                        <div className="mx-auto max-w-2xl px-4 lg:max-w-7xl">

                          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                            {currentProducts && currentProducts.length > 0 ? (
                              currentProducts.map((product) => (
                                <Link to={`/Productdetailspage/${product.id}`} key={product.id}>
                                  <div className="group relative bg-blue-50 p-2 rounded-md ">
                                    <LazyLoadImage
                                      alt={product.images[1]}
                                      src={product.images[1]}
                                      className="aspect-square w-full p-4 rounded-md object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                                      effect="blur"
                                      wrapperProps={{
                                        style: { transitionDelay: "1s" },
                                      }}
                                    />
                                    <div className="mt-4 flex justify-between">
                                      <div>
                                        <h3 className="text-sm text-gray-900">{product.title}</h3>
                                        <p className="mt-1 text-sm text-gray-500">{product.rating}</p>
                                      </div>
                                      <p className="text-sm font-medium text-gray-900">${product.price}</p>
                                    </div>
                                  </div>
                                </Link>
                              ))
                            ) : (
                              <p>No products available.</p>
                            )}

                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </section>

              {/* pagination here */}
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => handlePage(null, page - 1)}
                    disabled={page === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePage(null, page + 1)}
                    disabled={page >= Math.ceil(totalItems / itemsPerPage)}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm">
                      Showing <span className="font-medium">{totalItems ? (page - 1) * itemsPerPage + 1 : 0}</span> to{" "}
                      <span className="font-medium">{Math.min(page * itemsPerPage, totalItems)}</span> of{" "}
                      <span className="font-medium">{totalItems}</span> results
                    </p>
                  </div>
                  <div>
                    <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                      <button
                        onClick={() => handlePage(null, page - 1)}
                        disabled={page === 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon aria-hidden="true" className="size-5" />
                      </button>

                      {Array.from({ length: Math.min(5, Math.ceil(totalItems / itemsPerPage)) }).map((_, index) => {
                        // Show pages around the current page
                        let pageNumber
                        const totalPages = Math.ceil(totalItems / itemsPerPage)

                        if (totalPages <= 5) {
                          pageNumber = index + 1
                        } else {
                          // More complex pagination logic for many pages
                          if (page <= 3) {
                            pageNumber = index + 1
                          } else if (page >= totalPages - 2) {
                            pageNumber = totalPages - 4 + index
                          } else {
                            pageNumber = page - 2 + index
                          }
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePage(null, pageNumber)}
                            aria-current={page === pageNumber ? "page" : undefined}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === pageNumber
                              ? "bg-indigo-600 text-white focus-visible:outline-indigo-600 z-10"
                              : ""
                              } focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
                          >
                            {pageNumber}
                          </button>
                        )
                      })}

                      <button
                        onClick={() => handlePage(null, page + 1)}
                        disabled={page >= Math.ceil(totalItems / itemsPerPage)}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon aria-hidden="true" className="size-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </main>


          </div>
        </div>

        <Serivespage />

      </Protected>
    </Layout>

  )
}
